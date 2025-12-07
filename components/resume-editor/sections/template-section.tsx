"use client"

import type { Template } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

const templates = [
  {
    theme: "modern",
    name: "Modern",
    colorPalette: ["#22c55e", "#1f2937", "#ffffff"],
    preview: "bg-gradient-to-br from-primary/20 to-secondary/20",
  },
  {
    theme: "classic",
    name: "Classic",
    colorPalette: ["#1f2937", "#374151", "#ffffff"],
    preview: "bg-gradient-to-br from-gray-700/30 to-gray-500/20",
  },
  {
    theme: "creative",
    name: "Creative",
    colorPalette: ["#8b5cf6", "#ec4899", "#ffffff"],
    preview: "bg-gradient-to-br from-purple-500/30 to-pink-500/20",
  },
  {
    theme: "minimal",
    name: "Minimal",
    colorPalette: ["#171717", "#525252", "#fafafa"],
    preview: "bg-gradient-to-br from-neutral-800/30 to-neutral-600/20",
  },
  {
    theme: "professional",
    name: "Professional",
    colorPalette: ["#0ea5e9", "#0369a1", "#ffffff"],
    preview: "bg-gradient-to-br from-sky-500/30 to-sky-700/20",
  },
  {
    theme: "elegant",
    name: "Elegant",
    colorPalette: ["#d97706", "#92400e", "#fffbeb"],
    preview: "bg-gradient-to-br from-amber-500/30 to-amber-700/20",
  },
]

interface TemplateSectionProps {
  data: Template | undefined
  onChange: (data: Template) => void
}

export function TemplateSection({ data, onChange }: TemplateSectionProps) {
  const selectedTheme = data?.theme || "modern"

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Choose Template</CardTitle>
        <CardDescription>Select a template that best represents your style</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {templates.map((template) => (
            <button
              key={template.theme}
              onClick={() =>
                onChange({
                  theme: template.theme,
                  colorPalette: template.colorPalette,
                })
              }
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all text-left",
                selectedTheme === template.theme
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50",
              )}
            >
              <div className={cn("aspect-[3/4] rounded-md mb-3", template.preview)} />
              <p className="font-medium text-sm">{template.name}</p>
              <div className="flex gap-1 mt-2">
                {template.colorPalette.map((color, i) => (
                  <div
                    key={i}
                    className="w-4 h-4 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              {selectedTheme === template.theme && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
