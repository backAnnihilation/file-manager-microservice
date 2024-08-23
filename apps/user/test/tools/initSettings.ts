import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { EmailManager } from '../../core/managers/email-manager';
import { applyAppSettings } from '../../core/config/app-settings';
import {
  ConfigurationType,
  EnvironmentVariables,
} from '../../core/config/configuration';
import { AppModule } from '../../src/app.module';
import { EmailMockService } from './mock/email-manager.mock';
import { PrismaTestService } from './mock/prisma-test.service';
import { DatabaseService } from '../../core/db/prisma/prisma.service';
import { UsersTestManager } from './managers/UsersTestManager';

export const initSettings = async (
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void,
) => {
  try {
    const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule(
      {
        imports: [AppModule],
      },
    )
      .overrideProvider(DatabaseService)
      .useValue(PrismaTestService)
      .overrideProvider(EmailManager)
      .useValue(EmailMockService);

    if (addSettingsToModuleBuilder) {
      addSettingsToModuleBuilder(testingModuleBuilder);
    }

    let testingAppModule = await testingModuleBuilder.compile();

    const app = testingAppModule.createNestApplication();

    const configService = app.get(ConfigService<EnvironmentVariables>);

    const env = configService.get('ENV');

    console.log('in tests ENV: ', { env });

    applyAppSettings(app);

    await app.init();
    const usersTestManager = new UsersTestManager(app);

    const httpServer = app.getHttpServer();

    return {
      app,
      configService,
      httpServer,
      usersTestManager,
      testingAppModule,
    };
  } catch (error) {
    console.error('initSettings:', error);
  }
};
