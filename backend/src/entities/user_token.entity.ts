import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {UserEntity} from "./user.entity";

@Entity('user_token')
export class UserTokenEntity {
    @PrimaryGeneratedColumn()
    token_id: number;

    @ManyToOne(() => UserEntity, (user) => user.user_id)
    @JoinColumn({name: 'user_id'})
    user_id: UserEntity

    @Column({type: 'varchar', nullable: false, length: 255})
    token: string;

    @Column({type: 'timestamp', nullable: false})
    expires_in: Date
}