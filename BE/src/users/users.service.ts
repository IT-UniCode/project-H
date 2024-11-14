import { HttpStatus, Injectable } from '@nestjs/common';
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

  async search(
    param: string,
  ): Promise<Omit<User[], 'password'> | HttpStatus.NO_CONTENT> {
    const byEmail = await this.prisma.user.findMany({
      where: {
        email: {
          contains: param,
          mode: 'insensitive',
        },
      },
      take: 10,
    });

    if (byEmail.length === 0) {
      const byName = await this.prisma.user.findMany({
        where: {
          name: {
            contains: param,
            mode: 'insensitive',
          },
        },
      });

      if (byName) {
        const data = byName.map((user: User) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...rest } = user;
          return plainToInstance(User, rest);
        });

        return data;
      }

      return HttpStatus.NO_CONTENT;
    }

    const data = byEmail.map((user: User) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user;
      return plainToInstance(User, rest);
    });

    return data;
  }

  async create(dto: CreateUserDto): Promise<User | undefined> {
    const newUser = await this.prisma.user.create({ data: dto });
    return plainToInstance(User, newUser);
  }
}
