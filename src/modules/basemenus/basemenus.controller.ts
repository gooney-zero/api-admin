import { Logger } from '@/common/interceptors/logger.interceptor';
import { SWAGGER_TOKEN_NAME } from '@/constants/common';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { BasemenusService } from './basemenus.service';
import { CreateBasemenuDto } from './dto/create-basemenu.dto';
import { UpdateBasemenuDto } from './dto/update-basemenu.dto';

@ApiTags('basemenu')
@ApiBearerAuth(SWAGGER_TOKEN_NAME)
@Controller('basemenus')
export class BasemenusController {
  constructor(private readonly basemenusService: BasemenusService) {}

  @Post('/create')
  create(@Body() createBasemenuDto: CreateBasemenuDto) {
    return this.basemenusService.create(createBasemenuDto);
  }

  @Post('addmenuAuthority')
  addmenuAuthority(@Body() updateBasemenuDto: UpdateBasemenuDto) {
    return this.basemenusService.addMenuAuthority(updateBasemenuDto);
  }

  @Get('getMenus')
  getMenus(@Request() req) {
    return this.basemenusService.getMenus(req.user.authorityId);
  }
  @Get('getAllOfMenu')
  getAllOfMenu() {
    return this.basemenusService.getAllOfMenu();
  }

  @Get('/getFlatMenus/:id')
  getFlatMenusById(@Param('id') authorityId: number) {
    return this.basemenusService.getFlatMenusById(authorityId);
  }
}
