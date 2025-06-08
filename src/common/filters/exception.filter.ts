import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { NotModifiedException } from '../exceptions/not-modified.exception';
import { GqlArgumentsHost } from '@nestjs/graphql';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | Error, host: ArgumentsHost): void {
    const contextType = host.getType<'http' | 'graphql'>();

    let response: Response | undefined;
    let request: Request | undefined;
    let path = '';
    let acceptHeader = '';
    let isSse = false;

    if (contextType === 'http') {
      const ctx = host.switchToHttp();
      response = ctx.getResponse<Response>();
      request = ctx.getRequest<Request>();
      path = request.url;
      acceptHeader = request.headers['accept'] || '';
      isSse = acceptHeader.includes('text/event-stream');
    } else if (contextType === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      const ctx = gqlHost.getContext<{ req: Request; res: Response }>();
      response = ctx.res;
      request = ctx.req;
      path = request?.url || 'GraphQL';
    }

    if (!response || response.headersSent) {
      return;
    }

    if (exception instanceof NotModifiedException) {
      response.status(HttpStatus.NOT_MODIFIED).end();
      return;
    }

    console.error('Exception caught:', exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : exception.message || 'Internal server error';

    if (isSse) {
      response.status(status).end();
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path,
        message,
      });
    }
  }
}
