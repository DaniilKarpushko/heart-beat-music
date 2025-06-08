import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as crypto from 'crypto';
import { NotModifiedException } from '../exceptions/not-modified.exception';

@Injectable()
export class ETagInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const res = context.switchToHttp().getResponse<Response>();
    const req = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      switchMap((body) => {
        const hash = crypto
          .createHash('sha1')
          .update(JSON.stringify(body))
          .digest('hex');

        const etag = `"${hash}"`;

        if (req.headers['if-none-match'] === etag) {
          throw new NotModifiedException();
        }

        res.setHeader('ETag', etag);
        return of(body);
      }),
    );
  }
}
