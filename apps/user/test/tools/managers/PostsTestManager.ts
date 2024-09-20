import { HttpStatus, INestApplication } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import * as request from 'supertest';

import { DatabaseService } from '../../../src/core/db/prisma/prisma.service';
import { PostsRouting } from '../routes/posts.routing';
import { ICreatePostCommand } from '../../../src/features/post/api/models/input/create-post.model';

import { BaseTestManager } from './BaseTestManager';
import { EditPostInputModel } from '../../../src/features/post/api/models/input/edit-profile.model';

export class PostsTestManager extends BaseTestManager {
  protected readonly routing: PostsRouting;
  protected postsRepo: Prisma.PostDelegate<DefaultArgs>;
  constructor(
    protected readonly app: INestApplication,
    private prisma: DatabaseService,
  ) {
    super(app);
    this.routing = new PostsRouting();
    this.postsRepo = this.prisma.post;
  }

  async createPost(
    accessToken: string,
    inputData: ICreatePostCommand = null,
    expectedStatus = HttpStatus.CREATED,
  ): Promise<any> {
    const response = await request(this.application)
      .post(this.routing.createPost())
      .auth(accessToken, this.constants.authBearer)
      .set('Content-Type', 'multipart/form-data')
      .field('description', 'sadasdada')
      .attach('image', inputData.image.buffer, inputData.image.originalname)
      .expect(expectedStatus);

    return response.body;
  }

  async updatePost(
    postId: string,
    accessToken: string,
    inputData: EditPostInputModel = null,
    expectedStatus = HttpStatus.NO_CONTENT,
  ): Promise<void> {
    const post = await request(this.application)
      .put(this.routing.updatePost(postId))
      .auth(accessToken, this.constants.authBearer)
      .send(inputData)
      .expect(expectedStatus);
  }

  async deletePost(
    postId: string,
    accessToken: string,
    expectedStatus = HttpStatus.NO_CONTENT,
  ): Promise<void> {
    await request(this.application)
      .delete(this.routing.deletePost(postId))
      .auth(accessToken, this.constants.authBearer)
      .expect(expectedStatus);
  }
}
