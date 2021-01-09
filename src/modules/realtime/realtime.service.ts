import { Injectable } from '@nestjs/common';
import { EnvironmentService } from '../../environment.variables';
import * as NRP from 'node-redis-pubsub';
import { RealtimeObservable } from './realtime.observer';
import { RedisCacheService } from 'src/modules/redis-cache/redis-cache.service';


@Injectable()
export class RealTimeService {
    environment = new EnvironmentService('.env');
    nrp: any;
    config: any = {
        //url:"redis://redis:6379"
        //url: process.env.REDIS_URL,
        url: this.environment.get('REDIS_URL'),
    };

    servers: any;

    constructor(private readonly observer: RealtimeObservable, private cacheManager: RedisCacheService ) {
        this.nrp = new NRP(this.config);
        /* This variable is handling the server and callback function when a new message
         from redis server has arrived */
        this.servers = [
            {
                type: 'comlink',
                function: 'newComlinkMessage',
            },
            {
                type: 'etd',
                function: 'newEtdMessage',
            },
        ];

        this.getSomeValue("key").then((data)=>{
            console.log("la data leida en K1-redis ")
            console.log("--->" + data);
        });
        this.getSomeValue("key2").then((data)=>{
            console.log("la data leida en K2-redis")
            console.log("--->" + data);
        });
    }

    /* This function is subscribing to redis pub/sub messages fora specific message event */
    subscribeToRedisMessage(message: string) {
        this.nrp.on(message, async(data, channel) => {
            this.servers.forEach(server => {
                if (channel.includes(server.type)) {
                    this.observer[server.function](data, channel);//this code select the appropiate function observer handler 
                }
            });
        });
    }


    async setSomeValue(KEY:string , value:string){
        await this.cacheManager.set(KEY , value);
     }   
     
     async getSomeValue(KEY:string){
        const res = await this.cacheManager.get(KEY);
        return res;
     }
}