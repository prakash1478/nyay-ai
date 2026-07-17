import React, { useState } from 'react'
import { MapPin, Navigation } from 'lucide-react'

const TYPE_MAP_DOT = {
  'NALSA': 'bg-emerald-500 border-emerald-300 dark:border-emerald-700 shadow-emerald-500/30',
  'Nyaya Bandhu': 'bg-brass-500 border-brass-300 dark:border-brass-700 shadow-brass-500/30',
  'Tele-Law': 'bg-crimson-500 border-crimson-300 dark:border-crimson-700 shadow-crimson-500/30',
  'Pro Bono': 'bg-ink-700 border-ink-400 dark:border-ink-500 shadow-ink-700/30',
}

function latLngToPercent(lat, lng) {
  const minLat = 6, maxLat = 36
  const minLng = 68, maxLng = 97
  const x = ((lng - minLng) / (maxLng - minLng)) * 100
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100
  return { x: Math.max(2, Math.min(98, x)), y: Math.max(2, Math.min(98, y)) }
}

export default function LegalAidMap({ centers, selectedId, onSelect }) {
  const [tooltipId, setTooltipId] = useState(null)

  return (
    <div className="card p-5 h-full">
      <div className="flex items-center gap-2 mb-4">
        <Navigation className="w-4 h-4 text-brass-500" />
        <h3 className="font-display text-sm font-semibold text-ink-900 dark:text-parchment-100">
          Legal Aid Map
        </h3>
        <span className="ml-auto text-[10px] text-ink-400 dark:text-parchment-500">
          {centers.length} centers
        </span>
      </div>

      <div className="relative w-full overflow-hidden rounded-xl bg-gradient-to-b from-parchment-300/60 to-parchment-200/60 dark:from-ink-800/80 dark:to-ink-900/80 border border-ink-900/10 dark:border-parchment-100/10" style={{ paddingBottom: '75%' }}>
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20 dark:opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
            <line x1="25" y1="0" x2="25" y2="100" stroke="currentColor" className="text-ink-300 dark:text-parchment-400" strokeWidth="0.3" />
            <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" className="text-ink-300 dark:text-parchment-400" strokeWidth="0.3" />
            <line x1="75" y1="0" x2="75" y2="100" stroke="currentColor" className="text-ink-300 dark:text-parchment-400" strokeWidth="0.3" />
            <line x1="0" y1="25" x2="100" y2="25" stroke="currentColor" className="text-ink-300 dark:text-parchment-400" strokeWidth="0.3" />
            <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" className="text-ink-300 dark:text-parchment-400" strokeWidth="0.3" />
            <line x1="0" y1="75" x2="100" y2="75" stroke="currentColor" className="text-ink-300 dark:text-parchment-400" strokeWidth="0.3" />
          </svg>

          {/* Simplified India outline (abstract polygon) */}
          <svg className="absolute inset-0 w-full h-full opacity-[0.15] dark:opacity-[0.08]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
            <polygon
              points="38,5 48,3 58,4 65,8 70,12 75,18 78,25 80,30 82,35 85,40 88,45 92,50 95,55 96,60 94,65 90,68 85,70 80,72 78,75 75,80 70,85 65,90 60,93 55,95 48,96 42,95 38,92 35,88 32,84 30,80 28,75 25,70 22,65 20,60 18,55 15,50 12,45 10,40 8,35 5,30 4,25 6,20 8,16 12,12 16,9 20,7 25,5 30,4"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0.5"
              strokeLinejoin="round"
              className="text-ink-400/40 dark:text-parchment-300/40"
            />
          </svg>

          {/* Compass rose */}
          <div className="absolute top-3 right-3 opacity-40 dark:opacity-30">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-ink-500 dark:text-parchment-400">
              <path d="M12 2L9 9L2 12L9 15L12 22L15 15L22 12L15 9Z" fill="currentColor" opacity="0.6" />
              <path d="M12 2L12 22M2 12L22 12" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
            </svg>
          </div>

          {/* Center label */}
          <div className="absolute bottom-3 left-3 text-[9px] font-mono text-ink-400 dark:text-parchment-500 opacity-50 uppercase tracking-widest">
            India
          </div>
        </div>

        {/* Map pins */}
        {centers.map((center) => {
          const pos = latLngToPercent(center.lat, center.lng)
          const isSelected = center.id === selectedId
          const dotColor = TYPE_MAP_DOT[center.type] || TYPE_MAP_DOT['NALSA']

          return (
            <div key={center.id} className="absolute" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
              {/* Pulse ring for selected */}
              {isSelected && (
                <div className="absolute -inset-2 rounded-full animate-ping opacity-30 bg-brass-500" />
              )}

              {/* Dot */}
              <button
                className={`relative w-3.5 h-3.5 rounded-full border-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-150 hover:z-10 ${dotColor} ${
                  isSelected ? 'scale-150 z-10 ring-2 ring-brass-400 ring-offset-2 ring-offset-parchment-200 dark:ring-offset-ink-900' : ''
                }`}
                onClick={() => onSelect(center.id)}
                onMouseEnter={() => setTooltipId(center.id)}
                onMouseLeave={() => setTooltipId(null)}
                title={center.name}
              />

              {/* Tooltip */}
              {(tooltipId === center.id || isSelected) && (
                <div
                  className="absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none"
                  style={{ minWidth: '140px' }}
                >
                  <div className="bg-white dark:bg-ink-800 rounded-lg shadow-card dark:shadow-card-dark border border-ink-900/10 dark:border-parchment-100/10 p-2.5 text-center">
                    <p className="text-[11px] font-semibold text-ink-900 dark:text-parchment-100 leading-tight">
                      {center.name}
                    </p>
                    <p className="text-[9px] text-ink-500 dark:text-parchment-400 mt-0.5">
                      {center.city} · {center.type}
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white dark:border-t-ink-800" />
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Empty state */}
        {centers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-8 h-8 mx-auto text-ink-300 dark:text-ink-500 mb-2" />
              <p className="text-sm text-ink-400 dark:text-parchment-500">No centers match your filter</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 flex-wrap">
        {[
          { label: 'NALSA', color: 'bg-emerald-500' },
          { label: 'Nyaya Bandhu', color: 'bg-brass-500' },
          { label: 'Tele-Law', color: 'bg-crimson-500' },
          { label: 'Pro Bono', color: 'bg-ink-700 dark:bg-ink-400' },
        ].map((item) => (
          <span key={item.label} className="inline-flex items-center gap-1.5 text-[10px] text-ink-500 dark:text-parchment-400">
            <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  )
}
