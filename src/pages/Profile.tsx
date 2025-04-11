
import React, { useState, useEffect } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { User } from "lucide-react";

const Profile = () => {
  const { user, loading } = useSupabaseAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // User's initials for avatar fallback
  const getUserInitials = () => {
    if (!user?.email) return "?";
    return user.email.charAt(0).toUpperCase();
  };

  useEffect(() => {
    // In a real app, you would fetch the user profile from a database
    if (user) {
      // This is placeholder data - in a real app, fetch from your database
      setDisplayName(user.email?.split('@')[0] || "");
      setBio("AI enthusiast and lifelong learner");
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      // Simulate saving to a database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the user's profile in your database
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container py-8">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Please Sign In</h2>
              <p className="text-muted-foreground">
                You need to be signed in to view your profile.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 gama-gradient-text text-center">Your Profile</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{displayName || "User"}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input 
                id="displayName" 
                value={displayName} 
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                value={user.email || ""} 
                disabled
                className="bg-muted/50"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Input
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveProfile} 
              disabled={isSaving}
              className="ml-auto"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center px-4 py-3 rounded-md bg-muted/50">
              <div>
                <h3 className="font-medium">Account Created</h3>
                <p className="text-sm text-muted-foreground">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Unknown"}
                </p>
              </div>
            </div>
            
            <div className="flex justify-between items-center px-4 py-3 rounded-md bg-muted/50">
              <div>
                <h3 className="font-medium">Email Verified</h3>
                <p className="text-sm text-muted-foreground">
                  {user.email_confirmed_at ? "Verified" : "Not verified"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
