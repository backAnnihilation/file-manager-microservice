import { ConfigService } from '@nestjs/config';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { applyAppSettings } from '../../core/config/app-settings';
import { EnvironmentVariables } from '../../core/config/configuration';
import { DatabaseService } from '../../core/db/prisma/prisma.service';
import { EmailManager } from '../../core/managers/email-manager';
import { AppModule } from '../../src/app.module';
import { databaseService } from '../setupTests.e2e';
import { UsersTestManager } from './managers/UsersTestManager';
import { EmailMockService } from './mock/email-manager.mock';

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
      .useValue(databaseService)
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

    // const prismaClient = testingAppModule.get(DatabaseService);

    // await prismaClient.$transaction([
    //   prismaClient.userSession.deleteMany({}),
    //   prismaClient.userAccount.deleteMany({}),
    // ]);
    // await databaseService.$transaction([
    //   databaseService.userSession.deleteMany({}),
    //   databaseService.userAccount.deleteMany({}),
    // ]);
    // const prismaClient = testingAppModule.get(databaseService);
    // console.log(prismaClient);

    const usersTestManager = new UsersTestManager(app, databaseService);

    const httpServer = app.getHttpServer();

    return {
      app,
      configService,
      httpServer,
      usersTestManager,
      testingAppModule,
      databaseService,
    };
  } catch (error) {
    console.error('initSettings:', error);
  }
};
