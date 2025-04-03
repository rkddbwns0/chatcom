import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {FriendsEntity} from "../entities/friends.entity";
import {Friends_requestsEntity} from "../entities/friends_requests.entity";
import {FriendsService} from "../services/friends.service";
import {FriendsController} from "../controllers/friends.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, FriendsEntity, Friends_requestsEntity])],
    providers: [FriendsService],
    controllers: [FriendsController],
})

export class FriendsModule {}