import { AuthorityEntity } from '@/modules/authority/entities/authority.entity';
import { ArrayNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Meta } from '../entities/basemenu.entity';

export class CreateBasemenuDto {
  /**
   * 菜单名称
   * @example dashboard
   */
  @IsString()
  name: string;

  /**
   * 路径
   * @example dashboard
   */
  @IsString()
  path: string;

  /**
   * 排序
   * @example 1
   */
  @IsNumber()
  sort: number;

  /**
   * 组件路径
   * @example pages/dashboard
   */
  @IsString()
  component: string;

  meta: Meta;

  /**
   * 需要设置的权限数组
   * @example [999]
   */
  // @ArrayNotEmpty()
  // authorities: AuthorityEntity[];
}
