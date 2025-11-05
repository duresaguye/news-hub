import ProfileSettings from "@/components/profile-settings";
import SavedArticles from "@/components/saved-articles";
import SubscriptionPanel from "@/components/subscription-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Settings, Bookmark, Bell, Calendar, Eye, Share2, Download, Mail, Shield, CreditCard } from "lucide-react";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Enhanced Cover Header */}
      <div className="relative isolate overflow-hidden">
        <div
          className="h-48 md:h-56 w-full bg-center bg-cover relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1920&auto=format&fit=crop')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/60 to-purple-900/40"></div>
        </div>
        
        {/* User Info Overlay */}
        <div className="relative bg-white border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 py-6">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="size-20 md:size-28 ring-4 ring-white shadow-lg -mt-12">
                  <AvatarImage src="https://i.pravatar.cc/240?u=newshub" alt="John Doe" />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg">
                    JD
                  </AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">John Doe</h1>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                      Free Plan
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Member since Jan 2025</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>Last active: 2 hours ago</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 max-w-md">
                    News enthusiast focused on technology and global affairs. Always staying informed.
                  </p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3 self-stretch md:self-end">
                <Button variant="outline" size="sm" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button size="sm" className="gap-2 bg-blue-600 hover:bg-blue-700">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Stats Card */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Your Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: Bookmark, label: "Saved Articles", value: "18", color: "text-blue-600" },
                { icon: Mail, label: "News Sources", value: "5", color: "text-green-600" },
                { icon: Bell, label: "Active Alerts", value: "12", color: "text-orange-600" },
                { icon: Eye, label: "Articles Read", value: "247", color: "text-purple-600" }
              ].map((stat, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{stat.label}</span>
                  </div>
                  <span className="font-bold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Access */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { icon: Download, label: "Download Data", href: "/export" },
                { icon: Shield, label: "Privacy Settings", href: "/privacy" },
                { icon: CreditCard, label: "Billing", href: "/billing" },
                { icon: Bell, label: "Notification Settings", href: "/notifications" }
              ].map((item, index) => (
                <Link key={index} to={item.href}>
                  <Button variant="ghost" className="w-full justify-start gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Button>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="shadow-sm border-0 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg text-blue-900">Subscription</CardTitle>
              <CardDescription className="text-blue-700">
                Upgrade for premium features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-blue-800">Current Plan</span>
                  <Badge variant="outline" className="bg-white text-blue-600">Free</Badge>
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Enhanced Quick Actions */}
          <Card className="shadow-sm border-0">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Settings, label: "Profile Settings", description: "Update your personal information", href: "#settings" },
                  { icon: Bookmark, label: "Saved Articles", description: "Manage your reading list", href: "#saved" },
                  { icon: Bell, label: "News Alerts", description: "Configure notifications", href: "#subscriptions" }
                ].map((action, index) => (
                  <Link key={index} to={action.href} className="block">
                    <Button variant="outline" className="w-full h-auto p-4 flex flex-col items-center gap-3 hover:border-blue-300 hover:bg-blue-50 transition-all group">
                      <div className="p-3 rounded-full bg-blue-100 group-hover:bg-blue-200 transition-colors">
                        <action.icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-gray-900 group-hover:text-blue-700">{action.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{action.description}</div>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Tabs */}
          <Card className="shadow-sm border-0">
            <CardContent className="p-0">
              <Tabs defaultValue="settings" className="w-full">
                <div className="border-b">
                  <TabsList className="w-full justify-start rounded-none border-0 bg-transparent p-0 h-auto">
                    <TabsTrigger 
                      value="settings" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4 data-[state=active]:text-blue-600"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Profile Settings
                    </TabsTrigger>
                    <TabsTrigger 
                      value="saved" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4 data-[state=active]:text-blue-600"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      Saved Articles
                    </TabsTrigger>
                    <TabsTrigger 
                      value="subscriptions" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:bg-transparent px-6 py-4 data-[state=active]:text-blue-600"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Subscriptions & Alerts
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <div className="p-6">
                  <TabsContent value="settings" className="mt-0">
                    <ProfileSettings />
                  </TabsContent>
                  <TabsContent value="saved" className="mt-0">
                    <SavedArticles />
                  </TabsContent>
                  <TabsContent value="subscriptions" className="mt-0">
                    <SubscriptionPanel />
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}