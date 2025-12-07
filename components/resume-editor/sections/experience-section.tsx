"use client"
import type { WorkExperience } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface ExperienceSectionProps {
  data: WorkExperience[] | undefined
  onChange: (data: WorkExperience[]) => void
}

export function ExperienceSection({ data = [], onChange }: ExperienceSectionProps) {
  const addExperience = () => {
    onChange([...data, { company: "", role: "", startDate: "", endDate: "", description: "" }])
  }

  const updateExperience = (index: number, field: keyof WorkExperience, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeExperience = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Add your professional work history</CardDescription>
          </div>
          <Button onClick={addExperience} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No work experience added yet.</p>
            <p className="text-sm">Click "Add Experience" to get started.</p>
          </div>
        ) : (
          data.map((exp, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium">Experience {index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeExperience(index)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    placeholder="Google Inc."
                    value={exp.company}
                    onChange={(e) => updateExperience(index, "company", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role / Position</Label>
                  <Input
                    placeholder="Senior Software Engineer"
                    value={exp.role}
                    onChange={(e) => updateExperience(index, "role", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    placeholder="Jan 2020"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(index, "startDate", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input
                    placeholder="Present"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(index, "endDate", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe your responsibilities and achievements..."
                  value={exp.description}
                  onChange={(e) => updateExperience(index, "description", e.target.value)}
                  className="bg-input border-border min-h-24"
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
