"use client"

import type { Skill } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface SkillsSectionProps {
  data: Skill[] | undefined
  onChange: (data: Skill[]) => void
}

export function SkillsSection({ data = [], onChange }: SkillsSectionProps) {
  const addSkill = () => {
    onChange([...data, { name: "", progress: 80 }])
  }

  const updateSkill = (index: number, field: keyof Skill, value: string | number) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeSkill = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skills</CardTitle>
            <CardDescription>Add your technical and soft skills</CardDescription>
          </div>
          <Button onClick={addSkill} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Skill
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No skills added yet.</p>
            <p className="text-sm">Click "Add Skill" to get started.</p>
          </div>
        ) : (
          data.map((skill, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="e.g., React, TypeScript, Project Management"
                  value={skill.name}
                  onChange={(e) => updateSkill(index, "name", e.target.value)}
                  className="bg-input border-border"
                />
                <div className="flex items-center gap-4">
                  <Slider
                    value={[skill.progress]}
                    onValueChange={([value]) => updateSkill(index, "progress", value)}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-12">{skill.progress}%</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeSkill(index)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
