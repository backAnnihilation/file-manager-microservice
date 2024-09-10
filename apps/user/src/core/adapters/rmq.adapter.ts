import { RmqConfig } from '@config/rmq.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import {
  catchError,
  firstValueFrom,
  of,
  retry,
  throwError,
  timeout,
  from,
} from 'rxjs';
import { EVENT_CMD, EVENT_COMMANDS } from '@models/enum/queue-tokens';

@Injectable()
export class RMQAdapter {
  @Client({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RMQ_URL],
      queue: process.env.RMQ_QUEUE_NAME,
      queueOptions: { durable: true },
      noAck: false,
    },
  })
  private readonly rmqClient: ClientProxy;

  constructor() {}

  async sendMessage(payload: any, command: EVENT_COMMANDS): Promise<any> {
    try {
      const result = firstValueFrom(
        this.rmqClient.send(EVENT_CMD[command], payload).pipe(
          timeout(5000),
          catchError((err) => {
            console.log(
              `Send message to file service corrupted with error:`,
              err,
            );
            return of(`error`, err);
            return throwError(() => new Error(err));
          }),
        ),
      );
    } catch (error) {
      console.log(`Send message to file service corrupted with error:`, error);
    }
  }
}
