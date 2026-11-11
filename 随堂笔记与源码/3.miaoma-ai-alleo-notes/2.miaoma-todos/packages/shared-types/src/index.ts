export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'archived';
export type TaskPriority = 'none' | 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  description?: string;
  dueAt?: string;
  projectId?: string;
  tagIds?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Project {
  id: string;
  name: string;
  color?: string;
  taskCount: number;
  completedTaskCount: number;
  createdAt: string;
  updatedAt: string;
}
