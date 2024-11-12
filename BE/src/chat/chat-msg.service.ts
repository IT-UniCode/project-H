import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from '@prisma/client';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatMsgService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly server: ChatGateway,
  ) {}

  async findAll(id: number, userId: number): Promise<Message[] | undefined> {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id,
        OR: [{ firstUserId: userId }, { secondUserId: userId }],
      },
    });

    if (!chat) {
      throw new BadRequestException(`This chat with id ${id} does not exists`);
    }

    const data = await this.prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: 'asc' },
    });

    return data;
  }

  async create(
    dto: CreateMessageDto,
    chatId: number,
    userId: number,
  ): Promise<Message | undefined> {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          id: chatId,
          OR: [{ firstUserId: userId }, { secondUserId: userId }],
        },
      });

      const data = await this.prisma.message.create({
        data: { ...dto, chatId, userId },
      });

      this.server.send(
        'message',
        { data, type: 'create' },
        String(
          chat.secondUserId === userId ? chat.firstUserId : chat.secondUserId,
        ),
      );

      return data;
    } catch (error) {
      throw new BadRequestException(
        `This chat with Id ${chatId} does not exist or the user does not have access to this chat. ${error && 'Cannot send message'}`,
      );
    }
  }

  async update(
    chatId: number,
    id: number,
    userId: number,
    dto: UpdateMessageDto,
  ): Promise<Message | undefined> {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          id: chatId,
          OR: [{ firstUserId: userId }, { secondUserId: userId }],
        },
      });

      const data = await this.prisma.message.update({
        where: { id, userId, chatId },
        data: { message: dto.message, updatedAt: new Date() },
      });

      this.server.send(
        'message',
        { data, type: 'update' },
        String(
          chat.secondUserId === userId ? chat.firstUserId : chat.secondUserId,
        ),
      );

      return data;
    } catch (error) {
      throw new BadRequestException(
        `This chat with id ${chatId} of message with id ${id} does not exists. ${error && 'Cannot send message'}`,
      );
    }
  }

  async delete(chatId: number, msgId: number, userId: number) {
    try {
      const chat = await this.prisma.chat.findUnique({
        where: {
          id: chatId,
          OR: [{ firstUserId: userId }, { secondUserId: userId }],
        },
      });

      const data = await this.prisma.message.delete({
        where: { id: msgId, chatId },
      });

      this.server.send(
        'message',
        { data, type: 'delete' },
        String(
          chat.secondUserId === userId ? chat.firstUserId : chat.secondUserId,
        ),
      );

      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new BadRequestException(
        `This message with id ${msgId} does not exists. ${error && 'Cannot delete'}`,
      );
    }
  }
}
