import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { addMealToHistory, getMealHistory, updateMealHistory, deleteMealHistory } from '@/lib/convex';
import { useRateLimit } from '@/hooks/useRateLimit';
import { sanitizeInput } from '@/lib/utils';

interface MealPlanningCalendarProps {
  recipes: Recipe[];
}

export function MealPlanningCalendar({ recipes }: MealPlanningCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRecipe, setSelectedRecipe] = useState<string>('');
  const [mealPlan, setMealPlan] = useState<{ [date: string]: string }>({});
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const { toast } = useToast();
  const { isRateLimited, incrementCounter } = useRateLimit(10, 60000); // 10 requests per minute

  useEffect(() => {
    fetchMealHistory();
  }, []);

  const fetchMealHistory = async () => {
    try {
      const history = await getMealHistory();
      const planObject = history.reduce((acc, meal) => {
        acc[meal.date] = meal.recipeId;
        return acc;
      }, {} as { [date: string]: string });
      setMealPlan(planObject);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch meal history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddMeal = async () => {
    if (isRateLimited()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Please wait before making more requests.",
        variant: "destructive",
      });
      return;
    }

    incrementCounter();

    if (selectedDate && selectedRecipe) {
      const dateString = selectedDate.toISOString().split('T')[0];
      const sanitizedRecipeId = sanitizeInput(selectedRecipe);

      try {
        await addMealToHistory(sanitizedRecipeId, dateString);
        setMealPlan(prev => ({ ...prev, [dateString]: sanitizedRecipeId }));
        toast({
          title: "Success",
          description: "Meal added to plan.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to add meal. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditMeal = async (date: string) => {
    if (isRateLimited()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Please wait before making more requests.",
        variant: "destructive",
      });
      return;
    }

    incrementCounter();

    const sanitizedRecipeId = sanitizeInput(selectedRecipe);

    try {
      await updateMealHistory(sanitizedRecipeId, date);
      setMealPlan(prev => ({ ...prev, [date]: sanitizedRecipeId }));
      setEditingDate(null);
      toast({
        title: "Success",
        description: "Meal updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMeal = async (date: string) => {
    if (isRateLimited()) {
      toast({
        title: "Rate Limit Exceeded",
        description: "Please wait before making more requests.",
        variant: "destructive",
      });
      return;
    }

    incrementCounter();

    try {
      await deleteMealHistory(date);
      setMealPlan(prev => {
        const newPlan = { ...prev };
        delete newPlan[date];
        return newPlan;
      });
      toast({
        title: "Success",
        description: "Meal deleted successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete meal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Meal Planning Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Add Meal</CardTitle>
        </CardHeader>
        <CardContent>
          <Select onValueChange={setSelectedRecipe} value={selectedRecipe}>
            <SelectTrigger>
              <SelectValue placeholder="Select a recipe" />
            </SelectTrigger>
            <SelectContent>
              {recipes.map((recipe) => (
                <SelectItem key={recipe._id} value={recipe._id}>{recipe.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleAddMeal} className="mt-4">Add Meal</Button>
        </CardContent>
      </Card>
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>Meal Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.entries(mealPlan).map(([date, recipeId]) => (
            <div key={date} className="flex items-center justify-between mb-2">
              <span>{date}</span>
              {editingDate === date ? (
                <>
                  <Select onValueChange={setSelectedRecipe} value={selectedRecipe}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipes.map((recipe) => (
                        <SelectItem key={recipe._id} value={recipe._id}>{recipe.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => handleEditMeal(date)}>Save</Button>
                </>
              ) : (
                <>
                  <span>{recipes.find(r => r._id === recipeId)?.name}</span>
                  <div>
                    <Button onClick={() => setEditingDate(date)}>Edit</Button>
                    <Button onClick={() => handleDeleteMeal(date)} variant="destructive">Delete</Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}