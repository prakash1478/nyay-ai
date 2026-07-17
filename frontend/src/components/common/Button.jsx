import React from 'react'
import { Loader2 } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

const VARIANTS = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  gold: 'btn-gold',
  ghost: 'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-ink-600 dark:text-parchment-300 hover:bg-ink-900/5 dark:hover:bg-parchment-100/10 transition-colors',
}

export default function Button({
  children,
  variant = 'primary',
  isLoading = false,
  icon: Icon,
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={classNames(VARIANTS[variant], className)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        Icon && <Icon className="w-4 h-4" />
      )}
      {children}
    </button>
  )
}
