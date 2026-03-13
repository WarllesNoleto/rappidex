import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, DeliveryEntity, LogEntity } from '../database/entities';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, DeliveryEntity, LogEntity])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
