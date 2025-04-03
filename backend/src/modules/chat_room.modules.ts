import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../entities/user.entity";
import {Chat_roomEntity} from "../entities/chat_room.entity";
import {RoomParticipantsEntity} from "../entities/room_participants.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity, Chat_roomEntity, RoomParticipantsEntity])],
    providers: [],
    controllers: [],
})
export class ChatRoomModule {}