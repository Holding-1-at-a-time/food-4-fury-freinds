"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { searchRecipes, Recipe } from '@/lib/convex';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = async () => {
    try {
      const results = await searchRecipes(searchTerm, dietaryRestrictions);
      setRecipes(results);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to search recipes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDietaryRestrictionChange = (restriction: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(restriction)
        ? prev.filter(r => r !== restriction)
        : [...prev, restriction]
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Search Recipes</h1>
      <div className="mb-6">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search recipes..."
          className="mb-2"
        />
        <div className="flex flex-wrap gap-4 mb-4">
          {['Grain-free', 'Low-fat', 'High-protein', 'Vegetarian'].map((restriction) => (
            <div key={restriction} className="flex items-center">
              <Checkbox
                id={restriction}
                checked={dietaryRestrictions.includes(restriction)}
                onCheckedChange={() => handleDietaryRestrictionChange(restriction)}
              />
              <label htmlFor={restriction} className="ml-2">{restriction}</label>
            </div>
          ))}
        </div>
        <Button onClick={handleSearch}>Search</Button>
      </div>
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