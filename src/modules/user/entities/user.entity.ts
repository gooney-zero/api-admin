import { BaseEntity } from '@/modules/base.entity';
import {
  Entity,
  Column,
  Generated,
  ManyToMany,
  JoinTable,
  JoinColumn,
  OneToMany,
  OneToOne,
  ManyToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { AuthorityEntity } from '@/modules/authority/entities/authority.entity';

@Entity('sys_users')
export class UsersEntity extends BaseEntity {
  @Column()
  @Generated('uuid')
  uuid: string;

  @Column({ comment: '用户登录名', length: '32' })
  userName: string;

  // select表示查询的时候隐藏该字段 exclude表示序列化时过滤掉password字段 需要在对应请求的地方使用ClassSerializerInterceptor
  @Exclude()
  @Column({ comment: '用户登录密码', select: false })
  password: string;

  @Column({ comment: '用户昵称', default: '系统用户', nullable: true })
  nickName: string;

  @Column({ comment: '用户侧边主题', nullable: true })
  sideMode: string;

  @Column({ comment: '用户头像', nullable: true })
  headerImg: string;

  @Column({ comment: '基础颜色', default: '#fff', length: '8', nullable: true })
  baseColor: string;

  @Column({
    comment: '活跃颜色',
    default: '#1890ff',
    length: '8',
    nullable: true,
  })
  activeColor: string;

  @Column({ comment: '用户角色ID', default: 1 })
  authorityId: number;

  @Column({ length: 16, nullable: true })
  phone: string;

  @Column({ length: 32, nullable: true })
  email: string;

  @Column({ nullable: true })
  enable: number;

  @ManyToOne(() => AuthorityEntity, (authority) => authority.users)
  @JoinColumn({ name: 'authorityId' })
  authority: AuthorityEntity;

  @ManyToMany(() => AuthorityEntity, (authority) => authority.users)
  @JoinTable({
    name: 'sys_user_authority',
    joinColumns: [{ name: 'user_id' }],
    inverseJoinColumns: [{ name: 'authority_id' }],
  })
  authorities: AuthorityEntity[];
}
