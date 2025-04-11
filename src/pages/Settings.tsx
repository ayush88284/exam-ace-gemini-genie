
import React, { useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/components/ThemeProvider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sun, Moon, BellRing, BellOff, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const Settings = () => {
  const { user, loading } = useSupabaseAuth();
  const { theme, setTheme } = useTheme();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [questionCount, setQuestionCount] = useState("5");
  const [showAnswers, setShowAnswers] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate saving to a database
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would update the user's settings in your database
      toast.success("Settings updated successfully");
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error("Failed to update settings");
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
                You need to be signed in to view your settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 gama-gradient-text text-center">Settings</h1>
      
      <div className="grid gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how GAMA AI looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                <div>
                  <h3 className="font-medium">Theme</h3>
                  <p className="text-sm text-muted-foreground">
                    Select your preferred theme
                  </p>
                </div>
              </div>
              <div>
                <Select
                  value={theme}
                  onValueChange={(value) => setTheme(value as "light" | "dark")}
                >
                  <SelectTrigger className="w-28">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Study Preferences</CardTitle>
            <CardDescription>Customize your study session defaults</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Default Question Count</h3>
                <p className="text-sm text-muted-foreground">
                  Number of questions to generate by default
                </p>
              </div>
              <div>
                <Select
                  value={questionCount}
                  onValueChange={setQuestionCount}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="15">15</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {showAnswers ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                <div>
                  <h3 className="font-medium">Show Answers by Default</h3>
                  <p className="text-sm text-muted-foreground">
                    Automatically display answers when questions are generated
                  </p>
                </div>
              </div>
              <Switch
                checked={showAnswers}
                onCheckedChange={setShowAnswers}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {emailNotifications ? <BellRing className="h-5 w-5" /> : <BellOff className="h-5 w-5" />}
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive updates and study reminders via email
                  </p>
                </div>
              </div>
              <Switch
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleSaveSettings} 
              disabled={isSaving}
              className="ml-auto"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
