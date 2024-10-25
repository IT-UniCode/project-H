import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class Pagination {
  @ApiProperty({
    required: false,
    type: String,
    description:
      'Specify the number of items per page (or "max" for get all items). Default is 25.',
    example: 25,
  })
  pageSize: string;

  @IsNumber()
  @ApiProperty({
    required: false,
    type: Number,
    description: "Specify the page number to retrieve. Default is 1.",
    example: 1,
  })
  page: number;
}

export class PaginationMeta {
  @ApiProperty({
    description: "Page number",
    example: 1,
  })
  @IsNumber()
  page: 1;

  @ApiProperty({
    description: "Page size",
    example: 25,
  })
  @IsNumber()
  pageSize: 25;

  @ApiProperty({
    description: "Page count",
    example: 1,
  })
  @IsNumber()
  pageCount: 1;

  @ApiProperty({
    description: "Total objects count",
    example: 1,
  })
  total: 1;
}
