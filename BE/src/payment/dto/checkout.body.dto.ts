import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { PaymentCurrencyEnum } from 'src/types';

export class CheckoutBodyDto {
  @ApiProperty({
    description: 'Amount',
    type: Number,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    description: 'Currency (uah, usd, eur)',
    enum: PaymentCurrencyEnum,
  })
  @IsEnum(PaymentCurrencyEnum)
  currency: string;

  @ApiProperty({
    description: 'Fundraising id',
  })
  @IsString()
  fundraisingId: string;

  @ApiProperty({
    description: 'Redirect url',
  })
  @IsString()
  @Optional()
  redirectUrl?: string;
}
