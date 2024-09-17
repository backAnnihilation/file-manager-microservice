import { UserPost } from '@prisma/client';

import { UserPostViewModel } from './post.view.model';

export const getPostViewModel = (post: UserPost): UserPostViewModel => ({
  id: post.id,
  description: post.description,
  userId: post.userId,
  image: post.imageUrl,
});
