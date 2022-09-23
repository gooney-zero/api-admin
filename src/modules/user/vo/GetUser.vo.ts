import { AuthorityEntity } from '@/modules/authority/entities/authority.entity';
import { BaseEntity } from '@/modules/base.entity';

export class GetUserVo extends BaseEntity {
  uuid: string;

  userName: string;

  nickName: string;

  sideMode: string;

  headerImg: string;

  baseColor: string;

  activeColor: string;

  authorityId: number;

  phone: string;

  email: string;

  enable: number;

  authority: AuthorityEntity;

  authorities: AuthorityEntity[];
}
