import { ResultData } from '@/common/data/result.data';
import { ErrorCode } from '@/constants/e/code';
import { passwordToHash } from '@/utils/password.helper';
// import { passwordToHash } from '@/utils/password.helper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { instanceToPlain } from 'class-transformer';
import { Repository } from 'typeorm';
import { AuthorityService } from '../authority/authority.service';
import { AuthorityEntity } from '../authority/entities/authority.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersEntity } from './entities/user.entity';
import { NewCreateVo } from './vo/create.vo';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UsersEntity)
    private userRepository: Repository<UsersEntity>,
    private authorityService: AuthorityService,
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
