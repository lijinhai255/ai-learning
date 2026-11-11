import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TodoEntity } from './entities/todo.entity'
import { UserEntity } from './entities/user.entity'
import { AuthModule } from './modules/auth/auth.module'
import { TodoModule } from './modules/todo/todo.module'
import { UserModule } from './modules/user/user.module'

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST', 'localhost'),
                port: configService.get<number>('DB_PORT', 5433),
                username: configService.get<string>('DB_USERNAME', 'postgres'),
                password: configService.get<string>('DB_PASSWORD', ''),
                database: configService.get<string>('DB_DATABASE', 'todo_app'),
                entities: [UserEntity, TodoEntity],
                synchronize: true,
            }),
        }),
        AuthModule,
        UserModule,
        TodoModule,
    ],
})
export class AppModule {}
