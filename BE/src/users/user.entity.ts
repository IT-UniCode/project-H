import { ApiProperty } from '@nestjs/swagger';
import { User as UserPrisma } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class User implements UserPrisma {
  @ApiProperty({ example: 1, description: 'User Id' })
  id: number;

  @ApiProperty({ example: 'Name', description: 'User name' })
  name: string;

  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  email: string;

  @Exclude()
  password: string;
}
