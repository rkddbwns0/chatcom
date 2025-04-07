import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn} from "typeorm";
import {Chat_roomEntity} from "./chat_room.entity";
import {UserEntity} from "./user.entity";

@Entity('room_participants')
export class RoomParticipantsEntity {
    @ManyToOne(() => Chat_roomEntity, (chat_room) => chat_room.roomParticipants)
    @PrimaryColumn()
    @JoinColumn({name: 'room_id'})
    room_id: Chat_roomEntity;

    @ManyToOne(() => UserEntity, (users) => users.roomParticipants)
    @PrimaryColumn({type: 'integer', name: 'user_id'})
    @JoinColumn({name: 'user_id'})
    user_id: UserEntity;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    join_at: Date
}