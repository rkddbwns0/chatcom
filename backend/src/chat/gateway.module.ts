import {Module} from "@nestjs/common";
import {ChatGateway} from "./chat.gateway";
import {ChatLogService} from "../chat_log/chat_log.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Chat_roomEntity} from "../entities/chat_room.entity";
import {RoomParticipantsEntity} from "../entities/room_participants.entity";
import {UserEntity} from "../entities/user.entity";
import {MongooseModule} from "@nestjs/mongoose";
import {ChatLog, ChatLogSchema} from "../chat_log/schema/chat_log.schema";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat_roomEntity, RoomParticipantsEntity, UserEntity]),
        MongooseModule.forFeature([{name: ChatLog.name, schema: ChatLogSchema}])
    ],
    providers: [ChatGateway, ChatLogService]
})

export class ChatGatewayModule {}