import { ApiProperty } from '@nestjs/swagger';

export class AnswerGetDto {
  @ApiProperty({
    description: '',
    type: String,
    required: false,
    example: 'answerUniqueId',
  })
  surveyId: string;
}
