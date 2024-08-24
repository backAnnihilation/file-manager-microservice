import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { DatabaseService } from '../../core/db/prisma/prisma.service';
import { CaptureGuard } from '../../src/features/auth/infrastructure/guards/validate-capture.guard';
import { initSettings } from '../tools/initSettings';
import { UsersTestManager } from '../tools/managers/UsersTestManager';
import {
  aDescribe,
  e2eTestNamesEnum,
  skipSettings,
} from '../tools/skipSettings';
import { constructErrorMessages } from '../tools/utils/make-errors-messages';
import { constantsForDataTesting } from '../tools/utils/test-constants';
import { JwtTokens } from '../../src/features/auth/api/models/auth-input.models.ts/jwt.types';

const mockedCaptureGuard = {
  canActivate: jest.fn().mockImplementation(() => true),
};

aDescribe(skipSettings.for(e2eTestNamesEnum.AUTH))('AuthController', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let prismaService: DatabaseService;

  beforeAll(async () => {
    const testSettings = await initSettings(
      (moduleBuilder: TestingModuleBuilder) =>
        moduleBuilder.overrideGuard(CaptureGuard).useValue(mockedCaptureGuard),
    );
    app = testSettings.app;
    usersTestManager = testSettings.usersTestManager;
    prismaService = testSettings.databaseService;
  });

  afterAll(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it.skip('constant true', () => {
    expect(1).toBe(1);
  });

  describe.only('testing signIn api', () => {
    // if entrance allowed via userName
    // it(`/auth/login (POST) - shouldn't pass singIn with does'nt exist user's name, expect 401`, async () => {
    //   const inputData = usersTestManager.createInputData({
    //     userName: 'userName',
    //   });

    //   await usersTestManager.signIn(inputData, HttpStatus.UNAUTHORIZED);
    // });
    it(`/auth/login (POST) - shouldn't pass singIn with does'nt exist user's email, expect 401`, async () => {
      const inputData = usersTestManager.createInputData({
        email: 'email@email.com',
      });

      await usersTestManager.signIn(inputData, HttpStatus.UNAUTHORIZED);
    });

    // it(`/auth/login (POST) - shouldn't pass login with invalid registration email, expect 400`, async () => {
    //   const inputData = usersTestManager.createInputData({
    //     login: constantsForDataTesting.inputData.length02,
    //   });

    //   const result = await usersTestManager.signIn(
    //     inputData,
    //     HttpStatus.BAD_REQUEST,
    //   );

    //   const error = constructErrorMessages(['loginOrEmail']);
    //   usersTestManager.checkUserData(result, error);
    // });
    // it(`/auth/login (POST) - shouldn't pass login with invalid registration login, expect 400`, async () => {
    //   const inputData = usersTestManager.createInputData({
    //     login: constantsForDataTesting.inputData.length101,
    //   });

    //   const result = await usersTestManager.signIn(
    //     inputData,
    //     HttpStatus.BAD_REQUEST,
    //   );

    //   const error = constructErrorMessages(['loginOrEmail']);
    //   usersTestManager.checkUserData(result, error);
    // });

    // it(`/auth/login (POST) - shouldn't pass login with invalid user's email, expect 400`, async () => {
    //   const inputData = usersTestManager.createInputData({
    //     email: constantsForDataTesting.inputData.length02,
    //   });

    //   const result = await usersTestManager.signIn(
    //     inputData,
    //     HttpStatus.BAD_REQUEST,
    //   );

    //   const error = constructErrorMessages(['loginOrEmail']);
    //   usersTestManager.checkUserData(result, error);
    // });

    // it(`/auth/login (POST) - shouldn't pass login with invalid user's email, expect 400`, async () => {
    //   const inputData = usersTestManager.createInputData({
    //     email: constantsForDataTesting.inputData.length101,
    //   });

    //   const result = await usersTestManager.signIn(
    //     inputData,
    //     HttpStatus.BAD_REQUEST,
    //   );

    //   const error = constructErrorMessages(['loginOrEmail']);
    //   usersTestManager.checkUserData(result, error);
    // });

    // it(`/auth/login (POST) - shouldn't pass login with short user's password, expect 400`, async () => {
    //   const inputData = usersTestManager.createInputData({
    //     password: constantsForDataTesting.inputData.length05,
    //   });

    //   const result = await usersTestManager.signIn(
    //     inputData,
    //     HttpStatus.BAD_REQUEST,
    //   );

    //   const error = constructErrorMessages(['password']);
    //   usersTestManager.checkUserData(result, error);
    // });

    // it(`/auth/login (POST) - shouldn't pass login with long user's password, expect 400`, async () => {
    //   const inputData = usersTestManager.createInputData({
    //     password: constantsForDataTesting.inputData.length21,
    //   });

    //   const result = await usersTestManager.signIn(
    //     inputData,
    //     HttpStatus.BAD_REQUEST,
    //   );

    //   const error = constructErrorMessages(['password']);
    //   usersTestManager.checkUserData(result, error);
    // });

    // it(`/auth/login (POST) - shouldn't pass login with invalid user's info, both invalid fields, expect 400 and errors format`, async () => {
    //   const inputData = usersTestManager.createInputData();

    //   const result = await usersTestManager.signIn(
    //     inputData,
    //     HttpStatus.BAD_REQUEST,
    //   );

    //   const errors = constructErrorMessages(['loginOrEmail', 'password']);
    //   usersTestManager.checkUserData(result, errors);
    // });

    it('/auth/login (POST) - should be logged in', async () => {
      const validSignInData = usersTestManager.createInputData({});

      await usersTestManager.createSA(validSignInData);
      const jwtTokens: JwtTokens =
        await usersTestManager.signIn(validSignInData);
    });
  });

  describe('', () => {});
  describe('', () => {});
  describe('', () => {});
  describe('', () => {});
});
