import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CommentsQuery {
  @ApiProperty({
    description: 'Unique type of document',
  })
  @IsString()
  documentType: string;

  @ApiProperty({
    description: 'Unique id of document',
  })
  @IsString()
  documentId: string;
}
