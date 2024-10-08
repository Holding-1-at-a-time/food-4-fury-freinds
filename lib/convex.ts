// ... (previous code)

export async function shareRecipe(recipeId: string): Promise<void> {
  try {
    await convex.mutation(api.social.shareRecipe, { recipeId });
  } catch (error) {
    console.error('Error sharing recipe:', error);
    throw error;
  }
}

export async function followUser(userId: string): Promise<void> {
  try {
    await convex.mutation(api.social.followUser, { userId });
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
}

export async function unfollowUser(userId: string): Promise<void> {
  try {
    await convex.mutation(api.social.unfollowUser, { userId });
  } catch (error) {
    console.error('Error unfollowing user:', error);
    throw error;
  }
}

export async function getFollowers(): Promise<User[]> {
  try {
    const followers = await convex.query(api.social.getFollowers);
    return followers as User[];
  } catch (error) {
    console.error('Error fetching followers:', error);
    throw error;
  }
}

export async function getFollowing(): Promise<User[]> {
  try {
    const following = await convex.query(api.social.getFollowing);
    return following as User[];
  } catch (error) {
    console.error('Error fetching following users:', error);
    throw error;
  }
}