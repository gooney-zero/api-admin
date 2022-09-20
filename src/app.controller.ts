import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthorityService } from './modules/authority/authority.service';
import { BasemenusService } from './modules/basemenus/basemenus.service';
import { UserService } from './modules/user/user.service';

@ApiTags('init')
@ApiBearerAuth()
@Controller('init')
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly authorityService: AuthorityService,
    private readonly baseMenuService: BasemenusService,
  ) {}

  @Get()
  initData() {
    return this.authorityService.init().then(() => {
      return this.userService.initUser().then(() => {
        return this.baseMenuService.initBaseMenu();
      });
    });
  }
}
