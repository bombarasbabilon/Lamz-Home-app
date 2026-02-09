'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Utensils, ChevronDown, ChevronUp, Camera, X } from 'lucide-react'
import { useHealthStore, MealData } from '@/store/healthStore'

interface MealTrackerProps {
  selectedDate: Date
  username: string
}

const MEAL_TYPES = [
  { id: 'earlyMorning', label: 'Early Morning', time: '6:00 AM' },
  { id: 'breakfast', label: 'Breakfast', time: '8:00 AM' },
  { id: 'midMorning', label: 'Mid Morning', time: '10:30 AM' },
  { id: 'lunch', label: 'Lunch', time: '1:00 PM' },
  { id: 'tea', label: 'Tea', time: '4:00 PM' },
  { id: 'dinner', label: 'Dinner', time: '7:00 PM' },
  { id: 'supper', label: 'Supper', time: '9:00 PM' },
]

const QUICK_FOODS = [
  '2 egg whites + vegetables',
  'Methi seeds + water',
  'Fruits + almonds + walnut',
  'Quinoa/Millets + vegetables + dal',
  'Greek yogurt + seeds',
  'Grilled chicken/fish + salad',
  'Stir-fried vegetables',
  'Lentil chips',
  'Green tea',
  'Paneer tikkis',
]

export default function MealTracker({ selectedDate, username }: MealTrackerProps) {
  const { getDataForDate, updateMeal } = useHealthStore()
  const dateStr = format(selectedDate, 'yyyy-MM-dd')
  const dayData = getDataForDate(dateStr, username)

  const [expandedMeal, setExpandedMeal] = useState<string | null>('earlyMorning')
  const [currentMeal, setCurrentMeal] = useState<string>('')
  const [currentMealData, setCurrentMealData] = useState<MealData | null>(null)
  const [customFood, setCustomFood] = useState<string>('')

  const handleToggleMeal = (mealId: string) => {
    if (expandedMeal === mealId) {
      setExpandedMeal(null)
    } else {
      setExpandedMeal(mealId)
      setCurrentMeal(mealId)
      setCurrentMealData(dayData.meals[mealId as keyof typeof dayData.meals])
    }
  }

  const handleAddItem = (item: string) => {
    if (!currentMealData) return
    
    const newItems = [...currentMealData.items, item]
    const updatedMeal = { ...currentMealData, items: newItems }
    
    updateMeal(dateStr, username, currentMeal as any, updatedMeal)
    setCurrentMealData(updatedMeal)
  }

  const handleAddCustomFood = () => {
    if (!customFood.trim()) return
    handleAddItem(customFood.trim())
    setCustomFood('')
  }

  const handleRemoveItem = (index: number) => {
    if (!currentMealData) return
    
    const newItems = currentMealData.items.filter((_, i) => i !== index)
    const updatedMeal = { ...currentMealData, items: newItems }
    
    updateMeal(dateStr, username, currentMeal as any, updatedMeal)
    setCurrentMealData(updatedMeal)
  }

  const handleToggleCompliant = () => {
    if (!currentMealData) return
    
    const updatedMeal = { ...currentMealData, compliant: !currentMealData.compliant }
    updateMeal(dateStr, username, currentMeal as any, updatedMeal)
    setCurrentMealData(updatedMeal)
  }

  const handleNotesChange = (notes: string) => {
    if (!currentMealData) return
    
    const updatedMeal = { ...currentMealData, notes }
    updateMeal(dateStr, username, currentMeal as any, updatedMeal)
    setCurrentMealData(updatedMeal)
  }

  return (
    <div className="p-4 space-y-3 safe-area-inset-bottom pb-20">
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 flex items-center space-x-2 border-b border-gray-100">
          <Utensils className="text-orange-600" size={24} />
          <h2 className="text-xl font-bold text-gray-900">Meals</h2>
        </div>

        {MEAL_TYPES.map((meal) => {
          const mealData = dayData.meals[meal.id as keyof typeof dayData.meals]
          const isExpanded = expandedMeal === meal.id
          const hasData = mealData.items.length > 0 || mealData.notes
          const isCompliant = mealData.compliant

          return (
            <div key={meal.id} className="border-b border-gray-100 last:border-b-0">
              <button
                onClick={() => handleToggleMeal(meal.id)}
                className={`w-full p-4 flex items-center justify-between transition-colors ${
                  hasData
                    ? isCompliant
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'bg-orange-50 hover:bg-orange-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    hasData
                      ? isCompliant
                        ? 'bg-blue-500'
                        : 'bg-orange-500'
                      : 'bg-gray-300'
                  }`} />
                  <div className="text-left">
                    <div className="font-semibold text-gray-900">{meal.label}</div>
                    <div className="text-sm text-gray-500">{meal.time}</div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              {isExpanded && (
                <div className="p-4 bg-gray-50 space-y-4">
                  {/* Compliant Toggle */}
                  <div className="flex items-center justify-between bg-white rounded-xl p-3">
                    <span className="text-sm font-medium text-gray-700">Following diet plan?</span>
                    <button
                      onClick={handleToggleCompliant}
                      className={`relative w-14 h-8 rounded-full transition-colors ${
                        currentMealData?.compliant ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform ${
                          currentMealData?.compliant ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Added Items */}
                  {currentMealData && currentMealData.items.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Items
                      </label>
                      <div className="space-y-2">
                        {currentMealData.items.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-white rounded-lg p-3"
                          >
                            <span className="text-sm text-gray-900">{item}</span>
                            <button
                              onClick={() => handleRemoveItem(index)}
                              className="p-1 hover:bg-gray-100 rounded transition-colors"
                            >
                              <X size={16} className="text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Food Input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Add Custom Item
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customFood}
                        onChange={(e) => setCustomFood(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleAddCustomFood()
                          }
                        }}
                        placeholder="Enter food item..."
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleAddCustomFood}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Quick Add Foods */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quick Add
                    </label>
                    <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
                      {QUICK_FOODS.map((food) => (
                        <button
                          key={food}
                          onClick={() => handleAddItem(food)}
                          className="text-left p-3 bg-white hover:bg-blue-50 rounded-lg text-sm transition-colors border border-gray-200"
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={currentMealData?.notes || ''}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      placeholder="Any additional notes..."
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
