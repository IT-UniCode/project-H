import { ApiProperty } from '@nestjs/swagger';
import { UserResponseDto } from 'src/users/dto/user.response.dto';

export class ResponseComment {
  @ApiProperty({
    description: 'Unique id of comment',
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: 'Content of comment',
    type: String,
  })
  content: string;

  @ApiProperty({
    description: 'Type of document for comment',
    type: String,
  })
  documentType: string;

  @ApiProperty({
    description: 'Id of document for comment',
    type: String,
  })
  documentId: string;

  @ApiProperty({
    description: 'Unique user id of comment author',
    type: Number,
  })
  userId: number;

  @ApiProperty({
    description: 'Comment author details',
    type: UserResponseDto,
  })
  user: UserResponseDto;

  @ApiProperty({
    description: 'Date and time of creating comment as string',
    type: Date,
  })
  createdAt: Date;
}
