import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

const initialTodos: Todo[] = [
  { id: 1, title: '拆解产品需求', completed: true },
  { id: 2, title: '建立 React + Vue + NestJS 工程', completed: false },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [title, setTitle] = useState('');

  const remainingCount = useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);

  function addTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    setTodos((current) => [...current, { id: Date.now(), title: trimmedTitle, completed: false }]);
    setTitle('');
  }

  function toggleTodo(id: number) {
    setTodos((current) =>
      current.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)),
    );
  }

  function removeTodo(id: number) {
    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  return (
    <main className="todo-shell">
      <section className="todo-card" aria-labelledby="page-title">
        <p className="eyebrow">@todo/web-react</p>
        <h1 id="page-title">今日待办</h1>
        <p className="summary">还有 {remainingCount} 项任务待完成</p>

        <form className="todo-form" onSubmit={addTodo}>
          <label className="sr-only" htmlFor="new-todo">
            新待办
          </label>
          <input
            id="new-todo"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="添加一项待办..."
          />
          <button type="submit">添加</button>
        </form>

        <ul className="todo-list" aria-label="待办列表">
          {todos.map((todo) => (
            <li className="todo-row" key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? 'completed' : undefined}>{todo.title}</span>
              </label>
              <button className="delete-button" type="button" onClick={() => removeTodo(todo.id)}>
                删除
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
