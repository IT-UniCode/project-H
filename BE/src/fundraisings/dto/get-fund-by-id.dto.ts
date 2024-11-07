import { ApiProperty } from '@nestjs/swagger';
import { FundraisingDto } from './fundraising.dto';

export class GetFundraisingByIdDto {
  @ApiProperty({
    type: FundraisingDto,
  })
  data: object;

  @ApiProperty({ type: {} })
  meta: object;
}
