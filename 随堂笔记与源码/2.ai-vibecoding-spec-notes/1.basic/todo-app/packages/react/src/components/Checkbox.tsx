import type { InputHTMLAttributes } from 'react'

type CheckboxProps = InputHTMLAttributes<HTMLInputElement>

export function Checkbox({ className = '', ...rest }: CheckboxProps) {
    return <input type="checkbox" className={`todo-checkbox ${className}`} {...rest} />
}
