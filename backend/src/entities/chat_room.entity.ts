import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {RoomParticipantsEntity} from "./room_participants.entity";

@Entity('chat_room')
export class Chat_roomEntity {
    @PrimaryGeneratedColumn()
    room_id: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @OneToMany(() => RoomParticipantsEntity, (room_participants) => room_participants.room_id, { onDelete: 'CASCADE' })
    roomParticipants: RoomParticipantsEntity[];
}