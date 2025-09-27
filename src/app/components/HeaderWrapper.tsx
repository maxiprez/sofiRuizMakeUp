'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from './Header';
import { Session } from 'next-auth';

interface HeaderWrapperProps {
  session: Session | null;
}

export default function HeaderWrapper({ session: initialSession }: HeaderWrapperProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  
  const currentSession = session || initialSession;
  
  const isAdminInAdminPage = pathname?.includes('/admin') && currentSession?.user?.role === 'admin';
  
  if (isAdminInAdminPage) {
    return null;
  }
  
  return <Header session={currentSession} />;
}