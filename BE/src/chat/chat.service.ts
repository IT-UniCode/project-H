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
    return this.prisma.chat.findMany({
      where: { OR: [{ firstUserId: userId }, { secondUserId: userId }] },
    });
  }

  async findOneById(id: number) {
    return this.prisma.chat.findUnique({ where: { id } });
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
        OR: [{ firstUserId: userId }, { secondUserId: userId }],
      },
    });
    if (chat) {
      throw new BadRequestException(`This chat already exists`);
    }

    const firstUser = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    const secondUser = await this.prisma.user.findUnique({
      where: { id: dto.secondUserId },
    });

    const newChat = await this.prisma.chat.create({
      data: {
        ...dto,
        firstUserId: userId,
        firstUserName: firstUser.name,
        secondUserName: secondUser.name,
      },
    });
    return plainToInstance(Chat, newChat);
  }
}
