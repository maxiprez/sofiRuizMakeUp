'use client';

import { usePathname } from 'next/navigation';
import Header from './Header';
import { User } from 'next-auth';

export default function HeaderWrapper({ user }: { user: User }) {
  const pathname = usePathname();
  const isAdminInAdminPage = pathname?.includes('/admin') && user?.role === 'admin';
  
  if (isAdminInAdminPage) return null;
  return <Header />;
}