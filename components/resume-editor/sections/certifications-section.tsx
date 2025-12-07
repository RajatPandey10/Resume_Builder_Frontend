"use client"

import type { Certification } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

interface CertificationsSectionProps {
  data: Certification[] | undefined
  onChange: (data: Certification[]) => void
}

export function CertificationsSection({ data = [], onChange }: CertificationsSectionProps) {
  const addCertification = () => {
    onChange([...data, { title: "", issuer: "", year: "" }])
  }

  const updateCertification = (index: number, field: keyof Certification, value: string) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeCertification = (index: number) => {
    onChange(data.filter((_, i) => i !== index))
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Certifications</CardTitle>
            <CardDescription>Add your professional certifications</CardDescription>
          </div>
          <Button onClick={addCertification} size="sm" variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Certification
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {data.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No certifications added yet.</p>
            <p className="text-sm">Click "Add Certification" to get started.</p>
          </div>
        ) : (
          data.map((cert, index) => (
            <div key={index} className="p-4 rounded-lg border border-border bg-muted/30 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Certification {index + 1}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeCertification(index)}
                  className="h-8 w-8 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Certification Title</Label>
                  <Input
                    placeholder="AWS Solutions Architect"
                    value={cert.title}
                    onChange={(e) => updateCertification(index, "title", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Issuer</Label>
                  <Input
                    placeholder="Amazon Web Services"
                    value={cert.issuer}
                    onChange={(e) => updateCertification(index, "issuer", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    placeholder="2023"
                    value={cert.year}
                    onChange={(e) => updateCertification(index, "year", e.target.value)}
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
