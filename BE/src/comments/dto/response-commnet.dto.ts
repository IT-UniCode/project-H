import { ApiProperty } from "@nestjs/swagger";

export class ResponseComment {
  @ApiProperty({
    description: "Unique id of comment",
    type: Number,
  })
  id: number;

  @ApiProperty({
    description: "Content of comment",
    type: String,
  })
  content: string;

  @ApiProperty({
    description: "Type of document for comment",
    type: String,
  })
  documentType: string;

  @ApiProperty({
    description: "Id of document for comment",
    type: String,
  })
  documentId: string;

  @ApiProperty({
    description: "Unique user id of comment author",
    type: Number,
  })
  userId: number;

  @ApiProperty({
    description: "Author's user name",
    type: String,
    example: "Name",
  })
  userName: "Name";

  @ApiProperty({
    description: "Date and time of creating comment as string",
    type: Date,
  })
  createdAt: Date;
}
