import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
// NestJS needs both constructors at runtime for validation and dependency injection metadata.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CreateTodoDto } from './create-todo.dto';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(@Inject(TodoService) private readonly todoService: TodoService) {}

  @Get()
  findAll() {
    return this.todoService.findAll();
  }

  @Post()
  create(@Body() dto: CreateTodoDto) {
    return this.todoService.create(dto);
  }

  @Patch(':id/toggle')
  toggle(@Param('id', ParseIntPipe) id: number) {
    return this.todoService.toggle(id);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    this.todoService.remove(id);
  }
}
