import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to <span className="text-blue-600">Food 4 Fury Friends</span>
        </h1>

        <p className="mt-3 text-2xl">
          Homemade meals for your furry friends
        </p>

        <div className="flex mt-6">
          <Link href="/recipes">
            <Button>View Recipes</Button>
          </Link>
          <Link href="/ai-assistant">
            <Button variant="outline" className="ml-4">Ask AI Assistant</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}