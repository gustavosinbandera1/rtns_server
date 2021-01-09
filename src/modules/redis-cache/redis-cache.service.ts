import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { EnvironmentService } from '../../environment.variables';

@Injectable()
export class RedisCacheService {
    constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

    async get(key): Promise<any> {
        const res =  await this.cache.get(key);
        console.log(res);
        return res;
    }

    async set(key, value) {
        await this.cache.set(key, value, 1000);
    }

    async reset() {
        await this.cache.reset();
    }

    async del(key) {
        await this.cache.del(key);
    }
}