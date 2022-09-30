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
  TreeLevelColumn,
  TreeParent,
} from 'typeorm';

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

  @TreeLevelColumn()
  @Column({ default: null, nullable: true })
  parentId: number;

  @TreeParent()
  parent: BaseMenusEntity;

  @TreeChildren({ cascade: true })
  children: BaseMenusEntity[];
}
