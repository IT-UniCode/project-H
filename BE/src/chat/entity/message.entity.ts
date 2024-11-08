import { ApiProperty } from '@nestjs/swagger';

export class Message {
  @ApiProperty({
    description: 'Unique id',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Chat id',
    example: 1,
  })
  chatId: number;

  @ApiProperty({
    description: 'Text of message',
    example: 'some text',
  })
  message: string;

  @ApiProperty({
    description: 'Author id',
    example: 1,
  })
  userId: number;
}
