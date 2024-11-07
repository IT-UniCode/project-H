import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber } from 'class-validator';
import { Entity, PaymentCurrencyEnum } from 'src/types';

class Donate {
  @ApiProperty({
    description: 'Donated sum',
  })
  @IsNumber()
  total: 12312100;

  @ApiProperty({
    description: 'User id',
  })
  @IsNumber()
  userId: 0;

  @ApiProperty({
    description: 'Donation currency',
    enum: PaymentCurrencyEnum,
  })
  @IsEnum(PaymentCurrencyEnum)
  currency: 'usd';
}

export class FundraisingDto extends Entity {
  @ApiProperty({
    example: 'Fundraiser Title',
    description: 'Title of the fundraiser',
  })
  title: string;

  @ApiProperty({
    description: 'Content of fundraising (can be string or markdown)',
    example: 'Some content',
  })
  content: string;

  @ApiProperty({
    description: 'Goal sum of fundraising',
  })
  goal_sum: number;

  @ApiProperty({
    description: 'Total sum of fundraising',
  })
  total_sum: number;

  @ApiProperty({
    example: 'fundraiser-title',
    description: 'Slug for the fundraiser, used in URLs',
  })
  slug: string;

  @ApiProperty({
    example: {
      id: 0,
      documentId: 's3lme3bmk1dcyy79sjr95so9',
      name: 'Some category',
      slug: 'some-slug',
    },
  })
  fundraising_category: object;

  @ApiProperty({
    description: 'Preview image url',
    example: 'https://some-host.com/uploads/some_img_name_hash.jpeg',
  })
  previewImage: string;

  @ApiProperty({
    type: [Donate],
  })
  topDonations: [];
}
