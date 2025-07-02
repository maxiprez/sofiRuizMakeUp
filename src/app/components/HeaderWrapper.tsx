'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { SessionProps } from '@/app/layout';

export default function HeaderWrapper({ session }: SessionProps) {
  const pathname = usePathname();
  const isAdminInAdminPage = pathname?.includes('/admin') && session?.user?.role === 'admin';
  if (isAdminInAdminPage) return null;
  return <Header session={session} />;
}