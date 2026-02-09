import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SleepData {
  bedTime: string
  wakeTime: string
  quality: 'poor' | 'fair' | 'good' | 'excellent'
  notes: string
}

export interface WaterData {
  glasses: number
  target: number
  timestamps: string[]
}

export interface MealData {
  time: string
  items: string[]
  photos: string[]
  notes: string
  compliant: boolean
}

export interface MealsData {
  earlyMorning: MealData
  breakfast: MealData
  midMorning: MealData
  lunch: MealData
  tea: MealData
  dinner: MealData
  supper: MealData
}

export interface WorkoutData {
  type: string
  duration: number
  notes: string
  completed: boolean
}

export interface WeightData {
  weight: number
  unit: 'lbs' | 'kg'
  notes: string
}

export interface DayData {
  date: string
  user: string
  sleep: SleepData | null
  water: WaterData
  meals: MealsData
  workout: WorkoutData | null
  weight: WeightData | null
}

interface HealthStore {
  data: Record<string, DayData>
  getDataForDate: (date: string, username: string) => DayData
  updateSleep: (date: string, username: string, sleep: SleepData) => void
  updateWater: (date: string, username: string, water: Partial<WaterData>) => void
  updateMeal: (date: string, username: string, mealType: keyof MealsData, meal: Partial<MealData>) => void
  updateWorkout: (date: string, username: string, workout: WorkoutData) => void
  updateWeight: (date: string, username: string, weight: WeightData) => void
}

const createEmptyMeal = (): MealData => ({
  time: '',
  items: [],
  photos: [],
  notes: '',
  compliant: true,
})

const createEmptyDayData = (date: string, username: string): DayData => ({
  date,
  user: username,
  sleep: null,
  water: {
    glasses: 0,
    target: 8,
    timestamps: [],
  },
  meals: {
    earlyMorning: createEmptyMeal(),
    breakfast: createEmptyMeal(),
    midMorning: createEmptyMeal(),
    lunch: createEmptyMeal(),
    tea: createEmptyMeal(),
    dinner: createEmptyMeal(),
    supper: createEmptyMeal(),
  },
  workout: null,
  weight: null,
})

export const useHealthStore = create<HealthStore>()(
  persist(
    (set, get) => ({
      data: {},

      getDataForDate: (date: string, username: string) => {
        const key = `${username}-${date}`
        const existing = get().data[key]
        if (existing) return existing
        
        return createEmptyDayData(date, username)
      },

      updateSleep: (date: string, username: string, sleep: SleepData) => {
        set((state) => {
          const key = `${username}-${date}`
          const existing = state.data[key] || createEmptyDayData(date, username)
          
          return {
            data: {
              ...state.data,
              [key]: {
                ...existing,
                sleep,
              },
            },
          }
        })
      },

      updateWater: (date: string, username: string, water: Partial<WaterData>) => {
        set((state) => {
          const key = `${username}-${date}`
          const existing = state.data[key] || createEmptyDayData(date, username)
          
          return {
            data: {
              ...state.data,
              [key]: {
                ...existing,
                water: {
                  ...existing.water,
                  ...water,
                },
              },
            },
          }
        })
      },

      updateMeal: (date: string, username: string, mealType: keyof MealsData, meal: Partial<MealData>) => {
        set((state) => {
          const key = `${username}-${date}`
          const existing = state.data[key] || createEmptyDayData(date, username)
          
          return {
            data: {
              ...state.data,
              [key]: {
                ...existing,
                meals: {
                  ...existing.meals,
                  [mealType]: {
                    ...existing.meals[mealType],
                    ...meal,
                  },
                },
              },
            },
          }
        })
      },

      updateWorkout: (date: string, username: string, workout: WorkoutData) => {
        set((state) => {
          const key = `${username}-${date}`
          const existing = state.data[key] || createEmptyDayData(date, username)
          
          return {
            data: {
              ...state.data,
              [key]: {
                ...existing,
                workout,
              },
            },
          }
        })
      },

      updateWeight: (date: string, username: string, weight: WeightData) => {
        set((state) => {
          const key = `${username}-${date}`
          const existing = state.data[key] || createEmptyDayData(date, username)
          
          return {
            data: {
              ...state.data,
              [key]: {
                ...existing,
                weight,
              },
            },
          }
        })
      },
    }),
    {
      name: 'health-tracker-storage',
    }
  )
)
