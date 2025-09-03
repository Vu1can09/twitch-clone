'use client';

import { useDatabase } from '@/contexts/databaseContext';
import { useSession } from '@clerk/nextjs';
import { SignedInSessionResource } from '@clerk/types';
import { useEffect, useState } from 'react';
import Onboarding from '@/components/onboarding/onboarding';
import SelectInterests from '@/components/onboarding/selectInterests';
import { Tables } from '@/database/database.types';
import LiveChannels from '@/components/liveChannels/liveChannels';
import HomeFeed from '@/components/homeFeed/homeFeed';

export default function AppPage() {
  const { session } = useSession();
  const {
    supabase,
    setSupabaseClient,
    getUserData,
    getLiveStreams,
    setLiveStreamsMockData,
    removeLiveStreamsMockData,
  } = useDatabase();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showSelectInterests, setShowSelectInterests] = useState(false);
  const [livestreams, setLivestreams] = useState<Tables<'livestreams'>[]>([]);

  useEffect(() => {
    async function initializeSupabase(session: SignedInSessionResource) {
      const token = (await session?.getToken()) as string;
      if (token) {
        setSupabaseClient(token);
      }
    }

    if (session && !supabase) {
      initializeSupabase(session);
    } else {
      console.log('No clerk session');
    }
  }, [session, setSupabaseClient, supabase]);

  useEffect(() => {
    console.log('Supabase', supabase);
    console.log('Session', session?.user.id);
    if (supabase && session?.user.id) {
      getUserData(session?.user.id).then((user) => {
        if (user) {
          console.log(user);
          if (user.interests.length === 0) {
            setShowOnboarding(false);
            setShowSelectInterests(true);
          } else {
            setShowOnboarding(false);
            setShowSelectInterests(false);
            getLiveStreams().then((livestreams) => {
              setLivestreams(livestreams);
            });
          }
        } else {
          setShowOnboarding(true);
        }
      });
    }
  }, [supabase, session?.user.id, getUserData, getLiveStreams]);

  if (showOnboarding) {
    return <Onboarding />;
  }

  if (showSelectInterests) {
    return <SelectInterests />;
  }

  return (
    <>
      <section className='grid h-full grid-cols-[auto_1fr]'>
        <LiveChannels livestreams={livestreams} />
        <HomeFeed livestreams={livestreams} />
      </section>
      <button onClick={() => setLiveStreamsMockData()}>
        Set Livestreams Mock Data
      </button>
      <button onClick={() => removeLiveStreamsMockData()}>
        Remove Livestreams Mock Data
      </button>
    </>
  );
}