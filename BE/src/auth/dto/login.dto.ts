import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @ApiProperty({ example: '123456789', description: 'User password' })
  @IsString()
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  @IsEmail()
  email: string;
}
