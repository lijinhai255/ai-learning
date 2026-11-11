import { Controller, Get, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

@ApiTags('users')
@Controller('users')
export class UserController {
    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    @ApiBearerAuth()
    me(@Request() req) {
        const user = req.user
        return {
            id: user.id,
            username: user.username,
            createdAt: user.createdAt.toISOString(),
        }
    }
}
