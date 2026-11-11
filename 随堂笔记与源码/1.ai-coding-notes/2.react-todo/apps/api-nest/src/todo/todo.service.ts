import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateTodoDto } from './create-todo.dto';
import type { Todo } from './todo.types';

@Injectable()
export class TodoService {
  private readonly todos: Todo[] = [
    { id: 1, title: '拆解产品需求', completed: true },
    { id: 2, title: '建立 React + Vue + NestJS 工程', completed: false },
  ];

  findAll(): Todo[] {
    return this.todos;
  }

  create({ title }: CreateTodoDto): Todo {
    const todo = { id: Date.now(), title: title.trim(), completed: false };
    this.todos.push(todo);
    return todo;
  }

  toggle(id: number): Todo {
    const todo = this.todos.find((candidate) => candidate.id === id);
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    todo.completed = !todo.completed;
    return todo;
  }

  remove(id: number): void {
    const index = this.todos.findIndex((candidate) => candidate.id === id);
    if (index < 0) throw new NotFoundException(`Todo ${id} not found`);
    this.todos.splice(index, 1);
  }
}
