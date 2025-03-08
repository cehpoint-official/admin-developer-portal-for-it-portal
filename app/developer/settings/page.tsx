"use client";
import React, { useState } from "react";
import { Key, Lock, Save, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
//import { useToast } from '@/components/ui/use-toast';
import { motion } from "framer-motion";

const DeveloperSettings = () => {
  //const { toast } = useToast();

  const [profileForm, setProfileForm] = useState({
    fullName: "Alex Johnson",
    email: "alex.j@example.com",
    phone: "+1 (555) 987-6543",
    title: "Full Stack Developer",
    bio: "Experienced developer with a passion for building modern, responsive web applications.",
    skills: "React, Node.js, TypeScript, MongoDB",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Handle profile form changes
  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle password form changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save profile
  const handleSaveProfile = () => {
    //   toast({
    //     title: "Profile updated",
    //     description: "Your profile information has been saved.",
    //   });
  };

  // Handle save password
  const handleSavePassword = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      // toast({
      //   title: "Passwords don't match",
      //   description: "New password and confirm password must match.",
      //   variant: "destructive",
      // });
      return;
    }

    //   toast({
    //     title: "Password updated",
    //     description: "Your password has been changed successfully.",
    //   });

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-2 w-full md:w-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and public profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage
                      src="https://ui-avatars.com/api/?background=random&name=Alex+Johnson"
                      alt="Alex Johnson"
                    />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                </div>

                <div className="flex-1 grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={profileForm.fullName}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        value={profileForm.email}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={profileForm.title}
                        onChange={handleProfileChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      name="skills"
                      value={profileForm.skills}
                      onChange={handleProfileChange}
                      placeholder="Comma-separated list of skills"
                    />
                    <p className="text-sm text-muted-foreground">
                      Add your skills separated by commas (e.g., React, Node.js,
                      TypeScript)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={profileForm.bio}
                      onChange={handleProfileChange}
                      className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                className="flex items-center gap-1"
                onClick={handleSaveProfile}
              >
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="password" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to maintain account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setPasswordForm({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })
                }
              >
                Reset Fields
              </Button>
              <Button
                className="flex items-center gap-1"
                onClick={handleSavePassword}
              >
                <Lock className="h-4 w-4" />
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DeveloperSettings;
