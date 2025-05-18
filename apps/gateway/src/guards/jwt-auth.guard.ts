import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  // ✅ 반환 타입 명시 (boolean | Promise<boolean> | Observable<boolean>)
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { method, url } = request;

    // 로그인과 회원가입은 인증 없이 허용
    if (
      (method === 'POST' && url === '/auth/login') ||
      (method === 'POST' && url === '/users')
    ) {
      return true;
    }

    // 그 외 요청은 JWT 인증 수행
    return super.canActivate(context);
  }
}
