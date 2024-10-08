import { mutation, query } from './_generated/server';
import { v } from 'convex/values';

export const update = mutation({
  args: { userId: v.string(), embedding: v.array(v.number()) },
  handler: async (ctx, args) => {
    await ctx.db.insert('userEmbeddings', {
      userId: args.userId,
      embedding: args.embedding,
    });
  },
});

export const get = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const result = await ctx.db
      .query('userEmbeddings')
      .filter(q => q.eq(q.field('userId'), args.userId))
      .first();
    return result?.embedding;
  },
});

export const findSimilar = query({
  args: { embedding: v.array(v.number()), limit: v.number() },
  handler: async (ctx, args) => {
    // In a real-world scenario, you'd use a vector database for efficient similarity search
    // For this example, we'll use a simple cosine similarity calculation
    const allEmbeddings = await ctx.db.query('userEmbeddings').collect();
    const similarities = allEmbeddings.map(e => ({
      userId: e.userId,
      similarity: cosineSimilarity(args.embedding, e.embedding),
    }));
    return similarities.sort((a, b) => b.similarity - a.similarity).slice(0, args.limit);
  },
});

function cosineSimilarity(a: number[], b: number[]): number {
  const dotProduct = a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dotProduct / (magnitudeA * magnitudeB);
}