"use client";

import { useState } from "react";
import { Dumbbell, Timer, Activity } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateWorkout } from "@/lib/storage";
import type { DayEntry } from "@/lib/types";

interface WorkoutCardProps {
  workout: DayEntry["workout"];
  date: string;
  isCompliant: boolean;
}

export function WorkoutCard({ workout, date, isCompliant }: WorkoutCardProps) {
  const [didWorkout, setDidWorkout] = useState(workout.didWorkout);
  const [cardioDuration, setCardioDuration] = useState(workout.cardioDuration);
  const [weightTraining, setWeightTraining] = useState(workout.weightTraining);

  const handleWorkoutToggle = (value: boolean) => {
    setDidWorkout(value);
    updateWorkout(date, { didWorkout: value });
    
    if (value) {
      toast.success("Great job working out! 💪", {
        icon: "🏋️",
        duration: 2000,
      });
    } else {
      toast("Workout marked as not done", {
        icon: "📝",
        duration: 2000,
      });
    }
  };

  const handleCardioDurationChange = (value: string) => {
    setCardioDuration(value);
    updateWorkout(date, { cardioDuration: value });
    if (value) {
      toast.success("Cardio duration updated", {
        icon: "🏃",
        duration: 1500,
      });
    }
  };

  const handleWeightTrainingChange = (value: string) => {
    setWeightTraining(value);
    updateWorkout(date, { weightTraining: value });
    if (value) {
      toast.success("Weight training updated", {
        icon: "🏋️",
        duration: 1500,
      });
    }
  };

  const bgColor = isCompliant ? "bg-blue-50" : "bg-orange-50";
  const borderColor = isCompliant ? "border-blue-200" : "border-orange-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-0 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg hover:shadow-2xl transition-all card-3d">
        <div className="p-4">
          {/* Header */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Dumbbell className="h-6 w-6 text-purple-600" />
            </motion.div>
            <h3 className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">💪 Workout</h3>
          </motion.div>

          {/* Did you workout toggle */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="text-sm font-medium mb-2 block">Did you workout today?</label>
            <div className="flex gap-2">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  onClick={() => handleWorkoutToggle(true)}
                  variant={didWorkout ? "default" : "outline"}
                  className={`w-full transform transition-all ${
                    didWorkout 
                      ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/50 scale-105" 
                      : "hover:border-green-400 hover:text-green-600"
                  }`}
                >
                  ✅ Yes
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  onClick={() => handleWorkoutToggle(false)}
                  variant={!didWorkout ? "default" : "outline"}
                  className={`w-full transform transition-all ${
                    !didWorkout 
                      ? "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg shadow-orange-500/50 scale-105" 
                      : "hover:border-orange-400 hover:text-orange-600"
                  }`}
                >
                  ❌ No
                </Button>
              </motion.div>
            </div>
          </motion.div>

          {/* Cardio Duration */}
          <motion.div
            className="mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-600" />
              Cardio Duration
            </label>
            <Input
              type="text"
              value={cardioDuration}
              onChange={(e) => handleCardioDurationChange(e.target.value)}
              placeholder="e.g., 30 mins, 5km run"
              className="bg-background"
            />
          </motion.div>

          {/* Weight Training */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <label className="text-sm font-medium mb-2 flex items-center gap-2">
              <Timer className="h-4 w-4 text-purple-600" />
              Weight Training
            </label>
            <Input
              type="text"
              value={weightTraining}
              onChange={(e) => handleWeightTrainingChange(e.target.value)}
              placeholder="e.g., Upper body, 45 mins"
              className="bg-background"
            />
          </motion.div>

          {/* Summary */}
          {(cardioDuration || weightTraining) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <p className="text-xs text-muted-foreground">
                {didWorkout ? "💪 Workout completed!" : "📝 Workout details saved"}
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
