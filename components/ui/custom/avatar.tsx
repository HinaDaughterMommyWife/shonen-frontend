'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

type AvatarProps = {
    src?: string
    alt?: string
    size?: number
    fallback?: React.ReactNode
    className?: string
}

export function Avatar({
    src,
    alt = 'Avatar',
    size = 40,
    fallback,
    className,
}: AvatarProps) {
    return (
        <div
            className={cn(
                'relative inline-block overflow-hidden rounded-full bg-muted',
                className
            )}
            style={{ width: size, height: size }}
        >
            {src ? (
                <Image
                    src={src}
                    alt={alt}
                    width={size}
                    height={size}
                    quality={100}
                    className="object-cover w-full h-full"
                    loading="lazy"
                />
            ) : (
                <div className="flex items-center justify-center w-full h-full text-sm text-muted-foreground">
                    {fallback ?? <span>👤</span>}
                </div>
            )}
        </div>
    )
}
