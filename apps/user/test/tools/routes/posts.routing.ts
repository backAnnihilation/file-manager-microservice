import { RoutingEnum } from '@app/shared';
import { BaseRouting } from './base-api.routing';

export class PostsRouting extends BaseRouting {
  constructor() {
    super(RoutingEnum.posts);
  }
  getUserPosts = (userId: string) => `${this.baseUrl}/${userId}/posts`;
  getAllPosts = () => `${this.baseUrl}`;
  getPost = (postId: string) => `${this.baseUrl}/${postId}`;
  updatePost = (postId: string) => `${this.baseUrl}/${postId}`;
  deletePost = (postId: string) => `${this.baseUrl}/${postId}`;
  createPost = () => `${this.baseUrl}`;
}
