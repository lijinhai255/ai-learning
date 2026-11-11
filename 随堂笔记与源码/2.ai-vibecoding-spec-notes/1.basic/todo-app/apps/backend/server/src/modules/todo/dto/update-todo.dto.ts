import { ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator'

export class UpdateTodoDto {
    @ApiPropertyOptional({ example: '学习 Spec Coding 与 Loop Engineering', description: '任务标题' })
    @IsOptional()
    @IsString()
    @Length(1, 200)
    title?: string

    @ApiPropertyOptional({ example: true, description: '是否完成' })
    @IsOptional()
    @IsBoolean()
    completed?: boolean

    @ApiPropertyOptional({ example: true, description: '是否重要（星标）' })
    @IsOptional()
    @IsBoolean()
    important?: boolean
}
