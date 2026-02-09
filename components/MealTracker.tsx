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
    <div className="p-3 sm:p-4 space-y-3 pb-3">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-0">
        <div className="p-5 flex items-center space-x-3 border-b border-gray-100">
          <Utensils className="text-orange-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Meals</h2>
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
                className={`w-full p-5 min-h-[70px] flex items-center justify-between transition-all active:scale-[0.98] ${
                  hasData
                    ? isCompliant
                      ? 'bg-blue-50 hover:bg-blue-100'
                      : 'bg-orange-50 hover:bg-orange-100'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    hasData
                      ? isCompliant
                        ? 'bg-blue-500'
                        : 'bg-orange-500'
                      : 'bg-gray-300'
                  }`} />
                  <div className="text-left">
                    <div className="font-bold text-lg text-gray-900">{meal.label}</div>
                    <div className="text-base text-gray-500">{meal.time}</div>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
              </button>

              {isExpanded && (
                <div className="p-5 bg-gray-50 space-y-5">
                  {/* Compliant Toggle */}
                  <div className="flex items-center justify-between bg-white rounded-xl p-4">
                    <span className="text-base font-semibold text-gray-700">Following diet plan?</span>
                    <button
                      onClick={handleToggleCompliant}
                      className={`relative w-16 h-9 rounded-full transition-colors active:scale-95 ${
                        currentMealData?.compliant ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute top-1 w-7 h-7 bg-white rounded-full shadow transition-transform ${
                          currentMealData?.compliant ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Added Items */}
                  {currentMealData && currentMealData.items.length > 0 && (
                    <div className="space-y-3">
                      <label className="block text-base font-semibold text-gray-700">
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
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Add Custom Item
                    </label>
                    <div className="flex gap-3">
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
                        className="flex-1 px-3 py-4 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        style={{ maxWidth: '100%', boxSizing: 'border-box' }}
                      />
                      <button
                        onClick={handleAddCustomFood}
                        className="px-7 py-4 min-h-[56px] bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl text-base font-bold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Quick Add Foods */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Quick Add
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
                      {QUICK_FOODS.map((food) => (
                        <button
                          key={food}
                          onClick={() => handleAddItem(food)}
                          className="text-left p-4 min-h-[56px] bg-white hover:bg-blue-50 active:bg-blue-100 rounded-xl text-base font-medium transition-all active:scale-[0.98] border-2 border-gray-200 hover:border-blue-300"
                        >
                          {food}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-base font-semibold text-gray-700 mb-3">
                      Notes
                    </label>
                    <textarea
                      value={currentMealData?.notes || ''}
                      onChange={(e) => handleNotesChange(e.target.value)}
                      placeholder="Any additional notes..."
                      rows={4}
                      className="w-full px-3 py-4 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                      style={{ maxWidth: '100%', boxSizing: 'border-box' }}
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
