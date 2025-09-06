'use client';

import {
  LivestreamLayout,
  useCall,
  useCallStateHooks,
} from '@stream-io/video-react-sdk';
import { useEffect } from 'react';

export default function LivestreamWatching() {
  const call = useCall();
  const { useIsCallLive } = useCallStateHooks();
  const isLive = useIsCallLive();

  useEffect(() => {
    call?.join();
  }, [call]);

  return (
    <div className='aspect-video max-h-[500px] overflow-hidden'>
      {isLive && call?.id && (
        <LivestreamLayout
          muted={false}
          enableFullScreen={true}
          showLiveBadge={false}
          showDuration={true}
          showSpeakerName={false}
          showParticipantCount={true}
          floatingParticipantProps={{
            muted: false,
            enableFullScreen: true,
            showParticipantCount: false,
            showDuration: false,
            showLiveBadge: false,
            showSpeakerName: false,
            position: 'bottom-right',
          }}
        />
      )}
    </div>
  );
}