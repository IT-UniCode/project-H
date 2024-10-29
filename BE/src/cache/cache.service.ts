import { Inject, Injectable } from '@nestjs/common';
import { Keyv } from 'keyv';

@Injectable()
export class CacheService {
  constructor(@Inject('KEYV_INSTANCE') private readonly keyv: Keyv) {}

  async get(key: string): Promise<any> {
    return await this.keyv.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.keyv.set(
      key,
      value,
      ttl || Number(process.env.REDIS_TTL) || 600000, // 10 min
    );
  }

  async delete(key: string): Promise<void> {
    await this.keyv.delete(key);
  }
}
