import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TodoList } from '@miaoma/ui';
import type { Task } from '@miaoma/shared-types';
import './renderer.css';

const tasks: Task[] = [
  {
    id: 'desktop-task-1',
    title: '欢迎使用 Miaoma Todo 桌面端',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function App() {
  return (
    <main className="desktop-shell">
      <p className="desktop-kicker">MIAOMA TODO · DESKTOP</p>
      <h1>今日任务</h1>
      <TodoList tasks={tasks} />
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
