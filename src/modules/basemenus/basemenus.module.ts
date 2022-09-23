import { Module } from '@nestjs/common';
import { BasemenusService } from './basemenus.service';
import { BasemenusController } from './basemenus.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseMenusEntity } from './entities/basemenu.entity';
import { AuthorityModule } from '../authority/authority.module';
import { MenuAuthorityEntity } from './entities/menu_authority.entity';
import { EntityManager } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BaseMenusEntity,
      MenuAuthorityEntity,
      EntityManager,
    ]),
    AuthorityModule,
  ],
  controllers: [BasemenusController],
  providers: [BasemenusService],
  exports: [BasemenusService],
})
export class BasemenusModule {}
