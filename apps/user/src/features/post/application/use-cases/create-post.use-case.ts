// eslint-disable-next-line import/namespace
// eslint-disable-next-line import/namespace,import/no-unresolved
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// eslint-disable-next-line import/no-unresolved
import { OutputId } from '@models/output-id.dto';
// eslint-disable-next-line import/no-unresolved
import { GetErrors, LayerNoticeInterceptor } from '@shared/notification';
// eslint-disable-next-line import/no-unresolved
import { RMQAdapter } from '@user/core/adapters/rmq.adapter';

// eslint-disable-next-line import/no-unresolved
import { ICreatePostCommand } from '../../api/models/input/create-post.model';
// eslint-disable-next-line import/no-unresolved
import { CreateUserPostDTO } from '../dto/create-post.dto';
// eslint-disable-next-line import/no-unresolved
import { PostsRepository } from '../../infrastructure/posts.repo';
import {
  FileFormat,
  ImageType,
} from '../../../profile/api/models/enum/file-format.enums';

export class CreatePostCommand {
  constructor(public postDto: ICreatePostCommand) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  private location = this.constructor.name;
  constructor(
    private postRepo: PostsRepository,
    private rmqAdapter: RMQAdapter,
  ) {}

  async execute(
    command: CreatePostCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    // ): Promise<any> {
    const notice = new LayerNoticeInterceptor<null | OutputId>();

    const { userId, description, image } = command.postDto;

    const imagePayload = {
      fileFormat: FileFormat.IMAGE,
      fileType: ImageType.MAIN,
      image,
      userId,
    };

    const commandName = 'POST_CREATED';

    const result = await this.rmqAdapter.sendMessage(imagePayload, commandName);

    if (!result) {
      notice.addError(
        `Image wasn't uploaded`,
        'uploadImage',
        GetErrors.NotCreated,
      );
      return notice;
    }

    const postDto = new CreateUserPostDTO({
      description,
      userId,
      imageUrl: result.url,
    });

    console.log(result.url)

    await this.postRepo.create(postDto);

    return notice;
  }
}
