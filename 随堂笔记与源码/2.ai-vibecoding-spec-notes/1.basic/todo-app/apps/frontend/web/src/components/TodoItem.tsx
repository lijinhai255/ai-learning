import { Button, Checkbox } from '@todo-app/react'

import type { Todo } from '../types/api'

interface TodoItemProps {
    todo: Todo
    onToggle: (completed: boolean) => void
    onDelete: () => void
}

export default function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <li className={`todo-item ${todo.completed ? 'todo-item-completed' : ''}`}>
            <Checkbox checked={todo.completed} onChange={e => onToggle(e.target.checked)} />
            <span className="todo-item-title">{todo.title}</span>
            <Button variant="danger" onClick={onDelete}>
                删除
            </Button>
        </li>
    )
}
