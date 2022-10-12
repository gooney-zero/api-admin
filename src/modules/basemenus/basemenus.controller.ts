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
import { RemoveBasemenuDto } from './dto/remove-basemenu.dto';
import { UpdateBasemenuAuthorityDto } from './dto/update-basemenu-authority.dto';
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

  @Post('/update')
  update(@Body() updateBasemenuDto: UpdateBasemenuDto) {
    return this.basemenusService.update(updateBasemenuDto);
  }

  @Post('/remove')
  remove(@Body() removeBasemenuDto: RemoveBasemenuDto) {
    return this.basemenusService.remove(removeBasemenuDto.id);
  }

  @Post('addmenuAuthority')
  addmenuAuthority(@Body() updateBasemenuDto: UpdateBasemenuAuthorityDto) {
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
