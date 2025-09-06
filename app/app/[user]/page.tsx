'use client'

import Image from "next/image";
import { useDatabase } from "@/contexts/databaseContext";
import { Tables } from "@/database/database.types";
import { useSession } from "@clerk/nextjs";
import { use, useEffect, useState } from 'react';
import { Button } from "@/components/button/button";
import { EllipsisVertical } from "@/components/icons";
import { interests } from "@/lib/types/interest";
import InterestComponent from "@/components/onboarding/interestComponent";

export default function UserPage({
    params,
}:{
    params: Promise<{user:string}>;
}) {
    const [ streamerData, setStreamerData ] = useState<Tables<'users'>|null>(
        null
    );
    const {session} = useSession();
    const {supabase, getUserData, setSupabaseClient, followUser} = useDatabase();
    const {user} = use(params);
    const [ isFollowing, setIsFollowing] = useState(false);
    const [ isFollowLoading, setIsFollowLoading] = useState(false);

    useEffect(() =>{
        const initializeClients = async() => {
            if (!supabase) {
                const supabaseToken = await session?.getToken();
                if (supabaseToken){
                    setSupabaseClient(supabaseToken);
                    return;
                }
            }
            const userData = await getUserData(user,'user_name');
            if(!userData){
                console.error('[UserPage] user data not found');
                return;
            }
            setStreamerData(userData); 

            //check if the user is currently following the streamer
            if(session?.user.id && userData){
                const currentUserData = await getUserData(session.user.id, 'user_id');
                if(currentUserData && currentUserData.following.includes(user)){
                    setIsFollowing(true);
                }
            }
        };
        initializeClients();
    },
    [ session, supabase, setSupabaseClient, getUserData, setStreamerData, user]);

    const handleFollow = async () => {
    if (!session?.user.id || !streamerData) {
      console.error(
        '[UserPage] handleFollow] Missing session or streamer data'
      );
      return;
    }

    // Prevent users from following themselves
    if (session.user.id === user) {
      return;
    }

    setIsFollowLoading(true);
    try {
      const success = await followUser(session.user.id, user);
      if (success) {
        setIsFollowing(!isFollowing);
        // Refresh streamer data to update follower count
        const updatedStreamerData = await getUserData(user, 'user_name');
        if (updatedStreamerData) {
          setStreamerData(updatedStreamerData);
        }
      }
    } catch (error) {
      console.error('[UserPage] handleFollow] Error following user:', error);
    } finally {
      setIsFollowLoading(false);
    }
  };

    return(
        <div className="h-full overflow-y-scroll">
            {streamerData && (
                <section className="space-y-4">
                    <div className="flex items-counter justify-between p-4">
                        <div className="flex items-center space-x-4">
                            <Image
                            src={streamerData.image_url}
                            alt={streamerData.user_name}
                            width={60}
                            height={60}
                            className="rounded-full"
                            />

                            <div>
                                <h2 className="text-xl font-bold">{streamerData.user_name}</h2>
                                <p>{streamerData.followers.length} followers</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            {session?.user.id !== user && (
                                <Button variant='primary' onClick={handleFollow} disabled={isFollowLoading}>
                                    {isFollowLoading
                                    ? 'Following...'
                                    : isFollowing
                                    ? 'Unfollow'
                                    : 'Follow'}
                                </Button>
                            )}
                            <Button variant='icon'>
                                <EllipsisVertical/>
                            </Button>
                        </div>
                    </div>
                    <div className="p-4 space-y-2">
                        <h2 className="text-2xl font-bold"> Interests</h2>
                        <div className="flex gap-4 overflow-x-scroll">
                            {streamerData.interests.map((interest,index)=>(
                                <InterestComponent key={`${interest}-${index}`}
                                interest={interest}/>
                            ))}
                        </div>
                    </div>
                    <div className="'p-4 space-y-2">
                        <h2 className="text-2xl font-bold">Following</h2>
                        {streamerData.following.length === 0 && (
                <p>{streamerData.user_name} is not following anyone</p>
              )}
              {streamerData.following.map((following, index) => (
                <div key={`${following}-${index}`}>
                  <p>{following}</p>
                </div>
              ))}
                    </div>
                </section>
            )}
        </div>
    );
}