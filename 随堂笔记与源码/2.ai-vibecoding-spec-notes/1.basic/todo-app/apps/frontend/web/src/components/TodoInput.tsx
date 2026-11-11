import { Button, Input } from '@todo-app/react'
import type { FormEvent } from 'react'
import { useState } from 'react'

interface TodoInputProps {
    onSubmit: (title: string) => void
    loading?: boolean
}

export default function TodoInput({ onSubmit, loading = false }: TodoInputProps) {
    const [title, setTitle] = useState('')

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const trimmed = title.trim()
        if (!trimmed) {
            return
        }
        onSubmit(trimmed)
        setTitle('')
    }

    return (
        <form className="todo-input-form" onSubmit={handleSubmit}>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="添加新的任务..." disabled={loading} />
            <Button type="submit" disabled={loading}>
                {loading ? '添加中...' : '添加'}
            </Button>
        </form>
    )
}
