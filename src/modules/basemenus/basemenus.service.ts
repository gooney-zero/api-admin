import { ResultData } from '@/common/data/result.data';
import { ErrorCode } from '@/constants/e/code';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthorityService } from '../authority/authority.service';
import { AuthorityEntity } from '../authority/entities/authority.entity';
import { CreateBasemenuDto } from './dto/create-basemenu.dto';
import { UpdateBasemenuDto } from './dto/update-basemenu.dto';
import { BaseMenusEntity } from './entities/basemenu.entity';
import { MenuAuthorityEntity } from './entities/menu_authority.entity';

@Injectable()
export class BasemenusService {
  constructor(
    @InjectRepository(BaseMenusEntity)
    private baseMenusRepository: Repository<BaseMenusEntity>,
    @InjectRepository(MenuAuthorityEntity)
    private menuAuthorityEntity: Repository<MenuAuthorityEntity>,
    private authorityService: AuthorityService,
  ) {}
  async create(createBasemenuDto: CreateBasemenuDto) {
    const menu = await this.baseMenusRepository.findOne({
      where: { name: createBasemenuDto.name },
    });
    if (menu)
      return ResultData.fail(ErrorCode.ERROR_BASE_MENU_NAME_ALREADY_EXIST);
    return this.baseMenusRepository.save(createBasemenuDto).then((res) => {
      return ResultData.ok(res);
    });
  }

  initBaseMenu() {
    const createBasemenuDto = new CreateBasemenuDto();
    createBasemenuDto.name = 'dashboard';
    createBasemenuDto.path = 'dashboard';
    createBasemenuDto.sort = 1;
    createBasemenuDto.component = 'pages/superAdmin';
    createBasemenuDto.meta = {
      title: 'dashboard',
      icon: 'icon',
      keepAlive: true,
    };
    return this.baseMenusRepository.create(createBasemenuDto);
  }

  addMenuAuthority(updateBasemenuDto: UpdateBasemenuDto) {
    const auth = new AuthorityEntity();

    auth.baseMenus = updateBasemenuDto.baseMenus;

    auth.authorityId = updateBasemenuDto.authorityId;

    return this.authorityService.addMenuAuthority(auth);
  }

  remove(id: number) {
    return `This action removes a #${id} basemenu`;
  }
  async getMenus(authorityId: number) {
    const authorityMenus = await this.menuAuthorityEntity.findBy({
      authority_id: authorityId,
    });

    console.log(authorityMenus);

    const menuIds = authorityMenus.map((v) => v.menu_id);
    return this.baseMenusRepository
      .createQueryBuilder('menu')
      .where('menu.id IN (:...menuIds)', { menuIds })
      .orderBy('menu.sort')
      .getMany()
      .then((v) => {
        return v;
      })
      .catch((e) => {
        return e.sqlMessage;
      });
  }
}
