import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message } from '@prisma/client';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class ChatMsgService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async findAll(id: number): Promise<Message[] | undefined> {
    const isChatExist = await this.prisma.chat.findUnique({ where: { id } });

    if (!isChatExist) {
      throw new BadRequestException(`This chat with id ${id} does not exists`);
    }

    const data = await this.prisma.message.findMany({
      where: { chatId: id },
      orderBy: { createdAt: 'asc' },
    });

    return data;
  }

  async create(dto: CreateMessageDto, chatId: number, id: number) {
    try {
      return this.prisma.message.create({
        data: { ...dto, chatId, userId: id },
      });
    } catch (error) {
      throw new BadRequestException(
        `This chat with id ${chatId} does not exists. ${error && 'Cannot send message'}`,
      );
    }
  }

  async update(
    chatId: number,
    id: number,
    userId: number,
    dto: UpdateMessageDto,
  ) {
    try {
      return this.prisma.message.update({
        where: { id, userId, chatId },
        data: { message: dto.message, updatedAt: new Date() },
      });
    } catch (error) {
      throw new BadRequestException(
        `This chat with id ${chatId} of message with id ${id} does not exists. ${error && 'Cannot send message'}`,
      );
    }
  }

  async delete(chatId: number, id: number) {
    try {
      await this.prisma.message.delete({ where: { id, chatId } });
      return HttpStatus.NO_CONTENT;
    } catch (error) {
      throw new BadRequestException(
        `This message with id ${id} does not exists. ${error && 'Cannot delete'}`,
      );
    }
  }
}
