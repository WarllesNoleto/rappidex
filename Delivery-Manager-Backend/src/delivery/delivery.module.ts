import { Module } from '@nestjs/common';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DeliveryConfigEntity, DeliveryEntity, LogEntity, UserEntity } from '../database/entities';
import { OrdersGateway } from '../gateway/orders.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, DeliveryEntity, LogEntity, DeliveryConfigEntity])
  ],
  controllers: [DeliveryController],
  providers: [DeliveryService, OrdersGateway],
})
export class DeliveryModule {}