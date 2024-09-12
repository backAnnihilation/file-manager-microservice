import { CreatePostInputModel } from '../../api/models/input/create-post.model';

export class CreateUserPostDTO {
  readonly description: string;
  readonly userId: string;
  readonly imageUrl: string;
  readonly imageId: string;

  constructor(
    profileDto: CreatePostInputModel & { userId: string } & {
      imageUrl: string;
    } & { imageId: string },
  ) {
    const { description, userId, imageUrl, imageId } = profileDto;
    this.description = description;
    this.userId = userId;
    this.imageUrl = imageUrl;
    this.imageId = imageId;
  }
}
