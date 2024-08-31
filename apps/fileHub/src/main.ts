import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './core/configuration/app-settings';
import { EnvironmentVariables } from './core/configuration/configuration';
import { COLORS } from '../../../libs/shared/logger';

(async () => {
  const appOptions = {
    rawBody: true,
  };
  const app = await NestFactory.create(AppModule, appOptions);
  const configService = app.get(ConfigService<EnvironmentVariables>);
  const PORT = configService.getOrThrow('PORT');
  applyAppSettings(app);

  await app.listen(PORT, () => {
    console.log(`App starts to listen port: ${COLORS.secondary}${PORT}`);
  });
})();
