import { IsUUID } from 'class-validator';

export class DeleteUserDto {
  @IsUUID()
  uuid: string;
}
