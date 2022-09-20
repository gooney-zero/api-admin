import { IsString } from 'class-validator';

export class JwtConfig {
  @IsString()
  readonly secretkey: string;
  @IsString()
  readonly expiresin: string;
  @IsString()
  readonly refreshExpiresIn: string;
}
