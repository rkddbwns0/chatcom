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

@WebSocketGateway({cors: true})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
      private readonly chatLogService: ChatLogService,
  ) {
  }
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket){
    console.log("메시지임")
  }

  handleDisconnect(client: Socket) {
    console.log(client.handshake.query)
  }

  @SubscribeMessage('message')
  async handleMessage(
      @MessageBody() message: string,
      @ConnectedSocket() client: Socket
  ) {
    const data = client.handshake.query
    const messageDto: CreateChatLogDto = {
      room_id: Number(data.room_id),
      user_id: Number(data.user_id),
      message: message,
      nickname: ""
    }

    const saved = await this.chatLogService.sendMessage(messageDto)
    client.to(String(data.room_id)).emit('newMessage', saved)
  }
}
