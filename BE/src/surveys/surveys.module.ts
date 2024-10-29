import { Module } from '@nestjs/common';
import { SurveysController } from './surveys.controller';
import { RequestService } from 'src/request/request.service';
import { SurveysService } from './surveys.service';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [SurveysController],
  providers: [RequestService, SurveysService, CacheService],
})
export class SurveysModule {}
