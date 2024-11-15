import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './entity/chat.entity';
import { plainToInstance } from 'class-transformer';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(userId: number) {
    const chats = await this.prisma.chat.findMany({
      where: { OR: [{ firstUserId: userId }, { secondUserId: userId }] },
      include: {
        firstUser: { select: { name: true, email: true } },
        secondUser: { select: { name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    await Promise.all(
      chats.map(async (chat) => {
        const messageList = await this.prisma.message.findMany({
          where: { chatId: chat.id, unread: true },
        });

        const userMsg = messageList.filter((msg) => userId === msg.userId);

        if (chat.firstUserId === userId) {
          //@ts-expect-error add field for front end
          chat.secondUser.unread = userMsg.length;
          //@ts-expect-error add field for front end
          chat.firstUser.unread = messageList.length - userMsg.length;
        } else {
          //@ts-expect-error add field for front end
          chat.secondUser.unread = messageList.length - userMsg.length;
          //@ts-expect-error add field for front end
          chat.firstUser.unread = userMsg.length;
        }
      }),
    );

    return chats;
  }

  async findOneById(id: number, userId: number) {
    const chat = await this.prisma.chat.findUnique({
      where: { id },
      include: {
        firstUser: { select: { name: true, email: true } },
        secondUser: { select: { name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });
    const messageList = await this.prisma.message.findMany({
      where: { chatId: chat.id, unread: true },
    });

    const userMsg = messageList.filter((msg) => userId === msg.userId);

    if (chat.firstUserId === userId) {
      //@ts-expect-error add field for front end
      chat.secondUser.unread = userMsg.length;
      //@ts-expect-error add field for front end
      chat.firstUser.unread = messageList.length - userMsg.length;
    } else {
      //@ts-expect-error add field for front end
      chat.secondUser.unread = messageList.length - userMsg.length;
      //@ts-expect-error add field for front end
      chat.firstUser.unread = userMsg.length;
    }

    return chat;
  }

  async delete(id: number, userId: number) {
    try {
      await this.prisma.chat.delete({
        where: {
          id,
          OR: [{ firstUserId: userId }, { secondUserId: userId }],
        },
      });
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new BadRequestException(
        `This chat with id ${id} does not exist or the user does not have access to this chat. ${error && 'Cannot delete'}`,
      );
    }
  }

  async create(dto: CreateChatDto, userId: number) {
    if (dto.secondUserId === userId) {
      throw new BadRequestException(`Can't create a chat with yourself`);
    }
    const isUserExist = await this.usersService.findOneById(dto.secondUserId);
    if (!isUserExist) {
      throw new BadRequestException(`This user does not exists`);
    }

    const chat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          { firstUserId: userId, secondUserId: dto.secondUserId },
          { secondUserId: userId, firstUserId: dto.secondUserId },
        ],
      },
    });
    if (chat) {
      throw new BadRequestException(`This chat already exists`);
    }

    const newChat = await this.prisma.chat.create({
      data: {
        ...dto,
        firstUserId: userId,
      },
    });
    return plainToInstance(Chat, newChat);
  }
}
