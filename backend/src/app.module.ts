import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {UserModule} from "./users/user.module";
import {UserEntity} from "./entities/user.entity";
import {FriendsEntity} from "./entities/friends.entity";
import {Chat_roomEntity} from "./entities/chat_room.entity";
import {RoomParticipantsEntity} from "./entities/room_participants.entity";
import {FriendsModule} from "./friends/friends.module";
import {Friends_requestsEntity} from "./entities/friends_requests.entity";
import {ChatRoomModule} from "./chat_rooms/chat_room.modules";
import {MongooseModule} from "@nestjs/mongoose";
import {ChatLogModule} from "./chat_log/chat_log.module";
import {ChatGatewayModule} from "./chat/gateway.module";
import {UserTokenEntity} from "./entities/user_token.entity";
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [
      ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
      TypeOrmModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
              type: 'postgres',
              host: configService.get<string>('DB_HOST'),
              port: configService.get<number>('DB_PORT'),
              username: configService.get<string>('DB_USERNAME'),
              password: configService.get<string>('DB_PASSWORD'),
              database: configService.get<string>('DB_NAME'),
              entities: [UserEntity, FriendsEntity, Chat_roomEntity, RoomParticipantsEntity, Friends_requestsEntity, UserTokenEntity]
          }),
      }),
      MongooseModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (configService: ConfigService) => ({
              uri: configService.get<string>('MONGO_URI'),
          })
      }),
      UserModule,
      FriendsModule,
      ChatRoomModule,
      ChatLogModule,
      ChatGatewayModule,
      AuthModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
