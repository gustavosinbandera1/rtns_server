import { CacheModule, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
import * as redisStore from 'cache-manager-redis-store';

@Module({
    imports: [
        CacheModule.register({
            imports: [],
            inject: [],
            useFactory: async () => ({
                store: redisStore,
                host: "127.0.0.1",
                port: 6379,
                ttl: 1000000,
                max: 1000000
            })
        })
    ],
    providers: [RedisCacheService],
    exports: [RedisCacheService]
})
export class RedisCacheModule {}