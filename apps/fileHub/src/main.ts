import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { applyAppSettings } from '@file/core/configuration/app-settings';
import { EnvironmentVariables } from '@file/core/configuration/configuration';
import { COLORS } from '@shared/logger';

import { AppModule } from './app.module';

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
