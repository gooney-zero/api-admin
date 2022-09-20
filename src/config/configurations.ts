import { Type } from 'class-transformer';
import { ValidateNested, IsDefined } from 'class-validator';
import { resolve } from 'path';
import { AppConfig } from './app.config';
import { DatabaseConfig } from './database.config';
import { JwtConfig } from './jwt.config';

export class RootConfig {
  @Type(() => DatabaseConfig)
  @ValidateNested()
  @IsDefined()
  database: DatabaseConfig;

  @Type(() => JwtConfig)
  @ValidateNested()
  @IsDefined()
  jwt: JwtConfig;

  @Type(() => AppConfig)
  @ValidateNested()
  @IsDefined()
  app: AppConfig;
}
