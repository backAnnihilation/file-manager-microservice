import {
  Catch,
  ExceptionFilter,
  ArgumentsHost,
  RpcExceptionFilter,
} from '@nestjs/common';
import { RmqContext, RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(RpcException)
export class MicroserviceExceptionFilter
  implements RpcExceptionFilter<RpcException>
{
  constructor() {}

  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    console.log('MicroserviceExceptionFilter');
    const errors = exception.getError() as any[];
    const context = host.switchToRpc();
    const data = context.getData();
    const ctx = context.getContext();
    console.log({ errors });

    for (const error of errors) {
      console.log({ error });
    }
    console.log({ context, ctx: ctx.args, data });

    const errorResponse = {
      message: exception.message || 'Internal RPC error',
      data: data || null,
    };

    return throwError(() => new RpcException(errorResponse));
  }
}
