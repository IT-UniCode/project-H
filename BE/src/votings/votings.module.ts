import { Module } from '@nestjs/common';
import { VotingsController } from './votings.controller';
import { CacheModule } from 'src/cache/cache.module';
import { CacheService } from 'src/cache/cache.service';
import { RequestModule } from 'src/request/request.module';
import { RequestService } from 'src/request/request.service';
import { VotingsService } from './votings.service';

@Module({
  imports: [CacheModule, RequestModule],
  controllers: [VotingsController],
  providers: [CacheService, RequestService, VotingsService],
})
export class VotingsModule {}
