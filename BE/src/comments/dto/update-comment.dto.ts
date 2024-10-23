import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateCommentDto {
  @IsString()
  @ApiProperty({
    description: 'Comment text',
  })
  content: string;
}
