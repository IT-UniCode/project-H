import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CommentsDocumentType } from 'src/types/types';

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
    enum: CommentsDocumentType,
  })
  @IsEnum(CommentsDocumentType)
  documentType: CommentsDocumentType;
}
