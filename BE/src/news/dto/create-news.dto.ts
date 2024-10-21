import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsObject } from 'class-validator';

export class CreateNewsDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Some Title', description: 'Title of new' })
  @IsString()
  title: string;

  @IsNotEmpty()
  @ApiProperty({
    example: '"Some text"',
    description: 'Content can be string or markdown',
  })
  @IsObject()
  content: {};

  @ApiProperty({
    example: '[1, 3, 5, 6]',
    description: 'Categories of new (array of categories id)',
  })
  categories: number[];
}
