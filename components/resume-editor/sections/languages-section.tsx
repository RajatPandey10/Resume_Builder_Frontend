"use client"

import type { Language } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface LanguagesSectionProps {
  data: Language[] | undefined
  onChange: (data: Language[]) => void
}

export function LanguagesSection({ data = [], onChange }: LanguagesSectionProps) {
  const addLanguage = () => {
    onChange([...data, { name: "", progress: 80 }])
  }

  const updateLanguage = (index: number, field: keyof Language, value: string | number) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeLanguage = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const getProficiencyLabel = (progress: number) => {
    if (progress >= 90) return "Native"
    if (progress >= 75) return "Fluent"
    if (progress >= 50) return "Intermediate"
    return "Basic"
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Languages</CardTitle>
            <CardDescription>Add languages you speak</CardDescription>
          </div>
          <Button onClick={addLanguage} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Language
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No languages added yet.</p>
            <p className="text-sm">Click "Add Language" to get started.</p>
          </div>
        ) : (
          data.map((lang, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted/30">
              <div className="flex-1 space-y-3">
                <Input
                  placeholder="e.g., English, Spanish, French"
                  value={lang.name}
                  onChange={(e) => updateLanguage(index, "name", e.target.value)}
                  className="bg-input border-border"
                />
                <div className="flex items-center gap-4">
                  <Slider
                    value={[lang.progress]}
                    onValueChange={([value]) => updateLanguage(index, "progress", value)}
                    max={100}
                    step={5}
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground w-24">{getProficiencyLabel(lang.progress)}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeLanguage(index)}
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
