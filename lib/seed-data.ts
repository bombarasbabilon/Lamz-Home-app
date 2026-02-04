import { saveDayEntry } from "./storage";
import type { DayEntry } from "./types";

// Historical data from spreadsheet
export const seedHistoricalData = () => {
  const historicalData: DayEntry[] = [
    // Week 262-B - January 6-12, 2026 (Non-compliant days)
    {
      date: "2026-01-06",
      isCompliant: false,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["1 Slice sourdough", "1 egg + 2 egg whites", "1 slice cheese"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["Rice, Daal, Salad (cucumber, Onion, Tomato, Tuna, Ham Napoli, Mushrooms, Pumpkin Seed, Sunflower Seed"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: ["1 Chicken breast, Salad (Lettuce, Cucumber, Onion, Tomato, Feta, Hemp, Hearts, Sunflower, Pumpkin Seed, Sunflower Seed, Baby spinach"], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: ["2 squares of 85% Dark Chocolate, 3 slices of cheese"], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "10:00:00", napTime: "", sleepTime: "17:00:00" },
      observations: "Started the day late, meals got pushed out and did workout. Need to plan day earlier."
    },
    {
      date: "2026-01-07",
      isCompliant: false,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["Coffee with cream, Scrambled Omelette (1/2 a", "Tomato, 1/2 jalapenos, 1 egg + 2 egg whites, 1 slice mushroom"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["1 party, 3 jalapeños, 2 waffles"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: ["Rice, Salad, (Tuna, Salad, broccoli, Courgette, Kidney beans, cilantro, sunflower seeds, pumpkin seeds, 1/2 chipote pepper, 1 baby yogurt, 4 baby spinach"], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: ["200g chicken, chicken broth soup"], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: ["1.5 low mashi seeds, Scrambled Omelette (1/2 a Tomato, Onion, Spinach, 2 Mushrooms, 1 egg + 2 egg whites"], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "10:00:00", napTime: "", sleepTime: "2:00:30" },
      observations: "Started the day late again, getting towards the end of the day. Need to start day earlier, need to prep food for ingredients in advance"
    },
    {
      date: "2026-01-08",
      isCompliant: false,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["1 Slice sourdough, Onion, Spinach, 2 Mushrooms, 1 egg + 2 egg whites"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["5 almonds, 1 cup Pomegranate", "Salad (1/2 can chickpea, 1/2 tomato, lettuce, 1/2 onion, 1/2 avocado, 1/2 cucumber)"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: ["1.5 cup Tow yum chop, 1 big chilli ari fried chicken"], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "11:00:00", napTime: "", sleepTime: "2:00:30" },
      observations: "Almost got a workout in but had a family emergency to attend. Not happy with sleeping late as well"
    },
    {
      date: "2026-01-09",
      isCompliant: false,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["1 egg + 2 egg whites, Salad (lettuce, onion, 1/4 cucumber, and a sm of chickpea, sunflower seeds, pumpkin seeds, 5 almonds, 2 walnuts, 2 strawberries"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: ["2 slices sourdough toast, yogurt spread (1.5 blackberries, peanut butter, cinnamon, mini 1/2kg smoked salmon"], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "11:00:00", napTime: "", sleepTime: "4:00:30" },
      observations: "Woke up late so combined with lunch and ate three meals. Better for macro tracking"
    },
    {
      date: "2026-01-10",
      isCompliant: false,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["1 Slice sourdough, 1 egg + 2 egg whites, 1 slice mushroom"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["5 almonds, 1 walnut", "Stir Fry vegetables (mushroom, carrot, bell peppers, chickpea"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: ["1 cup miso soup with greaser, 1 bass fillet"], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "11:00:00", napTime: "", sleepTime: "2:00:30" },
      observations: "Went to David's for dinner but didn't eat cheat meal"
    },
    {
      date: "2026-01-11",
      isCompliant: false,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["Salad, Ladyfish, 5 almonds, 2 walnuts"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["2 bowls of rice and sour soup, 2 bass chicken breast, sliced chicken, 7 bass chicken pakora"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: ["Manchurian chicken, 1 chicken pakora"], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: ["1/2 cup rice, 2 pieces of lamb shoulder, 1 sambe, 1 Dosa"], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "12:00:00", napTime: "", sleepTime: "5:00:30" },
      observations: "Cheat day"
    },
    {
      date: "2026-01-12",
      isCompliant: false,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["1 egg + 2 egg whites + 1 slice sourdough", "1 sliced fish soup, 1 slice of hearts, tomfalis, 1 bowl smoked salmon"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: ["1 bowl kidney beans, Salad (lettuce, onion, cucumber, avocado, sunflower seeds, pumpkin seeds, chickpeas, cranberries"], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: ["2 oranges"], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: ["1 bowl fish soup, 2 slices of hearts, tomfalis, 1 bowl smoked salmon"], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: ["3 pieces dark chocolate"], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "1:00:00", napTime: "", sleepTime: "2:30:30" },
      observations: ""
    },
    // Week 263 - January 13-19, 2026 (Compliant days with workouts)
    {
      date: "2026-01-13",
      isCompliant: true,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: ["Stir Fry vegetables (bell pepper, onion), 1 egg + 2 egg whites"], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["3 free whites"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["Patch paneer, Salad"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: ["200g chicken, vegetable soup"], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: true, cardioDuration: "80", weightTraining: "60" },
      sleep: { wakeTime: "7:00:00", napTime: "", sleepTime: "" },
      observations: ""
    },
    {
      date: "2026-01-14",
      isCompliant: true,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["Burrito bowl (lettuce, onion, cucumber, red beans, 1/2 chipotle pepper, sweet potato crackers, 1 lime yogurt"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["5 almonds, 1 walnut, 1 orange"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: ["Carnie, 100g chicken"], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: true, cardioDuration: "60", weightTraining: "N/A" },
      sleep: { wakeTime: "9:00:00", napTime: "", sleepTime: "2:30:30" },
      observations: ""
    },
    {
      date: "2026-01-15",
      isCompliant: true,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["Burrito bowl (lettuce, onion, cucumber, red beans, 1/2 chipotle pepper, sweet potato crackers, 1 lime yogurt"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["5 almonds, 1 walnut, 1 lime yogurt, 1 egg + 2 egg whites"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: ["1/4 cup okra, 200g chicken"], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: true, cardioDuration: "60", weightTraining: "N/A" },
      sleep: { wakeTime: "10:00:00", napTime: "", sleepTime: "" },
      observations: ""
    },
    {
      date: "2026-01-16",
      isCompliant: true,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: ["1 egg + 2 egg whites, 1 slice sourdough"], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["5 almonds, 2 walnuts"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["1 lime quinoa, red curry (carrot puree, peas, beans, tomato onion)"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: ["Salad (cucumber, tomatoes, onion, coriander, 1/2 kilo toned milk chicken, fish soup (white beans, 1 kgs, 1/2 cup broth)"], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [] , notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: true, cardioDuration: "60", weightTraining: "N/A" },
      sleep: { wakeTime: "10:00:00", napTime: "", sleepTime: "2:00:30" },
      observations: ""
    },
    {
      date: "2026-01-17",
      isCompliant: true,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: ["1 egg + 2 egg whites, 1 slice sourdough, 1 pineapple laughing cow light"], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["5 almonds, 1 walnut, 1 apple"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["Salad (lettuce, cucumber, onion, tomato, dressing, seeds, 1/2 chipotle breast, fish soup (chicken broth)"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "10:00:00", napTime: "", sleepTime: "" },
      observations: ""
    },
    {
      date: "2026-01-18",
      isCompliant: true,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: ["1 Alfredo pats, motor with fries"], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["5 almonds, 1 walnut"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: ["1 small bowl moons, 2 chicken thighs, 1/2 cup rice"], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: false, cardioDuration: "N/A", weightTraining: "N/A" },
      sleep: { wakeTime: "", napTime: "", sleepTime: "1:00:30" },
      observations: ""
    },
    {
      date: "2026-01-19",
      isCompliant: true,
      meals: {
        earlyMorning: { id: crypto.randomUUID(), time: "", foods: ["Falafel Takka burger, Salad"], notes: "", timestamp: Date.now() },
        breakfast: { id: crypto.randomUUID(), time: "", foods: ["1 orange, 5 almonds, 2 walnuts, 2 walnut"], notes: "", timestamp: Date.now() },
        midMorning: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        lunch: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() },
        tea: { id: crypto.randomUUID(), time: "", foods: ["200g chicken, vegetable soup"], notes: "", timestamp: Date.now() },
        dinner: { id: crypto.randomUUID(), time: "", foods: ["1 orange, 30 dark chocolate covered acai berry"], notes: "", timestamp: Date.now() },
        supper: { id: crypto.randomUUID(), time: "", foods: [], notes: "", timestamp: Date.now() }
      },
      workout: { didWorkout: true, cardioDuration: "60", weightTraining: "N/A" },
      sleep: { wakeTime: "", napTime: "", sleepTime: "3:00:30" },
      observations: "Clean Bulk day"
    }
  ];

  // Save all historical data
  historicalData.forEach(entry => {
    saveDayEntry(entry);
  });

  console.log(`Seeded ${historicalData.length} days of historical data`);
};
