import {
  BaseCUDApiService,
  BaseQueryRepository,
  RmqService,
} from '@app/shared';
import { CommandBus } from '@nestjs/cqrs';
import { RmqContext } from '@nestjs/microservices';

export class BaseEventsApiService<
  TCommand,
  TViewModel,
> extends BaseCUDApiService<TCommand, TViewModel> {
  constructor(
    private readonly rmqService: RmqService,
    commandBus: CommandBus,
    queryRepo: BaseQueryRepository<TViewModel>,
  ) {
    super(commandBus, queryRepo);
  }

  async handle(command: TCommand, context: RmqContext): Promise<TViewModel> {
    const responseModel = (await this.handleCommand(
      command,
    )) as Promise<TViewModel>;
    this.rmqService.ack(context);
    return responseModel;
  }
}
