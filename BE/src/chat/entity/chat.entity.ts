import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class Chat {
  @ApiProperty({ example: 1, description: 'Chat Id' })
  id: number;

  @ApiProperty({
    description: 'First user id',
    example: 1,
  })
  @IsNumber()
  firstUserId: number;

  @ApiProperty({
    description: 'First user name',
    example: 1,
  })
  firstUserName: string;

  @ApiProperty({
    description: 'Second user id',
    example: 1,
  })
  @IsNumber()
  secondUserId: number;

  @ApiProperty({
    description: 'Second user name',
    example: 1,
  })
  secondUserName: string;
}
