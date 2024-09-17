import { CommandBus } from '@nestjs/cqrs';
import { handleErrors } from '@shared/handle-response-errors';
import { LayerNoticeInterceptor } from '@shared/notification';

export interface BaseQueryRepository<T> {
  getById: (id: string) => Promise<T>;
}

export interface BaseViewModel {
  id?: string;
}

export interface PostViewModel {
  id?: string;
  url?: string;
}

export class BaseCUDApiService<TCommand, TViewModel> {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryRepo: BaseQueryRepository<TViewModel>,
  ) {}
  async create(command: TCommand): Promise<TViewModel> {
    const notification = await this.commandBus.execute<
      TCommand,
      LayerNoticeInterceptor<TViewModel & BaseViewModel>
    >(command);

    if (notification.hasError) {
      const { error } = handleErrors(
        notification.code,
        notification.extensions[0],
      );
      throw error;
    }

    console.log(notification.data.id);

    return await this.queryRepo.getById(notification.data.id);
  }

  async createPost(command: TCommand) {
    const notification = await this.commandBus.execute<
      TCommand,
      LayerNoticeInterceptor<TViewModel & PostViewModel>
    >(command);

    if (notification.hasError) {
      const { error } = handleErrors(
        notification.code,
        notification.extensions[0],
      );
      throw error;
    }

    return {
      postId: notification.data.id,
      url: notification.data.url,
    };
  }
  async updateOrDelete(command: TCommand): Promise<void> {
    const notification = await this.commandBus.execute<
      TCommand,
      LayerNoticeInterceptor
    >(command);

    if (notification.hasError) {
      const { error } = handleErrors(
        notification.code,
        notification.extensions[0],
      );
      throw error;
    }
  }
}
