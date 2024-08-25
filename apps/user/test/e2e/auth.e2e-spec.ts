import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { DatabaseService } from '../../core/db/prisma/prisma.service';
import { JwtTokens } from '../../src/features/auth/api/models/auth-input.models.ts/jwt.types';
import { CaptureGuard } from '../../src/features/auth/infrastructure/guards/validate-capture.guard';
import { initSettings } from '../tools/initSettings';
import { UsersTestManager } from '../tools/managers/UsersTestManager';
import {
  aDescribe,
  e2eTestNamesEnum,
  skipSettings,
} from '../tools/skipSettings';
import { databaseCleanUp } from '../tools/utils/cleanUp';
import { constructErrorMessages } from '../tools/utils/make-errors-messages';
import { constantsForDataTesting } from '../tools/utils/test-constants';
import { ErrorField } from '../../core/utils/error-handler';
import { EmailMockService } from '../tools/mock/email-manager.mock';
import { wait } from '../tools/utils/delayUtils';
import { EmailManager } from '../../core/managers/email-manager';

const mockedCaptureGuard = {
  canActivate: jest.fn().mockImplementation(() => true),
};

aDescribe(skipSettings.for(e2eTestNamesEnum.AUTH))('AuthController', () => {
  let app: INestApplication;
  let usersTestManager: UsersTestManager;
  let dbService: DatabaseService;
  let dbCleaner: () => Promise<void>;
  let emailMockService: EmailMockService;
  let emailManager: EmailManager;

  beforeAll(async () => {
    const testSettings = await initSettings(
      (moduleBuilder: TestingModuleBuilder) =>
        moduleBuilder.overrideGuard(CaptureGuard).useValue(mockedCaptureGuard),
    );
    app = testSettings.app;

    emailMockService = new EmailMockService();
    emailManager = testSettings.testingAppModule.get(EmailManager);
    usersTestManager = testSettings.usersTestManager;
    dbService = testSettings.databaseService;

    dbCleaner = databaseCleanUp.bind(null, dbService);
    await dbCleaner();
  });

  afterAll(async () => {
    await dbCleaner();
    await dbService.$disconnect();
    await app.close();
  });

  it('constant true', () => {
    expect(1).toBe(1);
  });

  describe('testing signIn api', () => {
    afterAll(async () => {
      await dbCleaner();
    });
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
  describe('registration/signup', () => {
    afterAll(async () => {
      await dbCleaner();
    });

    it(`/auth/signup (POST) - should pass registration for uniq user, 204`, async () => {
      const correctInputData = usersTestManager.createInputData({});

      await usersTestManager.registration(correctInputData);
    });
    it(`/auth/registration (POST) - shouldn't receive error with the same already existed userName or email, because is unconfirmed, 204`, async () => {
      const inputData = usersTestManager.createInputData({});

      await usersTestManager.registration(inputData);
    });

    it(`/auth/registration (POST) - should receive error with the invalid userName or email, 400`, async () => {
      const inputData = usersTestManager.createInputData({
        email: constantsForDataTesting.inputData.INVALID_EMAIL,
      });

      const result = await usersTestManager.registration(
        inputData,
        HttpStatus.BAD_REQUEST,
      );

      const error = constructErrorMessages([ErrorField.Email]);
      usersTestManager.checkUserData(result, error);
    });

    it(`/auth/registration (POST) - shouldn't pass registration with bad password (length: 6 - 20), 400`, async () => {
      const invalidInputDataShort = usersTestManager.createInputData({
        password: constantsForDataTesting.inputData.length05,
      });

      const invalidInputDataLong = usersTestManager.createInputData({
        password: constantsForDataTesting.inputData.length21,
      });

      const result1 = await usersTestManager.registration(
        invalidInputDataShort,
        HttpStatus.BAD_REQUEST,
      );

      const result2 = await usersTestManager.registration(
        invalidInputDataLong,
        HttpStatus.BAD_REQUEST,
      );

      const error = constructErrorMessages([ErrorField.Password]);
      usersTestManager.checkUserData(result1, error);
      usersTestManager.checkUserData(result2, error);
    });

    it(`/auth/registration (POST) - shouldn't pass registration with bad userName (length: 6 - 30), 400`, async () => {
      const invalidInputShortName = usersTestManager.createInputData({
        userName: constantsForDataTesting.inputData.length05,
      });

      const invalidInputLongName = usersTestManager.createInputData({
        userName: constantsForDataTesting.inputData.length31,
      });

      const result1 = await usersTestManager.registration(
        invalidInputShortName,
        HttpStatus.BAD_REQUEST,
      );

      const result2 = await usersTestManager.registration(
        invalidInputLongName,
        HttpStatus.BAD_REQUEST,
      );

      const error = constructErrorMessages([ErrorField.UserName]);
      usersTestManager.checkUserData(result1, error);
      usersTestManager.checkUserData(result2, error);
    });

    it(`/auth/registration (POST) - shouldn't pass registration with bad fields, 400`, async () => {
      const invalidInputDataShort = usersTestManager.createInputData();

      const result = await usersTestManager.registration(
        invalidInputDataShort,
        HttpStatus.BAD_REQUEST,
      );

      const error = constructErrorMessages([
        ErrorField.UserName,
        ErrorField.Password,
        ErrorField.Email,
      ]);
      usersTestManager.checkUserData(result, error);
    });
  });
  describe('registration-email-resending', () => {
    beforeAll(async () => {
      const inputData = usersTestManager.createInputData({});
      const user = await usersTestManager.createSA(inputData);

      expect.setState({ user });
    });

    afterAll(async () => {
      await dbCleaner();
    });

    it(`/auth/registration-email-resending (POST) - shouldn't passed api with invalid email, 400`, async () => {
      const res = await usersTestManager.registrationEmailResending(
        '@',
        HttpStatus.BAD_REQUEST,
      );

      const error = constructErrorMessages([ErrorField.Email]);
      usersTestManager.checkUserData(res, error);
    });

    it.skip(`/auth/registration-email-resending (POST) - shouldn't passed api with a non-existent email in the system, 400`, async () => {
      const res = await usersTestManager.registrationEmailResending(
        constantsForDataTesting.inputData.EMAIL,
        HttpStatus.BAD_REQUEST,
      );
      console.log({ res: res.errorsMessages[0] });

      const error = constructErrorMessages([ErrorField.Email]);
      usersTestManager.checkUserData(res, error);
    });

    it.skip(`/auth/registration-email-resending (POST) - shouldn't send message with confirmation code, user is confirmed, 400 `, async () => {
      const { user } = expect.getState();

      const res = await usersTestManager.registrationEmailResending(
        user.email,
        HttpStatus.BAD_REQUEST,
      );

      const error = constructErrorMessages([ErrorField.Email]);
      usersTestManager.checkUserData(res, error);
    });

    it(`/auth/registration-email-resending (POST) - should send confirmation code, 204`, async () => {
      const registrationData = usersTestManager.createInputData({
        email: constantsForDataTesting.inputData.EMAIL2,
        userName: constantsForDataTesting.inputData.USER_NAME,
      });

      await usersTestManager.registration(registrationData);

      await usersTestManager.registrationEmailResending(registrationData.email);

      // todo fix mack calling
      // const sendEmailConfirmationMessageSpy = jest
      //   .spyOn(emailManager, 'sendEmailConfirmationMessage')
      //   .mockImplementation(emailMockService.sendEmailConfirmationMessage);

      // expect(sendEmailConfirmationMessageSpy).toHaveBeenCalled();

      await wait(3);
      const { accessToken } = await usersTestManager.signIn(registrationData);

      const userProfileInfo = await usersTestManager.me(accessToken);

      const { confirmationCode } = await dbService.userAccount.findUnique({
        where: { id: userProfileInfo.userId },
        select: { confirmationCode: true },
      });
      expect(confirmationCode).toBeTruthy();

      expect.setState({ userProfileInfo, confirmationCode });
    });

    it(`/auth/registration-confirmation (POST) - should'nt accept invalid confirmationCode, 400`, async () => {
      await usersTestManager.registrationConfirmation(
        '',
        HttpStatus.BAD_REQUEST,
      );
    });

    it(`/auth/registration-confirmation (POST) - should accept confirmationCode, and confirmed user, 204`, async () => {
      const { userProfileInfo, confirmationCode } = expect.getState();

      const { isConfirmed: beforeConfirmed } =
        await dbService.userAccount.findUnique({
          where: { id: userProfileInfo.userId },
          select: { isConfirmed: true },
        });
      expect(beforeConfirmed).toBeFalsy();

      await usersTestManager.registrationConfirmation(confirmationCode);

      const { isConfirmed: afterConfirmed } =
        await dbService.userAccount.findUnique({
          where: { id: userProfileInfo.userId },
          select: { isConfirmed: true },
        });

      expect(afterConfirmed).toBeTruthy();
    });
    it.skip(`/auth/registration (POST) - should receive error with the same already existed email, 400`, async () => {
      const { userProfileInfo } = expect.getState();
      const inputTheSameEmailData = usersTestManager.createInputData({
        email: userProfileInfo.email,
      });

      const theSameEmailResult = await usersTestManager.registration(
        inputTheSameEmailData,
        HttpStatus.BAD_REQUEST,
      );
      const emailError = constructErrorMessages([ErrorField.Email]);
      usersTestManager.checkUserData(theSameEmailResult, emailError);

      const inputTheSameUserName = usersTestManager.createInputData({
        userName: userProfileInfo.userName,
      });

      const theSameUserNameResult = await usersTestManager.registration(
        inputTheSameUserName,
        HttpStatus.BAD_REQUEST,
      );
      const userNameError = constructErrorMessages([ErrorField.UserName]);
      usersTestManager.checkUserData(theSameUserNameResult, userNameError);
    });
  });
  describe('', () => {});
  describe('', () => {});
  describe('', () => {});
  describe('', () => {});
});
