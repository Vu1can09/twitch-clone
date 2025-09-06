import { SupabaseClient,createClient } from "@supabase/supabase-js";
import { Children, createContext, useContext, useCallback } from "react";
import { useState } from "react";
import type { Tables } from "../database/database.types";
import { liveStreams } from "@/database/mockData";



type DatabaseContextType = {
    supabase: SupabaseClient | null;
    error : string | null;
    setSupabaseClient: (accessToken: string) => void;
    getUserData: (
    userId: string,
    field?: string
  ) => Promise<Tables<'users'> | null>;
    setUserData: (
    userName: string,
    imageUrl: string,
    mail: string,
    dateOfBirth: string,
    userId: string
  ) => Promise<Tables<'users'> | null>;
    setUserInterests: (
    interests: string[],
    userId: string
  ) => Promise<Tables<'users'> | null>;
  getLiveStreams: () => Promise<Tables<'livestreams'>[]>;
  createLiveStream: (
    name: string,
    categories: string[],
    userName: string,
    profileImageUrl: string,
  ) => Promise<Tables<'livestreams'> | null>;
    deleteLiveStream: (userName: string) => Promise<boolean>;
    setLiveStreamsMockData: () => void;
    removeLiveStreamsMockData: () => void;
    followUser:(
      currentUserId:string,
      userToFollowId:string
    )=>Promise<boolean>;
};

export const DatabaseContext = createContext<DatabaseContextType | null>(null);

