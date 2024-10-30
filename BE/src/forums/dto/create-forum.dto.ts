import { OmitType } from '@nestjs/swagger';
import { Forum } from './forum.dto';

export class CreateForumDto extends OmitType(Forum, [
  'userId',
  'userName',
  'state',
  'documentId',
  'createdAt',
  'publishedAt',
  'updatedAt',
  'id',
  'slug',
] as const) {}
