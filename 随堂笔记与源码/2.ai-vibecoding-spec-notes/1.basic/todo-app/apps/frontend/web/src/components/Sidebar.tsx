import { Archive, BookOpenCheck, Box, CalendarDays, Circle, Inbox, Layers, Plus, SlidersHorizontal, Star } from 'lucide-react'
import type { ReactNode } from 'react'

export type TodoListKey = 'inbox' | 'today' | 'upcoming' | 'anytime' | 'someday' | 'logbook'

interface SidebarProps {
    active: TodoListKey
    inboxCount: number
    todayCount: number
    onSelect: (key: TodoListKey) => void
}

interface SmartList {
    key: TodoListKey
    label: string
    icon: ReactNode
    count?: number
}

const SMART_LISTS: SmartList[] = [
    { key: 'inbox', label: 'Inbox', icon: <Inbox size={16} color="#4C9CF5" /> },
    { key: 'today', label: 'Today', icon: <Star size={16} color="#FFCA05" /> },
    { key: 'upcoming', label: 'Upcoming', icon: <CalendarDays size={16} color="#FF4D78" /> },
    { key: 'anytime', label: 'Anytime', icon: <Layers size={16} color="#35B887" /> },
    { key: 'someday', label: 'Someday', icon: <Archive size={16} color="#A6C66D" /> },
    { key: 'logbook', label: 'Logbook', icon: <BookOpenCheck size={16} color="#45B97C" /> },
]

const GROUPS: { label: string; icon: ReactNode; items: string[] }[] = [
    {
        label: 'Family',
        icon: <Box size={16} color="#B3BAC2" />,
        items: ['Vacation in Rome', 'Buy a New Car', 'Throw Party for Eve'],
    },
    {
        label: 'Work',
        icon: <Box size={16} color="#B3BAC2" />,
        items: ['Plan the launch', 'Onboard James', 'Attend Conference'],
    },
    {
        label: 'Hobbies',
        icon: <Box size={16} color="#B3BAC2" />,
        items: ['Run a Marathon', 'Learn Basic Italian'],
    },
]

export default function Sidebar({ active, inboxCount, todayCount, onSelect }: SidebarProps) {
    return (
        <aside className="sidebar">
            <div className="sidebar-window-controls">
                <span className="window-dot window-dot-red" />
                <span className="window-dot window-dot-yellow" />
                <span className="window-dot window-dot-green" />
            </div>

            <nav className="sidebar-lists">
                {SMART_LISTS.map((list, index) => {
                    const count = list.key === 'inbox' ? inboxCount : list.key === 'today' ? todayCount : list.count
                    return (
                        <button
                            key={list.key}
                            className={`sidebar-item ${active === list.key ? 'sidebar-item-active' : ''} ${index >= 5 ? 'sidebar-item-bold' : ''}`}
                            onClick={() => onSelect(list.key)}
                        >
                            {list.icon}
                            <span className="sidebar-item-label">{list.label}</span>
                            {count !== undefined && <span className="sidebar-item-count">{count}</span>}
                        </button>
                    )
                })}
            </nav>

            <div className="sidebar-groups">
                {GROUPS.map(group => (
                    <div key={group.label} className="sidebar-group">
                        <div className="sidebar-group-header">
                            {group.icon}
                            <span className="sidebar-item-label">{group.label}</span>
                        </div>
                        <div className="sidebar-group-items">
                            {group.items.map(item => (
                                <div key={item} className="sidebar-item sidebar-item-group">
                                    <Circle size={16} color="#AAB1BA" />
                                    <span className="sidebar-item-label">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="sidebar-item">
                    <Plus size={16} color="#4A4F55" />
                    <span className="sidebar-item-label">New List</span>
                </div>
                <SlidersHorizontal size={16} color="#6D737B" />
            </div>
        </aside>
    )
}
