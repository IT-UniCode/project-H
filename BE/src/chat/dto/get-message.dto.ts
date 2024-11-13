import { ApiProperty } from '@nestjs/swagger';
import { MessageDto } from './message.dto';
import { MetaPagination } from 'src/types';

export class GetMessageDto {
  @ApiProperty({
    type: [MessageDto],
  })
  data: [];

  @ApiProperty({
    type: MetaPagination,
  })
  meta: object;
}
