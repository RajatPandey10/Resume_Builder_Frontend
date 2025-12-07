"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function NewResumePage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createResume = async () => {
      try {
        const resume = await api.createResume({ title: "Untitled Resume" })
        router.replace(`/dashboard/resumes/${resume._id || resume.id}`)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create resume")
      }
    }

    createResume()
  }, [router])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button onClick={() => router.push("/dashboard/resumes")} className="text-primary hover:underline">
            Go back to resumes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Creating your resume...</p>
      </div>
    </div>
  )
}
