import { describe, expect, it } from 'vitest';

import { createTodo, removeTodo, toggleTodo } from './todo';

describe('Todo 领域规则', () => {
  it('创建经过规范化且未完成的待办', () => {
    expect(createTodo({ id: 'todo-1', title: '  Write tests  ' })).toEqual({
      id: 'todo-1',
      title: 'Write tests',
      completed: false,
    });
  });

  it('拒绝空标题', () => {
    expect(() => createTodo({ id: 'todo-1', title: '   ' })).toThrow('Todo title is required');
  });

  it('切换完成状态时不修改原对象', () => {
    const todo = createTodo({ id: 'todo-1', title: 'Write tests' });

    expect(toggleTodo(todo)).toEqual({ ...todo, completed: true });
    expect(todo.completed).toBe(false);
  });

  it('只删除指定标识的待办', () => {
    const todos = [
      createTodo({ id: 'todo-1', title: 'Write tests' }),
      createTodo({ id: 'todo-2', title: 'Review tests' }),
    ];

    expect(removeTodo(todos, 'todo-1')).toEqual([todos[1]]);
  });
});
