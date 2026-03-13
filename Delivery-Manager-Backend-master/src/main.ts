import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  INestApplication,
  NestApplicationOptions,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { utilities as nestWinstonUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { AppModule } from './app.module';

async function bootstrap() {
  const options = createNestOptions();
  const app = await NestFactory.create<INestApplication>(AppModule, options);
  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['*'],
    credentials: true,
  });
  setupGlobalPipes(app);
  setupSwaggerModule(app, configService);

  await app.listen(process.env.PORT || 3000);
}

function createNestOptions(): NestApplicationOptions {
  const appName = process.env.APP_NAME;
  const logger = WinstonModule.createLogger({
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.timestamp(),
          nestWinstonUtilities.format.nestLike(appName),
        ),
      }),
    ],
  });

  return { logger };
}

function setupGlobalPipes(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
}

function setupSwaggerModule(app: INestApplication, config: ConfigService) {
  const options = new DocumentBuilder()
    .setTitle(config.get('APP_NAME'))
    .setVersion(config.get('APP_VERSION'))
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/swagger', app, document);
}

bootstrap();
