import { ArrayNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  /**
   * 申请登录账号
   * @example gooney
   */
  @IsString()
  userName: string;

  /**
   * 申请登录密码
   * @example 123456
   */
  @IsString()
  password: string;

  /**
   * @example 999
   */
  @IsNumber()
  authorityId: number;

  /**
   * 需要设置的权限数组
   * @example [999]
   */
  @ArrayNotEmpty()
  authorities: number[];
  /**
   * @example gooney
   */
  @IsString()
  @IsOptional()
  nickName: string;

  @IsString()
  @IsOptional()
  sideMode: string;

  @IsString()
  @IsOptional()
  headerImg: string;

  @IsString()
  @IsOptional()
  baseColor: string;

  @IsString()
  @IsOptional()
  activeColor: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  email: string;

  @IsNumber()
  @IsOptional()
  enable: number;
}
