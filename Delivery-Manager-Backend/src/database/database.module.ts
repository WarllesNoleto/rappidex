import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { DeliveryConfigEntity, DeliveryEntity, UserEntity } from './entities';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mongodb',
        url: configService.get<string>('MONGODB_URI'),
        entities: [join(__dirname, '**/**.entity{.ts,.js}')],
        synchronize: true,
        useNewUrlParser: true,
        logging: true,
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [TypeOrmModule.forFeature([UserEntity, DeliveryEntity, DeliveryConfigEntity])],
})
export class DatabaseModule {}
