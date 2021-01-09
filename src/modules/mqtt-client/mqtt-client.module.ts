import { Module } from '@nestjs/common';
import { MqttClientService } from './mqtt-client.service';
import { MqttClientController } from './mqtt-client.controller';
import { MqttClientObservable } from './mqtt-client.observer';
import { RedisCacheService } from 'src/modules/redis-cache/redis-cache.service';
import { RedisCacheModule } from 'src/modules/redis-cache/redis-cache.module';

@Module({
  imports: [RedisCacheModule],
  providers: [MqttClientService,MqttClientObservable, RedisCacheService],
  controllers: [MqttClientController]
})
export class MqttClientModule {}
