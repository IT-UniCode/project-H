import { ApiProperty } from '@nestjs/swagger';
import { MetaPagination } from './meta.pagination';

export class ListResponse<D, M = MetaPagination> {
  @ApiProperty({
    description: 'List item',
    isArray: true,
  })
  data: D[];

  @ApiProperty({
    description: 'Meta atributes',
  })
  meta: M;
}
