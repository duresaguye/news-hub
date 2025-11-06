'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileSettings from '@/components/profile-settings';
import SavedArticles from '@/components/saved-articles';
import SubscriptionPanel from '@/components/subscription-panel';
import { User, Bookmark, CreditCard } from 'lucide-react';

export default function ProfilePageClient() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center gap-2">
            <Bookmark className="w-4 h-4" />
            Saved Articles
          </TabsTrigger>
          <TabsTrigger value="subscription" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Subscription
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileSettings />
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Saved Articles</h2>
            <SavedArticles />
          </div>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Subscription Plans</h2>
            <SubscriptionPanel />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}


