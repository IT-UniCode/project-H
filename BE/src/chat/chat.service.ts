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

  async delete(id: number) {
    try {
      await this.prisma.chat.delete({ where: { id } });
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new BadRequestException(
        `This chat does not exists. ${error && 'Cannot delete'}`,
      );
    }
  }

  async create(dto: CreateChatDto, id: number) {
    if (dto.secondUserId === id) {
      throw new BadRequestException(`Can't create a chat with yourself`);
    }
    const isUserExist = await this.usersService.findOneById(dto.secondUserId);
    if (!isUserExist) {
      throw new BadRequestException(`This user does not exists`);
    }

    const isFirst = await this.prisma.chat.findFirst({
      where: {
        firstUserId: id,
        secondUserId: dto.secondUserId,
      },
    });
    if (isFirst) {
      throw new BadRequestException(`This chat already exists`);
    }

    const isSecond = await this.prisma.chat.findFirst({
      where: {
        secondUserId: id,
        firstUserId: dto.secondUserId,
      },
    });
    if (isSecond) {
      throw new BadRequestException(`This chat already exists`);
    }

    const newChat = await this.prisma.chat.create({
      data: { ...dto, firstUserId: id },
    });
    return plainToInstance(Chat, newChat);
  }
}
