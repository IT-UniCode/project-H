import { Module } from '@nestjs/common';
import { FundraisingsController } from './fundraisings.controller';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  controllers: [FundraisingsController],
  imports: [CacheModule],
  providers: [RequestService, CacheService],
})
export class FundraisingsModule {}
