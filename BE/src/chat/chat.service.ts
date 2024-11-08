import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { Chat } from './chat.entity';
import { plainToInstance } from 'class-transformer';
import { JwtPayload } from 'src/auth/dto/jwt-payload';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(args: unknown = {}) {
    return this.prisma.chat.findMany(args);
  }

  async findOneById(id: number) {
    return this.prisma.chat.findUnique({ where: { id } });
  }

  async removeOne(id: number) {
    try {
      await this.prisma.chat.delete({ where: { id } });
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new BadRequestException(
        `This chat does not exists. ${error && 'Cannot delete'}`,
      );
    }
  }

  async create(dto: CreateChatDto, user: JwtPayload) {
    if (dto.secondUserId === user.id) {
      throw new BadRequestException(`Can't create a chat with yourself`);
    }
    const isUserExist = await this.usersService.findOneById(dto.secondUserId);
    if (!isUserExist) {
      throw new BadRequestException(`This user does not exists`);
    }

    const isFirst = await this.prisma.chat.findFirst({
      where: {
        firstUserId: user.id,
        secondUserId: dto.secondUserId,
      },
    });
    if (isFirst) {
      throw new BadRequestException(`This chat already exists`);
    }

    const isSecond = await this.prisma.chat.findFirst({
      where: {
        secondUserId: user.id,
        firstUserId: dto.secondUserId,
      },
    });
    if (isSecond) {
      throw new BadRequestException(`This chat already exists`);
    }

    const newChat = await this.prisma.chat.create({
      data: { ...dto, firstUserId: user.id },
    });
    return plainToInstance(Chat, newChat);
  }
}
