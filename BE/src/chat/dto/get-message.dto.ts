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
      pagination: {
        page: 1,
        pageCount: 1,
        pageSize: 25,
        total: 10,
      },
    },
  })
  meta: object;
}
