'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Dumbbell, Clock, CheckCircle, Scale } from 'lucide-react'
import { useHealthStore, WorkoutData, WeightData } from '@/store/healthStore'

interface WorkoutTrackerProps {
  selectedDate: Date
  username: string
}

const WORKOUT_TYPES = [
  'Walking',
  'Running',
  'Gym',
  'Yoga',
  'Swimming',
  'Cycling',
  'Home Workout',
  'Sports',
  'Dance',
  'Other',
]

export default function WorkoutTracker({ selectedDate, username }: WorkoutTrackerProps) {
  const { getDataForDate, updateWorkout, updateWeight } = useHealthStore()
  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const dayData = getDataForDate(dateStr, username)

  const [workoutData, setWorkoutData] = useState<WorkoutData>({
    type: '',
    duration: 60,
    notes: '',
    completed: false,
  })

  const [weightData, setWeightData] = useState<WeightData>({
    weight: 0,
    unit: 'lbs',
    notes: '',
  })

  useEffect(() => {
    if (dayData.workout) {
      setWorkoutData(dayData.workout)
    } else {
      setWorkoutData({
        type: '',
        duration: 60,
        notes: '',
        completed: false,
      })
    }

    if (dayData.weight) {
      setWeightData(dayData.weight)
    } else {
      setWeightData({
        weight: 0,
        unit: 'lbs',
        notes: '',
      })
    }
  }, [dateStr, username, dayData.workout, dayData.weight])

  const handleSave = () => {
    updateWorkout(dateStr, username, { ...workoutData, completed: true })
    setWorkoutData({ ...workoutData, completed: true })
  }

  const handleSkip = () => {
    updateWorkout(dateStr, username, { 
      type: 'Rest Day',
      duration: 0,
      notes: workoutData.notes || 'Rest day',
      completed: true 
    })
    setWorkoutData({
      type: 'Rest Day',
      duration: 0,
      notes: workoutData.notes || 'Rest day',
      completed: true,
    })
  }

  const handleWeightSave = () => {
    if (weightData.weight > 0) {
      updateWeight(dateStr, username, weightData)
    }
  }

  return (
    <div className="p-3 sm:p-4 space-y-6 safe-area-inset-bottom pb-8">
      {/* Weight Tracker Card */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-4 sm:p-6 border-2 border-purple-200 overflow-hidden">
        <div className="flex items-center space-x-3 mb-6">
          <Scale className="text-purple-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Weight Tracker</h2>
        </div>

        <div className="space-y-5">
          {/* Weight Input */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Current Weight
            </label>
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  value={weightData.weight || ''}
                  onChange={(e) => setWeightData({ ...weightData, weight: parseFloat(e.target.value) || 0 })}
                  onBlur={handleWeightSave}
                  placeholder="Enter weight"
                  step="0.1"
                  className="w-full px-3 py-4 text-3xl font-bold text-center border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  style={{ maxWidth: '100%', boxSizing: 'border-box' }}
                />
              </div>
              
              {/* Unit Toggle */}
              <div className="flex bg-white rounded-xl border-2 border-purple-300 overflow-hidden shadow-sm">
                <button
                  onClick={() => {
                    const newWeight = weightData.unit === 'kg' 
                      ? { ...weightData, unit: 'lbs' as const, weight: weightData.weight * 2.20462 }
                      : weightData
                    setWeightData(newWeight)
                    if (newWeight.weight > 0) updateWeight(dateStr, username, newWeight)
                  }}
                  className={`px-5 py-4 min-w-[60px] font-bold text-base transition-all active:scale-95 ${
                    weightData.unit === 'lbs'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  lbs
                </button>
                <button
                  onClick={() => {
                    const newWeight = weightData.unit === 'lbs'
                      ? { ...weightData, unit: 'kg' as const, weight: weightData.weight / 2.20462 }
                      : weightData
                    setWeightData(newWeight)
                    if (newWeight.weight > 0) updateWeight(dateStr, username, newWeight)
                  }}
                  className={`px-4 py-3 font-bold transition-colors ${
                    weightData.unit === 'kg'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  kg
                </button>
              </div>
            </div>
          </div>

          {/* Weight Display */}
          {weightData.weight > 0 && (
            <div className="bg-white rounded-xl p-4 text-center border-2 border-purple-300">
              <p className="text-3xl font-bold text-purple-600">
                {weightData.weight.toFixed(1)} {weightData.unit}
              </p>
              {weightData.unit === 'lbs' && (
                <p className="text-sm text-gray-500 mt-1">
                  ({(weightData.weight / 2.20462).toFixed(1)} kg)
                </p>
              )}
              {weightData.unit === 'kg' && (
                <p className="text-sm text-gray-500 mt-1">
                  ({(weightData.weight * 2.20462).toFixed(1)} lbs)
                </p>
              )}
            </div>
          )}

          {/* Weight Notes */}
          <div>
            <label className="block text-base font-semibold text-gray-700 mb-3">
              Notes (optional)
            </label>
            <textarea
              value={weightData.notes}
              onChange={(e) => setWeightData({ ...weightData, notes: e.target.value })}
              onBlur={handleWeightSave}
              placeholder="How are you feeling? Any observations..."
              rows={3}
              className="w-full px-3 py-4 text-base border-2 border-purple-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none transition-all"
              style={{ maxWidth: '100%', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 overflow-hidden">
        <div className="flex items-center space-x-3 mb-8">
          <Dumbbell className="text-green-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Workout</h2>
        </div>

        {workoutData.completed ? (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
              <CheckCircle className="mx-auto mb-3 text-green-600" size={48} />
              <h3 className="text-xl font-bold text-green-900 mb-2">Workout Completed!</h3>
              {workoutData.type !== 'Rest Day' && (
                <>
                  <p className="text-green-700 font-medium">{workoutData.type}</p>
                  <p className="text-green-600">{workoutData.duration} minutes</p>
                </>
              )}
              {workoutData.type === 'Rest Day' && (
                <p className="text-green-700 font-medium">Rest Day</p>
              )}
            </div>

            {workoutData.notes && (
              <div className="bg-gray-50 rounded-xl p-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <p className="text-gray-900">{workoutData.notes}</p>
              </div>
            )}

            <button
              onClick={() => setWorkoutData({ ...workoutData, completed: false })}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
            >
              Edit Workout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Workout Type */}
            <div>
              <label className="block text-base font-semibold text-gray-700 mb-3">
                Workout Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {WORKOUT_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setWorkoutData({ ...workoutData, type })}
                    className={`p-4 min-h-[56px] rounded-xl border-2 transition-all active:scale-95 ${
                      workoutData.type === type
                        ? 'bg-green-500 text-white border-transparent'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="font-semibold text-base">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Duration (minutes)
              </label>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <button
                  onClick={() => setWorkoutData({ ...workoutData, duration: Math.max(5, workoutData.duration - 5) })}
                  className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Clock size={20} className="text-gray-600" />
                </button>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={workoutData.duration}
                    onChange={(e) => setWorkoutData({ ...workoutData, duration: parseInt(e.target.value) || 0 })}
                    className="w-20 text-center text-2xl font-bold bg-transparent border-none focus:outline-none"
                    min="0"
                    max="300"
                  />
                  <span className="text-gray-500">min</span>
                </div>
                
                <button
                  onClick={() => setWorkoutData({ ...workoutData, duration: Math.min(300, workoutData.duration + 5) })}
                  className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Clock size={20} className="text-gray-600" />
                </button>
              </div>

              {/* Quick Duration Buttons */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {[30, 45, 60, 90].map((min) => (
                  <button
                    key={min}
                    onClick={() => setWorkoutData({ ...workoutData, duration: min })}
                    className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium text-sm transition-colors"
                  >
                    {min}m
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleSave}
                disabled={!workoutData.type}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-colors shadow-lg active:scale-95"
              >
                Complete Workout
              </button>

              <button
                onClick={handleSkip}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Mark as Rest Day
              </button>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                value={workoutData.notes}
                onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
                placeholder="How did it go? Any observations..."
                rows={3}
                className="w-full px-3 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none transition-all"
                style={{ maxWidth: '100%', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Recommended Target */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-900 font-medium">
          💡 Recommended: 60 minutes of physical activity, 6 days a week
        </p>
      </div>
    </div>
  )
}
