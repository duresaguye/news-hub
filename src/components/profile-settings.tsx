"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { handleLogout } from '@/lib/auth-client';

type UserProfile = {
  name: string
  email: string
  createdAt?: string
  subscriptions?: string[]
}

export default function ProfileSettings() {
  const router = useRouter()
  const [formData, setFormData] = useState<UserProfile>({
    name: "",
    email: "",
    subscriptions: []
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setError(null)
        const response = await authClient.getSession()
        
        // Handle different response structures
        const sessionData = response && typeof response === 'object' && 'data' in response 
          ? (response as any).data 
          : response;
        
       
        const userData = sessionData?.user || sessionData;
        
        if (userData) {
          const userProfile = {
            name: userData.name || '',
            email: userData.email || '',
            createdAt: userData.created_at || userData.createdAt || new Date().toISOString(),
            subscriptions: Array.isArray(userData.subscriptions) ? userData.subscriptions : []
          };
          
          setFormData(userProfile)
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error)
        const errorMessage = error instanceof Error ? error.message : 'An error occurred while loading your profile'
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserProfile()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
    
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update profile:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile'
      setError(errorMessage)
    }
  }

  const signOutUser = async () => {
    setIsLoggingOut(true);
    await handleLogout({
      onSuccess: () => router.push('/auth/login'),
      onError: (e) => console.error(e),
      onFinally: () => setIsLoggingOut(false)
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading profile...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Failed to load profile. {error}</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your account details</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isEditing ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <Input name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleSave} className="flex-1">
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="text-foreground font-medium">{formData.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <p className="text-foreground font-medium">{formData.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                <p className="text-foreground font-medium">
                  {formData.createdAt ? 
                    new Date(formData.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 
                    'Not available'}
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Subscriptions</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subscriptions?.length ? (
                  formData.subscriptions.map((sub, index) => (
                    <span key={index} className="px-3 py-1 bg-muted rounded-full text-sm">
                      {sub}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground">No active subscriptions</p>
                )}
              </div>
              <Button 
                onClick={() => setIsEditing(true)}
                className="mt-4"
              >
                Edit Profile
              </Button>
            </div>
           
          </>
        )}
      </CardContent>
    </Card>
  )
}
