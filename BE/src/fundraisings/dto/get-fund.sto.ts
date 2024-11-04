import { ApiProperty } from '@nestjs/swagger';
import { Fundraising } from './fundraising.dto';
import { Meta } from 'src/types';

export class GetFundraisingsDto {
  @ApiProperty({
    type: [Fundraising],
  })
  data: [];

  @ApiProperty({ type: Meta })
  meta: object;
}
