import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { RequestService } from 'src/request/request.service';
import { CacheService } from 'src/cache/cache.service';
import { CacheModule } from 'src/cache/cache.module';

@Module({
  imports: [CacheModule],
  controllers: [CommentsController],
  providers: [RequestService, CacheService],
})
export class CommentsModule {}
