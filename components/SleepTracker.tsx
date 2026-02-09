'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Moon, Star } from 'lucide-react'
import { useHealthStore, SleepData } from '@/store/healthStore'

interface SleepTrackerProps {
  selectedDate: Date
  username: string
}

const QUALITY_OPTIONS = [
  { value: 'poor', label: 'Poor', color: 'bg-red-500' },
  { value: 'fair', label: 'Fair', color: 'bg-yellow-500' },
  { value: 'good', label: 'Good', color: 'bg-blue-500' },
  { value: 'excellent', label: 'Excellent', color: 'bg-green-500' },
]

export default function SleepTracker({ selectedDate, username }: SleepTrackerProps) {
  const { getDataForDate, updateSleep } = useHealthStore()
  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const dayData = getDataForDate(dateStr, username)

  const [sleepData, setSleepData] = useState<SleepData>({
    bedTime: '',
    wakeTime: '',
    quality: 'good',
    notes: '',
  })

  useEffect(() => {
    if (dayData.sleep) {
      setSleepData(dayData.sleep)
    } else {
      setSleepData({
        bedTime: '',
        wakeTime: '',
        quality: 'good',
        notes: '',
      })
    }
  }, [dateStr, username, dayData.sleep])

  const handleSave = () => {
    updateSleep(dateStr, username, sleepData)
  }

  const calculateDuration = () => {
    if (!sleepData.bedTime || !sleepData.wakeTime) return null
    
    const [bedHour, bedMin] = sleepData.bedTime.split(':').map(Number)
    const [wakeHour, wakeMin] = sleepData.wakeTime.split(':').map(Number)
    
    let duration = (wakeHour * 60 + wakeMin) - (bedHour * 60 + bedMin)
    if (duration < 0) duration += 24 * 60 // Next day wake time
    
    const hours = Math.floor(duration / 60)
    const mins = duration % 60
    
    return `${hours}h ${mins}m`
  }

  const duration = calculateDuration()

  return (
    <div className="p-4 space-y-6 safe-area-inset-bottom">
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Moon className="text-indigo-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Sleep Schedule</h2>
        </div>

        <div className="space-y-4">
          {/* Bed Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bed Time
            </label>
            <input
              type="time"
              value={sleepData.bedTime}
              onChange={(e) => setSleepData({ ...sleepData, bedTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Wake Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wake Time
            </label>
            <input
              type="time"
              value={sleepData.wakeTime}
              onChange={(e) => setSleepData({ ...sleepData, wakeTime: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Duration Display */}
          {duration && (
            <div className="bg-indigo-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-indigo-900">Total Sleep</span>
                <span className="text-2xl font-bold text-indigo-600">{duration}</span>
              </div>
            </div>
          )}

          {/* Sleep Quality */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sleep Quality
            </label>
            <div className="grid grid-cols-2 gap-3">
              {QUALITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSleepData({ ...sleepData, quality: option.value as SleepData['quality'] })}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    sleepData.quality === option.value
                      ? `${option.color} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Star size={16} fill={sleepData.quality === option.value ? 'currentColor' : 'none'} />
                    <span className="font-medium">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={sleepData.notes}
              onChange={(e) => setSleepData({ ...sleepData, notes: e.target.value })}
              placeholder="Any observations about your sleep..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 rounded-xl transition-colors shadow-lg active:scale-95"
          >
            Save Sleep Data
          </button>
        </div>
      </div>
    </div>
  )
}
