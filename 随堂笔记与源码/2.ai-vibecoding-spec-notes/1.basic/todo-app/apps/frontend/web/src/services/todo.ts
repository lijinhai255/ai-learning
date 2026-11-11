import type { CreateTodoInput, Todo, UpdateTodoInput } from '../types/api'
import { http } from './http'

export function fetchTodos() {
    return http.get<Todo[]>('/todos').then(res => res.data)
}

export function createTodo(input: CreateTodoInput) {
    return http.post<Todo>('/todos', input).then(res => res.data)
}

export function updateTodo(id: string, input: UpdateTodoInput) {
    return http.patch<Todo>(`/todos/${id}`, input).then(res => res.data)
}

export function deleteTodo(id: string) {
    return http.delete<{ id: string }>(`/todos/${id}`).then(res => res.data)
}
