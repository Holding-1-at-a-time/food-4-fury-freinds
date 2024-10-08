import { mutation, query } from './_generated/server';
import { v } from 'convex/values';
import { ConvexError } from 'convex/values';
import bcrypt from 'bcryptjs';

export const signUp = mutation({
  args: { email: v.string(), password: v.string(), name: v.string() },
  handler: async (ctx, args) => {
    const { email, password, name } = args;
    const existingUser = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('email'), email))
      .first();
    if (existingUser) {
      throw new ConvexError('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await ctx.db.insert('users', { email, password: hashedPassword, name });
    const token = await ctx.auth.createToken(user);
    return { success: true, userId: user, token };
  },
});

export const signIn = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const { email, password } = args;
    const user = await ctx.db
      .query('users')
      .filter(q => q.eq(q.field('email'), email))
      .first();
    if (!user) {
      throw new ConvexError('Invalid email or password');
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new ConvexError('Invalid email or password');
    }
    const token = await ctx.auth.createToken(user._id);
    return { success: true, userId: user._id, token };
  },
});

export const signOut = mutation({
  handler: async (ctx) => {
    await ctx.auth.invalidateToken();
    return { success: true };
  },
});

export const getUser = query({
  handler: async (ctx) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      return null;
    }
    const user = await ctx.db.get(userId);
    return user ? { userId: user._id, email: user.email, name: user.name } : null;
  },
});

export const updateUser = mutation({
  args: { updates: v.object({ name: v.optional(v.string()) }) },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();
    if (!userId) {
      throw new ConvexError('Not authenticated');
    }
    await ctx.db.patch(userId, args.updates);
    return { success: true };
  },
});