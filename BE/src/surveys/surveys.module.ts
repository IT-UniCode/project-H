import { Module } from '@nestjs/common';
import { SurveysController } from './surveys.controller';
import { RequestService } from 'src/request/request.service';

@Module({
  controllers: [SurveysController],
  providers: [RequestService],
})
export class SurveysModule {}
