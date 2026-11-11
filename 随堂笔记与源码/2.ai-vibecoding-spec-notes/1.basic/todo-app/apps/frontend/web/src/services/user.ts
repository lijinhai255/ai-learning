import type { AuthResponse, LoginPayload, RegisterPayload } from '../types/api'
import { http } from './http'

export function login(payload: LoginPayload) {
    return http.post<AuthResponse>('/auth/login', payload).then(res => res.data)
}

export function register(payload: RegisterPayload) {
    return http.post<AuthResponse>('/auth/register', payload).then(res => res.data)
}
