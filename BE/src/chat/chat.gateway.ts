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
import { JwtPayload } from 'src/auth/dto/jwt-payload';
@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private jwtService: JwtService) {}

  private extractTokenFromHeader(headers: any): string | undefined {
    const [type, token] = headers?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  @WebSocketServer()
  server: Server;

  private async getUser(client: Socket): Promise<JwtPayload> {
    const token = this.extractTokenFromHeader(
      client.handshake.auth.authorization,
    );

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

    return this.jwtService
      .verifyAsync(token, {
        secret: process.env.SECRET,
      })
      .catch(() => {
        client.disconnect();
        return;
      });
  }

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
    const user = await this.getUser(client);
    client.join(String(user?.id));
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

  @SubscribeMessage('chat')
  async handleDeleteChat(@MessageBody() payload: { chatId: string }) {
    this.server.to(payload.chatId).emit('chat', { chatId: payload.chatId });
  }
}
