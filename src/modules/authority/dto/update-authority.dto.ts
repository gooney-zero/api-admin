import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthorityDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  defaultRouter: string;
}
