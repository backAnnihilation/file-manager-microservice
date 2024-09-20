import { HttpStatus, INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { RMQAdapter } from '@user/core/adapters';

import { DatabaseService } from '../../src/core/db/prisma/prisma.service';
import { initSettings } from '../tools/initSettings';
import { UsersTestManager } from '../tools/managers/UsersTestManager';
import {
  aDescribe,
  e2eTestNamesEnum,
  skipSettings,
} from '../tools/skipSettings';
import {
  constantsTesting,
  InputConstantsType,
  mockImage,
} from '../tools/utils/test-constants';
import { PostsTestManager } from '../tools/managers/PostsTestManager';
import { RMQAdapterMock } from '../tools/mock/rmq-adapter.mock';
import { CaptureGuard } from '../../src/features/auth/infrastructure/guards/validate-capture.guard';
import { mockedCaptureGuard } from '../tools/mock/capture-guard.mock';

aDescribe(skipSettings.for(e2eTestNamesEnum.Posts))('PostsController', () => {
  let app: INestApplication;
  let postsTestManager: PostsTestManager;
  let dbService: DatabaseService;
  let constants: InputConstantsType;
  let usersTestManager: UsersTestManager;

  beforeAll(async () => {
    const testSettings = await initSettings(
      (moduleBuilder: TestingModuleBuilder) =>
        moduleBuilder
          .overrideProvider(RMQAdapter)
          .useClass(RMQAdapterMock)
          .overrideGuard(CaptureGuard)
          .useValue(mockedCaptureGuard),
    );
    app = testSettings.app;
    constants = constantsTesting.inputData;
    postsTestManager = testSettings.postsTestManager;
    usersTestManager = testSettings.usersTestManager;
  });

  afterAll(async () => {
    await app.close();
  });

  it('constant true', () => {
    expect(1).toBe(1);
  });

  describe('posts-testing', () => {
    afterAll(async () => {
      // await dbCleaner();
    });

    beforeAll(async () => {
      const inputData_1 = usersTestManager.createInputData({});
      await usersTestManager.registration(inputData_1);
      const { accessToken } = await usersTestManager.signIn(inputData_1);
      const inputData_2 = usersTestManager.createInputData({
        userName: 'etofiasko',
        email: 'bratan@gmail.com',
      });
      await usersTestManager.registration(inputData_2);
      const tokens_2 = await usersTestManager.signIn(inputData_2);
      const accessToken2 = tokens_2.accessToken;

      expect.setState({ accessToken2, accessToken });
    });

    it(`should create new post`, async () => {
      const { accessToken } = expect.getState();

      const postDto = {
        description: 'badsfdasdsad',
        image: mockImage,
      };

      const post = await postsTestManager.createPost(accessToken, postDto);

      const postId = post.id;

      expect.setState({ postId });
    });

    it(`should not create a new post`, async () => {
      const { accessToken } = expect.getState();

      const postDto = {
        description: '',
        image: mockImage,
      };

      await postsTestManager.createPost(
        accessToken,
        postDto,
        HttpStatus.BAD_REQUEST,
      );
    });

    it(`should not update post  - error 403`, async () => {
      const { accessToken2, postId } = expect.getState();

      const postDto = {
        description: 'asdas',
        image: mockImage,
      };

      await postsTestManager.updatePost(
        postId,
        accessToken2,
        postDto,
        HttpStatus.FORBIDDEN,
      );
    });

    it(`shouldn't update post - error 400`, async () => {
      const { accessToken, postId } = expect.getState();

      const postDto = {
        description: 'a',
        image: mockImage,
      };

      await postsTestManager.updatePost(
        postId,
        accessToken,
        postDto,
        HttpStatus.BAD_REQUEST,
      );
    });

    it(`shouldn't update post - error 404`, async () => {
      const { accessToken } = expect.getState();

      const postDto = {
        description: 'a',
        image: mockImage,
      };

      await postsTestManager.updatePost(
        'dsadwad',
        accessToken,
        postDto,
        HttpStatus.NOT_FOUND,
      );
    });

    it(`should update post`, async () => {
      const { accessToken, postId } = expect.getState();

      const postDto = {
        description: 'constants.description',
      };

      await postsTestManager.updatePost(postId, accessToken, postDto);
    });

    it(`should not delete post  - error 403`, async () => {
      const { accessToken2, postId } = expect.getState();

      await postsTestManager.deletePost(
        postId,
        accessToken2,
        HttpStatus.FORBIDDEN,
      );
    });

    it(`shouldn't delete post - error 404`, async () => {
      const { accessToken } = expect.getState();

      await postsTestManager.deletePost(
        'adwsdswa',
        accessToken,
        HttpStatus.NOT_FOUND,
      );
    });

    it(`should delete post`, async () => {
      const { accessToken, postId } = expect.getState();

      await postsTestManager.deletePost(postId, accessToken);
    });
  });
});
