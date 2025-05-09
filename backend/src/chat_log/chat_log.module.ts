import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatLog, ChatLogSchema } from './schema/chat_log.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat_roomEntity } from '../entities/chat_room.entity';
import { RoomMebersEntity } from '../entities/room_members.entity';
import { UserEntity } from '../entities/user.entity';
import { ChatLogService } from './chat_log.service';
import { ChatLogController } from './chat_log.controller';
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
  providers: [ChatLogService],
  controllers: [ChatLogController],
  exports: [ChatLogService],
})
export class ChatLogModule {}
