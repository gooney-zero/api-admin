import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypedConfigModule } from 'nest-typed-config';
import { RootConfig } from './config/configurations';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from './config/config.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { UploadModule } from './modules/upload/upload.module';
import { BasemenusModule } from './modules/basemenus/basemenus.module';
import { AuthorityModule } from './modules/authority/authority.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [TypedConfigModule],
      inject: [RootConfig],
      useFactory(configService: RootConfig) {
        return {
          ...configService.database,
          synchronize: true,
          autoLoadEntities: true,
          logger: 'advanced-console',
          cache: {
            duration: 60000, // 1分钟的缓存
          },
        } as TypeOrmModuleOptions;
      },
    }),
    UserModule,
    AuthModule,
    UploadModule,
    BasemenusModule,
    AuthorityModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
