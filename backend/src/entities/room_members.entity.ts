import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { Chat_roomEntity } from './chat_room.entity';
import { UserEntity } from './user.entity';

@Entity('room_members')
export class RoomMebersEntity {
  @ManyToOne(() => Chat_roomEntity, (chat_room) => chat_room.room_members)
  @PrimaryColumn()
  @JoinColumn({ name: 'room_id' })
  room_id: Chat_roomEntity;

  @ManyToOne(() => UserEntity, (users) => users.room_members)
  @PrimaryColumn({ type: 'integer', name: 'user_id' })
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  @Column({ type: 'varchar', length: 50, nullable: true, default: null })
  custom_title: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  join_at: Date;
}
