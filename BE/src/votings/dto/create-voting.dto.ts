import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsString } from 'class-validator';

export class CreateVotingDto {
  @ApiProperty({
    description: 'Name of the voting',
    example: 'Some question?',
  })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Description of the voting',
    example: 'Some text',
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Array with variants for voting',
    example: { data: ['first', 'second', 'third'] },
  })
  @IsJSON()
  variants: JSON;
}
