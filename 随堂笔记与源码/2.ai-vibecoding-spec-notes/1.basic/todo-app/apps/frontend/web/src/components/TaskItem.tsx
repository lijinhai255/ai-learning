import { Check, Star, X } from 'lucide-react'

import type { Todo } from '../types/api'

interface TaskItemProps {
    todo: Todo
    onToggle: () => void
    onToggleImportant: () => void
    onDelete: () => void
}

export default function TaskItem({ todo, onToggle, onToggleImportant, onDelete }: TaskItemProps) {
    return (
        <li className={`task-item ${todo.completed ? 'task-item-completed' : ''}`}>
            <button className="task-checkbox" onClick={onToggle} aria-label={todo.completed ? '标记为未完成' : '标记为完成'}>
                {todo.completed && <Check size={14} strokeWidth={3} color="#FFFFFF" />}
            </button>
            <span className="task-item-title">{todo.title}</span>
            <div className="task-item-actions">
                {todo.important && <span className="task-important-badge">Important</span>}
                <button
                    className={`task-star ${todo.important ? 'task-star-active' : ''}`}
                    onClick={onToggleImportant}
                    aria-label="标记为重要"
                >
                    <Star size={16} fill={todo.important ? '#FFC400' : 'none'} color={todo.important ? '#FFC400' : '#C2C7CE'} />
                </button>
                <button className="task-delete" onClick={onDelete} aria-label="删除任务">
                    <X size={16} />
                </button>
            </div>
        </li>
    )
}
