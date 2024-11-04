import { ApiProperty } from '@nestjs/swagger';

export class FundraisingDto {
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
    example: 'Fundraiser Title',
    description: 'Title of the fundraiser',
  })
  title: string;

  @ApiProperty({
    example: 'fundraiser-title',
    description: 'Slug for the fundraiser, used in URLs',
  })
  slug: string;

  @ApiProperty({
    example: {
      id: 0,
      documentId: 's3lme3bmk1dcyy79sjr95so9',
      name: 'Some category',
      slug: 'some-slug',
    },
  })
  fundraising_category: object;
}
