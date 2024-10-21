import { Module } from '@nestjs/common';
import { NewsController } from './news.controller';

@Module({})
export class NewsModule {
  controllers: [NewsController];
}
