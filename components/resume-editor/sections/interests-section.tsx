"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface InterestsSectionProps {
  data: string[] | undefined
  onChange: (data: string[]) => void
}

export function InterestsSection({ data = [], onChange }: InterestsSectionProps) {
  const [newInterest, setNewInterest] = useState("")

  const addInterest = () => {
    if (newInterest.trim() && !data.includes(newInterest.trim())) {
      onChange([...data, newInterest.trim()])
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    onChange(data.filter((i) => i !== interest))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addInterest()
    }
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Interests & Hobbies</CardTitle>
        <CardDescription>Add your personal interests to show your personality</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Photography, Hiking, Reading"
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyPress={handleKeyPress}
            className="bg-input border-border"
          />
          <Button onClick={addInterest} variant="outline" disabled={!newInterest.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {data.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.map((interest, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary/20"
              >
                {interest}
                <button onClick={() => removeInterest(interest)} className="ml-2 hover:text-destructive">
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        {data.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No interests added yet. Type an interest and press Enter or click +.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
