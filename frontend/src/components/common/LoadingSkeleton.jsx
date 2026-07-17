import React from 'react'
import { classNames } from '../../utils/helpers.js'

export function SkeletonLine({ className = '' }) {
  return (
    <div
      className={classNames(
        'animate-pulse rounded-md bg-ink-900/8 dark:bg-parchment-100/10',
        className
      )}
    />
  )
}

export default function LoadingSkeleton({ rows = 3, className = '' }) {
  return (
    <div className={classNames('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonLine key={i} className={i === rows - 1 ? 'h-4 w-2/3' : 'h-4 w-full'} />
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="card p-6 space-y-4">
      <SkeletonLine className="h-5 w-1/3" />
      <LoadingSkeleton rows={3} />
    </div>
  )
}
