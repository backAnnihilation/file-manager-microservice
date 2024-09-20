import { ICreatePostDTOModel } from '../../api/models/input/create-post.model';

export class CreatePostDTO {
  readonly description: string;
  readonly userId: string;
  readonly imageUrl: string;
  readonly imageId: string;
  readonly id: string;

  constructor(profileDto: ICreatePostDTOModel) {
    const { description, userId, imageUrl, imageId, id } = profileDto;
    this.description = description;
    this.userId = userId;
    this.imageUrl = imageUrl;
    this.imageId = imageId;
    this.id = id;
  }
}
