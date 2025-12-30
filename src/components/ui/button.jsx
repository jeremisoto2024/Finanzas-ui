import { cn } from '@/lib/utils'

export function Button({
  className,
  variant = 'default',
  ...props
}) {
  const variants = {
    default:
      'bg-emerald-500 text-slate-950 hover:bg-emerald-400',
    outline:
      'border border-slate-700 hover:bg-slate-800',
    ghost:
      'hover:bg-slate-800 text-slate-300'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors',
        variants[variant],
        className
      )}
      {...props}
    />
  )
}