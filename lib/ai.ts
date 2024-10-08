import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { Ollama } from "langchain/llms/ollama";
import { ConvexClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const model = new Ollama({
  baseUrl: "http://localhost:11434",
  model: "llama2",
});

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function askAIAssistant(question: string): Promise<string> {
  try {
    const response = await model.call(
      `You are an AI assistant for a dog food recipe app. Answer the following question: ${question}`
    );
    return response;
  } catch (error) {
    console.error('Error asking AI assistant:', error);
    throw error;
  }
}

export async function generateRecipeRecommendation(dogProfile: any): Promise<string> {
  try {
    const userPreferences = await convex.query(api.userPreferences.get);
    const mealHistory = await convex.query(api.mealHistory.list);
    
    const prompt = `Given the following dog profile and user preferences, recommend a suitable recipe:
      Age: ${dogProfile.age}
      Weight: ${dogProfile.weight}
      Breed: ${dogProfile.breed}
      Activity Level: ${dogProfile.activityLevel}
      Dietary Restrictions: ${dogProfile.dietaryRestrictions.join(', ')}
      User Preferences: ${JSON.stringify(userPreferences)}
      Recent Meal History: ${JSON.stringify(mealHistory.slice(0, 5))}`;

    const response = await model.call(prompt);
    return response;
  } catch (error) {
    console.error('Error generating recipe recommendation:', error);
    throw error;
  }
}

export async function updateUserEmbeddings(userId: string): Promise<void> {
  try {
    const userPreferences = await convex.query(api.userPreferences.get);
    const mealHistory = await convex.query(api.mealHistory.list);
    
    // Generate user embedding based on preferences and history
    const userEmbedding = await generateEmbedding(JSON.stringify({ ...userPreferences, mealHistory }));
    
    // Store the embedding in Convex
    await convex.mutation(api.userEmbeddings.update, { userId, embedding: userEmbedding });
  } catch (error) {
    console.error('Error updating user embeddings:', error);
    throw error;
  }
}

async function generateEmbedding(text: string): Promise<number[]> {
  // In a real-world scenario, you'd use a proper embedding model here
  // For this example, we'll use a simple mock function
  return Array.from({ length: 128 }, () => Math.random());
}

export async function getCollaborativeRecommendations(userId: string): Promise<string[]> {
  try {
    const userEmbedding = await convex.query(api.userEmbeddings.get, { userId });
    const similarUsers = await convex.query(api.userEmbeddings.findSimilar, { embedding: userEmbedding, limit: 5 });
    
    // Get favorite recipes of similar users
    const recommendations = await convex.query(api.favorites.getForUsers, { userIds: similarUsers.map(u => u.userId) });
    
    return recommendations.map(r => r.recipeId);
  } catch (error) {
    console.error('Error getting collaborative recommendations:', error);
    throw error;
  }
}