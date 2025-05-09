import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatLogService } from '../chat_log/chat_log.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat_roomEntity } from '../entities/chat_room.entity';
import { RoomMebersEntity } from '../entities/room_members.entity';
import { UserEntity } from '../entities/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatLog, ChatLogSchema } from '../chat_log/schema/chat_log.schema';
import { WebSocketAuthService } from './webSocketAuth.service';
import { UserTokenEntity } from 'src/entities/user_token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Chat_roomEntity,
      RoomMebersEntity,
      UserEntity,
      UserTokenEntity,
    ]),
    MongooseModule.forFeature([{ name: ChatLog.name, schema: ChatLogSchema }]),
  ],
  providers: [ChatGateway, ChatLogService, WebSocketAuthService],
})
export class ChatGatewayModule {}
