import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { LogOut, MoreHorizontal } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomBar from '../../components/BottomBar'
import FilterPills, { type FilterKey } from '../../components/FilterPills'
import ProgressRing from '../../components/ProgressRing'
import Sidebar, { type TodoListKey } from '../../components/Sidebar'
import TaskSection from '../../components/TaskSection'
import { useAuth } from '../../hooks/useAuth'
import { createTodo, deleteTodo, fetchTodos, updateTodo } from '../../services/todo'
import type { UpdateTodoInput } from '../../types/api'

const LIST_TITLES: Record<TodoListKey, string> = {
    inbox: 'Inbox',
    today: 'Today',
    upcoming: 'Upcoming',
    anytime: 'Anytime',
    someday: 'Someday',
    logbook: 'Logbook',
}

export default function TodoList() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    const [active, setActive] = useState<TodoListKey>('today')
    const [filter, setFilter] = useState<FilterKey>('all')
    const [adding, setAdding] = useState(false)
    const [newTitle, setNewTitle] = useState('')

    const {
        data: todos = [],
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos,
    })

    const invalidate = () => queryClient.invalidateQueries({ queryKey: ['todos'] })

    const createMutation = useMutation({
        mutationFn: createTodo,
        onSuccess: invalidate,
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, input }: { id: string; input: UpdateTodoInput }) => updateTodo(id, input),
        onSuccess: invalidate,
    })

    const deleteMutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: invalidate,
    })

    const completedCount = todos.filter(todo => todo.completed).length
    const inboxCount = todos.length
    const todayCount = todos.length - completedCount

    const baseTodos = todos.filter(todo => {
        if (active === 'today') {
            return !todo.completed
        }
        if (active === 'logbook') {
            return todo.completed
        }
        return true
    })

    const visibleTodos = baseTodos.filter(todo => {
        if (filter === 'important') {
            return todo.important
        }
        if (filter === 'done') {
            return todo.completed
        }
        return true
    })

    const todayTodos = visibleTodos.filter(todo => !todo.completed)
    const nextUpTodos = visibleTodos.filter(todo => todo.completed)
    const progressPercent = todos.length === 0 ? 0 : completedCount / todos.length

    function handleSubmitAdd(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const title = newTitle.trim()
        if (!title) {
            return
        }
        createMutation.mutate({ title })
        setNewTitle('')
        setAdding(false)
    }

    function handleLogout() {
        logout()
        navigate('/login', { replace: true })
    }

    const subtitle =
        todos.length === 0 ? '暂无任务，点击底部 + 添加第一条任务' : `已完成 ${completedCount} / ${todos.length}，剩余 ${todayCount} 项`

    return (
        <div className="app-shell">
            <Sidebar active={active} inboxCount={inboxCount} todayCount={todayCount} onSelect={setActive} />
            <main className="main-panel">
                <header className="main-header">
                    <div className="main-title-row">
                        <ProgressRing percent={progressPercent} />
                        <h1 className="main-title">{LIST_TITLES[active]}</h1>
                        <span className="main-spacer" />
                        <MoreHorizontal size={18} color="#8C929A" />
                        <button
                            className="main-logout"
                            onClick={handleLogout}
                            aria-label="退出登录"
                            title={`${user?.username ?? ''}，退出登录`}
                        >
                            <LogOut size={16} color="#8C929A" />
                        </button>
                    </div>
                    <p className="main-subtitle">{subtitle}</p>
                </header>

                <FilterPills value={filter} onChange={setFilter} />

                <div className="task-sections">
                    {isLoading && <p className="task-empty">加载中...</p>}
                    {isError && <p className="task-empty">加载失败，请重试</p>}
                    {!isLoading && !isError && (
                        <>
                            <TaskSection
                                title="Today"
                                todos={todayTodos}
                                onToggle={todo => updateMutation.mutate({ id: todo.id, input: { completed: !todo.completed } })}
                                onToggleImportant={todo => updateMutation.mutate({ id: todo.id, input: { important: !todo.important } })}
                                onDelete={id => deleteMutation.mutate(id)}
                                headerExtra={
                                    adding ? (
                                        <form className="task-add-form" onSubmit={handleSubmitAdd}>
                                            <span className="task-add-check" />
                                            <input
                                                className="task-add-input"
                                                value={newTitle}
                                                onChange={e => setNewTitle(e.target.value)}
                                                placeholder="添加任务..."
                                                autoFocus
                                            />
                                            <button type="submit" className="task-add-submit">
                                                添加
                                            </button>
                                        </form>
                                    ) : undefined
                                }
                            />
                            <TaskSection
                                title="Next up"
                                todos={nextUpTodos}
                                onToggle={todo => updateMutation.mutate({ id: todo.id, input: { completed: !todo.completed } })}
                                onToggleImportant={todo => updateMutation.mutate({ id: todo.id, input: { important: !todo.important } })}
                                onDelete={id => deleteMutation.mutate(id)}
                            />
                            {visibleTodos.length === 0 && !adding && <p className="task-empty">暂无任务</p>}
                        </>
                    )}
                </div>

                <BottomBar onAddTask={() => setAdding(value => !value)} />
            </main>
        </div>
    )
}
