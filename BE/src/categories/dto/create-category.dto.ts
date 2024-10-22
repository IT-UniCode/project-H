import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Some Name', description: 'Name of the category' })
  @IsString()
  name: string;
}
