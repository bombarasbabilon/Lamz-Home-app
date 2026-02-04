export interface MealEntry {
  id: string;
  time: string;
  foods: string[];
  notes: string;
  photo?: string;
  timestamp: number;
}

export interface DayEntry {
  date: string;
  isCompliant: boolean;
  meals: {
    earlyMorning: MealEntry;
    breakfast: MealEntry;
    midMorning: MealEntry;
    lunch: MealEntry;
    tea: MealEntry;
    dinner: MealEntry;
    supper: MealEntry;
  };
  workout: {
    didWorkout: boolean;
    cardioDuration: string;
    weightTraining: string;
  };
  sleep: {
    wakeTime: string;
    napTime: string;
    sleepTime: string;
  };
  water: {
    intake: number; // in glasses or ml
    goal: number;
  };
  weight: {
    lamisa: string;
    raed: string;
  };
  observations: string;
}

export type MealTime = 
  | "earlyMorning"
  | "breakfast"
  | "midMorning"
  | "lunch"
  | "tea"
  | "dinner"
  | "supper";

export const MEAL_TIMES: { key: MealTime; label: string; time: string; icon: string }[] = [
  { key: "earlyMorning", label: "Early Morning", time: "06:00", icon: "🌅" },
  { key: "breakfast", label: "Breakfast", time: "08:00", icon: "🍳" },
  { key: "midMorning", label: "Mid Morning", time: "11:00", icon: "☕" },
  { key: "lunch", label: "Lunch", time: "13:00", icon: "🍱" },
  { key: "tea", label: "Tea", time: "16:00", icon: "🫖" },
  { key: "dinner", label: "Dinner", time: "19:00", icon: "🍽️" },
  { key: "supper", label: "Supper", time: "21:00", icon: "🌙" },
];

export const DIET_PLAN_FOODS = {
  earlyMorning: [
    "1½ glasses of water + 1½ tsp methi seeds",
  ],
  breakfast: [
    "2 egg whites",
    "Vegetables",
    "Multigrain bread/Ezekiel bread",
    "Oats (3 tbsp steel-cut/rolled)",
  ],
  midMorning: [
    "1 cup fruit",
    "3 almonds + 1 walnut",
  ],
  lunch: [
    "Salad",
    "1½ cups quinoa/millets (4 tbsp raw)",
    "1½ cups vegetables",
    "1½ cups dal/beans",
  ],
  tea: [
    "Greek yogurt + 2 tsp mixed seeds",
    "1 cup lentil chips",
  ],
  dinner: [
    "1½ bowls soup",
    "Grilled/tandoor chicken/fish (150-200g)",
    "Salad",
    "2 cups stir-fried vegetables",
    "Chicken/tofu/paneer/beansprouts",
    "Chicken kebabs",
    "3-4 egg whites bhurji + toast",
    "2 cups lentil pasta with chicken/seafood",
    "3 moong dal/besan chillas + vegetable + chutney",
    "2 cups moong dal khichri",
    "4-5 paneer tikkis (100g paneer) + salad",
  ],
  supper: [
    "Light snack if needed",
  ],
};
