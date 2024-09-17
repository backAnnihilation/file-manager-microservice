import {
  EVENT_CMD,
  EVENT_COMMANDS,
  FILES_SERVICE,
} from '@models/enum/queue-tokens';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RMQAdapter {
  constructor(@Inject(FILES_SERVICE) private rmqClient: ClientProxy) {}

  async sendMessage(
    payload: any,
    command: EVENT_COMMANDS | string,
  ): Promise<any> {
    try {
      return await lastValueFrom(this.rmqClient.send(command, payload));
    } catch (error) {
      console.log(`Send message to file service corrupted with error:`, error);
    }
  }
}
