import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '@/common/decorators/api.result.decorator';
import { CreateVo } from './vo/create.vo';
import { ResultData } from '@/common/data/result.data';
import { Authorize } from '@/common/decorators/authorize.decorator';
import { UsersEntity } from './entities/user.entity';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@ApiBearerAuth()
@ApiExtraModels(ResultData, CreateVo, CreateUserDto)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 创建一个新用户
   */
  @ApiResult(CreateVo)
  @Post('/create')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  /**
   * 查找所有用户
   */
  @Get('/getUsers')
  findAll() {
    return this.userService.findAll();
  }

  /**
   * 查找当前用户
   */
  @Get('/getUserInfo')
  getUserInfo(@Request() req) {
    return this.userService.getUserInfo(req.user.id);
  }
}
