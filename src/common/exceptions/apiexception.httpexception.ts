import { ErrorCode } from '@/constants/e/code';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ResultData } from '../data/result.data';

export class ApiException extends HttpException {
  constructor(public readonly code: ErrorCode) {
    super(ResultData.fail(code), HttpStatus.OK);
  }
}
