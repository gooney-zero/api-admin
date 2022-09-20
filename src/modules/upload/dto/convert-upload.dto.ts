import { IsArray } from 'class-validator';

export class ConvertUploadDto {
  @IsArray()
  files: string[];
}
