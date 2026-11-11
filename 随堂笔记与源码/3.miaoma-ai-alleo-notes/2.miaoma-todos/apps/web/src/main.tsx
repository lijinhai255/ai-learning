import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { TodoList } from '@miaoma/ui';
import type { Task } from '@miaoma/shared-types';
import './styles.css';

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: '梳理 Miaoma Todo 产品需求',
    status: 'in_progress',
    priority: 'high',
    dueAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    title: '准备今日专注时段',
    status: 'todo',
    priority: 'medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">MIAOMA TODO</p>
          <h1>今天</h1>
        </div>
        <button className="primary-button" type="button">+ 新建任务</button>
      </header>
      <section className="content-card" aria-label="今日任务">
        <TodoList tasks={initialTasks} />
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
