import { Button, Input } from '@todo-app/react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { getErrorMessage } from '../../utils/errors'

export default function Register() {
    const navigate = useNavigate()
    const { register } = useAuth()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setError('')
        if (password !== confirmPassword) {
            setError('两次输入的密码不一致')
            return
        }
        setLoading(true)
        try {
            await register({ username, password })
            navigate('/', { replace: true })
        } catch (err) {
            setError(getErrorMessage(err, '注册失败'))
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1 className="auth-title">注册</h1>
                <form className="auth-form" onSubmit={handleSubmit}>
                    <Input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="用户名（3-20 位字母、数字或下划线）"
                        autoComplete="username"
                        required
                    />
                    <Input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="密码（至少 6 位）"
                        autoComplete="new-password"
                        required
                    />
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="确认密码"
                        autoComplete="new-password"
                        required
                    />
                    {error && <p className="auth-error">{error}</p>}
                    <Button type="submit" disabled={loading}>
                        {loading ? '注册中...' : '注册'}
                    </Button>
                </form>
                <p className="auth-footer">
                    已有账号？<Link to="/login">去登录</Link>
                </p>
            </div>
        </div>
    )
}
