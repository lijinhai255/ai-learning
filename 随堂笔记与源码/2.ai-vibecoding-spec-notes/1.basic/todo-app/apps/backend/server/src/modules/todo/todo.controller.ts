import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { CreateTodoDto } from './dto/create-todo.dto'
import { UpdateTodoDto } from './dto/update-todo.dto'
import { TodoService } from './todo.service'

@ApiTags('todos')
@Controller('todos')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth()
export class TodoController {
    constructor(private readonly todoService: TodoService) {}

    @Get()
    findAll(@Request() req) {
        return this.todoService.findAll(req.user.id)
    }

    @Post()
    create(@Request() req, @Body() dto: CreateTodoDto) {
        return this.todoService.create(req.user.id, dto)
    }

    @Patch(':id')
    update(@Request() req, @Param('id') id: string, @Body() dto: UpdateTodoDto) {
        return this.todoService.update(req.user.id, id, dto)
    }

    @Delete(':id')
    remove(@Request() req, @Param('id') id: string) {
        return this.todoService.remove(req.user.id, id)
    }
}
