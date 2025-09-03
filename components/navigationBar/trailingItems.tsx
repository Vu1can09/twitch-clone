import Link from 'next/link';
import { Button } from '../button/button';
import { Mail, User } from '../icons';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  SignUpButton,
} from '@clerk/nextjs';

export default function TrailingItems() {
  return (
    <div className='flex items-center gap-3'>
      <button className='text-black rounded-full hover:bg-slate-200 p-2 cursor-pointer'>
        <Mail />
      </button>
      <SignedOut>
        <SignInButton>
          <Button variant={'secondary'}>Log In</Button>
        </SignInButton>
        <SignUpButton>
          <Button variant={'primary'}>Sign Up</Button>
        </SignUpButton>
      </SignedOut>
      <SignedIn>
        <SignOutButton>
          <Button variant={'secondary'}>Log Out</Button>
        </SignOutButton>
      </SignedIn>

      <Link href={'/app/dashboard'}>
        <Button variant={'icon'}>
          <User />
        </Button>
      </Link>
    </div>
  );
}