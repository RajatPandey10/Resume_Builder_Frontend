"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { Resume } from "@/lib/types"
import { Header } from "@/components/dashboard/header"
import { ResumeCard } from "@/components/dashboard/resume-card"
import { CreateResumeDialog } from "@/components/dashboard/create-resume-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Search, Grid, List } from "lucide-react"

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("updated")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fetchResumes = async () => {
    try {
      const data = await api.getResumes()
      setResumes(data)
    } catch (error) {
      console.error("Failed to fetch resumes:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleDelete = (id: string) => {
    setResumes(resumes.filter((r) => (r._id || r.id) !== id))
  }

  const filteredResumes = resumes
    .filter((resume) => resume.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "updated") {
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      }
      if (sortBy === "created") {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      }
      return a.title.localeCompare(b.title)
    })

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="My Resumes" description="Create, edit, and manage all your resumes" />

      <div className="flex-1 p-6 space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-1 gap-4 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/50 border-border"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 bg-muted/50 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="updated">Last Updated</SelectItem>
                <SelectItem value="created">Date Created</SelectItem>
                <SelectItem value="name">Name</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border border-border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                className="rounded-none h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
            <CreateResumeDialog onCreated={fetchResumes} />
          </div>
        </div>

        {/* Resume Grid/List */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="border-border">
                <CardContent className="p-0">
                  <Skeleton className="aspect-[3/4] rounded-t-lg" />
                </CardContent>
                <div className="p-4">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredResumes.length === 0 ? (
          <Card className="border-border border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{searchQuery ? "No resumes found" : "No resumes yet"}</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-sm">
                {searchQuery
                  ? "Try adjusting your search query"
                  : "Create your first resume to get started on your job search journey."}
              </p>
              {!searchQuery && (
                <CreateResumeDialog
                  onCreated={fetchResumes}
                  trigger={
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Resume
                    </Button>
                  }
                />
              )}
            </CardContent>
          </Card>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"
            }
          >
            {filteredResumes.map((resume) => (
              <ResumeCard key={resume._id || resume.id} resume={resume} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
