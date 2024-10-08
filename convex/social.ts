import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const shareRecipe = mutation({
  args: { recipeId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    await ctx.db.insert('sharedRecipes', {
      userId: user.tokenIdentifier,
      recipeId: args.recipeId,
      sharedAt: new Date().toISOString(),
    });
  },
});

export const followUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    await ctx.db.insert('follows', {
      followerId: user.tokenIdentifier,
      followedId: args.userId,
      followedAt: new Date().toISOString(),
    });
  },
});

export const unfollowUser = mutation({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    await ctx.db
      .query('follows')
      .filter(q => q.eq(q.field('followerId'), user.tokenIdentifier))
      .filter(q => q.eq(q.field('followedId'), args.userId))
      .delete();
  },
});

export const getFollowers = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    return await ctx.db
      .query('follows')
      .filter(q => q.eq(q.field('followedId'), user.tokenIdentifier))
      .join(ctx.db.query('users'), 'followerId')
      .collect();
  },
});

export const getFollowing = query({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) {
      throw new Error('Not authenticated');
    }
    return await ctx.db
      .query('follows')
      .filter(q => q.eq(q.field('followerId'), user.tokenIdentifier))
      .join(ctx.db.query('users'), 'followedId')
      .collect();
  },
});