import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

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
