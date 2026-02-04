"use client";

import { useState } from "react";
import { Sun, Coffee, Moon } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { updateSleep } from "@/lib/storage";
import type { DayEntry } from "@/lib/types";

interface SleepCardProps {
  sleep: DayEntry["sleep"];
  date: string;
  isCompliant: boolean;
}

export function SleepCard({ sleep, date, isCompliant }: SleepCardProps) {
  const [wakeTime, setWakeTime] = useState(sleep.wakeTime);
  const [napTime, setNapTime] = useState(sleep.napTime);
  const [sleepTime, setSleepTime] = useState(sleep.sleepTime);

  const handleWakeTimeChange = (value: string) => {
    setWakeTime(value);
    updateSleep(date, { wakeTime: value });
    if (value) {
      toast.success("Wake time updated", {
        icon: "🌅",
        duration: 1500,
      });
    }
  };

  const handleNapTimeChange = (value: string) => {
    setNapTime(value);
    updateSleep(date, { napTime: value });
    if (value) {
      toast.success("Nap time updated", {
        icon: "😴",
        duration: 1500,
      });
    }
  };

  const handleSleepTimeChange = (value: string) => {
    setSleepTime(value);
    updateSleep(date, { sleepTime: value });
    if (value) {
      toast.success("Sleep time updated", {
        icon: "🌙",
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
      <Card className="p-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg hover:shadow-2xl transition-all card-3d">
        <div className="p-4">
          {/* Header */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-4"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Moon className="h-6 w-6 text-indigo-600" />
            </motion.div>
            <h3 className="font-semibold text-lg bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">😴 Sleep Schedule</h3>
          </motion.div>

          <div className="space-y-4">
            {/* Wake Time */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Sun className="h-4 w-4 text-yellow-600" />
                Wake Time
              </label>
              <Input
                type="time"
                value={wakeTime}
                onChange={(e) => handleWakeTimeChange(e.target.value)}
                className="bg-background"
              />
            </motion.div>

            {/* Nap Time */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Coffee className="h-4 w-4 text-orange-600" />
                Nap Time
              </label>
              <Input
                type="time"
                value={napTime}
                onChange={(e) => handleNapTimeChange(e.target.value)}
                className="bg-background"
              />
            </motion.div>

            {/* Sleep Time */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="text-sm font-medium mb-2 flex items-center gap-2">
                <Moon className="h-4 w-4 text-indigo-600" />
                Sleep Time
              </label>
              <Input
                type="time"
                value={sleepTime}
                onChange={(e) => handleSleepTimeChange(e.target.value)}
                className="bg-background"
              />
            </motion.div>
          </div>

          {/* Summary */}
          {(wakeTime || napTime || sleepTime) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t"
            >
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {wakeTime && <span>🌅 Wake: {wakeTime}</span>}
                {napTime && <span className="ml-2">😴 Nap: {napTime}</span>}
                {sleepTime && <span className="ml-2">🌙 Sleep: {sleepTime}</span>}
              </p>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
