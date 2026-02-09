'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format, subDays, addDays } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar, User, LogOut, Moon, Sun } from 'lucide-react'
import SleepTracker from '@/components/SleepTracker'
import WaterTracker from '@/components/WaterTracker'
import MealTracker from '@/components/MealTracker'
import WorkoutTracker from '@/components/WorkoutTracker'
import DatePicker from '@/components/DatePicker'
import { useHealthStore } from '@/store/healthStore'

const TABS = [
  { id: 'sleep', label: 'Sleep', component: SleepTracker },
  { id: 'water', label: 'Water', component: WaterTracker },
  { id: 'meals', label: 'Meals', component: MealTracker },
  { id: 'workout', label: 'Workout', component: WorkoutTracker },
]

export default function TrackerPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState('sleep')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [username, setUsername] = useState('')
  const [darkMode, setDarkMode] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const { getDataForDate } = useHealthStore()

  useEffect(() => {
    const savedUser = localStorage.getItem('selectedUser')
    if (!savedUser) {
      router.push('/')
    } else {
      setUsername(savedUser)
    }

    // Load dark mode preference
    const savedTheme = localStorage.getItem('darkMode')
    if (savedTheme !== null) {
      setDarkMode(savedTheme === 'true')
    }
  }, [router])

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
  }

  const handleLogout = () => {
    localStorage.removeItem('selectedUser')
    router.push('/')
  }

  const handlePreviousDay = () => {
    setSelectedDate(prev => subDays(prev, 1))
  }

  const handleNextDay = () => {
    const tomorrow = addDays(selectedDate, 1)
    if (tomorrow <= new Date()) {
      setSelectedDate(tomorrow)
    }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setShowDatePicker(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = TABS.findIndex(tab => tab.id === activeTab)
      
      if (isLeftSwipe && currentIndex < TABS.length - 1) {
        setSlideDirection('left')
        setTimeout(() => {
          setActiveTab(TABS[currentIndex + 1].id)
          setSlideDirection(null)
        }, 150)
      } else if (isRightSwipe && currentIndex > 0) {
        setSlideDirection('right')
        setTimeout(() => {
          setActiveTab(TABS[currentIndex - 1].id)
          setSlideDirection(null)
        }, 150)
      }
    }

    setTouchStart(0)
    setTouchEnd(0)
  }

  const isToday = format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  const isFutureDate = selectedDate > new Date()

  const ActiveTabComponent = TABS.find(tab => tab.id === activeTab)?.component

  if (!username) return null

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      darkMode
        ? 'bg-gradient-to-br from-black via-gray-900 to-black'
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
    }`}>
      {/* Header */}
      <div className={`shadow-lg sticky top-0 z-50 safe-area-inset-top transition-all duration-500 ${
        darkMode
          ? 'bg-gradient-to-r from-black via-gray-900 to-black border-b border-yellow-500/20'
          : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500'
      }`}>
        <div className="px-4 py-4 flex items-center justify-between">
          <div className={`flex items-center space-x-3 px-4 py-2 rounded-full backdrop-blur-sm ${
            darkMode ? 'bg-yellow-500/20' : 'bg-white/20'
          }`}>
            <div className={`p-1 rounded-full ${
              darkMode ? 'bg-yellow-500' : 'bg-white'
            }`}>
              <User size={18} className={darkMode ? 'text-black' : 'text-blue-600'} />
            </div>
            <span className={`font-bold drop-shadow-md ${
              darkMode ? 'text-yellow-400' : 'text-white'
            }`}>{username}</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-3 min-w-[48px] min-h-[48px] rounded-full transition-all duration-200 active:scale-95 backdrop-blur-sm flex items-center justify-center ${
                darkMode ? 'hover:bg-yellow-500/20' : 'hover:bg-white/20'
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun size={24} className="text-yellow-400 drop-shadow-md" />
              ) : (
                <Moon size={24} className="text-white drop-shadow-md" />
              )}
            </button>
            <button
              onClick={handleLogout}
              className={`p-3 min-w-[48px] min-h-[48px] rounded-full transition-all duration-200 active:scale-95 backdrop-blur-sm flex items-center justify-center ${
                darkMode ? 'hover:bg-yellow-500/20' : 'hover:bg-white/20'
              }`}
              aria-label="Logout"
            >
              <LogOut size={24} className={`drop-shadow-md ${darkMode ? 'text-yellow-400' : 'text-white'}`} />
            </button>
          </div>
        </div>

        {/* Date Navigation */}
        <div className="px-4 py-4 flex items-center justify-between">
          <button
            onClick={handlePreviousDay}
            className={`p-3 min-w-[48px] min-h-[48px] rounded-full transition-all duration-200 active:scale-95 backdrop-blur-sm flex items-center justify-center ${
              darkMode ? 'hover:bg-yellow-500/20' : 'hover:bg-white/20'
            }`}
            aria-label="Previous day"
          >
            <ChevronLeft size={28} className={`drop-shadow-md ${darkMode ? 'text-yellow-400' : 'text-white'}`} />
          </button>

          <button
            onClick={() => setShowDatePicker(true)}
            className={`flex items-center space-x-3 px-6 py-3 min-h-[48px] backdrop-blur-sm rounded-full transition-all duration-200 active:scale-95 shadow-lg ${
              darkMode
                ? 'bg-yellow-500/20 hover:bg-yellow-500/30'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            <Calendar size={22} className={darkMode ? 'text-yellow-400' : 'text-white'} />
            <span className={`font-bold text-base drop-shadow-md ${
              darkMode ? 'text-yellow-400' : 'text-white'
            }`}>
              {isToday ? 'Today' : format(selectedDate, 'MMM dd, yyyy')}
            </span>
          </button>

          <button
            onClick={handleNextDay}
            disabled={isFutureDate}
            className={`p-3 min-w-[48px] min-h-[48px] rounded-full transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 backdrop-blur-sm flex items-center justify-center ${
              darkMode ? 'hover:bg-yellow-500/20' : 'hover:bg-white/20'
            }`}
            aria-label="Next day"
          >
            <ChevronRight size={28} className={`drop-shadow-md ${darkMode ? 'text-yellow-400' : 'text-white'}`} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex overflow-x-auto backdrop-blur-sm ${
          darkMode ? 'bg-yellow-500/10' : 'bg-white/10'
        }`}>
          {TABS.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[90px] py-4 text-base font-bold transition-all duration-300 relative active:scale-95 ${
                activeTab === tab.id
                  ? darkMode ? 'text-yellow-400' : 'text-white'
                  : darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-white/70 hover:text-white/90'
              }`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-t-full shadow-lg animate-slideIn ${
                  darkMode ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-white'
                }`}></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div 
        className={`flex-1 overflow-y-auto transition-all duration-300 min-h-0 ${
          darkMode
            ? 'bg-gradient-to-br from-black via-gray-900 to-black'
            : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
        } ${
          slideDirection === 'left' ? 'animate-slideOutLeft' : 
          slideDirection === 'right' ? 'animate-slideOutRight' : 
          'animate-slideIn'
        }`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className={`min-h-full ${
          darkMode
            ? 'bg-gradient-to-br from-black via-gray-900 to-black'
            : 'bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50'
        }`}>
          {ActiveTabComponent && (
            <ActiveTabComponent
              selectedDate={selectedDate}
              username={username}
            />
          )}
        </div>
      </div>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          onClose={() => setShowDatePicker(false)}
          username={username}
          darkMode={darkMode}
        />
      )}
    </div>
  )
}
