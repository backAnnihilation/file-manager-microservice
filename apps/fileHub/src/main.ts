import { QUEUE_NAME, RmqService } from '@app/shared';
import { applyAppSettings } from '@file/core/configuration/app-settings';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

(async () => {
  const app = await NestFactory.create(AppModule);
  applyAppSettings(app);
  const PORT = app.get(ConfigService).getOrThrow('PORT');
  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice(rmqService.getOptions(QUEUE_NAME.FILES));
  await app.startAllMicroservices();
  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${PORT}`);
  });
})();
