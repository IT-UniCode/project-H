import { ApiProperty } from '@nestjs/swagger';
import { ListResponse, MetaPagination } from 'src/types';
import { ResponseComment } from './response-commnet.dto';

export class CommentsPaginationDto extends ListResponse<ResponseComment> {
  @ApiProperty({
    description: 'List comments',
    type: [ResponseComment],
  })
  data: ResponseComment[];

  @ApiProperty({
    description: 'Meta pagination',
    type: MetaPagination,
  })
  meta: MetaPagination;
}
