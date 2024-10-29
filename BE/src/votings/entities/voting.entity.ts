import { ApiProperty } from '@nestjs/swagger';
import { IsJSON, IsNumber, IsObject, IsString } from 'class-validator';
import { Entity, Meta } from 'src/dto-classes';
export class Voting extends Entity {
  @ApiProperty({
    description: 'Name of voting',
  })
  @IsString()
  name: 'some name';

  @ApiProperty({
    description: 'Description of voting',
  })
  @IsString()
  content: 'some description';

  @ApiProperty({
    description: 'Variants for votes',
    example: [
      {
        id: 1,
        content: '1',
        uniqueId: '1',
      },
    ],
  })
  @IsObject()
  variants: [
    {
      id: 1;
      content: '1';
      uniqueId: '1';
    },
  ];

  @ApiProperty({
    description: 'State of voting (active or finished)',
    enum: ['active', 'finish'],
    example: 'active',
  })
  state: 'active' | 'finish';
}

export class ResponseVoting {
  @ApiProperty({ type: Voting })
  data: Voting;

  @ApiProperty({
    type: Meta,
  })
  meta: Meta;
}
