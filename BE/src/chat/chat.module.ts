import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [ChatGateway, ChatService, PrismaService, UsersService],
  exports: [ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
