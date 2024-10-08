import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface RecipeCardProps {
  recipe: Recipe;
  onSaveFavorite: (recipeId: string) => void;
  onAddToMealHistory: (recipeId: string) => void;
}

export function RecipeCard({ recipe, onSaveFavorite, onAddToMealHistory }: RecipeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{recipe.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-48 mb-4">
          {!imageLoaded && <Skeleton className="w-full h-full" />}
          <Image
            src={recipe.imageUrl}
            alt={recipe.name}
            layout="fill"
            objectFit="cover"
            onLoad={() => setImageLoaded(true)}
            className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        </div>
        <p className="mb-4">{recipe.description}</p>
        <Button onClick={() => onSaveFavorite(recipe._id)}>Save to Favorites</Button>
        <Button onClick={() => onAddToMealHistory(recipe._id)} className="ml-2">Add to Meal History</Button>
      </CardContent>
    </Card>
  );
}