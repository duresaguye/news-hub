"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function ProfileSettings() {
  const router = useRouter()
  const { user, loading, logout } = useAuth()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading profile...</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Fetching your account details.
        </CardContent>
      </Card>
    )
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sign in to view your profile</CardTitle>
          <CardDescription>Access saved articles and subscription settings after logging in.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/auth/login")}>Go to login</Button>
        </CardContent>
      </Card>
    )
  }

  const memberSince =
    user.createdAt || user.updatedAt
      ? new Date(user.createdAt || user.updatedAt || "").toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>

      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Username</p>
            <p className="text-foreground font-medium">{user.username || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Email</p>
            <p className="text-foreground font-medium">{user.email || "Unknown"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Member Since</p>
            <p className="text-foreground font-medium">{memberSince}</p>
          </div>
        </div>

        <div className="space-y-2">
          
       
        </div>

        <Button
          variant="destructive"
          onClick={async () => {
            await logout();
            router.push("/auth/login");
          }}
        >
          Sign out
        </Button>
      </CardContent>
    </Card>
  )
}
