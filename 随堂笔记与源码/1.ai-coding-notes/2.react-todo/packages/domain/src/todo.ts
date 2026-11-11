export interface Todo {
  readonly id: string;
  readonly title: string;
  readonly completed: boolean;
}

export interface CreateTodoInput {
  readonly id: string;
  readonly title: string;
}

/**
 * Creates a todo in the canonical domain shape.
 *
 * Validation lives here so UI adapters (React, Vue, or an API client) share
 * exactly the same invariant: a todo title must contain visible characters.
 */
export function createTodo({ id, title }: CreateTodoInput): Todo {
  const normalizedTitle = title.trim();

  if (!id.trim()) {
    throw new Error('Todo id is required');
  }

  if (!normalizedTitle) {
    throw new Error('Todo title is required');
  }

  return {
    id,
    title: normalizedTitle,
    completed: false,
  };
}

export function toggleTodo(todo: Todo): Todo {
  return { ...todo, completed: !todo.completed };
}

export function removeTodo(todos: readonly Todo[], id: string): Todo[] {
  return todos.filter((todo) => todo.id !== id);
}
