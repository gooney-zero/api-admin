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

@Injectable()
export class BasemenusService {
  constructor(
    @InjectEntityManager()
    private conn: EntityManager,
    @InjectRepository(BaseMenusEntity)
    private baseMenusRepository: TreeRepository<BaseMenusEntity>,
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
      const closureTableName =
        this.baseMenusRepository.metadata.closureJunctionTable.tablePath;
      // 需要手动更新 closureTable 的 id_ancestor的值 typroem的bug 如果不更新 默认id_ancestor 和 id_descendant都是 child的id
      const sql = `UPDATE ${closureTableName} SET id_ancestor =${res.parent.id}  WHERE id_ancestor = ${res.id} AND id_descendant =${res.id} `;
      this.baseMenusRepository.query(sql);
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
    return await this.conn.transaction(async (manager) => {
      const menus = await manager.findOne(AuthorityEntity, {
        where: { authorityId },
        relations: {
          baseMenus: true,
        },
        select: {
          baseMenus: true,
        },
      });
      return await Promise.all(
        menus.baseMenus.map(async (v) =>
          this.baseMenusRepository.findDescendantsTree(v),
        ),
      )
        .then((v) => ResultData.ok(v))
        .catch((e) => {
          return e.sqlMessage;
        });
    });
  }

  async getFlatMenusById(authorityId: number) {
    return await this.conn.transaction(async (manager) => {
      const authority = await manager.findOne(AuthorityEntity, {
        where: { authorityId },
        relations: ['baseMenus'],
        select: ['baseMenus'],
      });
      const menus = authority.baseMenus.map(
        async (menu) =>
          await manager
            .getTreeRepository(BaseMenusEntity)
            .findDescendants(menu),
      );
      return Promise.all(menus)

        .then((v) => {
          return ResultData.ok([...authority.baseMenus, ...v.flat()]);
        })
        .catch((e) => {
          return e;
        });
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
