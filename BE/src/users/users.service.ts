import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async search(param: string): Promise<Omit<User, 'password'> | undefined> {
    const byEmail = await this.prisma.user.findFirst({
      where: {
        email: {
          contains: param,
          mode: 'insensitive',
        },
      },
    });

    if (!byEmail) {
      const byName = await this.prisma.user.findFirst({
        where: {
          name: {
            contains: param,
            mode: 'insensitive',
          },
        },
      });

      if (byName) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...data } = byName;

        return data;
      }

      throw new NotFoundException(`User don't found`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...data } = byEmail;

    return data;
  }

  async create(dto: CreateUserDto): Promise<User | undefined> {
    const newUser = await this.prisma.user.create({ data: dto });
    return plainToInstance(User, newUser);
  }
}
