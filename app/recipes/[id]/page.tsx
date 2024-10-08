"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getRecipe, Recipe } from '@/lib/convex';
import { calculateRecipeNutrition } from '@/lib/nutrition';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

export default function RecipePage() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [nutrition, setNutrition] = useState<{ calories: number, protein: number, fat: number, carbs: number } | null>(null);
  const { toast } = useToast();
  const params = useParams();
  const id = params.id as string;

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const fetchedRecipe = await getRecipe(id);
      setRecipe(fetchedRecipe);
      if (fetchedRecipe) {
        const nutritionInfo = await calculateRecipeNutrition(fetchedRecipe.ingredients);
        setNutrition(nutritionInfo);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!recipe || !nutrition) {
    return <div>Loading...</div>;
  }

  const nutritionData = [
    { name: 'Protein', value: nutrition.protein },
    { name: 'Fat', value: nutrition.fat },
    { name: 'Carbs', value: nutrition.carbs },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">{recipe.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recipe Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{recipe.description}</p>
            <h3 className="font-bold mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside mb-4">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h3 className="font-bold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Nutrition Information</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Calories: {nutrition.calories}</p>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nutritionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {nutritionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}