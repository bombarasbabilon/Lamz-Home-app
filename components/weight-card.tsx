"use client";

import { useState } from "react";
import { Scale, Save } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateWeight } from "@/lib/storage";
import type { DayEntry } from "@/lib/types";

interface WeightCardProps {
  weight: DayEntry["weight"];
  date: string;
  isCompliant: boolean;
}

export function WeightCard({ weight, date, isCompliant }: WeightCardProps) {
  const [lamisaWeight, setLamisaWeight] = useState(weight.lamisa);
  const [raedWeight, setRaedWeight] = useState(weight.raed);
  const [hasChanges, setHasChanges] = useState(false);

  const handleLamisaChange = (value: string) => {
    setLamisaWeight(value);
    setHasChanges(true);
  };

  const handleRaedChange = (value: string) => {
    setRaedWeight(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    updateWeight(date, {
      lamisa: lamisaWeight,
      raed: raedWeight,
    });
    setHasChanges(false);
    toast.success("Weight recorded!", {
      icon: "⚖️",
      duration: 2000,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-0 bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-lg hover:shadow-2xl transition-all">
        <div className="p-4">
          {/* Header */}
          <motion.div
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between mb-4"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ 
                  rotate: [0, -5, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              >
                <Scale className="h-6 w-6 text-emerald-600" />
              </motion.div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">⚖️ Weekly Weight</h3>
            </div>
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Button 
                  onClick={handleSave} 
                  size="sm" 
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-lg hover:shadow-xl transition-all"
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Weight Inputs */}
          <div className="space-y-4">
            {/* Lamisa */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                <span className="text-lg">👩</span>
                Lamisa
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter weight"
                  value={lamisaWeight}
                  onChange={(e) => handleLamisaChange(e.target.value)}
                  className="pr-12 border-2 border-emerald-200 focus:border-emerald-400 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  lbs
                </span>
              </div>
              {lamisaWeight && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-emerald-600"
                >
                  ✓ Recorded: {lamisaWeight} lbs
                </motion.p>
              )}
            </motion.div>

            {/* Raed */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-2"
            >
              <label className="text-sm font-medium text-teal-700 flex items-center gap-2">
                <span className="text-lg">👨</span>
                Raed
              </label>
              <div className="relative">
                <Input
                  type="number"
                  step="0.1"
                  placeholder="Enter weight"
                  value={raedWeight}
                  onChange={(e) => handleRaedChange(e.target.value)}
                  className="pr-12 border-2 border-teal-200 focus:border-teal-400 transition-colors"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  lbs
                </span>
              </div>
              {raedWeight && (
                <motion.p 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs text-teal-600"
                >
                  ✓ Recorded: {raedWeight} lbs
                </motion.p>
              )}
            </motion.div>
          </div>

          {/* Info text */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-xs text-center text-muted-foreground"
          >
            📅 Record weekly for progress tracking
          </motion.p>
        </div>
      </Card>
    </motion.div>
  );
}
