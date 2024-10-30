import { ApiProperty } from '@nestjs/swagger';
import { PaginationMeta } from './types';

export class Entity {
  @ApiProperty({
    description: 'Unique id of entity (changes after updating)',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Unique id of entity (never changes)',
    type: String,
  })
  documentId: string;

  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  createdAt: string;

  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  updatedAt: string;

  @ApiProperty({
    description: 'Date as string',
    example: '2024-10-22T13:40:49.782Z',
  })
  publishedAt: string;
}

export class Meta {
  @ApiProperty({
    description: 'Pagination info',
    type: PaginationMeta,
  })
  pagination: PaginationMeta;
}
