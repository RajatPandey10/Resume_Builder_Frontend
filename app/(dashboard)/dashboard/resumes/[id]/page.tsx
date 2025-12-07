"use client"

import { useEffect, useState, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import type {
  Resume,
  ProfileInfo,
  ContactInfo,
  WorkExperience,
  Education,
  Skill,
  Project,
  Certification,
  Language,
  Template,
} from "@/lib/types"
import { EditorSidebar } from "@/components/resume-editor/editor-sidebar"
import { ProfileSection } from "@/components/resume-editor/sections/profile-section"
import { ContactSection } from "@/components/resume-editor/sections/contact-section"
import { ExperienceSection } from "@/components/resume-editor/sections/experience-section"
import { EducationSection } from "@/components/resume-editor/sections/education-section"
import { SkillsSection } from "@/components/resume-editor/sections/skills-section"
import { ProjectsSection } from "@/components/resume-editor/sections/projects-section"
import { CertificationsSection } from "@/components/resume-editor/sections/certifications-section"
import { LanguagesSection } from "@/components/resume-editor/sections/languages-section"
import { InterestsSection } from "@/components/resume-editor/sections/interests-section"
import { TemplateSection } from "@/components/resume-editor/sections/template-section"
import { ResumePreview } from "@/components/resume-editor/resume-preview"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { ArrowLeft, Save, Eye, Download, Loader2 } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

export default function ResumeEditorPage() {
  const params = useParams()
  const router = useRouter()
  const resumeId = params.id as string

  const [resume, setResume] = useState<Resume | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState("profile")
  const [showPreview, setShowPreview] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await api.getResumeById(resumeId)
        setResume(data)
      } catch (error) {
        toast.error("Failed to load resume")
        router.push("/dashboard/resumes")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResume()
  }, [resumeId, router])

  const saveResume = useCallback(
    async (updatedResume: Resume) => {
      setIsSaving(true)
      try {
        await api.updateResume(resumeId, updatedResume)
        setHasChanges(false)
      } catch (error) {
        toast.error("Failed to save changes")
      } finally {
        setIsSaving(false)
      }
    },
    [resumeId],
  )

  const debouncedSave = useDebouncedCallback(saveResume, 1500)

  const updateResume = useCallback(
    (field: keyof Resume, value: unknown) => {
      if (!resume) return
      const updatedResume = { ...resume, [field]: value }
      setResume(updatedResume)
      setHasChanges(true)
      debouncedSave(updatedResume)
    },
    [resume, debouncedSave],
  )

  const handleManualSave = async () => {
    if (!resume) return
    await saveResume(resume)
    toast.success("Resume saved successfully")
  }

  const renderSection = () => {
    if (!resume) return null

    switch (activeSection) {
      case "profile":
        return (
          <ProfileSection
            data={resume.profileInfo}
            onChange={(data: ProfileInfo) => updateResume("profileInfo", data)}
          />
        )
      case "contact":
        return (
          <ContactSection
            data={resume.contactInfo}
            onChange={(data: ContactInfo) => updateResume("contactInfo", data)}
          />
        )
      case "experience":
        return (
          <ExperienceSection
            data={resume.workExperience}
            onChange={(data: WorkExperience[]) => updateResume("workExperience", data)}
          />
        )
      case "education":
        return (
          <EducationSection data={resume.education} onChange={(data: Education[]) => updateResume("education", data)} />
        )
      case "skills":
        return <SkillsSection data={resume.skill} onChange={(data: Skill[]) => updateResume("skill", data)} />
      case "projects":
        return <ProjectsSection data={resume.project} onChange={(data: Project[]) => updateResume("project", data)} />
      case "certifications":
        return (
          <CertificationsSection
            data={resume.certification}
            onChange={(data: Certification[]) => updateResume("certification", data)}
          />
        )
      case "languages":
        return (
          <LanguagesSection data={resume.languages} onChange={(data: Language[]) => updateResume("languages", data)} />
        )
      case "interests":
        return (
          <InterestsSection data={resume.interests} onChange={(data: string[]) => updateResume("interests", data)} />
        )
      case "template":
        return <TemplateSection data={resume.template} onChange={(data: Template) => updateResume("template", data)} />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="w-64 border-r border-border bg-sidebar p-4">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <Skeleton className="h-12 w-64 mb-6" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    )
  }

  if (!resume) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <EditorSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/resumes">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="font-semibold">{resume.title}</h1>
              <p className="text-sm text-muted-foreground">
                {hasChanges ? "Unsaved changes" : isSaving ? "Saving..." : "All changes saved"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowPreview(!showPreview)} className="hidden md:flex">
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? "Hide Preview" : "Preview"}
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button
              size="sm"
              onClick={handleManualSave}
              disabled={isSaving || !hasChanges}
              className="bg-primary hover:bg-primary/90"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor */}
          <div className={`flex-1 overflow-y-auto p-6 ${showPreview ? "hidden lg:block lg:w-1/2" : ""}`}>
            {/* Mobile Section Selector */}
            <div className="lg:hidden mb-6">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full p-2 rounded-lg border border-border bg-input"
              >
                <option value="profile">Profile</option>
                <option value="contact">Contact</option>
                <option value="experience">Experience</option>
                <option value="education">Education</option>
                <option value="skills">Skills</option>
                <option value="projects">Projects</option>
                <option value="certifications">Certifications</option>
                <option value="languages">Languages</option>
                <option value="interests">Interests</option>
                <option value="template">Template</option>
              </select>
            </div>
            {renderSection()}
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="w-full lg:w-1/2 border-l border-border bg-muted/30 overflow-y-auto p-6">
              <div className="max-w-[210mm] mx-auto">
                <ResumePreview resume={resume} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
