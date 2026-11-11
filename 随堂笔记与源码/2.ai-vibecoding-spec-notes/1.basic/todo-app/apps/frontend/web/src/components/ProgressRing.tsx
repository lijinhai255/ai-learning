interface ProgressRingProps {
    percent: number
    size?: number
}

export default function ProgressRing({ percent, size = 27 }: ProgressRingProps) {
    const radius = (size - 6) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference * (1 - Math.min(Math.max(percent, 0), 1))
    const center = size / 2

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="todo-progress-ring">
            <circle cx={center} cy={center} r={radius} fill="none" stroke="#E3E6EA" strokeWidth="3" />
            <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke="#0A69C9"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                transform={`rotate(-90 ${center} ${center})`}
            />
        </svg>
    )
}
