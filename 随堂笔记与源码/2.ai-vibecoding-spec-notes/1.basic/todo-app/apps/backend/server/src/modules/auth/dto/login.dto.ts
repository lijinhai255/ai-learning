import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class LoginDto {
    @ApiProperty({ example: 'heyi', description: '用户名' })
    @IsString()
    @Length(3, 20)
    username: string

    @ApiProperty({ example: '123456', description: '密码' })
    @IsString()
    @Length(6, 64)
    password: string
}
