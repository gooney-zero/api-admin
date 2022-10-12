import { IsOptional, IsInt } from 'class-validator';
import { BaseMenusEntity } from '../entities/basemenu.entity';

export class UpdateBasemenuAuthorityDto {
  @IsOptional()
  baseMenus: BaseMenusEntity[];

  /**
   * 需要添加菜单的权限
   * @example 999
   */
  @IsInt()
  authorityId: number;
}
