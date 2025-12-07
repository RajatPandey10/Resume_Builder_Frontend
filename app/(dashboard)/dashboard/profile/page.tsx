"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import { Header } from "@/components/dashboard/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Camera, Loader2, Mail, Calendar, Crown } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "RP"

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB")
      return
    }

    setIsUploading(true)
    try {
      const result = await api.uploadProfileImage(file)
      await refreshUser()
      toast.success("Profile image updated successfully")
    } catch (error) {
      console.error("Upload error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload image")
    } finally {
      setIsUploading(false)
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const getPlanBadge = () => {
    switch (user?.subscriptionPlan) {
      case "premium":
        return <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">Premium</Badge>
      default:
        return <Badge variant="secondary">Basic</Badge>
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Profile" description="Manage your profile information" />

      <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* Profile Overview */}
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={user?.profileImageUrl || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary/20 text-primary text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                >
                  {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="flex items-center gap-3 justify-center sm:justify-start">
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  {getPlanBadge()}
                </div>
                <p className="text-muted-foreground mt-1">{user?.email}</p>
                <div className="flex items-center gap-4 mt-3 justify-center sm:justify-start text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {user?.emailVerified ? "Verified" : "Not Verified"}
                  </span>
                  {user?.createdAt && (
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {format(new Date(user.createdAt), "MMM yyyy")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input value={user?.name || ""} disabled className="bg-muted border-border" />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input value={user?.email || ""} disabled className="bg-muted border-border" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">To update your account details, please contact support.</p>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              Subscription Plan
            </CardTitle>
            <CardDescription>Manage your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-muted/50">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold capitalize">{user?.subscriptionPlan || "Basic"} Plan</h3>
                  {getPlanBadge()}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {user?.subscriptionPlan === "basic" || !user?.subscriptionPlan
                    ? "Limited features. Upgrade to unlock premium templates and features."
                    : "You have access to all premium features."}
                </p>
              </div>
              {(user?.subscriptionPlan === "basic" || !user?.subscriptionPlan) && (
                <Link href="/dashboard/billing">
                  <Button className="bg-primary hover:bg-primary/90">Upgrade Plan</Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
