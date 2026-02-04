"use client";

import { useState } from "react";
import { Droplets, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { updateWater } from "@/lib/storage";
import type { DayEntry } from "@/lib/types";

interface WaterCardProps {
  water: DayEntry["water"];
  date: string;
  isCompliant: boolean;
}

export function WaterCard({ water, date, isCompliant }: WaterCardProps) {
  const [intake, setIntake] = useState(water.intake);
  const [goal] = useState(water.goal);

  const handleIncrement = () => {
    const newIntake = intake + 1;
    setIntake(newIntake);
    updateWater(date, { intake: newIntake });
    
    if (newIntake === goal) {
      toast.success("🎉 Water goal achieved!", {
        icon: "💧",
        duration: 2000,
      });
    } else {
      toast.success("Glass added!", {
        icon: "💧",
        duration: 1500,
      });
    }
  };

  const handleDecrement = () => {
    if (intake > 0) {
      const newIntake = intake - 1;
      setIntake(newIntake);
      updateWater(date, { intake: newIntake });
      toast("Glass removed", {
        icon: "➖",
        duration: 1500,
      });
    }
  };

  const percentage = Math.min((intake / goal) * 100, 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-0 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200 shadow-lg hover:shadow-2xl transition-all">
        <div className="p-4">
          {/* Header */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-2 mb-4"
          >
            <motion.div
              animate={{ 
                y: [0, -5, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Droplets className="h-6 w-6 text-cyan-600" />
            </motion.div>
            <h3 className="font-semibold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">💧 Water Intake</h3>
          </motion.div>

          {/* Progress Circle */}
          <div className="flex items-center justify-center mb-4">
            <div className="relative w-32 h-32">
              {/* Background circle */}
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-cyan-100"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  className="text-cyan-500"
                  initial={{ strokeDasharray: "0 352" }}
                  animate={{ 
                    strokeDasharray: `${(percentage / 100) * 352} 352`
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-3xl font-bold text-cyan-600"
                  key={intake}
                  initial={{ scale: 1.3, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  {intake}
                </motion.span>
                <span className="text-sm text-cyan-500">/ {goal} glasses</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <motion.div
            className="flex gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button
                onClick={handleDecrement}
                variant="outline"
                disabled={intake === 0}
                className="w-full border-2 border-cyan-300 hover:bg-cyan-50 hover:border-cyan-400 transition-colors"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1"
            >
              <Button
                onClick={handleIncrement}
                className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50 hover:shadow-xl transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Glass
              </Button>
            </motion.div>
          </motion.div>

          {/* Status message */}
          {intake >= goal && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-sm font-medium text-cyan-600"
            >
              ✨ Goal achieved! Stay hydrated!
            </motion.div>
          )}
          {intake > 0 && intake < goal && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 text-center text-sm text-cyan-500"
            >
              {goal - intake} more {goal - intake === 1 ? 'glass' : 'glasses'} to go!
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
