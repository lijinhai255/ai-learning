import type { Task } from '@miaoma/shared-types';

export interface TodoListProps {
  tasks: Task[];
}

export function TodoList({ tasks }: TodoListProps) {
  if (tasks.length === 0) {
    return <p style={{ color: '#64748b', margin: 0 }}>今天还没有任务，先休息一下吧。</p>;
  }

  return (
    <ul style={{ display: 'grid', gap: 12, listStyle: 'none', margin: 0, padding: 0 }}>
      {tasks.map((task) => (
        <li
          key={task.id}
          style={{
            alignItems: 'center',
            border: '1px solid #e5e7eb',
            borderRadius: 14,
            display: 'flex',
            gap: 12,
            padding: '14px 16px',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              border: '1.5px solid #94a3b8',
              borderRadius: 999,
              display: 'inline-block',
              height: 18,
              width: 18,
            }}
          />
          <span style={{ color: '#18212f', flex: 1 }}>{task.title}</span>
          {task.priority !== 'none' && (
            <span style={{ color: task.priority === 'high' ? '#dc2626' : '#64748b', fontSize: 12 }}>
              {task.priority === 'high' ? '高优先级' : task.priority === 'medium' ? '中优先级' : '低优先级'}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
