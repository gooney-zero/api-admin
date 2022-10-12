import { ResultData } from '@/common/data/result.data';
import { ErrorCode } from '@/constants/e/code';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, In, Not, Repository, TreeRepository } from 'typeorm';
import { AuthorityService } from '../authority/authority.service';
import { AuthorityEntity } from '../authority/entities/authority.entity';
import { CreateBasemenuDto } from './dto/create-basemenu.dto';
import { UpdateBasemenuAuthorityDto } from './dto/update-basemenu-authority.dto';
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
    return this.conn.transaction(async (manager) => {
      const menu = await manager.findOne(BaseMenusEntity, {
        where: { name: createBasemenuDto.name },
      });
      if (menu)
        return ResultData.fail(ErrorCode.ERROR_BASE_MENU_NAME_ALREADY_EXIST);

      let child = new BaseMenusEntity();
      const { parentId, ...rest } = createBasemenuDto;

      child = Object.assign(child, rest);

      // parentId !== 0说明是子菜单
      if (parentId !== 0) {
        const parent = await manager.findOne(BaseMenusEntity, {
          where: { id: parentId },
        });
        if (!parent) {
          return ResultData.fail(
            ErrorCode.ERROR_BASE_MENU_NAME_NOTFOUND_PARENT,
          );
        }
        child.parent = parent;
      }
      return manager.save(child).then(async (res) => {
        const closureTableName =
          this.baseMenusRepository.metadata.closureJunctionTable.tablePath;
        if (res?.parent?.id && res.id) {
          // 需要手动更新 closureTable 的 id_ancestor的值 typroem的bug 如果不更新 默认id_ancestor 和 id_descendant都是 child的id
          const sql = `UPDATE ${closureTableName} SET id_ancestor =${res.parent.id}  WHERE id_ancestor = ${res.id} AND id_descendant =${res.id} `;
          await manager.query(sql);
        }
        return ResultData.ok(res);
      });
    });
  }
  async update(updateBasemenuDto: UpdateBasemenuDto) {
    return this.conn.transaction(async (manager) => {
      let child = await manager.findOne(BaseMenusEntity, {
        where: { id: updateBasemenuDto.id },
      });
      if (!child) return ResultData.fail(ErrorCode.ERROR_BASE_MENU_NOT_EXIST);
      if (child.name !== updateBasemenuDto.name) {
        const oldMenu = await manager.findOne(BaseMenusEntity, {
          where: {
            id: Not(updateBasemenuDto.id),
            name: updateBasemenuDto.name,
          },
        });
        if (oldMenu) {
          return ResultData.fail(ErrorCode.ERROR_BASE_MENU_NAME_ALREADY_EXIST);
        }
      }
      const { parentId, ...rest } = updateBasemenuDto;

      child = Object.assign(child, rest);
      if (parentId === 0) {
        child.parent = null;
      } else {
        const parent = await manager.findOne(BaseMenusEntity, {
          where: { id: parentId },
        });
        if (!parent) {
          return ResultData.fail(
            ErrorCode.ERROR_BASE_MENU_NAME_NOTFOUND_PARENT,
          );
        }
        child.parent = parent;
      }
      return manager.save(child).then(async (res) => {
        console.log(res);
        const closureTableName =
          this.baseMenusRepository.metadata.closureJunctionTable.tablePath;
        // 需要手动更新 closureTable 的 id_ancestor的值
        if (res?.parent?.id && res.id) {
          const sql = `UPDATE ${closureTableName} SET id_ancestor =${res.parent.id}  WHERE id_descendant =${res.id} `;
          console.log(sql);
          await manager.query(sql);
        }
        return ResultData.ok(null);
      });
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

  addMenuAuthority(updateBasemenuDto: UpdateBasemenuAuthorityDto) {
    const auth = new AuthorityEntity();

    auth.baseMenus = updateBasemenuDto.baseMenus;

    auth.authorityId = updateBasemenuDto.authorityId;

    return this.authorityService
      .addMenuAuthority(auth)
      .then((v) => ResultData.ok(v));
  }

  remove(id: number) {
    return this.conn.transaction(async (manager) => {
      const hasChildren = await manager.findOne(BaseMenusEntity, {
        where: { parentId: id },
      });
      if (hasChildren) {
        return ResultData.fail(ErrorCode.ERROR_BASE_MENU_HAS_EXIST_CHILDREN);
      }
      const existed = await manager.findOne(BaseMenusEntity, {
        where: { id },
        relations: ['authorities'],
      });
      if (!existed)
        return ResultData.fail(ErrorCode.ERROR_BASE_MENU_NAME_NOTFOUND);
      // 先删除所有角色拥有该菜单权限
      return manager
        .getRepository(BaseMenusEntity)
        .createQueryBuilder('menu')
        .relation('authorities')
        .of(existed)
        .remove(existed.authorities)
        .then(() => {
          // 再删除菜单
          return manager.remove(existed).then((v) => ResultData.ok(null));
        })
        .catch((e) => {
          ResultData.fail(ErrorCode.ERROR_BASE_MENU_DELETE_FAIL);
        });
    });
  }

  getChildrenList(
    menu: BaseMenusEntity,
    treeMap: Record<string, BaseMenusEntity[]>,
  ) {
    menu.children = treeMap[menu.id];

    if (menu.children) {
      const len = menu.children.length;
      for (let i = 0; i < len; i++) {
        const v = menu.children[i];
        this.getChildrenList(v, treeMap);
      }
    }
  }

  async getMenus(authorityId: number) {
    const mapMenus = await this.getTreeMap(authorityId);
    const menus = mapMenus['0'];
    const len = menus.length;
    for (let i = 0; i < len; i++) {
      const v = menus[i];
      this.getChildrenList(v, mapMenus);
    }
    return ResultData.ok(menus);
  }

  /**
   * 根据权限获取map树
   * @param authorityId
   * @returns
   */
  async getTreeMap(
    authorityId: number,
  ): Promise<Record<string, BaseMenusEntity[]>> {
    const data = await this.getFlatMenusById(authorityId);
    const mapMenus: Record<string, BaseMenusEntity[]> = {};
    const v = data.data;
    for (let i = 0; i < v.length; i++) {
      const item = v[i];
      (
        mapMenus[item.parentId ?? 0] || (mapMenus[item.parentId ?? 0] = [])
      ).push(item);
    }
    return mapMenus;
  }

  /**
   * 获取不带children菜单
   * @param authorityId
   * @returns
   */
  async getFlatMenusById(authorityId: number) {
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
      const menuIds = menus.baseMenus.map((v) => v.id);

      return manager
        .find(BaseMenusEntity, {
          where: {
            id: In(menuIds),
          },
          order: {
            sort: 'DESC',
          },
        })
        .then((v) => ResultData.ok(v));
    });
  }

  /**
   * 获取带children菜单
   * @returns
   */
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
