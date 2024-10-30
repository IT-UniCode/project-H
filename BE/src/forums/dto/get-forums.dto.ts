import { ApiProperty } from '@nestjs/swagger';
import { Meta } from 'src/types';
import { Forum } from './forum.dto';

export class GetForumsDto {
  @ApiProperty({
    type: [Forum],
  })
  data: Forum[];

  @ApiProperty({
    type: Meta,
  })
  meta: Meta;
}
