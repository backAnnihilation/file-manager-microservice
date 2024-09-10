import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { applyAppSettings } from './core/config/app-settings';
import { EnvironmentVariables } from './core/config/configuration';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RmqConfig } from '@config/rmq.config';

(async () => {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const PORT = app.get(ConfigService<EnvironmentVariables>).getOrThrow('PORT');
  applyAppSettings(app);

  const { url, queueName: queue } = app
    .get(ConfigService<RmqConfig>)
    .getOrThrow('rmq', { infer: true });

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 1,
    },
  });

  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${PORT}`);
  });
})();
