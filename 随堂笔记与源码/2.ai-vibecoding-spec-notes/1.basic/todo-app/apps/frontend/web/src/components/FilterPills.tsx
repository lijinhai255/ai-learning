export type FilterKey = 'all' | 'important' | 'done'

interface FilterPillsProps {
    value: FilterKey
    onChange: (value: FilterKey) => void
}

const FILTERS: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'important', label: 'Important' },
    { key: 'done', label: 'Done' },
]

export default function FilterPills({ value, onChange }: FilterPillsProps) {
    return (
        <div className="filter-pills">
            {FILTERS.map(item => (
                <button
                    key={item.key}
                    className={`filter-pill ${value === item.key ? 'filter-pill-active' : ''}`}
                    onClick={() => onChange(item.key)}
                >
                    {item.label}
                </button>
            ))}
        </div>
    )
}
