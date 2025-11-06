import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

const emptyMediaVariants = cva(
  'flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6",
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type EmptyProps = {
  title?: string
  description?: string | null
  className?: string
}

export function Empty({
  title = 'No results',
  description,
  className = '',
}: EmptyProps) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12',
        className,
      )}
    >
      <div
        data-slot="empty-icon"
        data-variant="default"
        className={cn(emptyMediaVariants({ variant: 'default' }))}
      />
      <div
        data-slot="empty-title"
        className={cn('text-lg font-medium tracking-tight')}
      >
        {title}
      </div>
      {description ? (
        <p className="text-sm text-muted-foreground max-w-prose">
          {description}
        </p>
      ) : null}
    </div>
  )
}
