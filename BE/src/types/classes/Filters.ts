import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class Filters {
  @IsString()
  @ApiProperty({
    required: false,
    type: String,
    description:
      'The name of the field to filter data by (e.g., "title", "category").',
    example: 'documentId',
  })
  field: string;

  @IsNumberString()
  @ApiProperty({
    required: false,
    type: String,
    example: 'someDocumentId',
    description:
      'The value the specified filter field must match (e.g., "JS", "Sport", "Politics" or a numerical value).',
  })
  value: string | number;
}
