import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { AuthenticatorModule } from './authenticator/authenticator.module';
import { DeliveryModule } from './delivery/delivery.module';
import { OrdersGateway } from './gateway/orders.gateway';

@Module({
  imports: [DatabaseModule, UserModule, AuthenticatorModule, DeliveryModule],
  controllers: [AppController],
  providers: [AppService, OrdersGateway],
})
export class AppModule {}
