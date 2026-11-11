import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { RegisterDto } from './dto/register.dto'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto)
    }

    @Post('login')
    @UseGuards(AuthGuard('local'))
    login(@Request() req) {
        return this.authService.login(req.user)
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    me(@Request() req) {
        return req.user
    }
}
