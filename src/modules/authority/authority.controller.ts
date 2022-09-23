import { ApiResult } from '@/common/decorators/api.result.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiExtraModels } from '@nestjs/swagger';
import { AuthorityService } from './authority.service';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { GetAuthorityListVO } from './vo/GetAuthorityList.vo';

@ApiTags('authority')
@ApiBearerAuth()
@ApiExtraModels(GetAuthorityListVO)
@Controller('authority')
export class AuthorityController {
  constructor(private readonly authorityService: AuthorityService) {}

  @Post()
  create(@Body() createAuthorityDto: CreateAuthorityDto) {
    return this.authorityService.create(createAuthorityDto);
  }

  @Get('/list')
  findAll(@Request() req) {
    return this.authorityService.findAll(req.user.authorityId);
  }

  @Get('/getAuthorityList')
  @ApiResult(GetAuthorityListVO)
  findAuthorityList(
    @Request() req,
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.authorityService.findList(page, pageSize);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorityService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAuthorityDto: UpdateAuthorityDto,
  ) {
    return this.authorityService.update(+id, updateAuthorityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorityService.remove(+id);
  }
}
