import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({
    description: 'Second user id',
    example: 1,
  })
  @IsNumber()
  secondUserId: number;
}
