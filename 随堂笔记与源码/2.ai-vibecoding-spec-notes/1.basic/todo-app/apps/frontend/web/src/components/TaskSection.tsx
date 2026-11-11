import { MoreHorizontal } from 'lucide-react'
import type { ReactNode } from 'react'

import type { Todo } from '../types/api'
import TaskItem from './TaskItem'

interface TaskSectionProps {
    title: string
    todos: Todo[]
    onToggle: (todo: Todo) => void
    onToggleImportant: (todo: Todo) => void
    onDelete: (id: string) => void
    headerExtra?: ReactNode
}

export default function TaskSection({ title, todos, onToggle, onToggleImportant, onDelete, headerExtra }: TaskSectionProps) {
    if (todos.length === 0 && !headerExtra) {
        return null
    }

    return (
        <section className="task-section">
            <header className="task-section-header">
                <h2 className="task-section-title">{title}</h2>
                <MoreHorizontal size={16} color="#0A69C9" />
            </header>
            {headerExtra}
            <ul className="task-list">
                {todos.map(todo => (
                    <TaskItem
                        key={todo.id}
                        todo={todo}
                        onToggle={() => onToggle(todo)}
                        onToggleImportant={() => onToggleImportant(todo)}
                        onDelete={() => onDelete(todo.id)}
                    />
                ))}
            </ul>
        </section>
    )
}
