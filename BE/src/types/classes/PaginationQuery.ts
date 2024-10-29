import { ApiProperty } from '@nestjs/swagger';

export class PaginationQuery {
  @ApiProperty({
    required: false,
    description:
      'Specify the number of items per page (or -1 for get all items). Default is 25.',
    example: '25',
  })
  pageSize: string;

  @ApiProperty({
    required: false,
    description: 'Specify the page number to retrieve. Default is 1.',
    example: '1',
  })
  page: string;
}
