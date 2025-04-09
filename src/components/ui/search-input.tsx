import React from 'react'
import { Input } from './input'
import { Button } from './button'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchInputProps {
    placeholder?: string
    onSearch: (value: string) => void
    className?: string
    allowClear?: boolean
}

const SearchInput = ({
    placeholder = "Search",
    onSearch,
    className,
    allowClear = true
}: SearchInputProps) => {
    const [value, setValue] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(value)
    }

    const handleClear = () => {
        setValue('')
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    return (
        <form onSubmit={handleSubmit} className={cn("relative flex w-full", className)}>
            <Input
                ref={inputRef}
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="pr-20"
            />
            {allowClear && value && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-16 top-1/2 -translate-y-1/2 px-2"
                    onClick={handleClear}
                >
                    ×
                </Button>
            )}
            <Button type="submit" className="absolute right-0 top-0 h-full rounded-l-none">
                <Search className="h-4 w-4 mr-2" />
                Search
            </Button>
        </form>
    )
}

export { SearchInput } 