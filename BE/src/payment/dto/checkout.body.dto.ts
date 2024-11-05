import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CheckoutBodyDto {
  @ApiProperty({
    description: 'Amount',
    type: Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency (uah, usd, eur)',
    enum: ['uah', 'usd', 'eur'],
  })
  @IsString()
  currency: string;

  @ApiProperty({
    description: 'Fundraising id',
  })
  fundraisingId: string;
}
