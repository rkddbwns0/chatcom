import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Chat_roomEntity } from '../entities/chat_room.entity';
import { RoomMebersEntity } from '../entities/room_members.entity';
import { FriendsEntity } from '../entities/friends.entity';
import { ChatRoomService } from './chat_room.service';
import { ChatRoomController } from './chat_room.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatLog, ChatLogSchema } from 'src/chat_log/schema/chat_log.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      Chat_roomEntity,
      RoomMebersEntity,
      FriendsEntity,
    ]),
    MongooseModule.forFeature([{ name: ChatLog.name, schema: ChatLogSchema }]),
  ],
  providers: [ChatRoomService],
  controllers: [ChatRoomController],
})
export class ChatRoomModule {}
