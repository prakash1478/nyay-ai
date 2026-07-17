import React from 'react'
import { classNames } from '../../utils/helpers.js'

export default function Card({ children, className = '', as: Tag = 'div', ...props }) {
  return (
    <Tag className={classNames('card p-6', className)} {...props}>
      {children}
    </Tag>
  )
}
