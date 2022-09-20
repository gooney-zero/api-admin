import { ApiProperty } from '@nestjs/swagger';

export class CreateVo {
  /**
   *
   * 用户唯一标识
   */
  uid: string;
}

export function NewCreateVo(uid: string) {
  const c = new CreateVo();
  c.uid = uid;
  return c;
}
