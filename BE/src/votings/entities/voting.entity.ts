import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNumber, IsObject, IsString } from "class-validator";
import { Entity } from "src/dto-classes";
export class Voting extends Entity {
  @ApiProperty({
    description: "Name of voting",
  })
  @IsString()
  name: "some name";

  @ApiProperty({
    description: "Description of voting",
  })
  @IsString()
  content: "some description";

  @ApiProperty({
    description: "Variants for votes",
    example: { data: ["a", "b", "c"] },
  })
  @IsObject()
  variants: {
    data: ["a", "b", "c"];
  };

  @ApiProperty({
    description: "Users votes",
    example: {
      data: [
        {
          userId: 1,
          variant: 1,
        },
      ],
    },
  })
  answers: {
    data: [
      {
        userId: 1;
        variant: 1;
      },
    ];
  };

  @ApiProperty({
    description: "State of voting (active or finished)",
    enum: ["active", "finish"],
    example: "active",
  })
  state: "active" | "finish";
}
