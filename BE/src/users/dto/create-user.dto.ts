import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Name', description: 'User name' })
  @IsString()
  name: string;

  @IsNotEmpty()
  @ApiProperty({ example: '123456789', description: 'User pass' })
  @IsString()
  password: string;
}
