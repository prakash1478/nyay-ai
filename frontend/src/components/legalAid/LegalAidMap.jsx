import React, { useState } from 'react'
import { MapPin, Navigation, Compass, Sun, Moon } from 'lucide-react'

const TYPE_MAP_DOT = {
  'NALSA': 'bg-emerald-500 border-emerald-300 dark:border-emerald-700 shadow-emerald-500/40',
  'Nyaya Bandhu': 'bg-brass-500 border-brass-300 dark:border-brass-700 shadow-brass-500/40',
  'Tele-Law': 'bg-crimson-500 border-crimson-300 dark:border-crimson-700 shadow-crimson-500/40',
  'Pro Bono': 'bg-indigo-500 border-indigo-300 dark:border-indigo-700 shadow-indigo-500/40',
}

function latLngToPercent(lat, lng) {
  const minLat = 6.7, maxLat = 37.1
  const minLng = 68.0, maxLng = 97.5
  const svgPadX = 10, svgPadY = 48, svgW = 590, svgH = 625
  const svgX = svgPadX + (lng - minLng) / (maxLng - minLng) * svgW
  const svgY = svgPadY + (maxLat - lat) / (maxLat - minLat) * svgH

  const pctX = svgX / 612
  const pctY = svgY / 696

  const containerAspect = 0.75
  const svgAspect = 696 / 612
  const visW = containerAspect / svgAspect
  const offX = (1 - visW) / 2

  return {
    x: Math.max(0.5, Math.min(99.5, (offX + pctX * visW) * 100)),
    y: Math.max(0.5, Math.min(99.5, pctY * 100)),
  }
}

export default function LegalAidMap({ centers, selectedId, onSelect }) {
  const [tooltipId, setTooltipId] = useState(null)
  const [dark, setDark] = useState(false)

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

      <div
        className="relative w-full overflow-hidden rounded-xl border border-ink-900/10 dark:border-parchment-100/10"
        style={{ paddingBottom: '75%' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-emerald-50/30 to-amber-50/20 dark:from-ink-900 dark:via-ink-900 dark:to-ink-950">
          <object
            data="/maps/india.svg"
            type="image/svg+xml"
            className={`w-full h-full pointer-events-none select-none transition-all duration-500 ${dark ? 'brightness-[0.7] contrast-[1.1]' : 'brightness-[1.05] contrast-[0.95]'}`}
            style={{ filter: `saturate(${dark ? 0.4 : 0.65})` }}
            aria-label="Map of India"
          />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-transparent via-transparent to-sky-200/10 dark:to-transparent" />
        </div>

        <div className="absolute top-3 right-3 z-10 flex gap-1.5">
          <button
            onClick={() => setDark(!dark)}
            className="w-7 h-7 rounded-lg flex items-center justify-center bg-white/80 dark:bg-ink-800/80 text-ink-500 dark:text-parchment-300 backdrop-blur-sm hover:bg-white dark:hover:bg-ink-700 transition-all shadow-sm"
            title="Toggle map style"
          >
            {dark ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
          </button>
        </div>

        <div className="absolute top-3 left-3 z-10 opacity-40 dark:opacity-30 pointer-events-none">
          <Compass className="w-6 h-6 text-ink-500 dark:text-parchment-300" />
          <div className="text-[7px] font-bold text-ink-400 dark:text-parchment-500 text-center mt-0.5 tracking-widest">N</div>
        </div>

        <div className="absolute bottom-3 left-3 z-10 text-[9px] font-semibold font-mono text-ink-400/60 dark:text-parchment-500/60 uppercase tracking-[0.2em] pointer-events-none">
          INDIA
        </div>

        {centers.map((center) => {
          const pos = latLngToPercent(center.lat, center.lng)
          const isSelected = center.id === selectedId
          const dotColor = TYPE_MAP_DOT[center.type] || TYPE_MAP_DOT['NALSA']

          return (
            <div key={center.id} className="absolute z-20" style={{ left: `${pos.x}%`, top: `${pos.y}%` }}>
              {isSelected && (
                <div className="absolute -inset-3 rounded-full animate-ping opacity-20 bg-brass-500" />
              )}

              <button
                className={`relative w-3.5 h-3.5 rounded-full border-2 shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 hover:scale-150 hover:z-30 active:scale-125 ${dotColor} ${
                  isSelected ? 'scale-150 z-30 ring-2 ring-brass-400 ring-offset-2 ring-offset-white dark:ring-offset-ink-900' : 'hover:ring-2 hover:ring-white/50 dark:hover:ring-ink-700/50'
                }`}
                onClick={() => onSelect(center.id)}
                onMouseEnter={() => setTooltipId(center.id)}
                onMouseLeave={() => setTooltipId(null)}
                title={center.name}
              >
                <span className="sr-only">{center.name}</span>
              </button>

              {(tooltipId === center.id || isSelected) && (
                <div className="absolute z-40 bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none" style={{ minWidth: '150px' }}>
                  <div className="bg-white/95 dark:bg-ink-800/95 backdrop-blur-sm rounded-lg shadow-lg dark:shadow-card-dark border border-ink-900/10 dark:border-parchment-100/10 p-2.5 text-center">
                    <p className="text-[11px] font-semibold text-ink-900 dark:text-parchment-100 leading-tight">
                      {center.name}
                    </p>
                    <p className="text-[9px] text-ink-500 dark:text-parchment-400 mt-0.5">
                      {center.city} · {center.type}
                    </p>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-white/95 dark:border-t-ink-800/95" />
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {centers.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-center bg-white/80 dark:bg-ink-900/80 backdrop-blur-sm rounded-xl px-5 py-4 shadow-sm">
              <MapPin className="w-8 h-8 mx-auto text-ink-300 dark:text-ink-500 mb-2" />
              <p className="text-sm text-ink-400 dark:text-parchment-500">No centers match your filter</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mt-3 flex-wrap gap-y-2">
        <div className="flex items-center gap-3 flex-wrap">
          {[
            { label: 'NALSA', color: 'bg-emerald-500' },
            { label: 'Nyaya Bandhu', color: 'bg-brass-500' },
            { label: 'Tele-Law', color: 'bg-crimson-500' },
            { label: 'Pro Bono', color: 'bg-indigo-500' },
          ].map((item) => (
            <span key={item.label} className="inline-flex items-center gap-1.5 text-[10px] text-ink-500 dark:text-parchment-400">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
