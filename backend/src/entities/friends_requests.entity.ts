import {Check, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity('friends_requests')
@Check("send_id <> receiver_id")
@Check(`"status IN ('대기', '수락', '거절')"`)
export class Friends_requestsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => UserEntity, (users) => users.user_id)
    @JoinColumn({name: 'send_id'})
    send_id: UserEntity;

    @ManyToOne(() => UserEntity, (users) => users.user_id)
    @JoinColumn({name: 'receiver_id'})
    receiver_id: UserEntity;

    @Column({type: 'varchar', length: 10, default: '대기'})
    status: string;

    @Column({type:'timestamp', default: 'CURRENT_TIMESTAMP'})
    created_at: Date
}