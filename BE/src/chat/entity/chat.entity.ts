import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class UserRel {
  @ApiProperty({
    example: 'name',
  })
  name: string;

  @ApiProperty({
    example: 'some@mail.com',
  })
  email: string;
}
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
    description: 'Second user id',
    example: 1,
  })
  @IsNumber()
  secondUserId: number;

  @ApiProperty({
    type: UserRel,
  })
  firstUser: object;

  @ApiProperty({
    type: UserRel,
  })
  secondUser: object;
}
