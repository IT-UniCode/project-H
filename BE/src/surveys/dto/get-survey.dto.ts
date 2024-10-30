import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Entity, Meta } from 'src/types';

export class Survey extends Entity {
  @ApiProperty({
    description: 'Name of survey',
    type: String,
    example: 'Some name',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Content can be string or markdown',
    type: String,
    example: 'Some content',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'Vote variants',
    example: [
      {
        id: 1,
        content: '1',
        uniqueId: '1',
      },
      {
        id: 2,
        content: '2',
        uniqueId: '2',
      },
    ],
  })
  variants: [];

  @ApiProperty({ example: 'some-name', description: 'Slug of the survey' })
  slug: string;

  @ApiProperty({
    description: 'State of voting (active or finished)',
    enum: ['active', 'finish'],
    example: 'active',
  })
  @IsNotEmpty()
  state: 'active' | 'finish';
}

export class GetSurveyDto {
  @ApiProperty({
    type: Survey,
  })
  data: Survey;

  @ApiProperty({
    type: Meta,
  })
  meta: Meta;
}
