import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';

@Module({})
export class CategoriesModule {
  controllers: [CategoriesController];
}
