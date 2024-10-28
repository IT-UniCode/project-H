import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Pagination } from 'src/types';
import { CommentsDocumentType } from 'src/types/types';

export class CommentsQuery extends IntersectionType(Pagination) {
  @ApiProperty({
    description: 'Unique type of document',
    enum: CommentsDocumentType,
  })
  @IsEnum(CommentsDocumentType)
  documentType: CommentsDocumentType;

  @ApiProperty({
    description: 'Unique id of document',
  })
  @IsString()
  documentId: string;
}
