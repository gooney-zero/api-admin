import { IsString } from 'class-validator';

export class LoginDto {
  /**
   * 用户名
   * @example gooney
   */
  @IsString()
  username: string;

  /**
   * 登录密码
   * @example 123456
   */
  @IsString()
  password: string;
}
