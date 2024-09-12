import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostInputModel {
  @IsNotEmpty()
  @Length(0, 500)
  description: string;
}

export interface ICreatePostCommand extends CreatePostInputModel {
  userId: string;
  photo: Buffer;
}
