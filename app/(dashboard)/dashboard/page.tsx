"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Resume } from "@/lib/types"
import { Header } from "@/components/dashboard/header"
import { ResumeCard } from "@/components/dashboard/resume-card"
import { CreateResumeDialog } from "@/components/dashboard/create-resume-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { FileText, Plus, TrendingUp, Eye, Download } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)

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

  const stats = [
    { label: "Total Resumes", value: resumes.length, icon: FileText },
    { label: "Total Views", value: 0, icon: Eye },
    { label: "Downloads", value: 0, icon: Download },
    { label: "Success Rate", value: "0%", icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={`Welcome back, ${user?.name?.split(" ")[0] || "User"}!`}
        description="Manage your resumes and track your progress"
        showCreateButton
      />

      <div className="flex-1 p-6 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <Card key={i} className="border-border bg-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Resumes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Recent Resumes</h2>
            {resumes.length > 0 && (
              <Link href="/dashboard/resumes">
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </Link>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
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
          ) : resumes.length === 0 ? (
            <Card className="border-border border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
                <p className="text-muted-foreground text-center mb-6 max-w-sm">
                  Create your first resume to get started on your job search journey.
                </p>
                <CreateResumeDialog
                  onCreated={fetchResumes}
                  trigger={
                    <Button className="bg-primary hover:bg-primary/90">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Resume
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {resumes.slice(0, 4).map((resume) => (
                <ResumeCard key={resume._id || resume.id} resume={resume} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
