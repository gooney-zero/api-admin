import { BaseWithoutIdEntity } from '@/modules/base.withoutid.entity';
import { BaseMenusEntity } from '@/modules/basemenus/entities/basemenu.entity';
import { UsersEntity } from '@/modules/user/entities/user.entity';
import { IsOptional } from 'class-validator';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity('sys_authorities')
export class AuthorityEntity extends BaseWithoutIdEntity {
  @Column()
  name: string;

  @Column({ primary: true, unique: true })
  authorityId: number;

  @Column({ comment: '默认菜单', default: 'dashboard' })
  @IsOptional()
  defaultRouter?: string;

  @ManyToMany(() => UsersEntity, (user) => user.authorities)
  users: UsersEntity[];

  @ManyToMany(() => BaseMenusEntity, (menu) => menu.authorities)
  @JoinTable({
    name: 'sys_authority_menus',
    joinColumns: [{ name: 'authority_id' }],
    inverseJoinColumns: [{ name: 'menu_id' }],
  })
  baseMenus: BaseMenusEntity[];
}
