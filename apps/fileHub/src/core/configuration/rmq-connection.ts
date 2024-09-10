import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RmqConfig } from '@config/rmq.config';

export const getRmqConfig = (
  configService: ConfigService<RmqConfig>,
): MicroserviceOptions => {
  const { url, queueName: queue } = configService.getOrThrow('rmq', {
    infer: true,
  });

  return {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions: { durable: true },
      noAck: false,
      prefetchCount: 1,
    },
  };
};
