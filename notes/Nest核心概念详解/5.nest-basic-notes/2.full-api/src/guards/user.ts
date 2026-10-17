import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export default class UserGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    // 这是一个简单示例，业务 jwt 来做校验
    console.log("🚀 ~ UserGuard ~ canActivate ~ req.header('token'):", req.header('token'))
    // return req.header('token') === 'heyitoken';
    return req.header('apikey') === 'arc_heyitoken';
    // return true
  }
}
