import type React from "react"
import { Logo } from "@/components/logo"
import Link from "next/link"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-card border-r border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link href="/">
            <Logo />
          </Link>
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight text-balance">Build Your Perfect Resume in Minutes</h1>
            <p className="text-lg text-muted-foreground max-w-md text-pretty">
              Create professional, ATS-friendly resumes that help you stand out and land your dream job.
            </p>
            <div className="flex gap-8 pt-4">
              <div>
                <p className="text-3xl font-bold text-primary">10K+</p>
                <p className="text-sm text-muted-foreground">Resumes Created</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">95%</p>
                <p className="text-sm text-muted-foreground">Success Rate</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">50+</p>
                <p className="text-sm text-muted-foreground">Templates</p>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Trusted by professionals worldwide</p>
        </div>
        {/* Decorative elements */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -left-10 top-1/3 w-60 h-60 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link href="/">
              <Logo />
            </Link>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
