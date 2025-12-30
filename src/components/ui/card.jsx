import { cn } from '@/lib/utils'

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-800 bg-slate-900 p-6 shadow-sm',
        className
      )}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }) {
  return (
    <div
      className={cn('mb-4 flex items-center justify-between', className)}
      {...props}
    />
  )
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn('text-sm font-medium text-slate-400', className)}
      {...props}
    />
  )
}

export function CardContent({ className, ...props }) {
  return (
    <div
      className={cn('text-2xl font-semibold', className)}
      {...props}
    />
  )
}