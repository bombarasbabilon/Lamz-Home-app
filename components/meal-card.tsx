"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Sparkles, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { MealEntry, MealTime } from "@/lib/types";
import { DIET_PLAN_FOODS } from "@/lib/types";
import { updateMeal, updateMealTime } from "@/lib/storage";

interface MealCardProps {
  mealTime: { key: MealTime; label: string; time: string; icon?: string };
  meal: MealEntry;
  date: string;
  isCompliant: boolean;
}

export function MealCard({ mealTime, meal, date, isCompliant }: MealCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [foods, setFoods] = useState<string[]>(meal.foods);
  const [notes, setNotes] = useState(meal.notes);
  const [customFood, setCustomFood] = useState("");
  const [mealTimeValue, setMealTimeValue] = useState(meal.time || mealTime.time);
  const [isEditingTime, setIsEditingTime] = useState(false);

  const suggestedFoods = DIET_PLAN_FOODS[mealTime.key] || [];

  const handleSave = () => {
    updateMeal(date, mealTime.key, {
      foods,
      notes,
      timestamp: Date.now(),
    });
    setIsOpen(false);
    toast.success(`${mealTime.label} saved!`, {
      icon: "✅",
      duration: 2000,
    });
  };

  const handleTimeChange = (newTime: string) => {
    setMealTimeValue(newTime);
    updateMealTime(date, mealTime.key, newTime);
    setIsEditingTime(false);
    toast.success("Time updated!", {
      icon: "⏰",
      duration: 1500,
    });
  };

  const handleAddFood = (food: string) => {
    if (!foods.includes(food)) {
      setFoods([...foods, food]);
      toast.success(`Added ${food}`, {
        icon: "🍽️",
        duration: 1500,
      });
    }
  };

  const handleAddCustomFood = () => {
    if (customFood.trim() && !foods.includes(customFood.trim())) {
      setFoods([...foods, customFood.trim()]);
      setCustomFood("");
      toast.success("Added custom food", {
        icon: "➕",
        duration: 1500,
      });
    }
  };

  const handleRemoveFood = (index: number) => {
    const removedFood = foods[index];
    setFoods(foods.filter((_, i) => i !== index));
    toast(`Removed ${removedFood}`, {
      icon: "🗑️",
      duration: 1500,
    });
  };

  const bgColor = isCompliant ? "bg-blue-50" : "bg-orange-50";
  const borderColor = isCompliant ? "border-blue-200" : "border-orange-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="p-0 bg-white/95 border-2 border-amber-200 hover:border-amber-400 shadow-lg hover:shadow-2xl transition-all">
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-1">
                {mealTime.icon && (
                  <motion.span 
                    className="text-xl"
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 500 }}
                  >
                    {mealTime.icon}
                  </motion.span>
                )}
                <h3 className="font-semibold text-lg bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">{mealTime.label}</h3>
              </div>
              {isEditingTime ? (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={mealTimeValue}
                    onChange={(e) => handleTimeChange(e.target.value)}
                    className="h-7 w-24 text-xs"
                    autoFocus
                    onBlur={() => setIsEditingTime(false)}
                  />
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingTime(true)}
                  className="text-sm text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  <Clock className="h-3 w-3" />
                  {mealTimeValue || mealTime.time}
                </button>
              )}
            </motion.div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="sm" variant="outline" className="group">
                    {meal.foods.length > 0 ? (
                      <>
                        <Edit2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                        Edit
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2 group-hover:rotate-90 transition-transform" />
                        Add
                      </>
                    )}
                  </Button>
                </motion.div>
              </DialogTrigger>
              <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {mealTime.icon && <span className="text-2xl">{mealTime.icon}</span>}
                    Log {mealTime.label}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                  {/* Suggested Foods */}
                  {suggestedFoods.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-yellow-500" />
                        <h4 className="font-medium">Suggested Foods</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {suggestedFoods.map((food, index) => (
                          <motion.div
                            key={`${food}-${index}`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * index }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddFood(food)}
                              disabled={foods.includes(food)}
                            >
                              {food}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Custom Food Input */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="font-medium mb-2">Add Custom Food</h4>
                    <div className="flex gap-2">
                      <Input
                        value={customFood}
                        onChange={(e) => setCustomFood(e.target.value)}
                        placeholder="Enter food item..."
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomFood();
                          }
                        }}
                      />
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button onClick={handleAddCustomFood} size="sm">
                          Add
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Selected Foods */}
                  <AnimatePresence mode="popLayout">
                    {foods.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <h4 className="font-medium mb-2">Selected Foods ({foods.length})</h4>
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {foods.map((food, index) => (
                            <motion.div
                              key={`${food}-${index}`}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ delay: index * 0.03 }}
                              layout
                            >
                              <motion.div
                                className="flex items-center justify-between p-2 bg-background rounded-md"
                                whileHover={{ backgroundColor: "rgba(0,0,0,0.05)" }}
                              >
                                <span className="text-sm">{food}</span>
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveFood(index)}
                                    className="hover:bg-red-100 hover:text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </motion.div>
                              </motion.div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Notes */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h4 className="font-medium mb-2">Notes (Optional)</h4>
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add any observations or notes..."
                      rows={3}
                    />
                  </motion.div>

                  {/* Save Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button onClick={handleSave} className="w-full">
                      Save Meal
                    </Button>
                  </motion.div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Display Foods */}
          <AnimatePresence mode="wait">
            {meal.foods.length > 0 ? (
              <motion.div
                key="has-foods"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <div className="flex flex-wrap gap-1">
                  {meal.foods.map((food, index) => (
                    <motion.span
                      key={`${food}-${index}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="inline-block px-2 py-1 text-xs bg-background rounded-md cursor-default"
                    >
                      {food}
                    </motion.span>
                  ))}
                </div>
                {meal.notes && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground italic"
                  >
                    📝 {meal.notes}
                  </motion.p>
                )}
              </motion.div>
            ) : (
              <motion.p
                key="no-foods"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-sm text-muted-foreground text-center py-2"
              >
                No meal logged yet
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </Card>
    </motion.div>
  );
}
