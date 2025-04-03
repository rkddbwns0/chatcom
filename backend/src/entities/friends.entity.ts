import {Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity('friends')
@Check(`"user_id <> friend_id"`)
export class FriendsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (users) => users.sentFriendRequest)
    @JoinColumn({name: 'user_id'})
    user_id: UserEntity;

    @ManyToOne(() => UserEntity, (users) => users.receivedFriendRequest)
    @JoinColumn({name: 'friend_id'})
    friend_id: UserEntity;

    @Column({type: 'boolean', default: false})
    with_friend_state: boolean;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    created_at: Date;
}