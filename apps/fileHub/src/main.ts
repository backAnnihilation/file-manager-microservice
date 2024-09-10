import { applyAppSettings } from '@file/core/configuration/app-settings';
import { EnvironmentVariables } from '@file/core/configuration/configuration';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { COLORS } from '@shared/logger';
import { AppModule } from './app.module';
import { getRmqConfig } from './core/configuration/rmq-connection';
import { Transport } from '@nestjs/microservices';

(async () => {
  const app = await NestFactory.create(AppModule, { rawBody: true });

  const PORT = app.get(ConfigService<EnvironmentVariables>).getOrThrow('PORT');

  applyAppSettings(app);

  const rmqConfig = getRmqConfig(app.get(ConfigService));

  app.connectMicroservice(rmqConfig);
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${COLORS.secondary}${PORT}`);
  });

  // const app = await NestFactory.createMicroservice(AppModule, {
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RMQ_URL],
  //     queue: process.env.RMQ_QUEUE_NAME,
  //     queueOptions: { durable: true },
  //     prefetchCount: 1,
  //   },
  // });

  // await app.listen();
})();
