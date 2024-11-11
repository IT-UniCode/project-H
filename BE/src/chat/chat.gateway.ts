import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UseGuards,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthGuard } from 'src/guard/user.guard';
import { JwtService } from '@nestjs/jwt';
@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeader(headers: any): string | undefined {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  @WebSocketServer()
  server: Server;

  async send(event: string, data: object, destination?: string | string[]) {
    try {
      if (destination) {
        this.server.to(destination).emit(event, data);
      } else {
        this.server.emit(event, data);
      }

      return HttpStatus.OK;
    } catch (error) {
      throw new BadRequestException(`Message not sended, ${error}`);
    }
  }

  @UseGuards(AuthGuard)
  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = this.extractTokenFromHeader(client.handshake.headers);

    if (!token) {
      client.send(
        JSON.stringify({
          event: 'error',
          data: {
            message: 'Unauthorized',
            status: HttpStatus.UNAUTHORIZED,
          },
        }),
      );
      client.disconnect();
      return;
    }

    const { id } = await this.jwtService.verifyAsync(token, {
      secret: process.env.SECRET,
    });

    client.join(String(id));
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    client.disconnect();
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { chatId: string; message: string },
  ) {
    this.server
      .to(payload.chatId)
      .emit('message', { userId: client.id, message: payload.message });
  }
}
