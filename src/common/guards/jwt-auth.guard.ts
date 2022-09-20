import { ErrorCode } from '@/constants/e/code';
import { AuthService } from '@/modules/auth/auth.service';
import {
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { AUTHORIZE_KEY_METADATA } from '../decorators/authorize.decorator';
import { ResultData } from '../data/result.data';
import { ApiException } from '../exceptions/apiexception.httpexception';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AuthService)
    private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const allowAnon = this.reflector.getAllAndOverride<boolean>(
      AUTHORIZE_KEY_METADATA,
      [ctx.getHandler(), ctx.getClass()],
    );
    // return true;
    if (allowAnon) return true;
    const req = ctx.switchToHttp().getRequest();
    const accessToken = req.get('Authorization');
    if (!accessToken)
      throw new ForbiddenException(ResultData.fail(ErrorCode.NOT_LOGGED_IN));
    const user = this.authService.verifyToken(accessToken);
    if (!user) throw new ApiException(ErrorCode.LOGIN_HAS_EXPIRED);
    return this.activate(ctx);
  }

  async activate(ctx: ExecutionContext): Promise<boolean> {
    return super.canActivate(ctx) as Promise<boolean>;
  }
}
