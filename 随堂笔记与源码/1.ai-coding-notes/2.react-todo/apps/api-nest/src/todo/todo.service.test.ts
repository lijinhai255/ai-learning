import { describe, expect, it } from 'vitest';
import { TodoService } from './todo.service';

describe('Todo 服务', () => {
  it('创建未完成的待办', () => {
    const service = new TodoService();
    const todo = service.create({ title: '  write tests  ' });

    expect(todo.title).toBe('write tests');
    expect(todo.completed).toBe(false);
  });
});
