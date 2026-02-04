"use client";

import { useState } from "react";
import { FileText, Save } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { saveDayEntry, getDayEntry } from "@/lib/storage";
import type { DayEntry } from "@/lib/types";

interface ObservationsCardProps {
  observations: string;
  date: string;
  isCompliant: boolean;
}

export function ObservationsCard({ observations, date, isCompliant }: ObservationsCardProps) {
  const [notes, setNotes] = useState(observations);
  const [hasChanges, setHasChanges] = useState(false);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    setHasChanges(true);
  };

  const handleSave = () => {
    const dayEntry = getDayEntry(date);
    dayEntry.observations = notes;
    saveDayEntry(dayEntry);
    setHasChanges(false);
    toast.success("Observations saved!", {
      icon: "📝",
      duration: 2000,
    });
  };

  const bgColor = isCompliant ? "bg-blue-50" : "bg-orange-50";
  const borderColor = isCompliant ? "border-blue-200" : "border-orange-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="p-0 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 shadow-lg hover:shadow-2xl transition-all card-3d">
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
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              >
                <FileText className="h-6 w-6 text-orange-600" />
              </motion.div>
              <h3 className="font-semibold text-lg bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">📝 Daily Observations</h3>
            </div>
            {hasChanges && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button onClick={handleSave} size="sm" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save
                </Button>
              </motion.div>
            )}
          </motion.div>

          {/* Textarea */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Textarea
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add observations about your day, how you felt, energy levels, challenges, etc..."
              rows={4}
              className="bg-background resize-none"
            />
          </motion.div>

          {/* Character count */}
          {notes && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-xs text-muted-foreground text-right"
            >
              {notes.length} characters
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
