"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { getUser, User, getRecipes, Recipe, saveFavoriteRecipe, getMealHistory, addMealToHistory } from '@/lib/convex';
import { generateRecipeRecommendation } from '@/lib/ai';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recommendation, setRecommendation] = useState<string>('');
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [mealHistory, setMealHistory] = useState<{ date: string; recipeId: string }[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
    fetchRecipes();
    fetchMealHistory();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
      if (userData) {
        const recRecommendation = await generateRecipeRecommendation({
          age: userData.dogAge,
          weight: userData.dogWeight,
          breed: userData.dogBreed,
          activityLevel: userData.activityLevel,
          dietaryRestrictions: userData.dietaryRestrictions,
        });
        setRecommendation(recRecommendation);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const fetchMealHistory = async () => {
    try {
      const history = await getMealHistory();
      setMealHistory(history);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch meal history. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSaveFavorite = async (recipeId: string) => {
    try {
      await saveFavoriteRecipe(recipeId);
      toast({
        title: "Success",
        description: "Recipe added to favorites!",
      });
      // Refresh favorite recipes
      const updatedFavorites = await getFavoriteRecipes();
      setFavoriteRecipes(updatedFavorites);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save favorite recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddToMealHistory = async (recipeId: string) => {
    try {
      await addMealToHistory(recipeId);
      toast({
        title: "Success",
        description: "Meal added to history!",
      });
      // Refresh meal history
      fetchMealHistory();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add meal to history. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}!</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dog's Name: {user.dogName}</p>
            <p>Breed: {user.dogBreed}</p>
            <p>Age: {user.dogAge} years</p>
            <p>Weight: {user.dogWeight} kg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recipe Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{recommendation}</p>
          </CardContent>
        </Card>
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Your Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe._id}>
            <CardHeader>
              <CardTitle>{recipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{recipe.description}</p>
              <Button onClick={() => handleSaveFavorite(recipe._id)}>Save to Favorites</Button>
              <Button onClick={() => handleAddToMealHistory(recipe._id)} className="ml-2">Add to Meal History</Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">Favorite Recipes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteRecipes.map((recipe) => (
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
      <h2 className="text-2xl font-bold mt-8 mb-4">Meal History</h2>
      <div className="space-y-4">
        {mealHistory.map((meal, index) => (
          <Card key={index}>
            <CardContent>
              <p>Date: {meal.date}</p>
              <p>Recipe: {recipes.find(r => r._id === meal.recipeId)?.name || 'Unknown'}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}