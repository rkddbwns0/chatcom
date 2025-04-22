import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway, WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from "socket.io";
import {ChatLogService} from "../chat_log/chat_log.service";
import {CreateChatLogDto} from "../chat_log/chat_log.dto";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { WebSocketAuthService } from './webSocketAuth.service';
import { UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
      private readonly chatLogService: ChatLogService,
      private readonly webSocketAuthService: WebSocketAuthService,
      private readonly jwtService: JwtService,
      private readonly configService: ConfigService
  ) {
  }
  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket){
    try {
      const access_token = client.handshake.query.access_token as string;
      const refresh_token = client.handshake.query.refresh_token as string;

      let payload;
      try {
        payload = await this.webSocketAuthService.validateAccessToken(access_token, refresh_token);
      } catch (error) {
        console.log(error, '토큰 만료')
        console.log(payload)
        await this.webSocketAuthService.validateRefreshToken(refresh_token, payload?.user_id);

        client.emit('newAccessToken', payload?.newAccessToken);

        payload = this.jwtService.verify(payload?.newAccessToken, {
          secret: this.configService.get<string>('JWT_SECRET_KEY'),
        });
        console.log(payload)
      }
      client.data.user = payload
    } catch (error) {
      console.error(error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(client.handshake.query)
  }

  @SubscribeMessage('message')
  async handleMessage(
      @MessageBody() message: string,
      @ConnectedSocket() client: Socket
  ) {
    const user = client.data.user;
    const data = client.handshake.query;

    if (user.user_id !== Number(data.user_id)) {
      console.log('유저 정보가 일치하지 않습니다.')
      client.emit('error', '유저 정보가 일치하지 않습니다. 다시 로그인을 해 주세요.')
      client.disconnect();
      return;
    }

    const messageDto: CreateChatLogDto = {
      room_id: Number(data.room_id),
      user_id: user.user_id,
      message: message,
      nickname: user.nickname
    }
    

    const saved = await this.chatLogService.sendMessage(messageDto)
    client.to(String(data.room_id)).emit('newMessage', saved)
  }
}
