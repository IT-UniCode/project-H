import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { MessageDto } from '../dto/message.dto';

class UserRel {
  @ApiProperty({
    example: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'some@mail.com',
  })
  email: string;

  @ApiProperty({ type: Number })
  unread: number;
}
export class Chat {
  @ApiProperty({ example: 1, description: 'Chat Id' })
  id: number;

  @ApiProperty({
    description: 'First user id',
    example: 1,
  })
  @IsNumber()
  firstUserId: number;

  @ApiProperty({
    description: 'Second user id',
    example: 1,
  })
  @IsNumber()
  secondUserId: number;

  @ApiProperty({
    type: UserRel,
  })
  firstUser: object;

  @ApiProperty({
    type: UserRel,
  })
  secondUser: object;

  @ApiProperty({
    type: [MessageDto],
  })
  messages: [];
}
