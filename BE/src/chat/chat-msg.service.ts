import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from '@prisma/client';
import { UpdateMessageDto } from './dto/update-message.dto';
import { ChatGateway } from './chat.gateway';
import { Pagination } from 'src/types';

@Injectable()
export class ChatMsgService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly server: ChatGateway,
  ) {}

  async findAll(id: number, userId: number, pagination: Pagination) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id,
        OR: [{ firstUserId: userId }, { secondUserId: userId }],
      },
    });

    if (!chat) {
      throw new BadRequestException(`This chat with id ${id} does not exists`);
    }
    const messageList = (
      await this.prisma.message.findMany({
        where: { chatId: id, unread: true },
      })
    ).filter((msg) => userId !== msg.userId);

    const total = await this.prisma.message.count({
      where: { chatId: id },
    });

    const take = pagination.pageSize === -1 ? total : pagination.pageSize;
    const skip = pagination.page * Math.abs(pagination.pageSize);

    const data = await this.prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    });

    const meta = {
      totalUnread: messageList.length,
      pagination: {
        page: pagination.page + 1,
        pageCount: Math.ceil(total / take) || 1,
        pageSize: take,
        total,
      },
    };

    return { data, meta };
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
        data: { ...dto, chatId, userId, message: dto.message.trim() },
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

  async readMsg(chatId: number, userId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: {
        id: chatId,
        OR: [{ firstUserId: userId }, { secondUserId: userId }],
      },
    });

    if (!chat) {
      throw new BadRequestException(
        `This chat with id ${chatId} does not exist or the user does not have access to this chat`,
      );
    }

    const allMsg = await this.prisma.message.findMany({ where: { chatId } });

    await Promise.all(
      allMsg
        .filter((msg) => userId !== msg.userId)
        .map(
          async (msg) =>
            await this.prisma.message.update({
              where: { id: msg.id },
              data: {
                unread: false,
              },
            }),
        ),
    );

    return HttpStatus.NO_CONTENT;
  }
}
