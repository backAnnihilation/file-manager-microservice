import { registerAs } from '@nestjs/config';
import { Environment } from '../environment.enum';

export type RmqConfig = { rmq: ReturnType<typeof rmqConfig> };
export const rmqConfig = registerAs('rmq', () => ({
  url:
    process.env.ENV === Environment.TESTING
      ? process.env.RMQ_LOCAL_URL
      : process.env.RMQ_URL,
  queueName: process.env.RMQ_QUEUE_NAME,
}));