export const DatabaseProvider = ({
    children,
}:{
    children: React.ReactNode;
}) => {
    const [supabase,setSupabase]= useState<SupabaseClient | null>(null);
    const [error,setError]= useState<string | null>(null);

    const setSupabaseClient = useCallback((accessToken: string):void => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase environment variables');
    }
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      accessToken: async () => accessToken,
    });

    setSupabase(supabaseClient);
}, []);
    const getUserData = useCallback(
    async (
      userId: string,
      field: string = 'user_id'
    ): Promise<Tables<'users'> | null> => {
      console.log(
        'Getting user data from supabase: ',
        supabase,
        'for userId: ',
        userId
      );
      if (!supabase) {
        return null;
      }
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          // Filter case insensitive
          .ilike(field, `%${userId}%`)
          .single();

        console.log('User data: ', data);
        if (error) {
          console.error('Error getting user data', error);
          setError(`Error getting user data: ${error.message}`);
          return null;
        }
        return data;
      } catch (error) {
        console.error('Error getting user data', error);
        return null;
      }
    },
    [supabase]
  );
  const setUserData = useCallback(
    async (
      userName: string,
      imageUrl: string,
      mail: string,
      dateOfBirth: string,
      userId: string
    ): Promise<Tables<'users'> | null> => {
      if (!supabase) {
        return null;
      }
      const { data, error } = await supabase
        .from('users')
        .insert({
          user_name: userName,
          image_url: imageUrl,
          mail: mail,
          date_of_birth: dateOfBirth,
          user_id: userId,
          following: [],
          followers: [],
          interests: [],
        })
        .select()
        .single();
      if (error) {
        
        setError(`Error setting user data: ${error.message}`);
        return null;
      }
      return data as Tables<'users'>;
    },
    [supabase]
  );
  const setUserInterests = useCallback(
    async (
      interests: string[],
      userId: string
    ): Promise<Tables<'users'> | null> => {
      if (!supabase) {
        return null;
      }
      const { data, error } = await supabase
        .from('users')
        .update({ interests: interests })
        .eq('user_id', userId)
        .select()
        .single();
      if (error) {
        console.error('Error setting user interests', error);
        setError(`Error setting user interests: ${error.message}`);
        return null;
      }
      return data as Tables<'users'>;
    },
    [supabase]
  );

  const getLiveStreams = useCallback(async (): Promise<Tables<'livestreams'>[]> => {
    if(!supabase){
      return [];
    }
    const {data,error}= await supabase 
    .from ('livestreams')
    .select('*');
    if(error){
      console.log('Error getting live streams',error);
    }
    return data as Tables<'livestreams'>[];
  },[supabase]);
  const createLiveStream = useCallback(
    async (
      name: string,
      categories: string[],
      userName: string,
      profileImageUrl: string
    ): Promise<Tables<'livestreams'> | null> => {
      if (!supabase) {
        console.error('[createLiveStream] Supabase not initialized');
        return null;
      }
      const { data, error } = await supabase
        .from('livestreams')
        .insert({
          name: name,
          categories: categories,
          user_name: userName,
          profile_image_url: profileImageUrl,
        })
        .select()
        .single();
      if (error) {
        console.log('Error creating livestream', error);
        setError(error.message);
        return null;
      }
      return data as Tables<'livestreams'>;
    },
    [supabase]
  );

  const deleteLiveStream = useCallback(
    async (userName: string): Promise<boolean> => {
      if (!supabase) {
        console.error('[deleteLivestream] Supabase not initialized');
        return false;
      }
      const { error } = await supabase
        .from('livestreams')
        .delete()
        .eq('user_name', userName);
      if (error) {
        console.log('Error deleting livestream', error);
        setError(error.message);
        return false;
      }
      return true;
    },
    [supabase]
  );
  const setLiveStreamsMockData = useCallback(async () => {
    if (!supabase) {
      return;
    }
    const { data, error } = await supabase
      .from('livestreams')
      .insert(liveStreams);
    if (error) {
      console.log('Error setting mock data', error);
    }
    return data;
  }, [supabase]);

  const removeLiveStreamsMockData = useCallback(async () => {
    if (!supabase) {
      return;
    }
    const { error } = await supabase
      .from('livestreams')
      .delete()
      .in(
        'id',
        liveStreams.map((livestream) => livestream.id)
      );
    if (error) {
      console.log('Error removing mock data', error);
    }
  }, [supabase]);

  const followUser = useCallback(
    async (currentUserId: string, userToFollowId: string): Promise<boolean> => {
      if (!supabase) {
        console.error('[followUser] Supabase not initialized');
        return false;
      }

      try {
        const currentUser = await getUserData(currentUserId, 'user_id');
        if (!currentUser) {
          console.error('[followUser] Current user not found');
          return false;
        }

        const userToFollow = await getUserData(userToFollowId, 'user_name');
        if (!userToFollow) {
          console.error('[followUser] User to follow not found');
          return false;
        }

        // Update following lists
        let updatedCurrentUserFollowing: string[] = [];
        let updatedUserToFollowFollowers: string[] = [];
        if (currentUser.following.includes(userToFollowId)) {
          // Remove from the lists if already following
          updatedCurrentUserFollowing = currentUser.following.filter(
            (id) => id !== userToFollow.user_id
          );
          updatedUserToFollowFollowers = userToFollow.followers.filter(
            (id) => id !== currentUserId
          );
        } else {
          // If not following, add to following list
          updatedCurrentUserFollowing = [
            ...currentUser.following,
            userToFollowId,
          ];
          updatedUserToFollowFollowers = [
            ...userToFollow.followers,
            currentUserId,
          ];
        }

        const { error: currentUserError } = await supabase
          .from('users')
          .update({ following: updatedCurrentUserFollowing })
          .eq('user_id', currentUserId);

        if (currentUserError) {
          console.error(
            '[followUser] Error updating current user following',
            currentUserError
          );
          return false;
        }

        const { error: userToFollowError } = await supabase
          .from('users')
          .update({ followers: updatedUserToFollowFollowers })
          .eq('user_id', userToFollow.user_id);

        if (userToFollowError) {
          console.error(
            '[followUser] Error updating user to follow followers',
            userToFollowError
          );
          return false;
        }

        console.log('[followUser] Successfully followed user');
        return true;
      } catch (error) {
        console.error('[followUser] Error following user', error);
        return false;
      }
    },
    [supabase, getUserData]
  );


    return (
        <DatabaseContext.Provider value={{
                supabase,
        error,
        setSupabaseClient,
        getUserData,
        setUserData,
        setUserInterests,
        getLiveStreams,
        createLiveStream,
        deleteLiveStream,
        setLiveStreamsMockData,
        removeLiveStreamsMockData,
        followUser
        }}
        >
            {children}
        </DatabaseContext.Provider>
    );
};

export const useDatabase = () => {
    const context = useContext(DatabaseContext);
    if (!context) {
        throw new Error('useDatabase must be used within a DatabaseProvider');
    }
    return context; 
};