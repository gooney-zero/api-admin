import { ResultData } from '@/common/data/result.data';
import { ErrorCode } from '@/constants/e/code';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorityDto } from './dto/create-authority.dto';
import { UpdateAuthorityDto } from './dto/update-authority.dto';
import { AuthorityEntity } from './entities/authority.entity';

@Injectable()
export class AuthorityService {
  constructor(
    @InjectRepository(AuthorityEntity)
    private authorityRepository: Repository<AuthorityEntity>,
  ) {}
  async create(createAuthorityDto: CreateAuthorityDto) {
    const item = await this.authorityRepository.findOne({
      where: { authorityId: createAuthorityDto.authorityId },
    });
    if (item) return ResultData.fail(ErrorCode.ERROR_AUTHORITY_ALREADY_EXIST);
    return this.authorityRepository
      .save(createAuthorityDto)
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
      .skip(pageSize * (page - 1))
      .take(pageSize)
      .getManyAndCount()
      .then((v) => ResultData.ok({ list: v[0], total: v[1] }));
  }

  findOne(id: number) {
    return `This action returns a #${id} authority`;
  }

  update(id: number, updateAuthorityDto: UpdateAuthorityDto) {
    return `This action updates a #${id} authority`;
  }

  remove(id: number) {
    return `This action removes a #${id} authority`;
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
    return this.authorityRepository.save(auth).catch((e) => {
      console.log(e);
      return e;
    });
  }
}
