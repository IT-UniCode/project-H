import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

// Це пгінація для чого? Query????
export class Pagination {
  @ApiProperty({
    required: false,
    description:
      'Specify the number of items per page (or -1 for get all items). Default is 25.',
    example: 25,
  })
  pageSize: number;

  @IsNumber()
  @ApiProperty({
    required: false,
    description: 'Specify the page number to retrieve. Default is 1.',
    example: 1,
  })
  page: number;
}

export class PaginationMeta {
  @ApiProperty({
    description: 'Page number',
    example: 1,
  })
  @IsNumber()
  page: number;

  @ApiProperty({
    description: 'Page size',
    example: 25,
  })
  @IsNumber()
  pageSize: number;

  @ApiProperty({
    description: 'Page count',
    example: 1,
  })
  @IsNumber()
  pageCount: number;

  @ApiProperty({
    description: 'Total objects count',
    example: 1,
  })
  total: number;
}
