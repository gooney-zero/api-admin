import { IsOptional, IsInt } from 'class-validator';
import { BaseMenusEntity } from '../entities/basemenu.entity';

export class UpdateBasemenuDto {
  @IsOptional()
  baseMenus: BaseMenusEntity[];

  /**
   * 当前登录用户的权限
   * @example 999
   */
  @IsInt()
  authorityId: number;
}
