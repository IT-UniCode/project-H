import { ApiProperty } from '@nestjs/swagger';
import { Chat } from '../entity/chat.entity';

export class GetChatDto {
  @ApiProperty({
    type: [Chat],
  })
  data: [];

  @ApiProperty({
    example: {
      totalUnread: 0,
    },
  })
  meta: object;
}
