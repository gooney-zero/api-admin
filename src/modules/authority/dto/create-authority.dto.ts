import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateAuthorityDto {
  /**
   * 名称
   * @example 超级管理员
   */
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  defaultRouter: string;

  // @IsOptional()
  // users: UsersEntity;

  // @IsOptional()
  // baseMenus: BaseMenusEntity[];

  /**
   * 当前登录用户的权限
   * @example 999
   */
  @IsInt()
  authorityId: number;
}
