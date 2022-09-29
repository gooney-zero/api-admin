import { Authorize } from '@/common/decorators/authorize.decorator';
import { ApiResult } from '@/common/decorators/api.result.decorator';
import { LocalAuthGuard } from '@/common/guards/local-auth.guard';
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginVo } from './vo/login.vo';
import { SWAGGER_TOKEN_NAME } from '@/constants/common';

@ApiTags('auth用户登录')
@ApiBearerAuth()
@ApiExtraModels(LoginVo)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    this.authService = authService;
  }

  /**
   * 登录
   * @param req.user 的参数是从validate()方法中的返回值定义的
   * @returns
   */
  // 对应请求的地方标记使用ClassSerializerInterceptor，此时，该Controller中所有的请求都不包含password字段，
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiResult(LoginVo)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  @ApiBearerAuth(SWAGGER_TOKEN_NAME)
  @Authorize()
  async login(@Request() req, @Body() user: LoginDto) {
    return this.authService.login(req.user);
  }
  // async login(@Body() user: LoginDto) {
  //   return this.authService.login(user);
  // }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
