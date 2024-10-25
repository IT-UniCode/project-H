import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from './dto-classes';

export class MetaPagination {
  @ApiProperty({
    description: 'Pagination info',
    type: PaginationMeta,
  })
  pagination: PaginationMeta;
}
