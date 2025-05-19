import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable()
export class HttpProxyErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const status = error?.response?.status || 500;
        const data = error?.response?.data;

        const message = data?.message || 'Internal Server Error';

        return throwError(() => new HttpException(message, status));
      }),
    );
  }
}
