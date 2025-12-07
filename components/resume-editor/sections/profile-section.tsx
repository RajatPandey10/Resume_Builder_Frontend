"use client"

import type { ProfileInfo } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ProfileSectionProps {
  data: ProfileInfo | undefined
  onChange: (data: ProfileInfo) => void
}

export function ProfileSection({ data, onChange }: ProfileSectionProps) {
  const handleChange = (field: keyof ProfileInfo, value: string) => {
    onChange({
      ...(data || { fullName: "", designation: "", summary: "" }),
      [field]: value,
    })
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Add your personal details that will appear at the top of your resume</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="John Doe"
            value={data?.fullName || ""}
            onChange={(e) => handleChange("fullName", e.target.value)}
            className="bg-input border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="designation">Job Title / Designation</Label>
          <Input
            id="designation"
            placeholder="Senior Software Engineer"
            value={data?.designation || ""}
            onChange={(e) => handleChange("designation", e.target.value)}
            className="bg-input border-border"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            placeholder="Write a brief summary about yourself and your career goals..."
            value={data?.summary || ""}
            onChange={(e) => handleChange("summary", e.target.value)}
            className="bg-input border-border min-h-32"
          />
        </div>
      </CardContent>
    </Card>
  )
}
