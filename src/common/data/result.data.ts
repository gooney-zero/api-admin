import { ErrorCode } from '@/constants/e/code';
import { MsgFlags } from '@/constants/e/msg';
import { ApiProperty } from '@nestjs/swagger';

// import { ApiProperty } from '@nestjs/swagger'
export class ResultData<T> {
  constructor(code = ErrorCode.SUCCESS, data?: T) {
    this.code = code;
    this.msg = this.getMsg(this.code);
    this.data = data || null;
  }

  @ApiProperty({ type: 'number', default: 200 })
  code: ErrorCode;

  @ApiProperty({ type: 'string', default: 'ok' })
  msg?: string;

  data?: T;

  getMsg(code: ErrorCode) {
    const msg = MsgFlags[code];
    if (msg) {
      return msg;
    }
    return MsgFlags[ErrorCode.ERROR];
  }

  static ok<T>(data?: T) {
    return new ResultData(ErrorCode.SUCCESS, data);
  }
  static fail<T>(code: ErrorCode, data: T = null) {
    return new ResultData(code, data);
  }
}
