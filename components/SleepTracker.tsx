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
    <div className="p-3 sm:p-4 space-y-6 safe-area-inset-bottom pb-24">
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        <div className="flex items-center space-x-3 mb-8">
          <Moon className="text-indigo-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Sleep Schedule</h2>
        </div>

        <div className="space-y-6">
          {/* Bed Time */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Bed Time
            </label>
            <input
              type="time"
              value={sleepData.bedTime}
              onChange={(e) => setSleepData({ ...sleepData, bedTime: e.target.value })}
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Wake Time */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Wake Time
            </label>
            <input
              type="time"
              value={sleepData.wakeTime}
              onChange={(e) => setSleepData({ ...sleepData, wakeTime: e.target.value })}
              className="w-full px-5 py-4 text-lg border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Duration Display */}
          {duration && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-indigo-900">Total Sleep</span>
                <span className="text-3xl font-bold text-indigo-600">{duration}</span>
              </div>
            </div>
          )}

          {/* Sleep Quality */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-4">
              Sleep Quality
            </label>
            <div className="grid grid-cols-2 gap-4">
              {QUALITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSleepData({ ...sleepData, quality: option.value as SleepData['quality'] })}
                  className={`p-4 min-h-[60px] rounded-xl border-2 transition-all active:scale-95 ${
                    sleepData.quality === option.value
                      ? `${option.color} text-white border-transparent`
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Star size={20} fill={sleepData.quality === option.value ? 'currentColor' : 'none'} />
                    <span className="font-semibold text-base">{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Notes (optional)
            </label>
            <textarea
              value={sleepData.notes}
              onChange={(e) => setSleepData({ ...sleepData, notes: e.target.value })}
              placeholder="Any observations about your sleep..."
              rows={4}
              className="w-full px-5 py-4 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none transition-all"
            />
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-lg py-5 min-h-[64px] rounded-xl transition-all shadow-lg active:scale-98"
          >
            Save Sleep Data
          </button>
        </div>
      </div>
    </div>
  )
}
