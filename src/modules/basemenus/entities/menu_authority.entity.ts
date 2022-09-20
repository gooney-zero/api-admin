import { AuthorityEntity } from '@/modules/authority/entities/authority.entity';
import { Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { BaseMenusEntity } from './basemenu.entity';

/**
 * authority和basemenu的中间表
 */
@Entity('sys_authority_menus')
export class MenuAuthorityEntity {
  @PrimaryColumn()
  authority_id: number;

  @PrimaryColumn()
  menu_id: number;

  @ManyToOne(() => BaseMenusEntity, (menu) => menu.authorityToMenus)
  menu: BaseMenusEntity;

  @ManyToOne(() => BaseMenusEntity, (menu) => menu.authorityToMenus)
  authority: AuthorityEntity;
}
