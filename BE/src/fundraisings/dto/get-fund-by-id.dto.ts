import { ApiProperty } from '@nestjs/swagger';
import { Fundraising } from './fundraising.dto';

export class GetFundraisingByIdDto {
  @ApiProperty({
    type: Fundraising,
  })
  data: object;

  @ApiProperty({ type: {} })
  meta: object;
}
