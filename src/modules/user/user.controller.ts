import {
  Controller,
  Get,
  Post,
  Body,
  ClassSerializerInterceptor,
  UseInterceptors,
  Request,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { ApiResult } from '@/common/decorators/api.result.decorator';
import { CreateVo } from './vo/create.vo';
import { ResultData } from '@/common/data/result.data';
import { GetUserVo } from './vo/GetUser.vo';
import { UpdateUserDto } from './dto/update-user.dto';
import { DeleteUserDto } from './dto/detele-user.dto';
import { SWAGGER_TOKEN_NAME } from '@/constants/common';

@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('user')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@ApiExtraModels(ResultData, CreateVo, CreateUserDto, GetUserVo)
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
  @ApiResult(GetUserVo)
  @Get('/getUserInfo')
  getUserInfo(@Request() req) {
    return this.userService.getUserInfo(req.user.uuid);
  }
  /**
   * 更新当前用户
   */
  @ApiResult()
  @Post('/updateUser')
  setUserInfo(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.setUserInfo(updateUserDto);
  }
  /**
   * 删除当前用户
   */
  @ApiResult()
  @Post('/deleteUser')
  deleteUser(@Request() req, @Body() body: DeleteUserDto) {
    return this.userService.delUser(req.user.uuid, body.uuid);
  }
}
