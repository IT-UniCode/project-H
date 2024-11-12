import { OmitType } from '@nestjs/swagger';
import { Chat } from '../entity/chat.entity';

export class PostChatDto extends OmitType(Chat, [
  'messages',
  'firstUser',
  'secondUser',
]) {}
