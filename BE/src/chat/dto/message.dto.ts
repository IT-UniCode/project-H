import { ApiProperty } from '@nestjs/swagger';
import { Message } from '../entity/message.entity';

export class MessageDto extends Message {
  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  updatedAt: string;

  @ApiProperty({
    type: Boolean,
  })
  unread: true;
}
