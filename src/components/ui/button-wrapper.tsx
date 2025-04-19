import React from 'react';
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

// Types that match Ant Design's Button props for easier migration
type ButtonType = 'primary' | 'default' | 'dashed' | 'link' | 'text';
type ButtonSize = 'large' | 'middle' | 'small';
type ButtonShape = 'default' | 'circle' | 'round';
type ButtonHTMLType = 'submit' | 'button' | 'reset';

interface ButtonProps {
    type?: ButtonType;
    size?: ButtonSize;
    shape?: ButtonShape;
    icon?: React.ReactNode;
    loading?: boolean;
    disabled?: boolean;
    danger?: boolean;
    ghost?: boolean;
    block?: boolean;
    className?: string;
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    htmlType?: ButtonHTMLType;
    children?: React.ReactNode;
}

export function Button({
    type = 'default',
    size = 'middle',
    shape = 'default',
    icon,
    loading = false,
    disabled = false,
    danger = false,
    ghost = false,
    block = false,
    className = '',
    onClick,
    htmlType = 'button',
    children,
    ...props
}: ButtonProps) {
    // Map Ant Design sizes to shadcn classes
    const sizeClasses = {
        large: 'cursor-pointer h-11 px-8 text-lg',
        middle: 'cursor-pointer h-9 px-4',
        small: 'cursor-pointer h-7 px-3 text-sm',
    };

    // Map Ant Design types to shadcn variants
    const variantClasses = {
        primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
        default: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        dashed: 'border-dashed border-2 border-input bg-background hover:bg-accent hover:text-accent-foreground',
        link: 'bg-slate-800 hover:bg-slate-800 text-primary underline-offset-4 hover:underline',
        text: 'hover:bg-accent hover:text-accent-foreground',
    };

    // Shape classes
    const shapeClasses = {
        default: 'rounded-md',
        circle: 'rounded-full aspect-square p-0',
        round: 'rounded-full',
    };

    return (
        <ShadcnButton
            type={htmlType}
            disabled={disabled || loading}
            onClick={onClick}
            className={cn(
                sizeClasses[size],
                variantClasses[type],
                shapeClasses[shape],
                {
                    'w-full': block,
                    'border-destructive text-destructive hover:bg-destructive/90 hover:text-destructive-foreground': danger,
                    'border-2 bg-transparent': ghost,
                    'pointer-events-none': loading,
                },
                className
            )}
            {...props}
        >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {!loading && icon && <span className="mr-2">{icon}</span>}
            {children}
        </ShadcnButton>
    );
} 