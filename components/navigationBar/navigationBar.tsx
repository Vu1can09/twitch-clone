import Image from 'next/image';
import Link from 'next/link';

import twitchPurple from '@/app/twitch-purple.svg';
import { EllipsisVertical } from '../icons';
import SearchBar from './searchBar';
import TrailingItems from './trailingItems';
import { Button } from '../button/button';

export default function NavigationBar() {
  return (
    <header>
      <nav className='w-full flex text-black items-center justify-between bg-white p-2 border-b border-slate-300'>
        <div className='flex items-center gap-6'>
          <Link href={'/'}>
            <Image src={twitchPurple} alt='logo' width={32} height={32} />
          </Link>
          <Link href={'/browse'} className='text-black font-bold'>
            Browse
          </Link>
          <Button variant={'icon'}>
            <EllipsisVertical />
          </Button>
        </div>

        <SearchBar />

        <TrailingItems />
      </nav>
    </header>
  );
}