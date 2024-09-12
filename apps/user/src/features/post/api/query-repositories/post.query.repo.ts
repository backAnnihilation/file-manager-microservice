import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { DatabaseService } from '../../../../../core/db/prisma/prisma.service';
import { UserPostViewModel } from '../models/output/post.view.model';
import { getPostViewModel } from '../models/output/post.output.model';

@Injectable()
export class PostQueryRepo {
  private readonly userPostsRepo: Prisma.UserPostDelegate<DefaultArgs>;
  constructor(private prisma: DatabaseService) {
    this.userPostsRepo = this.prisma.userPost;
  }

  async getUsersPosts(userId: string): Promise<UserPostViewModel[] | null> {
    try {
      const posts = await this.userPostsRepo.findMany({ where: { userId } });

      if (!posts) return null;

      const result: UserPostViewModel[] = [];

      // цикл с подбором фоток к каждому посту
      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        // const photo = await this.fileService.getFileByUrl(post.imageUrl)
        const photo = '1231231';

        result.push(getPostViewModel(post, photo));
      }

      return result;
    } catch (error) {
      console.error('Database fails operate with find user profile', error);
      return null;
    }
  }
}
