import {Column, Entity,  OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {FriendsEntity} from "./friends.entity";
import {RoomParticipantsEntity} from "./room_participants.entity";
import {Friends_requestsEntity} from "./friends_requests.entity";

@Entity({name: 'users'})
export class UserEntity {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({type: 'varchar', nullable: false, length: 20})
    name: string;

    @Column({type: "varchar", nullable: false, length: 25})
    email: string;

    @Column({type: "varchar", nullable: false, length: 255})
    password: string;

    @Column({type: 'int', nullable: false })
    phone: number;

    @Column({type: 'varchar', nullable: false, length: 255})
    resident_num: string;

    @Column({type: 'varchar', nullable: false, length: 20})
    nickname: string;

    @Column({type: 'date', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;

    @OneToMany(() => FriendsEntity, (friends) => friends.user_id, { onDelete: 'CASCADE' })
    sentFriendRequest: FriendsEntity[];

    @OneToMany(() => FriendsEntity, (friends) => friends.friend_id, { onDelete: 'CASCADE' })
    receivedFriendRequest: FriendsEntity[];

    @OneToMany(() => RoomParticipantsEntity, (room_participants) => room_participants.user_id, { onDelete: 'CASCADE' })
    roomParticipants: RoomParticipantsEntity[];

    @OneToMany(() => Friends_requestsEntity, (friends_requests) => friends_requests.send_id)
    send_id: Friends_requestsEntity[];

    @OneToMany(() => Friends_requestsEntity, (friends_requests) => friends_requests.receiver_id)
    receiver_id: Friends_requestsEntity[];

}