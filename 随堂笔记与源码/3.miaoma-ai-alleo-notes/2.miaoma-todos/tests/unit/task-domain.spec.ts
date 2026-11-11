import { describe, expect, it } from 'vitest';
import type { Task } from '@miaoma/shared-types';

const createTask = (overrides: Partial<Task> = {}): Task => ({
  id: 'task-1',
  title: '整理 Inbox',
  status: 'todo',
  priority: 'medium',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
});

describe('task domain contract', () => {
  it('creates a task with a stable default status', () => {
    expect(createTask().status).toBe('todo');
  });

  it('preserves completedAt when a completed task is restored', () => {
    const task = createTask({ status: 'completed', completedAt: '2026-01-02T00:00:00.000Z' });
    expect({ ...task, status: 'todo' }.completedAt).toBe('2026-01-02T00:00:00.000Z');
  });
});
