import { Logger } from '@/common/interceptors/logger.interceptor';
import { ResultData } from '@/common/data/result.data';
import { ErrorCode } from '@/constants/e/code';
import { checkPassword } from '@/utils/password.helper';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findWithPassword(username);
    if (!user) {
      return ResultData.fail(ErrorCode.ERROR_USER_WRONG_PASSWORD);
    }
    if (!checkPassword(user.password, pass)) {
      return ResultData.fail(ErrorCode.ERROR_USER_WRONG_PASSWORD);
    }
    return ResultData.ok(user);
  }

  async validateUserById(id: number) {
    const user = await this.usersService.getUserInfo(id);
    if (!user) {
      return ResultData.fail(ErrorCode.ERROR_USER_WRONG_PASSWORD);
    }
  }

  async login(user: UsersEntity) {
    const payload = {
      username: user.userName,
      id: user.id,
      authorityId: user.authorityId,
    };
    return {
      access_token: this.genToken(payload),
      user: {
        uuid: user.uuid,
        nickName: user.nickName,
        headerImg: user.headerImg,
        authority: user.authorities,
        sideMode: user.sideMode,
        activeColor: user.activeColor,
        baseColor: user.baseColor,
      },
    };
  }

  genToken(payload: { username: string; id: number }) {
    return `Bearer ${this.jwtService.sign(payload)}`;
  }

  verifyToken(token: string) {
    try {
      if (!token) return null;
      const user = this.jwtService.verify(token.replace('Bearer ', ''));
      return user;
    } catch (error) {
      return null;
    }
  }
}
