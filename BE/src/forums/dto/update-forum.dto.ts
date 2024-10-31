import { ApiProperty } from '@nestjs/swagger';

export class UpdateForumDto {
  @ApiProperty({
    example: 'Some content',
  })
  content: string;
}
