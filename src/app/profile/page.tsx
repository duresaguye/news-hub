import { redirect } from 'next/navigation';
import { getLedSession } from '@/lib/ledSession';
import ProfilePageClient from './ProfilePageClient';

export default async function ProfilePage() {
  const session = getLedSession();
  if (!session?.user) {
    redirect('/auth/login?redirect=/profile');
  }
  return <ProfilePageClient />;
}
