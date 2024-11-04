import { ApiProperty } from '@nestjs/swagger';
import { FundraisingPreview } from './fundraising-preview.dto';
import { Meta } from 'src/types';

export class GetFundraisingsDto {
  @ApiProperty({
    type: [FundraisingPreview],
  })
  data: [];

  @ApiProperty({ type: Meta })
  meta: object;
}
