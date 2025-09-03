import { useState } from "react";
import { Tables } from "@/database/database.types";
import { ArrowRight } from "../icons";
import { liveStreams } from "@/database/mockData";
import Image from "next/image";

export default function LiveChannels({
  livestreams,
}: {
  livestreams: Tables<'livestreams'>[];
}) {
    const [expanded,setExpanded]= useState(true);
    return (
        <div
      className={`bg-twitch-ice text-gray-500 p-2 flex flex-col gap-1 overflow-y-scroll ${
        expanded ? 'min-w-xs' : ''
      }`}
    >
      <div
        className={`flex items-center pb-2 text-black ${
          expanded ? 'justify-between' : 'justify-center'
        }`}
      >
        {expanded && (
          <h2 className='text-sm uppercase font-bold'>Live Channels</h2>
        )}
        <button
          className={`text-sm text-secondary cursor-pointer rounded-full hover:bg-gray-200 p-1 ${
            expanded ? '' : 'rotate-180'
          } transition-all duration-150 ease-in-out`}
          onClick={() => setExpanded(!expanded)}
        >
          <ArrowRight />
        </button>
      </div>

      {livestreams.map((livestream) => (
        <button
          key={livestream.id}
          className='flex items-center gap-2 text-secondary cursor-pointer'
          onClick={() => {
            console.log(`Clicked on ${livestream.name}`);
          }}
        >
          <Image
            src={livestream.profile_image_url}
            alt={livestream.name}
            width={40}
            height={40}
            className='rounded-full'
          />
          {expanded && (
            <>
              <div className='gap-1'>
                <h3 className='text-sm font-bold text-black text-left'>
                  {livestream.name}
                </h3>
                <p className='text-xs text-start'>
                  {livestream.categories.join(', ')}
                </p>
              </div>
              <div className='flex items-center justify-start gap-1 ml-auto'>
                <div className='size-2 bg-red-500 rounded-full' />
              </div>
            </>
          )}
        </button>
      ))}
    </div>
  );
}