import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Scale, Search, SlidersHorizontal, X } from 'lucide-react'
import Breadcrumb from '../../components/common/Breadcrumb.jsx'
import LegalAidMap from '../../components/legalAid/LegalAidMap.jsx'
import CenterCard from '../../components/legalAid/CenterCard.jsx'
import legalAidCenters from '../../data/legalAidData.js'

const CATEGORIES = ['All', 'NALSA', 'Nyaya Bandhu', 'Tele-Law', 'Pro Bono']

export default function LegalAidPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [selectedId, setSelectedId] = useState(null)

  const filteredCenters = useMemo(() => {
    return legalAidCenters.filter((center) => {
      const matchesSearch =
        !search ||
        center.name.toLowerCase().includes(search.toLowerCase()) ||
        center.city.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = activeCategory === 'All' || center.type === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [search, activeCategory])

  const handleSelect = (id) => {
    setSelectedId((prev) => (prev === id ? null : id))
  }

  const clearSearch = () => setSearch('')

  return (
    <div>
      <Breadcrumb items={[{ label: 'Legal Aid' }]} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-2"
      >
        <span className="w-11 h-11 rounded-xl bg-brass-500/10 flex items-center justify-center">
          <Scale className="w-5.5 h-5.5 text-brass-600 dark:text-brass-400" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink-900 dark:text-parchment-100">
            Nearby Legal Aid Centers
          </h1>
          <p className="text-sm text-ink-500 dark:text-parchment-400">
            Find NALSA clinics, Nyaya Bandhu advocates, Tele-Law centers, and pro bono lawyers near you.
          </p>
        </div>
      </motion.div>

      {/* Search and filters */}
      <div className="mt-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400 dark:text-parchment-400" />
          <input
            type="text"
            placeholder="Search by center name or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10 pr-10"
          />
          {search && (
            <button
              onClick={clearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600 dark:hover:text-parchment-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <SlidersHorizontal className="w-4 h-4 text-ink-400 dark:text-parchment-400 shrink-0" />
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-brass-500 text-ink-950 shadow-sm'
                  : 'bg-white dark:bg-ink-800 text-ink-600 dark:text-parchment-300 border border-ink-900/10 dark:border-parchment-100/10 hover:bg-ink-900/5 dark:hover:bg-parchment-100/5'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <p className="text-xs text-ink-400 dark:text-parchment-500">
          Showing {filteredCenters.length} of {legalAidCenters.length} centers
        </p>
      </div>

      {/* Two-column layout */}
      <div className="mt-2 flex flex-col lg:flex-row gap-6">
        {/* Map panel - 60% on desktop, full on mobile (top) */}
        <div className="w-full lg:w-[60%] lg:sticky lg:top-6 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <LegalAidMap
              centers={filteredCenters}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </motion.div>
        </div>

        {/* List panel - 40% on desktop, full on mobile (bottom) */}
        <div className="w-full lg:w-[40%] space-y-4">
          {filteredCenters.length === 0 ? (
            <div className="card p-10 text-center">
              <Scale className="w-10 h-10 mx-auto text-ink-300 dark:text-ink-500 mb-3" />
              <p className="text-sm font-medium text-ink-600 dark:text-parchment-300">
                No centers found
              </p>
              <p className="text-xs text-ink-400 dark:text-parchment-500 mt-1">
                Try adjusting your search or filter.
              </p>
            </div>
          ) : (
            filteredCenters.map((center, index) => (
              <CenterCard
                key={center.id}
                center={center}
                index={index}
                isSelected={center.id === selectedId}
                onSelect={handleSelect}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
