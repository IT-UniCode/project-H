import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UsersService } from 'src/users/users.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly server: ChatGateway,
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
      const messages = await this.prisma.message.findMany({
        where: { chatId: id },
      });

      await Promise.all(
        messages.map(async (msg) => {
          await this.prisma.message.delete({ where: { id: msg.id } });
        }),
      );

      const chat = await this.prisma.chat.findUnique({
        where: {
          id,
          OR: [{ firstUserId: userId }, { secondUserId: userId }],
        },
      });
      const secondUserId =
        chat.firstUserId === userId ? chat.secondUserId : chat.firstUserId;

      await this.prisma.chat.delete({
        where: {
          id,
          OR: [{ firstUserId: userId }, { secondUserId: userId }],
        },
      });

      this.server.send(
        'chat',
        { chatId: id, type: 'delete' },
        String(secondUserId),
      );

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
      include: {
        firstUser: true,
        secondUser: true,
      },
    });

    this.server.send(
      'chat',
      { chatId: newChat.id, type: 'create' },
      String(
        newChat.firstUserId === userId
          ? newChat.secondUserId
          : newChat.firstUserId,
      ),
    );

    return newChat;
  }
}
