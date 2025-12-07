"use client"

import { cn } from "@/lib/utils"
import { User, Phone, Briefcase, GraduationCap, Code, FolderOpen, Award, Languages, Heart, Palette } from "lucide-react"

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "contact", label: "Contact", icon: Phone },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Code },
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "certifications", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Languages },
  { id: "interests", label: "Interests", icon: Heart },
  { id: "template", label: "Template", icon: Palette },
]

interface EditorSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function EditorSidebar({ activeSection, onSectionChange }: EditorSidebarProps) {
  return (
    <aside className="w-64 border-r border-border bg-sidebar overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-muted-foreground mb-4 px-2">Resume Sections</h2>
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                activeSection === section.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.label}
            </button>
          ))}
        </nav>
      </div>
    </aside>
  )
}
