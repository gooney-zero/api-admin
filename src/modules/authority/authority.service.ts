import { ResultData } from '@/common/data/result.data';
import { ErrorCode } from '@/constants/e/code';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { AuthorityEntity } from './entities/authority.entity';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectRepository(AuthorityEntity)
    private authorityRepository: Repository<AuthorityEntity>,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}
  async create(createAuthorityDto: CreateAuthorityDto) {
    const item = await this.authorityRepository.findOne({
      where: { authorityId: createAuthorityDto.authorityId },
    });
    if (item) return ResultData.fail(ErrorCode.ERROR_AUTHORITY_ALREADY_EXIST);
    return this.authorityRepository
      .insert(createAuthorityDto)
      .then(() => ResultData.ok());
  }

  findAll(authorityId: number) {
    return this.authorityRepository
      .createQueryBuilder('authority')
      .leftJoinAndSelect('authority.users', 'users')
      .leftJoinAndSelect('authority.baseMenus', 'baseMenus')
      .getMany()
      .then((v) => {
        ResultData.ok(v);
      });
  }
  findList(page: number, pageSize: number) {
    return this.authorityRepository
      .createQueryBuilder('authority')
      .leftJoinAndSelect('authority.baseMenus', 'baseMenus')
      .leftJoinAndSelect('baseMenus.children', 'children')
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount()
      .then((v) => ResultData.ok({ list: v[0], total: v[1] }));
  }

  findOne(id: number) {
    return `This action returns a #${id} authority`;
  }

  async update(id: number, updateAuthorityDto: UpdateAuthorityDto) {
    return await this.entityManager.transaction(async (manager) => {
      const authority = await manager.findOne(AuthorityEntity, {
        where: { authorityId: id },
      });
      if (!authority) {
        return ResultData.fail(ErrorCode.ERROR_AUTHORITY_NOT_EXIST);
      }
      const authorityEntity = new AuthorityEntity();
      authorityEntity.name = updateAuthorityDto.name;
      authorityEntity.authorityId = id;
      authorityEntity.defaultRouter = updateAuthorityDto.defaultRouter;
      return manager
        .save(authorityEntity)
        .then(() => ResultData.ok())
        .catch(() => ResultData.fail(ErrorCode.ERROR_AUTHORITY_WRONG_FAIL));
    });
  }

  async remove(id: number) {
    return await this.entityManager.transaction(async (manager) => {
      const authority = await manager.findOne(AuthorityEntity, {
        where: { authorityId: id },
        relations: {
          users: true,
          baseMenus: true,
        },
      });
      if (authority.users.length > 0) {
        return ResultData.fail(
          ErrorCode.ERROR_AUTHORITY_WRONG_HAVE_USER_USEING,
        );
      }
      const a = new AuthorityEntity();
      a.authorityId = id;
      if (authority.baseMenus.length > 0) {
        // const mas = await manager.findBy(MenuAuthorityEntity, {
        //   authority_id: id,
        // });
        // const ma = new MenuAuthorityEntity();
        // ma.authority_id = id;
        a.baseMenus = [];
        // await manager.remove(ma);
      }
      return await manager
        .remove(a)
        .then(() => ResultData.ok())
        .catch(() => ResultData.fail(ErrorCode.ERROR_USER_WRONG_DELETE_FAIL));
    });
  }

  init() {
    const authority = new CreateAuthorityDto();
    authority.name = '超级管理员';
    authority.authorityId = 999;
    return this.create(authority);
  }

  async findById(authorityId: number) {
    return await this.authorityRepository.findBy({ authorityId });
  }

  addMenuAuthority(auth: AuthorityEntity) {
    return this.authorityRepository
      .save(auth)
      .then(() => ResultData.ok())
      .catch((e) => {
        return ResultData.fail(ErrorCode.ERROR_AUTHORITY_WRONG_ADD_MENY);
      });
  }
}
