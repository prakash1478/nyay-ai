import React, { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { classNames } from '../../utils/helpers.js'

const Input = forwardRef(({ label, error, type = 'text', className = '', ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const resolvedType = isPassword && showPassword ? 'text' : type

  return (
    <div className="w-full">
      {label && <label className="label-field">{label}</label>}
      <div className="relative">
        <input
          ref={ref}
          type={resolvedType}
          className={classNames(
            'input-field',
            error && 'border-crimson-500 focus:border-crimson-500 focus:ring-crimson-500/20',
            isPassword && 'pr-11',
            className
          )}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 dark:hover:text-parchment-100"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-crimson-600 dark:text-crimson-400">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
