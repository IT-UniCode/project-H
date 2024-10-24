import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty({
    description: 'Unique id of document',
  })
  @IsString()
  documentId: string;

  @ApiProperty({
    description: 'Just text',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Unique type of document',
    //   enum: TODO
  })
  //   @IsEnum() TODO
  documentType: 'news' | 'forum';
}
