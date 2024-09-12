import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { EditUserPostDTO } from '../application/dto/edit-post.dto';
import { DatabaseService } from '@user/core/db/prisma/prisma.service';
import { BaseRepository } from '@user/core/db/base.repository';
import { CreateUserPostDTO } from '../application/dto/create-post.dto';

@Injectable()
export class PostsRepository extends BaseRepository {
  private readonly userPosts: Prisma.UserPostDelegate<DefaultArgs>;
  constructor(protected prisma: DatabaseService) {
    super(prisma);
    this.userPosts = this.prisma.userPost;
  }
  async create(userPostDto: CreateUserPostDTO) {
    try {
      const data: Prisma.UserPostCreateInput = {
        description: userPostDto.description,
        imageUrl: userPostDto.imageUrl,
        userAccount: {
          connect: { id: userPostDto.userId },
        },
      };

      const post = await this.userPosts.create({ data });
      console.log(post.id);
      return;
    } catch (error) {
      console.log(error);
      throw new Error(`userPost is not saved: ${error}`);
    }
  }

  async update(userPostDto: EditUserPostDTO) {
    try {
      return await this.userPosts.update({
        data: { description: userPostDto.description },
        where: { id: userPostDto.postId, userId: userPostDto.userId },
      });
    } catch (error) {
      console.log(error);
      throw new Error(`userPost is not updated: ${error}`);
    }
  }

  async getPostById(id: string) {
    try {
      return await this.userPosts.findUnique({ where: { id } });
    } catch (error) {
      console.log(`error in getPostById: ${error}`);
      return null;
    }
  }

  async deletePost(id: string) {
    try {
      return await this.userPosts.delete({ where: { id: id } });
    } catch (error) {
      throw new Error(`error in deletePostUser: ${error}`);
    }
  }
}
