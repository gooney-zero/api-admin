import { ResultData } from '@/common/data/result.data';
import { ErrorCode } from '@/constants/e/code';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, TreeRepository } from 'typeorm';
import { AuthorityService } from '../authority/authority.service';
import { AuthorityEntity } from '../authority/entities/authority.entity';
import { CreateBasemenuDto } from './dto/create-basemenu.dto';
import { UpdateBasemenuDto } from './dto/update-basemenu.dto';
import { BaseMenusEntity } from './entities/basemenu.entity';
import { MenuAuthorityEntity } from './entities/menu_authority.entity';

@Injectable()
export class BasemenusService {
  constructor(
    @InjectEntityManager()
    private conn: EntityManager,
    @InjectRepository(BaseMenusEntity)
    private baseMenusRepository: TreeRepository<BaseMenusEntity>,
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

    let child = new BaseMenusEntity();
    const { parentId, ...rest } = createBasemenuDto;

    child = Object.assign(child, rest);

    // parentId !== 0说明是子菜单
    if (parentId !== 0) {
      const parent = await this.baseMenusRepository.findOne({
        where: { id: parentId },
      });
      if (!parent) {
        return ResultData.fail(ErrorCode.ERROR_BASE_MENU_NAME_NOTFOUND_PARENT);
      }
      child.parent = parent;
    }
    return this.baseMenusRepository.save(child).then((res) => {
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

    return this.authorityService
      .addMenuAuthority(auth)
      .then((v) => ResultData.ok(v));
  }

  remove(id: number) {
    return `This action removes a #${id} basemenu`;
  }
  async getMenus(authorityId: number) {
    const authorityMenus = await this.menuAuthorityEntity.findBy({
      authority_id: authorityId,
    });

    const menuIds = authorityMenus.map((v) => v.menu_id);
    return this.baseMenusRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.children', 'children')
      .where('menu.id IN (:...menuIds)', { menuIds })
      .orderBy('menu.sort', 'DESC')
      .getMany()
      .then((v) => {
        return ResultData.ok(v);
      })
      .catch((e) => {
        return e.sqlMessage;
      });
  }

  getAllOfMenu() {
    return this.baseMenusRepository
      .findTrees()
      .then((v) => {
        return ResultData.ok(v);
      })
      .catch((e) => {
        return e.sqlMessage;
      });
  }
}
