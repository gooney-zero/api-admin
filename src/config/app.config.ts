import { Type } from 'class-transformer';
import { IsDefined, IsNumber, IsString, ValidateNested } from 'class-validator';

class LoggerConfig {
  @IsString()
  readonly dir: string;
}

export class AppConfig {
  @Type(() => LoggerConfig)
  @ValidateNested()
  @IsDefined()
  public readonly logger!: LoggerConfig;

  @IsNumber()
  readonly port: number;

  @IsString()
  readonly prefix: string;
}
