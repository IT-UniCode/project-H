import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CommentsDocumentType } from 'src/types/types';

export class CommentsQuery {
  @ApiProperty({
    description: 'Unique type of document',
    enum: CommentsDocumentType,
  })
  @IsEnum(CommentsDocumentType)
  documentType: 'news';

  @ApiProperty({
    description: 'Unique id of document',
  })
  @IsString()
  documentId: string;
}
