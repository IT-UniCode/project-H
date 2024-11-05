import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

class MerchantPaymInfo {
  @ApiProperty({
    description: 'Reference object',
  })
  @IsString()
  reference: string;

  @ApiProperty({
    description: 'Destination of payment',
  })
  @IsString()
  destination: string;
}

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
    type: MerchantPaymInfo,
  })
  merchantPaymInfo?: MerchantPaymInfo;
}
