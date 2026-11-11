import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

interface AuthRouteProps {
    children: ReactNode
}

export default function AuthRoute({ children }: AuthRouteProps) {
    const { token } = useAuth()

    if (!token) {
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
}
