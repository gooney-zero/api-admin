import { Module } from '@nestjs/common';
import { AuthorityService } from './authority.service';
import { AuthorityController } from './authority.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityEntity } from './entities/authority.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorityEntity])],

  controllers: [AuthorityController],
  providers: [AuthorityService],
  exports: [AuthorityService],
})
export class AuthorityModule {}
