"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { createUser } from '@/lib/convex';

export default function OnboardingPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dogName: '',
    dogBreed: '',
    dogAge: '',
    dogWeight: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      toast({
        title: "Success",
        description: "Your profile has been created!",
      });
      router.push('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to Food 4 Fury Friends</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your Name"
          required
        />
        <Input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Your Email"
          required
        />
        <Input
          name="dogName"
          value={formData.dogName}
          onChange={handleChange}
          placeholder="Dog's Name"
          required
        />
        <Input
          name="dogBreed"
          value={formData.dogBreed}
          onChange={handleChange}
          placeholder="Dog's Breed"
          required
        />
        <Input
          name="dogAge"
          type="number"
          value={formData.dogAge}
          onChange={handleChange}
          placeholder="Dog's Age (years)"
          required
        />
        <Input
          name="dogWeight"
          type="number"
          value={formData.dogWeight}
          onChange={handleChange}
          placeholder="Dog's Weight (kg)"
          required
        />
        <Button type="submit">Create Profile</Button>
      </form>
    </div>
  );
}