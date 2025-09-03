import { useDatabase } from '@/contexts/databaseContext';
import {
  Call,
  useCallStateHooks,
  useDeviceList,
} from '@stream-io/video-react-sdk';
import { ParticipantView } from '@stream-io/video-react-sdk';
import { Button } from '../button/button';
import { ArrowRight, User } from '../icons';
import { useState, useEffect } from 'react';
import GoLiveForm from './goLiveForm';
import { useSession } from '@clerk/nextjs';

export default function StreamerView({
  call,
  chatExpanded,
  setChatExpanded,
}: {
  call: Call;
  chatExpanded: boolean;
  setChatExpanded: (expanded: boolean) => void;
}) {
  const [showGoLiveForm, setShowGoLiveForm] = useState(false);
  const [currentUserName, setCurrentUserName] = useState<string | null>(null);
  const { session } = useSession();
  const { getUserData, deleteLiveStream } = useDatabase();
  const {
    useCameraState,
    useMicrophoneState,
    useScreenShareState,
    useParticipantCount,
    useIsCallLive,
    useParticipants,
  } = useCallStateHooks();

  const {
    camera,
    isEnabled: isCamEnabled,
    devices,
    selectedDevice,
  } = useCameraState();
  const { microphone, isEnabled: isMicEnabled } = useMicrophoneState();
  const { screenShare, isEnabled: isScreenShareEnabled } =
    useScreenShareState();

  const participantCount = useParticipantCount();
  const isLive = useIsCallLive();

  const [firstParticipant] = useParticipants();
  const { deviceList, selectedDeviceInfo } = useDeviceList(
    devices,
    selectedDevice
  );

  console.log('Camera enabled: ', isCamEnabled);

  // Get current user data when component mounts
  useEffect(() => {
    const getCurrentUser = async () => {
      const userId = session?.user.id;
      if (userId) {
        const userData = await getUserData(userId);
        if (userData) {
          setCurrentUserName(userData.user_name);
        }
      }
    };
    getCurrentUser();
  }, [session?.user.id, getUserData]);

  return (
    <div className='flex flex-col gap-2 relative'>
      <div
        className={`relative flex items-center justify-center max-h-[500px] overflow-hidden border-b-4 ${
          isLive ? 'border-twitch-purple' : 'border-slate-200'
        }`}
      >
        <>
          {firstParticipant ? (
            <>
              <ParticipantView
                className='h-full'
                trackType={
                  isScreenShareEnabled ? 'screenShareTrack' : 'videoTrack'
                }
                VideoPlaceholder={() => (
                  <div className='h-[500px] aspect-video bg-slate-200' />
                )}
                participant={firstParticipant}
              />
              {isScreenShareEnabled && isCamEnabled && (
                <ParticipantView
                  className='aspect-video h-32 absolute bottom-4 right-4 rounded-lg overflow-hidden'
                  trackType='videoTrack'
                  VideoPlaceholder={() => (
                    <div className='h-[500px] aspect-video bg-slate-200' />
                  )}
                  participant={firstParticipant}
                />
              )}
            </>
          ) : (
            <div>The host hasn&apos;t joined yet</div>
          )}
        </>
      </div>
      {!chatExpanded && setChatExpanded && (
        <button
          className={`absolute top-4 right-4 bg-slate-100/40 p-4 rounded-full text-sm text-secondary text-black flex gap-2 ${
            chatExpanded ? 'rotate-180' : ''
          } transition-transform duration-150 ease-in-out`}
          onClick={() => setChatExpanded(!chatExpanded)}
        >
          <ArrowRight />
          <span>Open chat</span>
        </button>
      )}
      <div className='flex gap-4 p-6'>
        <div className='flex items-center'>
          <User />
          <span>{participantCount}</span>
        </div>
        <Button
          variant='primary'
          onClick={async () => {
            if (isLive) {
              // Stop the stream first
              call.stopLive();
              // Then remove from database
              if (currentUserName) {
                try {
                  const success = await deleteLiveStream(currentUserName);
                  if (success) {
                    console.log('Livestream removed from database');
                  } else {
                    console.error('Failed to remove livestream from database');
                  }
                } catch (error) {
                  console.error(
                    'Error removing livestream from database:',
                    error
                  );
                }
              } else {
                console.warn(
                  'No current username found, cannot remove livestream from database'
                );
              }
            } else {
              setShowGoLiveForm(true);
            }
          }}
        >
          {isLive ? 'Stop Live' : 'Go Live'}
        </Button>
        <Button variant='secondary' onClick={() => camera.toggle()}>
          {isCamEnabled ? 'Disable camera' : 'Enable camera'}
        </Button>
        <Button variant='secondary' onClick={() => microphone.toggle()}>
          {isMicEnabled ? 'Mute Mic' : 'Unmute Mic'}
        </Button>
      </div>
      <section className='p-6 space-y-2'>
        <h2 className='text-xl font-semibold'>What do you want to share?</h2>
        <p className='text-sm text-secondary'>
          You can share your camera, screen, or both.
        </p>
        <div className='flex gap-2'>
          <Button
            className={`border-2 ${
              isCamEnabled && !isScreenShareEnabled
                ? 'border-twitch-purple'
                : 'border-transparent'
            }`}
            onClick={async () => {
              await camera.enable();
              await screenShare.disable();
            }}
            variant='secondary'
          >
            Camera only
          </Button>
          <Button
            className={`border-2 ${
              !isCamEnabled && isScreenShareEnabled
                ? 'border-twitch-purple'
                : 'border-transparent'
            }`}
            onClick={async () => {
              await screenShare.enable();
              await camera.disable();
            }}
            variant='secondary'
          >
            Screen only
          </Button>
          <Button
            className={`border-2 ${
              isCamEnabled && isScreenShareEnabled
                ? 'border-twitch-purple'
                : 'border-transparent'
            }`}
            onClick={async () => {
              await camera.enable();
              await screenShare.enable();
            }}
            variant='secondary'
          >
            Screen + Camera
          </Button>
        </div>
      </section>

      <div className='flex flex-col gap-2 p-6'>
        <h2 className='text-lg font-semibold'>Select camera</h2>
        <div className='flex gap-2'>
          {deviceList.map((device, index) => (
            <Button
              className={`border-2 ${
                selectedDeviceInfo?.deviceId === device.deviceId
                  ? 'border-twitch-purple'
                  : 'border-transparent'
              }`}
              variant='secondary'
              key={`${device.deviceId}-${index}`}
              onClick={async () => {
                await camera.select(device.deviceId);
              }}
            >
              {device.label}
            </Button>
          ))}
        </div>
      </div>
      {showGoLiveForm && (
        <GoLiveForm
          onGoLive={() => {
            setShowGoLiveForm(false);
            call.goLive();
          }}
          onCancel={() => setShowGoLiveForm(false)}
        />
      )}
    </div>
  );
}