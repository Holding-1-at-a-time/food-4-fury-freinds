import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    dogName: v.string(),
    dogBreed: v.string(),
    dogAge: v.number(),
    dogWeight: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.db.insert('users', args);
    return userId;
  },
});

export const get = query({
  args: { id: v.id('users') },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});