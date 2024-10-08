"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { getUser, User, shareRecipe, followUser, unfollowUser, getFollowers, getFollowing } from '@/lib/convex';

export default function SocialPage() {
  const [user, setUser] = useState<User | null>(null);
  const [followers, setFollowers] = useState<User[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchUserData();
    fetchFollowers();
    fetchFollowing();
  }, []);

  const fetchUserData = async () => {
    try {
      const userData = await getUser();
      setUser(userData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchFollowers = async () => {
    try {
      const followerData = await getFollowers();
      setFollowers(followerData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch followers. Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchFollowing = async () => {
    try {
      const followingData = await getFollowing();
      setFollowing(followingData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch following users. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleShareRecipe = async (recipeId: string) => {
    try {
      await shareRecipe(recipeId);
      toast({
        title: "Success",
        description: "Recipe shared successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share recipe. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFollowUser = async (userId: string) => {
    try {
      await followUser(userId);
      toast({
        title: "Success",
        description: "User followed successfully!",
      });
      fetchFollowing();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to follow user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleUnfollowUser = async (userId: string) => {
    try {
      await unfollowUser(userId);
      toast({
        title: "Success",
        description: "User unfollowed successfully!",
      });
      fetchFollowing();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unfollow user. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async () => {
    // Implement user search functionality
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Social</h1>
      <div className="mb-6">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="mb-2"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Followers ({followers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {followers.map((follower) => (
              <div key={follower._id} className="mb-2">
                <span>{follower.name}</span>
                <Button onClick={() => handleFollowUser(follower._id)} className="ml-2">Follow Back</Button>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Following ({following.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {following.map((followedUser) => (
              <div key={followedUser._id} className="mb-2">
                <span>{followedUser.name}</span>
                <Button onClick={() => handleUnfollowUser(followedUser._id)} className="ml-2">Unfollow</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}