'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Droplet, Plus, Minus } from 'lucide-react'
import { useHealthStore } from '@/store/healthStore'

interface WaterTrackerProps {
  selectedDate: Date
  username: string
}

export default function WaterTracker({ selectedDate, username }: WaterTrackerProps) {
  const { getDataForDate, updateWater } = useHealthStore()
  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const dayData = getDataForDate(dateStr, username)

  const [glasses, setGlasses] = useState(0)
  const [target, setTarget] = useState(8)

  useEffect(() => {
    setGlasses(dayData.water.glasses)
    setTarget(dayData.water.target)
  }, [dateStr, username, dayData.water])

  const addGlass = () => {
    const newGlasses = glasses + 1
    setGlasses(newGlasses)
    updateWater(dateStr, username, {
      glasses: newGlasses,
      timestamps: [...dayData.water.timestamps, new Date().toISOString()],
    })
  }

  const removeGlass = () => {
    if (glasses > 0) {
      const newGlasses = glasses - 1
      setGlasses(newGlasses)
      const newTimestamps = [...dayData.water.timestamps]
      newTimestamps.pop()
      updateWater(dateStr, username, {
        glasses: newGlasses,
        timestamps: newTimestamps,
      })
    }
  }

  const updateTarget = (newTarget: number) => {
    if (newTarget >= 1 && newTarget <= 20) {
      setTarget(newTarget)
      updateWater(dateStr, username, { target: newTarget })
    }
  }

  const percentage = Math.min((glasses / target) * 100, 100)
  const isCompleted = glasses >= target

  return (
    <div className="p-3 sm:p-4 space-y-6 safe-area-inset-bottom pb-24">
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-8">
          <Droplet className="text-blue-500" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Water Intake</h2>
        </div>

        {/* Progress Circle */}
        <div className="flex justify-center mb-10">
          <div className="relative w-56 h-56">
            {/* Background Circle */}
            <svg className="transform -rotate-90 w-56 h-56">
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="#e5e7eb"
                strokeWidth="18"
                fill="none"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke={isCompleted ? '#10b981' : '#3b82f6'}
                strokeWidth="18"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 100}`}
                strokeDashoffset={`${2 * Math.PI * 100 * (1 - percentage / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-6xl font-bold text-gray-900">{glasses}</span>
              <span className="text-base text-gray-500 mt-1">of {target} glasses</span>
              <span className="text-sm text-gray-400 mt-1">{Math.round(percentage)}%</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Add/Remove Buttons */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={removeGlass}
              disabled={glasses === 0}
              className="p-4 bg-red-100 hover:bg-red-200 text-red-600 rounded-full transition-colors disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
            >
              <Minus size={24} />
            </button>
            
            <button
              onClick={addGlass}
              className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg transition-all active:scale-95"
            >
              <Plus size={32} />
            </button>
          </div>

          {/* Quick Add Buttons */}
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                onClick={() => {
                  const newGlasses = glasses + num
                  setGlasses(newGlasses)
                  const newTimestamps = [...dayData.water.timestamps]
                  for (let i = 0; i < num; i++) {
                    newTimestamps.push(new Date().toISOString())
                  }
                  updateWater(dateStr, username, {
                    glasses: newGlasses,
                    timestamps: newTimestamps,
                  })
                }}
                className="py-4 min-h-[56px] bg-gradient-to-br from-gray-100 to-gray-200 hover:from-blue-50 hover:to-blue-100 text-gray-700 hover:text-blue-700 rounded-xl text-lg font-bold transition-all active:scale-95 shadow-sm"
              >
                +{num}
              </button>
            ))}
          </div>

          {/* Target Setting */}
          <div className="bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Daily Target
            </label>
            <div className="flex items-center justify-between">
              <button
                onClick={() => updateTarget(target - 1)}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Minus size={20} />
              </button>
              
              <span className="text-2xl font-bold text-gray-900">{target} glasses</span>
              
              <button
                onClick={() => updateTarget(target + 1)}
                className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          {/* Success Message */}
          {isCompleted && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 shadow-sm">
              <p className="text-center text-green-700 font-bold text-lg">
                🎉 Great job! You've reached your daily goal!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
