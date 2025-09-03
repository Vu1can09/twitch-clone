import { useDatabase } from '@/contexts/databaseContext';
import { Interest, interests } from '@/lib/types/interest';
import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import InterestComponent from './interestComponent';

export default function SelectInterests() {
  const [selectedInterests, setSelectedInterests] = useState<Interest[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const { setUserInterests } = useDatabase();
  const { user } = useUser();

  if (!isOpen) return null;

  return (
    <section className='fixed inset-0 z-50 flex items-center justify-center bg-twitch-ice bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg w-full max-w-2xl mx-8 relative text-black'>
        <h1 className='text-2xl font-bold p-6 text-center'>
          What are you into?
        </h1>
        <p className='text-center text-sm mb-6 px-6'>
          Choose 1 or more categories of channels being streamed right now.
        </p>
        <div>
          <div className='grid grid-cols-5 gap-3 p-6'>
            {interests.map((interest) => (
              <button
                key={interest.id}
                style={{ backgroundColor: interest.color }}
                onClick={() => {
                  if (selectedInterests.includes(interest)) {
                    setSelectedInterests(
                      selectedInterests.filter((i) => i.id !== interest.id)
                    );
                  } else {
                    setSelectedInterests([...selectedInterests, interest]);
                  }
                }}
              >
                <InterestComponent
                  interest={interest.name}
                  selected={selectedInterests.includes(interest)}
                />
              </button>
            ))}
          </div>
          <div className='flex items-center justify-center w-full h-[1px] bg-gray-300 my-4'>
            <p className='bg-white px-6 py-2 text-sm font-semibold'>
              <span className='text-xs px-2 py-0.5 uppercase text-white bg-red-500 rounded-full mr-2'>
                Live
              </span>
              Channels for you
            </p>
          </div>
          <p className='text-center text-sm text-gray-500 px-6 min-h-32 flex items-center justify-center'>
            No live channels at the moment.
          </p>
          <div className='flex items-center justify-center w-full h-[1px] bg-gray-300 my-4' />
          <div className='flex items-center justify-end w-full p-4'>
            <button
              className={`bg-gray-200 px-6 py-2 text-sm font-semibold cursor-pointer rounded-md ${
                selectedInterests.length === 0
                  ? 'bg-gray-300 opacity-50'
                  : 'bg-purple-500 text-white'
              }`}
              onClick={() => {
                console.log(selectedInterests);
                if (selectedInterests.length === 0 || !user?.id) {
                  console.log('No interests selected or user not found');
                  return;
                }
                setUserInterests(
                  selectedInterests.map((interest) => interest.name),
                  user.id
                );
                setIsOpen(false);
              }}
            >
              {selectedInterests.length === 0 ? 'Choose 1 more' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}