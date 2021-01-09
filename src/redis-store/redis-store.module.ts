import { Module } from '@nestjs/common';
import { RedisStoreController } from './redis-store.controller';
import { RedisStoreService } from './redis-store.service';

@Module({
    imports: [],
    providers: [RedisStoreService],
    controllers: [RedisStoreController]
  })
export class RedisStoreModule {}
