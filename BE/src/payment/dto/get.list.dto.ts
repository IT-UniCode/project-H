import { ApiProperty } from '@nestjs/swagger';

export class GetListDto {
  @ApiProperty({
    example: null,
  })
  someFundraisingId: '';

  @ApiProperty({
    example: [
      {
        total: 1234,
        userId: 0,
        currency: 'usd',
      },
      {
        total: 1234,
        userId: 1,
        currency: 'eur',
      },
      {
        total: 1234,
        userId: 0,
        currency: 'uah',
      },
    ],
  })
  someAnotherFundraisingId: [];
}
