import { AuthorityEntity } from '@/modules/authority/entities/authority.entity';

export class LoginVo {
  /**
   * 登录令牌
   */
  access_token: string;

  user: {
    uuid: string;
    nickName: string;
    headerImg: string;
    authority: AuthorityEntity;
    sideMode: string;
    activeColor: string;
    baseColor: string;
  };
}
