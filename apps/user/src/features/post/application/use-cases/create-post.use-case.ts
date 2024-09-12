import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
import {
  GetErrors,
  LayerNoticeInterceptor,
} from '../../../../../../../libs/shared/notification';
import { UsersRepository } from '../../../admin/infrastructure/users.repo';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { IEditPostCommand } from '../../api/models/input/edit-profile.model';
import { ICreatePostCommand } from '../../api/models/input/create-post.model';
import { CreateUserPostDTO } from '../dto/create-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repo';
// import { NewUserPostDTO } from '../dto/create2-profile.dto';
('../../api/models/input-models/fill-profile.model');

export class CreatePostCommand {
  constructor(public postDto: ICreatePostCommand) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  private location = this.constructor.name;
  constructor(
    private userRepo: UsersRepository,
    private postRepo: PostsRepository,
    // private profilesRepo: ProfilesRepository,
  ) {}

  async execute(
    command: CreatePostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    // ): Promise<any> {
    const notice = new LayerNoticeInterceptor<null | OutputId>();

    //  const imageUrl = await fileService.save(postDto.photo)
    const imageUrl = '1231aasd2311';

    const postDto = new CreateUserPostDTO({
      description: command.postDto.description,
      userId: command.postDto.userId,
      imageUrl,
    });

    await this.postRepo.create(postDto);

    return notice;
  }
}
