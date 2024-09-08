import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ExtractUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    const { userId } = request;

    return userId;
  },
);
