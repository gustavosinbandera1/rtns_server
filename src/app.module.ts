// Nest
import { Module, NestModule, RequestMethod, MiddlewareConsumer } from '@nestjs/common';
import { EnvironmentService } from './environment.variables';
// Modules
//import { AuthModule } from './modules/auth/auth.module';
import { RealtimeModule } from './modules/realtime/realtime.module';

//  Database import
import { DatabaseModule } from './database';

//  Gateway sockets
import { AppGateway } from './app.gateway';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TokenMiddleware } from './common/middlewares/token.middleware';
import { TenantMiddleware } from './common/middlewares/tenant.middleware';
import { DevicesModule } from './modules/devices/devices.module';
import { MqttClientModule } from './modules/mqtt-client/mqtt-client.module';
import { RedisCacheModule } from './modules/redis-cache/redis-cache.module';
import { RedisStoreModule } from './redis-store/redis-store.module';


@Module({
	imports: [
		//AuthModule,
		DatabaseModule,
		RealtimeModule,
		DevicesModule,
		MqttClientModule,
		RedisCacheModule,
		RedisStoreModule
	],
	controllers: [],
	providers: [
		AppGateway,
	]
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
	const environment = new EnvironmentService('.env');
	  console.log('conchasumare');
	  console.log(environment.get('NODE_ENV'));
	  console.log(process.env.NODE_ENV);
		consumer
		.apply(LoggerMiddleware, TenantMiddleware, TokenMiddleware)
    .forRoutes('*');
  }
}