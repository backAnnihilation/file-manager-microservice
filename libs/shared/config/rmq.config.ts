import { registerAs } from '@nestjs/config';

export type RmqConfig = { rmq: ReturnType<typeof rmqConfig> };
export const rmqConfig = registerAs('rmq', () => ({
  url: process.env.RMQ_URL,
  queueName: process.env.RMQ_QUEUE_NAME,
}));
