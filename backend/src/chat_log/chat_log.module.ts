import {Module} from "@nestjs/common";
import {MongooseModule} from "@nestjs/mongoose";
import {ChatLog, ChatLogSchema} from "./schema/chat_log.schema";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Chat_roomEntity} from "../entities/chat_room.entity";
import {RoomParticipantsEntity} from "../entities/room_participants.entity";
import {UserEntity} from "../entities/user.entity";
import {ChatLogService} from "./chat_log.service";
import {ChatLogController} from "./chat_log.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Chat_roomEntity, RoomParticipantsEntity, UserEntity]),
        MongooseModule.forFeature([{name: ChatLog.name, schema: ChatLogSchema}])],
    providers: [ChatLogService],
    controllers: [ChatLogController],
})

export class ChatLogModule {}