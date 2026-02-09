'use client'

import { useState, useRef, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isAfter } from 'date-fns'
import { X, ChevronLeft, ChevronRight, Moon, Droplets, Utensils, Dumbbell } from 'lucide-react'
import { useHealthStore } from '@/store/healthStore'

interface DatePickerProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onClose: () => void
  username: string
  darkMode?: boolean
}

export default function DatePicker({ selectedDate, onDateSelect, onClose, username, darkMode = true }: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)
  const [previewPosition, setPreviewPosition] = useState({ x: 0, y: 0 })
  const [longPressDate, setLongPressDate] = useState<Date | null>(null)
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const { data } = useHealthStore()

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get first day of week for padding
  const firstDayOfWeek = monthStart.getDay()
  const paddingDays = Array(firstDayOfWeek).fill(null)

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    if (!isAfter(nextMonth, new Date())) {
      setCurrentMonth(nextMonth)
    }
  }

  const hasDataForDate = (date: Date): { hasData: boolean; isCompliant: boolean } => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const key = `${username}-${dateStr}`
    const dayData = data[key]

    if (!dayData) return { hasData: false, isCompliant: true }

    // Check if any data exists for the day
    const hasSleep = dayData.sleep !== null
    const hasWater = dayData.water.glasses > 0
    const hasMeals = Object.values(dayData.meals).some((meal: any) => meal.items.length > 0)
    const hasWorkout = dayData.workout !== null

    const hasData = hasSleep || hasWater || hasMeals || hasWorkout

    // Check compliance (all meals should be compliant)
    const allMealsCompliant = Object.values(dayData.meals)
      .filter((meal: any) => meal.items.length > 0)
      .every((meal: any) => meal.compliant)

    return { hasData, isCompliant: allMealsCompliant }
  }

  const getDatePreview = (date: Date): string => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const key = `${username}-${dateStr}`
    const dayData = data[key]

    if (!dayData) return ''

    const items: string[] = []

    if (dayData.sleep) items.push('💤')
    if (dayData.water.glasses > 0) items.push(`💧${dayData.water.glasses}`)
    
    const mealCount = Object.values(dayData.meals).filter((meal: any) => meal.items.length > 0).length
    if (mealCount > 0) items.push(`🍽️${mealCount}`)
    
    if (dayData.workout?.completed) items.push('💪')

    return items.join(' ')
  }

  const getDetailedPreview = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    const key = `${username}-${dateStr}`
    const dayData = data[key]

    if (!dayData) return null

    const details = []

    if (dayData.sleep) {
      const quality = dayData.sleep.quality || 'N/A'
      details.push({ icon: Moon, label: 'Sleep', value: quality, color: 'text-purple-600' })
    }

    if (dayData.water.glasses > 0) {
      details.push({ icon: Droplets, label: 'Water', value: `${dayData.water.glasses}/${dayData.water.target} glasses`, color: 'text-blue-600' })
    }

    const mealCount = Object.values(dayData.meals).filter((meal: any) => meal.items.length > 0).length
    if (mealCount > 0) {
      const compliantMeals = Object.values(dayData.meals).filter((meal: any) => meal.items.length > 0 && meal.compliant).length
      details.push({ icon: Utensils, label: 'Meals', value: `${compliantMeals}/${mealCount} compliant`, color: 'text-orange-600' })
    }

    if (dayData.workout?.completed) {
      details.push({ icon: Dumbbell, label: 'Workout', value: dayData.workout.type, color: 'text-green-600' })
    }

    return details.length > 0 ? details : null
  }

  const handleMouseEnter = (date: Date, event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPreviewPosition({ x: rect.left, y: rect.top })
    setHoveredDate(date)
  }

  const handleTouchStart = (date: Date, event: React.TouchEvent) => {
    longPressTimer.current = setTimeout(() => {
      const rect = event.currentTarget.getBoundingClientRect()
      setPreviewPosition({ x: rect.left, y: rect.top })
      setLongPressDate(date)
    }, 500)
  }

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
    }
  }

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current)
      }
    }
  }, [])

  const activePreviewDate = longPressDate || hoveredDate
  const previewData = activePreviewDate ? getDetailedPreview(activePreviewDate) : null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fadeIn">
      <div className={`rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 hover:shadow-3xl ${
        darkMode
          ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900'
          : 'bg-gradient-to-br from-white to-gray-50'
      }`} style={{ transform: 'perspective(1000px) rotateX(0deg)' }}>
        {/* Header */}
        <div className={`sticky top-0 rounded-t-3xl border-b shadow-lg p-4 flex items-center justify-between ${
          darkMode
            ? 'bg-gradient-to-r from-yellow-600 via-amber-600 to-yellow-700 border-yellow-500/20'
            : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 border-white/20'
        } text-white`}>
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePreviousMonth}
              className="p-2 hover:bg-white/20 hover:bg-black/20 rounded-full transition-all duration-200 active:scale-95"
            >
              <ChevronLeft size={20} className={darkMode ? 'text-black' : 'text-white'} />
            </button>
            <h2 className={`text-lg font-bold drop-shadow-md ${
              darkMode ? 'text-black' : 'text-white'
            }`}>
              {format(currentMonth, 'MMMM yyyy')}
            </h2>
            <button
              onClick={handleNextMonth}
              disabled={isAfter(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1), new Date())}
              className="p-2 hover:bg-white/20 hover:bg-black/20 rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <ChevronRight size={20} className={darkMode ? 'text-black' : 'text-white'} />
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 hover:bg-black/20 rounded-full transition-all duration-200 active:scale-95"
          >
            <X size={20} className={darkMode ? 'text-black' : 'text-white'} />
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="p-4">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className={`text-center text-xs font-bold py-2 ${
                darkMode ? 'text-yellow-400' : 'text-gray-600'
              }`}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-2">
            {/* Padding for first week */}
            {paddingDays.map((_, index) => (
              <div key={`padding-${index}`} />
            ))}

            {/* Days */}
            {daysInMonth.map((date) => {
              const isSelected = isSameDay(date, selectedDate)
              const isToday = isSameDay(date, new Date())
              const isFuture = isAfter(date, new Date())
              const { hasData, isCompliant } = hasDataForDate(date)
              const preview = getDatePreview(date)

              return (
                <button
                  key={date.toString()}
                  onClick={() => !isFuture && onDateSelect(date)}
                  onMouseEnter={(e) => !isFuture && handleMouseEnter(date, e)}
                  onMouseLeave={() => setHoveredDate(null)}
                  onTouchStart={(e) => !isFuture && handleTouchStart(date, e)}
                  onTouchEnd={handleTouchEnd}
                  disabled={isFuture}
                  className={`
                    relative aspect-square p-1 rounded-xl transition-all duration-300 transform
                    ${isFuture ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:shadow-lg active:scale-95'}
                    ${isSelected ? (darkMode 
                      ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-black shadow-xl scale-105' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl scale-105') : ''}
                    ${isToday && !isSelected ? (darkMode ? 'ring-2 ring-yellow-500 ring-offset-2 ring-offset-gray-900' : 'ring-2 ring-blue-500 ring-offset-2') : ''}
                    ${hasData && !isSelected ? (isCompliant 
                      ? (darkMode ? 'bg-gradient-to-br from-yellow-900/40 to-amber-900/40' : 'bg-gradient-to-br from-blue-100 to-blue-200') 
                      : (darkMode ? 'bg-gradient-to-br from-orange-900/40 to-red-900/40' : 'bg-gradient-to-br from-orange-100 to-orange-200')) : ''}
                    ${!hasData && !isSelected && !isFuture ? (darkMode ? 'hover:bg-gray-800' : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-100') : ''}
                  `}
                  style={{
                    transform: isSelected ? 'perspective(1000px) translateZ(10px)' : 'perspective(1000px) translateZ(0px)'
                  }}
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <span className={`text-sm font-medium ${
                      isSelected 
                        ? (darkMode ? 'text-black' : 'text-white')
                        : (darkMode ? 'text-gray-300' : 'text-gray-900')
                    }`}>
                      {format(date, 'd')}
                    </span>
                    {preview && !isSelected && (
                      <div className={`text-[10px] leading-tight mt-0.5 text-center ${
                        darkMode ? 'text-yellow-400' : 'text-gray-600'
                      }`}>
                        {preview}
                      </div>
                    )}
                  </div>
                  {hasData && !isSelected && (
                    <div className={`absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full ${
                      isCompliant 
                        ? (darkMode ? 'bg-yellow-500' : 'bg-blue-500') 
                        : (darkMode ? 'bg-orange-500' : 'bg-orange-500')
                    }`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        <div className={`border-t p-4 space-y-3 ${
          darkMode
            ? 'border-yellow-500/20 bg-gradient-to-b from-transparent to-gray-900'
            : 'border-gray-200 bg-gradient-to-b from-transparent to-gray-50'
        }`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-lg shadow-sm ${
                darkMode
                  ? 'bg-gradient-to-br from-yellow-900/40 to-amber-900/40'
                  : 'bg-gradient-to-br from-blue-100 to-blue-200'
              }`}></div>
              <span className={`font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-4 h-4 rounded-lg shadow-sm ${
                darkMode
                  ? 'bg-gradient-to-br from-orange-900/40 to-red-900/40'
                  : 'bg-gradient-to-br from-orange-100 to-orange-200'
              }`}></div>
              <span className={`font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>Non-compliant</span>
            </div>
          </div>
          <p className={`text-xs text-center font-medium ${
            darkMode ? 'text-yellow-400/80' : 'text-gray-600'
          }`}>
            💤 Sleep | 💧 Water | 🍽️ Meals | 💪 Workout • Hover for details
          </p>
        </div>
      </div>

      {/* Preview Popup */}
      {previewData && (
        <div
          className="fixed z-[60] pointer-events-none"
          style={{
            left: `${previewPosition.x}px`,
            top: `${previewPosition.y - 10}px`,
            transform: 'translate(-50%, -100%)'
          }}
        >
          <div className={`rounded-2xl shadow-2xl p-4 min-w-[200px] animate-slideUp border ${
            darkMode
              ? 'bg-gradient-to-br from-gray-900 to-black border-yellow-500/30'
              : 'bg-white border-gray-200'
          }`}
               style={{
                 transform: 'perspective(1000px) rotateX(5deg) translateZ(20px)',
                 boxShadow: darkMode
                   ? '0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(251, 191, 36, 0.3) inset'
                   : '0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.5) inset'
               }}>
            <div className={`text-xs font-bold mb-2 ${
              darkMode ? 'text-yellow-400' : 'text-gray-500'
            }`}>
              {activePreviewDate && format(activePreviewDate, 'MMM dd, yyyy')}
            </div>
            <div className="space-y-2">
              {previewData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 animate-fadeIn" style={{ animationDelay: `${index * 50}ms` }}>
                  <item.icon size={16} className={item.color} />
                  <span className={`text-xs font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>{item.label}:</span>
                  <span className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>{item.value}</span>
                </div>
              ))}
            </div>
            {/* Arrow */}
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
              <div className={`w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent ${
                darkMode ? 'border-t-gray-900' : 'border-t-white'
              }`}
                   style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
