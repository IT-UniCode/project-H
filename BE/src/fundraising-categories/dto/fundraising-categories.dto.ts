import { ApiProperty } from '@nestjs/swagger';
import { FundraisingPreview } from 'src/fundraisings/dto/fundraising-preview.dto';
import { Entity, Meta } from 'src/types';

export class FundraisingCategoryDto extends Entity {
  @ApiProperty({
    description: 'Category name',
    example: 'Some name',
  })
  name: string;

  @ApiProperty({
    description: 'Category slug',
    example: 'some-slug',
  })
  slug: string;

  @ApiProperty({
    description: 'Relation with fundraising',
    type: [FundraisingPreview],
  })
  fundraisings: [];
}

export class FundraisingCategoriesResponse {
  @ApiProperty({
    type: [FundraisingCategoryDto],
  })
  data: [];

  @ApiProperty({ type: Meta })
  meta: object;
}
