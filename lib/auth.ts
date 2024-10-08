import { ConvexClient } from 'convex/browser';
import { api } from '../convex/_generated/api';

const convex = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function signUp(email: string, password: string, name: string) {
  try {
    const result = await convex.mutation(api.auth.signUp, { email, password, name });
    return result;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const result = await convex.mutation(api.auth.signIn, { email, password });
    return result;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await convex.mutation(api.auth.signOut);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getUser() {
  try {
    const user = await convex.query(api.auth.getUser);
    return user;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
}

export async function updateUser(updates: Partial<User>) {
  try {
    const result = await convex.mutation(api.auth.updateUser, updates);
    return result;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}