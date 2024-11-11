import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({
    description: 'Text of message',
    example: 'some text',
    required: true,
  })
  @IsNotEmpty()
  message: string;
}
