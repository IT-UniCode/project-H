import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AnswerCreateDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Id of user answer',
    type: [String],
    example: 'aso2i3o4o9809saf',
    required: true,
  })
  answers: string[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Voting ID',
    type: String,
    example: 'aso2i3o4o9809saf',
    required: true,
  })
  surveyId: string;
}
