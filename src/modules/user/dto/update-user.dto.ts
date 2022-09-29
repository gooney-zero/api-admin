import {
  ArrayNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateUserDto {
  @IsUUID()
  uuid: string;

  /**
   * 需要设置的权限数组
   * @example [999]
   */
  @ArrayNotEmpty()
  @IsOptional()
  authorities?: number[];
  /**
   * @example gooney
   */
  @IsString()
  @IsOptional()
  nickName?: string;

  @IsString()
  @IsOptional()
  sideMode?: string;

  @IsString()
  @IsOptional()
  headerImg?: string;

  @IsString()
  @IsOptional()
  baseColor?: string;

  @IsString()
  @IsOptional()
  activeColor?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  @IsOptional()
  enable?: number;

  @IsNumber()
  @IsOptional()
  authorityId?: number;
}
