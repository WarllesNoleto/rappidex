import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthenticatorModule } from './authenticator/authenticator.module';
import { DeliveryModule } from './delivery/delivery.module';
import { OrdersGateway } from './gateway/orders.gateway';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    AuthenticatorModule,
    DeliveryModule,
  ],
  controllers: [AppController],
  providers: [AppService, OrdersGateway],
})
export class AppModule {}
