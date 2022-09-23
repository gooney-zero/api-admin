import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { RootConfig } from '@/config/configurations';
import { UserService } from '@/modules/user/user.service';
import { ErrorCode } from '@/constants/e/code';
import { ApiException } from '@/common/exceptions/apiexception.httpexception';

interface JwtPayload {
  iat: number;
  exp: number;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: RootConfig,
    private readonly userService: UserService,
  ) {
    super({
      // fromHeader：在Http 请求头中查找JWT
      // fromBodyField: 在请求的Body字段中查找JWT
      // fromAuthHeaderAsBearerToken：在授权标头带有Bearer方案中查找JWT
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secretkey,
    });
  }

  // token验证, payload是super中已经解析好的token信息
  async validate(
    payload: {
      username: string;
      uuid: string;
      authorityId: number;
    } & JwtPayload,
    done: VerifiedCallback,
  ) {
    // return payload;
    const { iat, exp, uuid, authorityId } = payload;
    const timeDiff = exp - iat;
    if (timeDiff <= 0) {
      throw new ApiException(ErrorCode.LOGIN_HAS_EXPIRED);
    }

    const { data: user } = await this.userService.getUserInfo(uuid);
    if (!user) {
      throw new ApiException(ErrorCode.NOT_LOGGED_IN);
    }

    delete user.password;
    done(null, { uuid: user.uuid, authorityId: authorityId });
  }
}
