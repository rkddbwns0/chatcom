import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { RoomMebersEntity } from './room_members.entity';

@Entity('chat_room')
export class Chat_roomEntity {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column({ type: 'varchar', length: 50, nullable: true, default: null })
  title: string;

  @Column({
    type: 'enum',
    enum: ['one_to_one', 'group'],
    default: 'one_to_one',
  })
  chat_type: string;

  @Column({
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  created_at: Date;

  @OneToMany(() => RoomMebersEntity, (room_members) => room_members.room_id, {
    onDelete: 'CASCADE',
  })
  room_members: RoomMebersEntity[];
}
