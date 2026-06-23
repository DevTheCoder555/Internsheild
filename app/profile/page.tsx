"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { updateProfileAction, logoutAction } from "@/actions/auth";
import { toast } from "@/hooks/useToast";
import { User, Mail, Calendar, Shield, Loader2, Save, LogOut } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleUpdate = async (formData: FormData) => {
    setSaving(true);
    const result = await updateProfileAction(formData);
    if (result.success) {
      toast({ type: "success", title: "Profile Updated" });
      router.refresh();
    } else {
      toast({ type: "error", title: "Update Failed", description: result.error });
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await logoutAction();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <User className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Sign In Required</h1>
        <p className="text-gray-400 mb-6">Please sign in to view your profile.</p>
        <Button variant="shield" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <User className="h-8 w-8 text-blue-400" />
          Profile
        </h1>
      </div>

      <div className="grid gap-6">
        {/* Profile Header */}
        <Card className="bg-gray-900/50 border-white/10">
          <CardContent className="p-6 flex items-center gap-6">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-blue-600 text-white text-2xl">
                {user.full_name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold text-white">{user.full_name || "User"}</h2>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Joined {formatDate(user.created_at)}
                </span>
                <span className="flex items-center gap-1 text-xs">
                  <Shield className={`h-3 w-3 ${user.role === "admin" ? "text-red-400" : "text-blue-400"}`} />
                  <span className="capitalize text-gray-400">{user.role}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-900/50 border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-blue-400">{user.scan_count || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Scans Performed</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-900/50 border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-purple-400">{user.report_count || 0}</p>
              <p className="text-sm text-gray-400 mt-1">Reports Submitted</p>
            </CardContent>
          </Card>
        </div>

        {/* Edit Profile */}
        <Card className="bg-gray-900/50 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleUpdate} className="space-y-4">
              <div>
                <Label htmlFor="fullName" className="text-gray-300">Full Name</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  defaultValue={user.full_name || ""}
                  placeholder="Your full name"
                  className="mt-1 bg-gray-800/50 border-white/10"
                />
              </div>

              <div>
                <Label className="text-gray-300">Email</Label>
                <Input
                  value={user.email}
                  disabled
                  className="mt-1 bg-gray-800/50 border-white/10 opacity-60"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <Button type="submit" variant="shield" disabled={saving}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-gray-900/50 border-red-500/20">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Sign Out</p>
              <p className="text-xs text-gray-400">Sign out of your account on this device</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
