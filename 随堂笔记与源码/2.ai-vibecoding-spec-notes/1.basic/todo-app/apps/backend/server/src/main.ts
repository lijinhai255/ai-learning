import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'
import { HttpExceptionFilter } from './fundamentals/common/filters/http-exception.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors()

    // 全局过滤器与管道
    app.useGlobalFilters(new HttpExceptionFilter())
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }))

    // 全局路由前缀
    app.setGlobalPrefix('api')

    // Swagger 文档
    const swaggerOptions = new DocumentBuilder()
        .setTitle('Todo 应用 API 文档')
        .setDescription('Todo 应用 API 文档')
        .setVersion('1.0')
        .addBearerAuth()
        .build()
    const document = SwaggerModule.createDocument(app, swaggerOptions)
    SwaggerModule.setup('doc', app, document)

    const configService = app.get(ConfigService)
    const port = configService.get<number>('PORT') ?? 8082

    await app.listen(port)
}
bootstrap()
