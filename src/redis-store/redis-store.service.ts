import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../environment.variables';
import * as redis from 'redis'

@Injectable()
export class RedisStoreService {
    environment = new EnvironmentService('.env');
    redisClient: any;
    constructor() {
        console.log("constructor from redis store");
        this.redisClient = redis.createClient({
            url: this.environment.get('REDIS_URL'),
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT
        });

        this.redisClient.on("error", ()=> {

        });

        this.redisClient.on("connect", function () {
            console.log("Connected to Redis!!!!!!!!!!!");
        });
    }
 
    async writeKey(key, value) {
        await this.redisClient.set(key, value);
    }

    async getKey(key, cb) {
        await this.redisClient.get(key, cb);
    }

    async delKey(key) {
        await this.redisClient.del(key);
    }

    async rpush(key, element) {
        await this.redisClient.rpush(key, element);
    }

    async lpush(key, element) {
        await this.redisClient.lpush(key, element);
    }

    async rpop(key, cb) {
        await this.redisClient.rpop(key, cb);
    }

    async getSync(key) {
        let value = null;
        await this.redisClient.get(key, function (err, result) {
            if (err || !result) {
                console.log(`redisClient::getSync error for key ${key}, error=${err}`);
            } else {
                result = result.replace(/\\/g, "");
                value = JSON.parse(result);
            }
        });
        return value;
    }

    async keysSync(wildcard) {
        let value = null;
        await this.redisClient.keys(wildcard, function (err, result) {
            if (err || !result) {
                // console.log(`redisClient::getSync error for key ${key}, error=${err}`);
            } else {
                value = result;
            }
        });
        return value;
    }

    async setSync(key, value) {
        this.redisClient.set(key, value, function (err, result) {
            if (err) {
                console.log(`redisClient::setSync error saving key ${key}`);
            }
        });
    }

    async saddSync(key, value) {
        await this.redisClient.sadd(key, value, function (err, result) {
            if (err) {
                console.log(`redisClient::saddSync error saving key ${key}, ${err}`);
            }
        });
    }

    async sremSync(key, value) {
        await this.redisClient.srem(key, value, function (err, result) {
            if (err) {
                console.log(`redisClient::sremSync error removing value ${value} from key ${key}, ${err}`);
            }
        });
    } 


}
