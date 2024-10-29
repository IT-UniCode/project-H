import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { VotingsController } from './votings.controller';
import { CacheModule } from 'src/cache/cache.module';
import { CacheService } from 'src/cache/cache.service';
import { RequestModule } from 'src/request/request.module';
import { RequestService } from 'src/request/request.service';
import { ValidateVoteMiddleware } from 'src/validate-vote-middleware/validate-vote.middleware';
import { ExtractUserMiddleware } from 'src/extract-user/extract-user.middleware';

@Module({
  imports: [CacheModule, RequestModule],
  controllers: [VotingsController],
  providers: [CacheService, RequestService],
})
export class VotingsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ExtractUserMiddleware, ValidateVoteMiddleware)
      .forRoutes({ path: 'votings', method: RequestMethod.POST });
  }
}
