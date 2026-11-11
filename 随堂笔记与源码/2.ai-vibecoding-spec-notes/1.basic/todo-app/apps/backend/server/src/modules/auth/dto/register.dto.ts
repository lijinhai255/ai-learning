import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length, Matches } from 'class-validator'

export class RegisterDto {
    @ApiProperty({ example: 'heyi', description: '用户名' })
    @IsString()
    @Length(3, 20)
    @Matches(/^[a-zA-Z0-9_]+$/, { message: 'username 只能包含字母、数字与下划线' })
    username: string

    @ApiProperty({ example: '123456', description: '密码' })
    @IsString()
    @Length(6, 64)
    password: string
}
