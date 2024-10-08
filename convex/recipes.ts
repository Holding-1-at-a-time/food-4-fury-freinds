import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const list = query({
  handler: async (ctx) => {
    return await ctx.db.query('recipes').collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    ingredients: v.array(v.string()),
    instructions: v.array(v.string()),
    nutritionInfo: v.object({
      calories: v.number(),
      protein: v.number(),
      fat: v.number(),
      carbs: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const recipeId = await ctx.db.insert('recipes', args);
    return recipeId;
  },
});

export const update = mutation({
  args: {
    id: v.id('recipes'),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    ingredients: v.optional(v.array(v.string())),
    instructions: v.optional(v.array(v.string())),
    nutritionInfo: v.optional(v.object({
      calories: v.number(),
      protein: v.number(),
      fat: v.number(),
      carbs: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id('recipes') },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});