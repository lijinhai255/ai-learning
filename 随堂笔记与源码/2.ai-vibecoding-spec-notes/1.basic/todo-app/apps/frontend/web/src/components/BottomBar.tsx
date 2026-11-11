import { ArrowRight, CalendarDays, Plus, Search, SquarePlus } from 'lucide-react'

interface BottomBarProps {
    onAddTask: () => void
}

export default function BottomBar({ onAddTask }: BottomBarProps) {
    return (
        <footer className="bottom-bar">
            <button className="bottom-bar-action" onClick={onAddTask} aria-label="添加任务">
                <Plus size={18} color="#727880" />
            </button>
            <SquarePlus size={20} color="#727880" />
            <CalendarDays size={18} color="#A8ADB4" />
            <ArrowRight size={20} color="#A8ADB4" />
            <Search size={19} color="#636970" />
        </footer>
    )
}
