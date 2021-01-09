import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { RealtimeController } from './realtime.controller';
import { RealTimeService } from './realtime.service';
import { RealtimeObservable } from './realtime.observer';
import { RedisCacheService } from 'src/modules/redis-cache/redis-cache.service';
import { RedisCacheModule } from 'src/modules/redis-cache/redis-cache.module';
//import { HandleMessage } from './handle.Message';
@Module({
    imports: [RedisCacheModule],
    controllers: [RealtimeController/*, HandleMessage*/],
    providers: [RealTimeService, RealtimeObservable, RedisCacheService],
    exports: []

})

export class RealtimeModule {
}