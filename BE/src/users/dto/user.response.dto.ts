import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 'test@mail.com', description: 'User email' })
  id: number;

  @ApiProperty({ example: 'Name', description: 'User name' })
  name: string;
}
