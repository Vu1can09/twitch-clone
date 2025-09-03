'use client';

import { DatabaseProvider } from '@/contexts/databaseContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <DatabaseProvider>{children}</DatabaseProvider>;
}