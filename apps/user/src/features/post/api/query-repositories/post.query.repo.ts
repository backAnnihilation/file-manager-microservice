import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { DatabaseService } from '@user/core/db/prisma/prisma.service';

import { UserPostViewModel } from '../models/output/post.view.model';
import { getPostViewModel } from '../models/output/post.output.model';

@Injectable()
export class PostQueryRepo {
  private readonly userPostsRepo: Prisma.UserPostDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.userPostsRepo = this.prisma.userPost;
  }

  async getUsersPosts(userId: string): Promise<UserPostViewModel[] | []> {
    try {
      const posts = await this.userPostsRepo.findMany({
        where: { userId: userId },
      });

      if (!posts) return [];

      return posts.map(getPostViewModel);
    } catch (error) {
      console.error('Database fails operate with find user posts', error);
    }
  }
  async getPost(id: string): Promise<UserPostViewModel> {
    try {
      const post = await this.userPostsRepo.findUnique({ where: { id: id } });

      return getPostViewModel(post);
    } catch (error) {
      console.error('Database fails operate with find user post', error);
      throw new NotFoundException();
    }
  }
}
