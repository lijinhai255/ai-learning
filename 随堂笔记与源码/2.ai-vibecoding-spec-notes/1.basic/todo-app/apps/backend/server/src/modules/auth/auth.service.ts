import { ConflictException, Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'

import { UserEntity } from '../../entities/user.entity'
import { UserService } from '../user/user.service'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
    ) {}

    async register(dto: RegisterDto) {
        const existing = await this.userService.findByUsername(dto.username)
        if (existing) {
            throw new ConflictException('用户名已存在')
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10)
        const user = await this.userService.create(dto.username, hashedPassword)

        return this.buildAuthResponse(user)
    }

    async validateUser(username: string, password: string) {
        const user = await this.userService.findByUsername(username)
        if (!user) {
            return null
        }

        const matched = await bcrypt.compare(password, user.password)
        if (!matched) {
            return null
        }

        return user
    }

    async login(user: UserEntity) {
        return this.buildAuthResponse(user)
    }

    private buildAuthResponse(user: UserEntity) {
        const token = this.jwtService.sign({ sub: user.id, username: user.username })
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                createdAt: user.createdAt.toISOString(),
            },
        }
    }
}
