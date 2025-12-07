"use client"

import type { Project } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, GripVertical } from "lucide-react"

interface ProjectsSectionProps {
  data: Project[] | undefined
  onChange: (data: Project[]) => void
}

export function ProjectsSection({ data = [], onChange }: ProjectsSectionProps) {
  const addProject = () => {
    onChange([...data, { title: "", description: "", github: "", liveDemo: "" }])
  }

  const updateProject = (index: number, field: keyof Project, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeProject = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Projects</CardTitle>
            <CardDescription>Showcase your best work and side projects</CardDescription>
          </div>
          <Button onClick={addProject} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No projects added yet.</p>
            <p className="text-sm">Click "Add Project" to get started.</p>
          </div>
        ) : (
          data.map((project, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />
                  <span className="text-sm font-medium">Project {index + 1}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProject(index)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Project Title</Label>
                  <Input
                    placeholder="E-commerce Platform"
                    value={project.title}
                    onChange={(e) => updateProject(index, "title", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Describe your project, technologies used, and your role..."
                    value={project.description}
                    onChange={(e) => updateProject(index, "description", e.target.value)}
                    className="bg-input border-border min-h-24"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input
                      placeholder="https://github.com/username/project"
                      value={project.github || ""}
                      onChange={(e) => updateProject(index, "github", e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Live Demo URL</Label>
                    <Input
                      placeholder="https://myproject.com"
                      value={project.liveDemo || ""}
                      onChange={(e) => updateProject(index, "liveDemo", e.target.value)}
                      className="bg-input border-border"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
