import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {FriendsEntity} from "../entities/friends.entity";
import {Friends_requestsEntity} from "../entities/friends_requests.entity";
import {FriendsService} from "./friends.service";
import {FriendsController} from "./friends.controller";
import { UserTokenEntity } from "src/entities/user_token.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, FriendsEntity, Friends_requestsEntity, UserTokenEntity])],
    providers: [FriendsService],
    controllers: [FriendsController],
})

export class FriendsModule {}