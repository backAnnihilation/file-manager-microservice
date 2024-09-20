import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  ImageType,
  MediaType,
  LayerNoticeInterceptor,
  OutputId,
  EVENT_COMMANDS,
  EVENT_NAME,
} from '@app/shared';
import { RMQAdapter } from '@user/core/adapters/rmq.adapter';
import { v4 as uuidv4 } from 'uuid';

import { ICreatePostCommand } from '../../api/models/input/create-post.model';
import { CreatePostDTO } from '../dto/create-post.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';

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

    const postId: string = uuidv4();

    const imagePayload = {
      fileFormat: MediaType.IMAGE,
      fileType: ImageType.MAIN,
      image,
      userId,
      postId,
    };

    const commandName = EVENT_COMMANDS.POST_CREATED;
    const result = await this.rmqAdapter.sendMessage(imagePayload, commandName);

    if (!result) {
      notice.addError(
        `Image wasn't uploaded`,
        this.location,
        notice.errorCodes.InternalServerError,
      );
      return notice;
    }

    const postDto = new CreatePostDTO({
      description,
      userId,
      imageUrl: result.url,
      imageId: result.id,
      id: postId,
    });

    await this.postRepo.create(postDto);

    const post = await this.postRepo.getPostById(postId)


    console.log(111111)
    console.log(post)
    console.log(111111)

    return notice;
  }
}
