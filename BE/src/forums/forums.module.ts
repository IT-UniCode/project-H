import { Module } from '@nestjs/common';
import { ForumsController } from './forums.controller';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [ForumsController],
  providers: [RequestService, CacheService],
})
export class ForumsModule {}
