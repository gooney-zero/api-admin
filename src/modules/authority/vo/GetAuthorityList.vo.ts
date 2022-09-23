import { BaseEntity } from '@/modules/base.entity';

export class GetAuthorityListVO extends BaseEntity {
  name: string;

  authorityId: number;

  defaultRouter: string;
}
