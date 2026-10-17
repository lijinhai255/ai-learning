import { NestMiddleware } from "@nestjs/common";

// 我们前面给大家讲过插件化或者是叫微内核架构。
export default class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log('LogMiddleware', req.method);
    next();
    // console.log('LogMiddleware', res);
  }
}