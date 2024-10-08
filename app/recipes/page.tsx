"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getRecipes, Recipe } from '@/lib/convex';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const fetchedRecipes = await getRecipes();
      setRecipes(fetchedRecipes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch recipes. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Dog Food Recipes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe._id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{recipe.description}</p>
              <Button>View Recipe</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}