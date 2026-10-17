import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { HttpErrorFilter } from './filters/http-exception.js';
import { ValidationPipe } from './pipes/heyi-id-params.js';
import UserGuard from './guards/user.js';
import { LoggingInterceptor } from './interceptors/logging.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // 使用全局异常过滤器
  app.useGlobalFilters(new HttpErrorFilter());

  // 全局管道
  // app.useGlobalPipes(new ValidationPipe());

  // 全局守卫
  // app.useGlobalGuards(new UserGuard())

  // 全局拦截器
  app.useGlobalInterceptors(new LoggingInterceptor())

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
