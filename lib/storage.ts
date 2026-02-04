"use client";

import { DayEntry, MealEntry, MealTime } from "./types";

const STORAGE_KEY = "health-tracker-data";

export const getEmptyMealEntry = (): MealEntry => ({
  id: crypto.randomUUID(),
  time: "",
  foods: [],
  notes: "",
  timestamp: Date.now(),
});

export const getEmptyDayEntry = (date: string): DayEntry => ({
  date,
  isCompliant: true,
  meals: {
    earlyMorning: getEmptyMealEntry(),
    breakfast: getEmptyMealEntry(),
    midMorning: getEmptyMealEntry(),
    lunch: getEmptyMealEntry(),
    tea: getEmptyMealEntry(),
    dinner: getEmptyMealEntry(),
    supper: getEmptyMealEntry(),
  },
  workout: {
    didWorkout: false,
    cardioDuration: "",
    weightTraining: "",
  },
  sleep: {
    wakeTime: "",
    napTime: "",
    sleepTime: "",
  },
  observations: "",
});

export const saveDayEntry = (entry: DayEntry): void => {
  if (typeof window === "undefined") return;
  
  const data = getAllEntries();
  data[entry.date] = entry;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getDayEntry = (date: string): DayEntry => {
  if (typeof window === "undefined") return getEmptyDayEntry(date);
  
  const data = getAllEntries();
  const entry = data[date];
  
  if (!entry) return getEmptyDayEntry(date);
  
  // Ensure backward compatibility with old data
  return {
    ...entry,
    workout: entry.workout || {
      didWorkout: false,
      cardioDuration: "",
      weightTraining: "",
    },
    sleep: entry.sleep || {
      wakeTime: "",
      napTime: "",
      sleepTime: "",
    },
    water: entry.water || {
      intake: 0,
      goal: 8,
    },
    weight: entry.weight || {
      lamisa: "",
      raed: "",
    },
  };
};

export const getAllEntries = (): Record<string, DayEntry> => {
  if (typeof window === "undefined") return {};
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error loading data:", error);
    return {};
  }
};

export const updateMeal = (
  date: string,
  mealTime: MealTime,
  meal: Partial<MealEntry>
): void => {
  const dayEntry = getDayEntry(date);
  dayEntry.meals[mealTime] = {
    ...dayEntry.meals[mealTime],
    ...meal,
  };
  saveDayEntry(dayEntry);
};

export const updateMealTime = (
  date: string,
  mealTime: MealTime,
  time: string
): void => {
  const dayEntry = getDayEntry(date);
  dayEntry.meals[mealTime].time = time;
  saveDayEntry(dayEntry);
};

export const updateWorkout = (
  date: string,
  workout: Partial<DayEntry["workout"]>
): void => {
  const dayEntry = getDayEntry(date);
  dayEntry.workout = {
    ...dayEntry.workout,
    ...workout,
  };
  saveDayEntry(dayEntry);
};

export const updateSleep = (
  date: string,
  sleep: Partial<DayEntry["sleep"]>
): void => {
  const dayEntry = getDayEntry(date);
  dayEntry.sleep = {
    ...dayEntry.sleep,
    ...sleep,
  };
  saveDayEntry(dayEntry);
};

export const updateWater = (
  date: string,
  water: Partial<DayEntry["water"]>
): void => {
  const dayEntry = getDayEntry(date);
  dayEntry.water = {
    ...dayEntry.water,
    ...water,
  };
  saveDayEntry(dayEntry);
};

export const updateWeight = (
  date: string,
  weight: Partial<DayEntry["weight"]>
): void => {
  const dayEntry = getDayEntry(date);
  dayEntry.weight = {
    ...dayEntry.weight,
    ...weight,
  };
  saveDayEntry(dayEntry);
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export const parseDate = (dateString: string): Date => {
  return new Date(dateString + "T00:00:00");
};

export const getToday = (): string => {
  return formatDate(new Date());
};

export const addDays = (dateString: string, days: number): string => {
  const date = parseDate(dateString);
  date.setDate(date.getDate() + days);
  return formatDate(date);
};

export const exportToJSON = (): string => {
  return JSON.stringify(getAllEntries(), null, 2);
};

export const exportToCSV = (): string => {
  const data = getAllEntries();
  
  // Sort dates
  const sortedDates = Object.keys(data).sort();
  
  // Header row matching spreadsheet format with new fields
  const headers = [
    "Date",
    "Wake Time",
    "Nap Time", 
    "Sleep Time",
    "Early Morning",
    "Breakfast",
    "Mid Morning",
    "Lunch",
    "Teatime",
    "Dinner",
    "Supper",
    "Did you workout today?",
    "Cardio Duration",
    "Weight Training",
    "Water Intake (glasses)",
    "Lamisa Weight (lbs)",
    "Raed Weight (lbs)",
    "Observations"
  ];
  
  const rows: string[] = [headers.join(",")];
  
  sortedDates.forEach((date) => {
    const day = data[date];
    
    // Format all meals
    const earlyMorning = day.meals.earlyMorning.foods.join("; ");
    const breakfast = day.meals.breakfast.foods.join("; ");
    const midMorning = day.meals.midMorning.foods.join("; ");
    const lunch = day.meals.lunch.foods.join("; ");
    const teatime = day.meals.tea.foods.join("; ");
    const dinner = day.meals.dinner.foods.join("; ");
    const supper = day.meals.supper.foods.join("; ");
    
    const row = [
      date,
      day.sleep.wakeTime || "",
      day.sleep.napTime || "",
      day.sleep.sleepTime || "",
      `"${earlyMorning}"`,
      `"${breakfast}"`,
      `"${midMorning}"`,
      `"${lunch}"`,
      `"${teatime}"`,
      `"${dinner}"`,
      `"${supper}"`,
      day.workout.didWorkout ? "Yes" : "No",
      day.workout.cardioDuration || "N/A",
      day.workout.weightTraining || "N/A",
      day.water?.intake || "0",
      day.weight?.lamisa || "",
      day.weight?.raed || "",
      `"${day.observations.replace(/"/g, '""')}"`
    ];
    
    rows.push(row.join(","));
  });
  
  return rows.join("\n");
};
