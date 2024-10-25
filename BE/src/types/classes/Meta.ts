import { ApiProperty } from "@nestjs/swagger";
import { PaginationMeta } from "./Pagination";

export class Meta {
  @ApiProperty({
    description: "Pagination info",
    type: PaginationMeta,
  })
  pagination: PaginationMeta;
}
