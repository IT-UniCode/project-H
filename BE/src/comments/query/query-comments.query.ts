import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { PaginationQuery } from 'src/types';
import { CommentsDocumentType } from 'src/types/types';

export class CommentsQuery extends IntersectionType(PaginationQuery) {
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
