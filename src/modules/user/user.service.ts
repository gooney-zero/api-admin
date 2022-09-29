import { ResultData } from '@/common/data/result.data';
import { ErrorCode } from '@/constants/e/code';
import { passwordToHash } from '@/utils/password.helper';
// import { passwordToHash } from '@/utils/password.helper';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { EntityManager, Repository } from 'typeorm';
import { AuthorityService } from '../authority/authority.service';
import { AuthorityEntity } from '../authority/entities/authority.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersEntity } from './entities/user.entity';
import { NewCreateVo } from './vo/create.vo';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private authorityService: AuthorityService,
    @InjectEntityManager() private entityManager: EntityManager,
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: { userName: createUserDto.userName },
    });
    if (!user) {
      createUserDto.password = passwordToHash(createUserDto.password);
      const authorities = createUserDto.authorities.map((id) => {
        const authority = new AuthorityEntity();
        authority.authorityId = id;
        return authority;
      });
      const authority = new AuthorityEntity();
      authority.authorityId = createUserDto.authorityId;

      return this.userRepository
        .save({ ...createUserDto, authorities, authority: authority })
        .then((user) => {
          return ResultData.ok(instanceToPlain(NewCreateVo(user.uuid)));
        });
    }
    const code = ErrorCode.ERROR_USER_ALREADY_EXIST;
    return ResultData.fail(code);
  }

  async setUserInfo(updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { uuid: updateUserDto.uuid },
    });
    if (!user) {
      return ResultData.fail(ErrorCode.ERROR_USER_NOT_EXIST);
    }

    return await this.entityManager.transaction(async (manager) => {
      const userEntity = new UsersEntity();
      if (updateUserDto.authorities?.length) {
        const authorities: AuthorityEntity[] = [];
        for (let i = 0; i < updateUserDto.authorities.length; i++) {
          const listOne = await manager.findOne(AuthorityEntity, {
            where: { authorityId: updateUserDto.authorities[i] },
          });
          if (!listOne) {
            return ResultData.fail(ErrorCode.ERROR_AUTHORITY_NOT_EXIST);
          }
          authorities.push(listOne);
        }
        userEntity.authorities = authorities;
      }
      userEntity.id = user.id;
      userEntity.sideMode = updateUserDto.sideMode;
      userEntity.headerImg = updateUserDto.headerImg;
      userEntity.baseColor = updateUserDto.baseColor;
      userEntity.activeColor = updateUserDto.activeColor;
      userEntity.phone = updateUserDto.phone;
      userEntity.email = updateUserDto.email;
      userEntity.enable = updateUserDto.enable;
      userEntity.authorityId = updateUserDto.authorityId;
      return manager
        .save(userEntity)
        .then(() => ResultData.ok())
        .catch(() => ResultData.fail(ErrorCode.ERROR_USER_WRONG_UPDATE));
    });
  }

  findWithPassword(userName: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where({ userName })
      .getOne()
      .then((v) => ResultData.ok(v));
  }

  getUserInfo(uuid: string) {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.uuid = :uuid', { uuid })
      .leftJoinAndSelect('user.authority', 'authority')
      .leftJoinAndSelect('user.authorities', 'authorities')
      .getOne()
      .then((v) => ResultData.ok(v));
  }

  findAll() {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.authorities', 'authorities')
      .getMany()
      .then((v) => ResultData.ok(v));
  }

  async delUser(userUuid: string, uuid: string) {
    if (userUuid === uuid) {
      return ResultData.fail(ErrorCode.ERROR_USER_WRONG_DELETE_SELF);
    }
    const user = await this.userRepository.findOne({
      where: { uuid },
    });
    if (!user) {
      return ResultData.fail(ErrorCode.ERROR_USER_NOT_EXIST);
    }
    return await this.entityManager.transaction(async (manager) => {
      const userEntity = new UsersEntity();
      userEntity.id = user.id;
      userEntity.authorities = [];
      await manager.save(userEntity);
      return manager
        .softRemove(user)
        .then(() => ResultData.ok())
        .catch(() => ResultData.fail(ErrorCode.ERROR_USER_WRONG_DELETE_FAIL));
    });
  }

  initUser() {
    const user = new CreateUserDto();
    user.userName = 'admin';
    user.password = '123456';
    user.nickName = 'admin';
    user.authorityId = 999;
    user.authorities = [999];
    return this.create(user);
  }
}
