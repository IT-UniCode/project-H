import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { ChatMsgService } from './chat-msg.service';
import { ChatMsgController } from './chat-msg.controller';

@Module({
  providers: [
    ChatGateway,
    ChatService,
    ChatMsgService,
    PrismaService,
    UsersService,
  ],
  exports: [ChatService],
  controllers: [ChatController, ChatMsgController],
})
export class ChatModule {}
