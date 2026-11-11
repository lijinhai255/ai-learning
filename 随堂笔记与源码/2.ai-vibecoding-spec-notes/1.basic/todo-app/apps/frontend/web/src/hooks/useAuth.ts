import { useCallback, useState } from 'react'

import { login as loginRequest, register as registerRequest } from '../services/user'
import type { AuthResponse, LoginPayload, RegisterPayload, User } from '../types/api'

const TOKEN_KEY = 'todo-app-token'
const USER_KEY = 'todo-app-user'

function readToken(): string | null {
    return localStorage.getItem(TOKEN_KEY)
}

function readUser(): User | null {
    const raw = localStorage.getItem(USER_KEY)
    if (!raw) {
        return null
    }
    try {
        return JSON.parse(raw) as User
    } catch {
        return null
    }
}

export function useAuth() {
    const [token, setToken] = useState<string | null>(readToken)
    const [user, setUser] = useState<User | null>(readUser)

    const saveSession = useCallback((data: AuthResponse) => {
        localStorage.setItem(TOKEN_KEY, data.token)
        localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        setToken(data.token)
        setUser(data.user)
    }, [])

    const login = useCallback(
        async (payload: LoginPayload) => {
            const data = await loginRequest(payload)
            saveSession(data)
        },
        [saveSession]
    )

    const register = useCallback(
        async (payload: RegisterPayload) => {
            const data = await registerRequest(payload)
            saveSession(data)
        },
        [saveSession]
    )

    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
        setToken(null)
        setUser(null)
    }, [])

    return { token, user, login, register, logout }
}
