import { UserPost } from '@prisma/client';

import { UserPostViewModel } from './post.view.model';

// TODO убрать string у photo
export const getPostViewModel = (
  post: UserPost,
  photo: Buffer | string,
): UserPostViewModel => ({
  id: post.id,
  description: post.description,
  userId: post.userId,
  photo,
});
