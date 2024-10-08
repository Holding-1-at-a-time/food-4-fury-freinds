import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const add = mutation({
  args: { recipeId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    await ctx.db.insert('mealHistory', {
      userId: user.tokenIdentifier,
      recipeId: args.recipeId,
      date: new Date().toISOString(),
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    return await ctx.db
      .query('mealHistory')
      .filter(q => q.eq(q.field('userId'), user.tokenIdentifier))
      .order('desc')
      .collect();
  },
});