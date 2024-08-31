import { INestApplication } from '@nestjs/common';
import { DatabaseService } from '../../core/db/prisma/prisma.service';
import { initSettings } from '../tools/initSettings';
import { UsersTestManager } from '../tools/managers/UsersTestManager';
import {
  aDescribe,
  e2eTestNamesEnum,
  skipSettings,
} from '../tools/skipSettings';
import { dbCleaner, databaseService as dbService } from '../setupTests.e2e';
import { UpdateProfileInputModel } from '../../src/features/user/api/models/input/update-profile.model';

aDescribe(skipSettings.for(e2eTestNamesEnum.Profile))('UserController', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let dbService: DatabaseService;

  beforeAll(async () => {
    const testSettings = await initSettings();
    app = testSettings.app;

    usersTestManager = testSettings.usersTestManager;
  });

  afterAll(async () => {
    await app.close();
  });

  it('constant true', () => {
    expect(1).toBe(1);
  });

  describe('profile-testing', () => {
    afterAll(async () => {
      await dbCleaner();
    });

    beforeAll(async () => {
      const inputData = usersTestManager.createInputData({});
      await usersTestManager.registration(inputData);
      const { accessToken } = await usersTestManager.signIn(inputData);
      expect.setState({ accessToken });
    });

    it(`should update profile info`, async () => {
      const { accessToken } = expect.getState();
      const profileDto: UpdateProfileInputModel = {
        firstName: 'newFirstName',
        lastName: 'newLastName',
        dateOfBirth: '12.06.2012',
      };
      await usersTestManager.updateProfile(accessToken, profileDto);
    });
  });
});
