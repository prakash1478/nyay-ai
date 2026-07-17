export function formatBytes(bytes, decimals = 1) {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join('')
}

export function formatTime(date = new Date()) {
  return new Intl.DateTimeFormat('en-IN', { hour: '2-digit', minute: '2-digit' }).format(date)
}

export function truncate(text, length = 32) {
  if (!text) return ''
  return text.length > length ? `${text.slice(0, length)}…` : text
}

export function riskLevelMeta(score) {
  if (score >= 70) return { label: 'High Risk', color: 'crimson' }
  if (score >= 40) return { label: 'Moderate Risk', color: 'brass' }
  return { label: 'Low Risk', color: 'emerald' }
}
