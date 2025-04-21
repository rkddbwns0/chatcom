import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {UserService} from "./user.service";
import {UserController} from "./user.controller";
import { UserTokenEntity } from "src/entities/user_token.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, UserTokenEntity])],
    providers: [UserService],
    controllers: [UserController],
})

export class UserModule {}