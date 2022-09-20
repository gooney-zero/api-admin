import { IsString } from 'class-validator';

export class DatabaseConfig {
  @IsString()
  public readonly type!: string;
  @IsString()
  public readonly database!: string;
  @IsString()
  public readonly username!: string;
  @IsString()
  public readonly password!: string;
  @IsString()
  public readonly host!: string;
  @IsString()
  public readonly port!: string;
  @IsString()
  public readonly charset!: string;
}
