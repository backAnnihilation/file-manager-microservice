import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ICreatePostCommand } from '../../api/models/input/create-post.model';
import { CreateUserPostDTO } from '../dto/create-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repo';
import { OutputId } from '@models/output-id.dto';
import { LayerNoticeInterceptor } from '@shared/notification';

export class CreatePostCommand {
  constructor(public postDto: ICreatePostCommand) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  private location = this.constructor.name;
  constructor(
    private postRepo: PostsRepository,
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
