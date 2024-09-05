import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { PostsController } from './api/post.controller';

@Module({
  imports: [CqrsModule],
  controllers: [PostsController],
  providers: [],
})
export class PostModule {}
