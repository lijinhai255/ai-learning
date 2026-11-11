import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    variant?: 'primary' | 'ghost' | 'danger'
}

export function Button({ children, variant = 'primary', className = '', ...rest }: ButtonProps) {
    const variantClass = {
        primary: 'todo-button-primary',
        ghost: 'todo-button-ghost',
        danger: 'todo-button-danger',
    }[variant]

    return (
        <button className={`todo-button ${variantClass} ${className}`} {...rest}>
            {children}
        </button>
    )
}
