import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map, finalize } from 'rxjs';
import { Request, Response } from 'express';
import { GqlExecutionContext } from '@nestjs/graphql';
import { RENDER_METADATA } from '@nestjs/common/constants';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const start = performance.now();

    const contextType = context.getType<'http' | 'graphql'>();

    let req: Request | undefined;
    let res: Response | undefined;
    let method = 'GRAPHQL';
    let url = 'GraphQL';
    let isSse = false;
    let isRender = false;

    if (contextType === 'http') {
      const httpCtx = context.switchToHttp();
      req = httpCtx.getRequest<Request>();
      res = httpCtx.getResponse<Response>();
      method = req.method;
      url = req.url;
      isSse = req.headers.accept?.includes('text/event-stream') ?? false;
      isRender = this.reflector.get(RENDER_METADATA, context.getHandler());
    } else if (contextType === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context).getContext<{
        req: Request;
        res: Response;
      }>();
      res = gqlCtx.res;
    }

    return next.handle().pipe(
      map((data: unknown) => {
        const elapsed = performance.now() - start;
        const elapsedStr = `${elapsed.toFixed(3)}ms`;

        if (isSse) return data;

        if (isRender && typeof data === 'object' && data !== null) {
          return {
            ...(data as Record<string, unknown>),
            timing: elapsedStr,
          };
        }

        if (res) {
          res.setHeader('X-Elapsed-Time', elapsedStr);
        }

        return data;
      }),
      finalize(() => {
        const total = (performance.now() - start).toFixed(3);
        console.log(`${method} ${url} — ${total}ms`);
      }),
    );
  }
}
