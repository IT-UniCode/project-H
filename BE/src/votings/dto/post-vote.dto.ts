import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Entity } from 'src/types';

class Vote extends Entity {
  @ApiProperty({
    description: 'Voting id',
    example: 'nkopfwwusms7tsmwydvb7tob',
  })
  @IsString()
  votingId: string;

  @ApiProperty({
    description: 'User id',
    example: 1,
  })
  @IsNumber()
  userId: number;

  @ApiProperty({
    description: 'Unique id of answer',
    example: '1',
  })
  @IsString()
  answer: string;
}

export class PostVoteDto {
  @ApiProperty({
    type: Vote,
  })
  data: Vote;

  @ApiProperty({
    type: {},
  })
  meta: object;
}
