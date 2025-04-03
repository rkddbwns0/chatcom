import {Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Chat_roomEntity} from "./chat_room.entity";
import {UserEntity} from "./user.entity";

@Entity('room_participants')
export class RoomParticipantsEntity {
    @OneToMany(() => Chat_roomEntity, (chat_room) => chat_room.room_id)
    @PrimaryColumn({type: 'integer', name: 'room_id'})
    room_id: Chat_roomEntity;

    @OneToMany(() => UserEntity, (users) => users.user_id)
    @PrimaryColumn({type: 'integer', name: 'user_id'})
    user_id: UserEntity;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    join_at: Date
}