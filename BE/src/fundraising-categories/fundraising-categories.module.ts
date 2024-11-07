import { Module } from '@nestjs/common';
import { FundraisingCategoriesController } from './fundraising-categories.controller';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';
import { RequestService } from 'src/request/request.service';

@Module({
  controllers: [FundraisingCategoriesController],
  imports: [CacheModule],
  providers: [CacheService, RequestService],
})
export class FundraisingCategoriesModule {}
