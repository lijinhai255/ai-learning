import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UserModule } from '../user/user.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JWT_EXPIRES_IN, JWT_SECRET } from './constants'
import { JwtStrategy } from './jwt.strategy'
import { LocalStrategy } from './local.strategy'

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: JWT_SECRET,
            signOptions: { expiresIn: JWT_EXPIRES_IN },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
