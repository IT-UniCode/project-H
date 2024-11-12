import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from './message.dto';

export class GetMessageDto {
  @ApiProperty({
    type: [MessageDto],
  })
  data: [];

  @ApiProperty({
    example: {
      totalUnread: 0,
    },
  })
  meta: object;
}
