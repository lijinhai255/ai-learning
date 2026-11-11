import { Button, Input } from '@todo-app/react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/errors'

export default function Login() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        setLoading(true)
        try {
            await login({ username, password })
            navigate('/', { replace: true })
        } catch (err) {
            setError(getErrorMessage(err, '登录失败'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">登录</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <Input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="用户名"
                        autoComplete="username"
                        required
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="密码"
                        autoComplete="current-password"
                        required
                    />
                    {error && <p className="auth-error">{error}</p>}
                    <Button type="submit" disabled={loading}>
                        {loading ? '登录中...' : '登录'}
                    </Button>
                </form>
                <p className="auth-footer">
                    还没有账号？<Link to="/register">去注册</Link>
                </p>
            </div>
        </div>
    )
}
