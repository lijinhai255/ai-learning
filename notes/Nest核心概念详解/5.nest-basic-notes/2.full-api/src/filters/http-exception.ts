import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('🚀 ~ HttpErrorFilter ~ catch ~ exception:', exception)
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const status = exception.getStatus();

    // 同一层异常处理
    res.json({
      message: '出错啦，稍后重试' + exception.message,
      code: status,
      detail: '妙码异常处理',
    });
  }
}
