import { IsNumber } from 'class-validator';

export class RemoveBasemenuDto {
  /**
   * 菜单ID
   * @example dashboard
   */
  @IsNumber()
  id: number;
}
