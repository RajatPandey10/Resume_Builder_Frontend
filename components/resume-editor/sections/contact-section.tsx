"use client"

import type { ContactInfo } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"

interface ContactSectionProps {
  data: ContactInfo | undefined
  onChange: (data: ContactInfo) => void
}

export function ContactSection({ data, onChange }: ContactSectionProps) {
  const handleChange = (field: keyof ContactInfo, value: string) => {
    onChange({
      ...(data || { email: "", phone: "", location: "" }),
      [field]: value,
    })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Contact Information</CardTitle>
        <CardDescription>How can employers reach you?</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={data?.email || ""}
              onChange={(e) => handleChange("email", e.target.value)}
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={data?.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <Input
              id="location"
              placeholder="New York, NY"
              value={data?.location || ""}
              onChange={(e) => handleChange("location", e.target.value)}
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedIn" className="flex items-center gap-2">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </Label>
            <Input
              id="linkedIn"
              placeholder="linkedin.com/in/johndoe"
              value={data?.linkedIn || ""}
              onChange={(e) => handleChange("linkedIn", e.target.value)}
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="github" className="flex items-center gap-2">
              <Github className="w-4 h-4" />
              GitHub
            </Label>
            <Input
              id="github"
              placeholder="github.com/johndoe"
              value={data?.github || ""}
              onChange={(e) => handleChange("github", e.target.value)}
              className="bg-input border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Website
            </Label>
            <Input
              id="website"
              placeholder="johndoe.com"
              value={data?.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              className="bg-input border-border"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
