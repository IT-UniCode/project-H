import { ApiProperty } from '@nestjs/swagger';
import { Forum } from './forum.dto';

export class GetForumByIdDto {
  @ApiProperty({
    type: Forum,
  })
  data: Forum;

  @ApiProperty({
    type: {},
  })
  meta: object;
}
