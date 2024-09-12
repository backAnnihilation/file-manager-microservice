import { CreatePostInputModel } from '../../api/models/input/create-post.model';

export class CreateUserPostDTO {
  readonly description: string;
  readonly userId: string;
  readonly imageUrl: string;

  constructor(
    profileDto: CreatePostInputModel & { userId: string } & {
      imageUrl: string;
    },
  ) {
    const { description, userId, imageUrl } = profileDto;
    this.description = description;
    this.userId = userId;
    this.imageUrl = imageUrl;
  }
}
