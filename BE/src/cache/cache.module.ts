import KeyvRedis from '@keyv/redis';
import { Module } from '@nestjs/common';
import { Keyv } from 'keyv';
import { CacheService } from './cache.service';
@Module({
  providers: [
    {
      provide: 'KEYV_INSTANCE',
      useFactory: () =>
        new Keyv({
          store: new KeyvRedis(
            process.env.REDIS_URL || 'redis://localhost:6379',
          ),
        }),
    },
    CacheService,
  ],
  exports: ['KEYV_INSTANCE'],
})
export class CacheModule {}
