import { ApiProperty } from '@nestjs/swagger'
import { IsString, Length } from 'class-validator'

export class CreateTodoDto {
    @ApiProperty({ example: '学习 Spec Coding', description: '任务标题' })
    @IsString()
    @Length(1, 200)
    title: string
}
