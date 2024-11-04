import { ApiProperty } from '@nestjs/swagger';
import { Entity } from 'src/types';

export class Fundraising extends Entity {
  @ApiProperty({
    example: 'Fundraiser Title',
    description: 'Title of the fundraiser',
  })
  title: string;

  @ApiProperty({
    example: 'Some text',
    description: 'Preview text for the fundraiser',
  })
  previewText: string;

  @ApiProperty({
    example: 'http://some.host.com/uploads/preview_image.jpeg',
    description: 'URL of the preview image',
  })
  previewImage: string;

  @ApiProperty({
    example: 'Some text',
    description: 'Fundraising content can be string or markdown',
  })
  content: string;

  @ApiProperty({
    example: 10000,
    description: 'The fundraising goal amount',
  })
  goal_sum: number;

  @ApiProperty({
    example: 2500,
    description: 'The current amount raised so far',
  })
  current_sum: number;

  @ApiProperty({
    example: 'fundraiser-title',
    description: 'Slug for the fundraiser, used in URLs',
  })
  slug: string;

  @ApiProperty({
    example: 'active',
    description: 'State of the fundraiser (e.g., active, completed, pending)',
  })
  state: string;
}
