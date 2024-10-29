import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Entity, Meta } from 'src/types';

export class Survey extends Entity {
  @ApiProperty({
    description: 'Name of survey',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  name: 'new-survey';

  @ApiProperty({
    description: 'Name of survey',
    type: String,
  })
  @IsString()
  @IsNotEmpty()
  content: 'some content';

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
