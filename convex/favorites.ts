import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const save = mutation({
  args: { recipeId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    await ctx.db.insert('favorites', {
      userId: user.tokenIdentifier,
      recipeId: args.recipeId,
    });
  },
});

export const list = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    const favorites = await ctx.db
      .query('favorites')
      .filter(q => q.eq(q.field('userId'), user.tokenIdentifier))
      .join(ctx.db.query('recipes'), 'recipeId')
      .collect();
    return favorites.map(f => f.recipe);
  },
});