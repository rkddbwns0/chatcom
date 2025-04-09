import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Chat_roomEntity} from "../entities/chat_room.entity";
import {RoomParticipantsEntity} from "../entities/room_participants.entity";
import {FriendsEntity} from "../entities/friends.entity";
import {ChatRoomService} from "./chat_room.service";
import {ChatRoomController} from "./chat_room.controller";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, Chat_roomEntity, RoomParticipantsEntity, FriendsEntity])],
    providers: [ChatRoomService],
    controllers: [ChatRoomController],
})
export class ChatRoomModule {}