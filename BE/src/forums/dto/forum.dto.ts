import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'src/types';

export class Forum extends Entity {
  @ApiProperty({
    description: 'Forum title',
    example: 'Some title',
  })
  title: string;

  @ApiProperty({
    description: 'Author user id',
    example: 1,
  })
  userId: number;

  @ApiProperty({
    description: 'Forum content',
    example: 'Some content',
  })
  content: string;

  @ApiProperty({
    required: true,
    description: 'Unique slug',
    example: 'some-slug',
  })
  slug: string;

  @ApiProperty({
    description: 'State of voting (active or finished)',
    enum: ['active', 'finish'],
    example: 'active',
    required: true,
  })
  state: 'active' | 'finish';
}
