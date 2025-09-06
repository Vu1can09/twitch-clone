'use client';

import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export default function Home() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!isSignedIn) {
    redirect('/login');
  }

  redirect('/app');
}