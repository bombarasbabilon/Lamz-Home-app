"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Download, Check, AlertTriangle, Upload, Settings } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { MealCard } from "@/components/meal-card";
import { WorkoutCard } from "@/components/workout-card";
import { SleepCard } from "@/components/sleep-card";
import { WaterCard } from "@/components/water-card";
import { WeightCard } from "@/components/weight-card";
import { ObservationsCard } from "@/components/observations-card";
import { MEAL_TIMES } from "@/lib/types";
import { seedHistoricalData } from "@/lib/seed-data";
import {
  getDayEntry,
  saveDayEntry,
  getToday,
  addDays,
  formatDate,
  parseDate,
  exportToJSON,
  exportToCSV,
  initializeStorage,
  isFirstVisit,
  importFromJSON,
  clearAllData,
} from "@/lib/storage";
import type { DayEntry } from "@/lib/types";

export default function Home() {
  const [currentDate, setCurrentDate] = useState(getToday());
  const [dayEntry, setDayEntry] = useState<DayEntry | null>(null);
  const [direction, setDirection] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Initialize storage and load seed data on first mount
  useEffect(() => {
    initializeStorage();
    
    const firstVisit = isFirstVisit();
    if (firstVisit) {
      const seeded = seedHistoricalData();
      if (seeded) {
        toast.success("📚 Historical data loaded!", {
          duration: 3000,
          icon: "✅",
        });
      }
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const entry = getDayEntry(currentDate);
    setDayEntry(entry);
    setTimeout(() => setIsLoading(false), 300);
  }, [currentDate]);

  // Auto-save effect
  useEffect(() => {
    if (dayEntry) {
      saveDayEntry(dayEntry);
      setLastSaved(new Date());
    }
  }, [dayEntry]);

  const handlePreviousDay = () => {
    setDirection(-1);
    setCurrentDate(addDays(currentDate, -1));
  };

  const handleNextDay = () => {
    setDirection(1);
    setCurrentDate(addDays(currentDate, 1));
  };

  const handleToday = () => {
    setDirection(0);
    setCurrentDate(getToday());
    toast.success("Jumped to today!");
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const selectedDate = formatDate(date);
      setDirection(0);
      setCurrentDate(selectedDate);
      setIsCalendarOpen(false);
      toast.success(`Jumped to ${date.toLocaleDateString()}`, {
        icon: "📅",
        duration: 2000,
      });
    }
  };

  const handleComplianceToggle = () => {
    if (!dayEntry) return;
    const updated = { ...dayEntry, isCompliant: !dayEntry.isCompliant };
    setDayEntry(updated);
    saveDayEntry(updated);
    
    if (updated.isCompliant) {
      toast.success("Day marked as compliant!", {
        icon: <Check className="w-5 h-5" />,
      });
    } else {
      toast("Day marked as non-compliant", {
        icon: <AlertTriangle className="w-5 h-5 text-orange-500" />,
      });
    }
  };

  const handleExportJSON = () => {
    const data = exportToJSON();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `health-tracker-${formatDate(new Date())}.json`;
    a.click();
    toast.success("Exported to JSON!");
  };

  const handleExportCSV = () => {
    const data = exportToCSV();
    const blob = new Blob([data], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `health-tracker-${formatDate(new Date())}.csv`;
    a.click();
    toast.success("Exported to CSV!");
  };

  const handleImportJSON = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const jsonString = event.target?.result as string;
          const success = importFromJSON(jsonString);
          if (success) {
            toast.success("✅ Data imported successfully!");
            setDayEntry(getDayEntry(currentDate));
          } else {
            toast.error("❌ Failed to import data");
          }
        } catch (error) {
          toast.error("❌ Invalid JSON file");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleSeedData = () => {
    seedHistoricalData();
    toast.success("Historical data loaded! 📚", {
      duration: 3000,
    });
    // Refresh current view
    setDayEntry(getDayEntry(currentDate));
  };

  // Swipe gesture handling
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swipe left - next day
      if (currentDate !== getToday()) {
        handleNextDay();
      }
    }

    if (touchStart - touchEnd < -75) {
      // Swipe right - previous day
      handlePreviousDay();
    }
  };

  if (isLoading || !dayEntry) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-lg font-medium"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  const dateObj = new Date(currentDate + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-b from-background to-muted/20"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Header */}
      <motion.header 
        className="sticky top-0 z-50 bg-white/95 border-b-2 border-purple-200 shadow-lg"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="container mx-auto px-4 py-4">
          <motion.h1 
            className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            🎯 Health Tracker
          </motion.h1>
          
          {/* Date Navigation */}
          <motion.div 
            className="flex items-center justify-between gap-2 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousDay}
              className="hover:scale-110 transition-transform"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentDate}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="flex-1 text-center"
              >
                <div className="font-semibold text-sm sm:text-base">{formattedDate}</div>
              </motion.div>
            </AnimatePresence>
            
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextDay}
              disabled={currentDate === getToday()}
              className="hover:scale-110 transition-transform disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>

          <motion.div 
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="flex-1 min-w-[80px] hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Calendar className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Today</span>
              <span className="sm:hidden">Now</span>
            </Button>
            
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 min-w-[80px] hover:bg-purple-50 hover:border-purple-300 transition-colors"
                >
                  📅 <span className="ml-1 sm:ml-2">Date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={parseDate(currentDate)}
                  onSelect={handleDateSelect}
                  initialFocus
                  disabled={(date) => date > new Date()}
                />
              </PopoverContent>
            </Popover>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="flex-1 min-w-[80px] hover:bg-green-50 hover:border-green-300 transition-colors"
            >
              <Download className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">Save</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportJSON}
              className="flex-1 min-w-[80px] hover:bg-blue-50 hover:border-blue-300 transition-colors"
            >
              <Upload className="h-4 w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Import</span>
              <span className="sm:hidden">Load</span>
            </Button>
          </motion.div>
          
          {/* Auto-save Indicator */}
          {lastSaved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center text-xs text-green-600 mt-2 flex items-center justify-center gap-1"
            >
              <Check className="w-3 h-3" />
              <span>All changes saved automatically</span>
            </motion.div>
          )}
        </div>
      </motion.header>

      {/* Compliance Indicator */}
      <div className="container mx-auto px-4 py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card
            className={`p-4 cursor-pointer transition-all duration-300 ${
              dayEntry.isCompliant
                ? "bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 text-white border-0 shadow-[0_8px_30px_rgb(34,197,94,0.4)]"
                : "bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white border-0 shadow-[0_8px_30px_rgb(249,115,22,0.4)]"
            } hover:shadow-2xl card-3d`}
            onClick={handleComplianceToggle}
          >
            <div className="text-center">
              <motion.div 
                className="font-semibold flex items-center justify-center gap-2 text-white"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {dayEntry.isCompliant ? (
                  <>
                    <Check className="h-5 w-5" />
                    ✨ Crushing It!
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5" />
                    💪 Keep Pushing!
                  </>
                )}
              </motion.div>
              <motion.div 
                className="text-sm text-muted-foreground mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                Tap to toggle
              </motion.div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Workout & Sleep Tracking */}
      <div className="container mx-auto px-4">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5,
              },
            },
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
          >
            <WorkoutCard
              workout={dayEntry.workout}
              date={currentDate}
              isCompliant={dayEntry.isCompliant}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
          >
            <WaterCard
              water={dayEntry.water}
              date={currentDate}
              isCompliant={dayEntry.isCompliant}
            />
          </motion.div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 24,
            }}
          >
            <SleepCard
              sleep={dayEntry.sleep}
              date={currentDate}
              isCompliant={dayEntry.isCompliant}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Meal Cards */}
      <div className="container mx-auto px-4 pb-8">
        <motion.div 
          className="space-y-4"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.5,
              },
            },
          }}
        >
          {MEAL_TIMES.map((mealTime, index) => (
            <motion.div
              key={mealTime.key}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 24,
              }}
            >
              <MealCard
                mealTime={mealTime}
                meal={dayEntry.meals[mealTime.key]}
                date={currentDate}
                isCompliant={dayEntry.isCompliant}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Observations & Weight Section */}
        <motion.div
          className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <ObservationsCard
            observations={dayEntry.observations}
            date={currentDate}
            isCompliant={dayEntry.isCompliant}
          />
          <WeightCard
            weight={dayEntry.weight}
            date={currentDate}
            isCompliant={dayEntry.isCompliant}
          />
        </motion.div>
      </div>

      {/* Swipe Hint */}
      <motion.div
        className="fixed bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground bg-background/80 backdrop-blur px-4 py-2 rounded-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        ← Swipe to navigate →
      </motion.div>
    </div>
  );
}

