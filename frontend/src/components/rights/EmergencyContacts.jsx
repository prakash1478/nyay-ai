import React from 'react'
import { Phone } from 'lucide-react'

export default function EmergencyContacts({ contacts = [] }) {
  return (
    <ul className="space-y-2.5">
      {contacts.map((contact) => (
        <li
          key={contact.label}
          className="flex items-center justify-between gap-3 rounded-lg border border-crimson-500/20 bg-crimson-500/5 px-3.5 py-2.5"
        >
          <span className="flex items-center gap-2 text-sm text-ink-700 dark:text-parchment-200">
            <Phone className="w-3.5 h-3.5 text-crimson-600 dark:text-crimson-400" />
            {contact.label}
          </span>
          <span className="text-sm font-mono font-semibold text-crimson-700 dark:text-crimson-400">
            {contact.number}
          </span>
        </li>
      ))}
    </ul>
  )
}
