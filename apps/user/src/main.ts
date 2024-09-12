import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './core/config/app-settings';
import { EnvironmentVariables } from './core/config/configuration';

(async () => {
  const app = await NestFactory.create(AppModule, { rawBody: true });
  const PORT = app.get(ConfigService<EnvironmentVariables>).getOrThrow('PORT');
  applyAppSettings(app);
  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${PORT}`);
  });
})();
