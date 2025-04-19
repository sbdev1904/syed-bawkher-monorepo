import React from 'react'
import { cn } from '@/lib/utils'

interface SpinnerProps {
    className?: string
    size?: 'sm' | 'md' | 'lg'
    container?: boolean
}

const Spinner = ({ className, size = 'md', container = false }: SpinnerProps) => {
    const sizeClass = {
        sm: 'h-4 w-4',
        md: 'h-6 w-6',
        lg: 'h-8 w-8'
    }

    const spinner = (
        <div
            className={cn(
                'inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]',
                sizeClass[size],
                className
            )}
            role="status"
        >
            <span className="sr-only">Loading...</span>
        </div>
    )

    if (container) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                {spinner}
            </div>
        )
    }

    return spinner
}

export { Spinner } 