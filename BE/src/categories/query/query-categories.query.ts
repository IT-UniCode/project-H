import { ApiProperty, IntersectionType } from "@nestjs/swagger";
import { IsBoolean, IsObject } from "class-validator";
import { Filters, Pagination } from "src/types";

export class CategoriesQuery extends IntersectionType(Pagination, Filters) {
  @IsBoolean()
  @ApiProperty({
    required: false,
    type: Boolean,
    description:
      "Include news in the response if set to true. If false or omitted, categories will not be included.",
  })
  includeNews?: boolean;

  @ApiProperty({
    example: "name",
  })
  field: string;
}
