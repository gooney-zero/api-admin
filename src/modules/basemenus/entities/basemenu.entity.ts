import { AuthorityEntity } from '@/modules/authority/entities/authority.entity';
import { BaseEntity } from '@/modules/base.entity';
import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { MenuAuthorityEntity } from './menu_authority.entity';

export class Meta {
  /**
   * title
   * @example dashboard
   */
  @Column()
  title: string;

  /**
   * icon
   * @example icon
   */
  @Column()
  icon: string;

  /**
   * keepalive
   * @example true
   */
  @Column()
  keepAlive: boolean;
}

@Entity('sys_base_menus')
@Tree('closure-table')
export class BaseMenusEntity extends BaseEntity {
  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  sort: number;

  @Column()
  component: string;

  @Column(() => Meta)
  meta: Meta;

  @ManyToMany(() => AuthorityEntity, (authority) => authority.baseMenus)
  @IsOptional()
  authorities?: AuthorityEntity[];

  @OneToMany(() => MenuAuthorityEntity, (v) => v.menu)
  authorityToMenus: MenuAuthorityEntity[];

  @TreeParent()
  parent: BaseMenusEntity;

  @TreeChildren()
  children: BaseMenusEntity[];
}
