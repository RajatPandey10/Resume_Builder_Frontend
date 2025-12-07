"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Mail, CheckCircle, XCircle } from "lucide-react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [status, setStatus] = useState<"pending" | "verifying" | "success" | "error">(token ? "verifying" : "pending")
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    try {
      await api.verifyEmail(verificationToken)
      setStatus("success")
      toast.success("Email verified successfully!")
      setTimeout(() => router.push("/dashboard"), 2000)
    } catch (error) {
      setStatus("error")
      toast.error(error instanceof Error ? error.message : "Verification failed")
    }
  }

  const handleResend = async () => {
    if (!email) {
      toast.error("Email address not found")
      return
    }

    setIsResending(true)
    try {
      await api.resendVerification(email)
      toast.success("Verification email sent!")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to resend email")
    } finally {
      setIsResending(false)
    }
  }

  if (status === "verifying") {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            <p className="text-lg font-medium">Verifying your email...</p>
            <p className="text-sm text-muted-foreground">Please wait a moment</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "success") {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <p className="text-lg font-medium">Email Verified!</p>
            <p className="text-sm text-muted-foreground mb-4">Redirecting to dashboard...</p>
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90">Go to Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (status === "error") {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <XCircle className="w-8 h-8 text-destructive" />
            </div>
            <p className="text-lg font-medium">Verification Failed</p>
            <p className="text-sm text-muted-foreground mb-4">The verification link may have expired</p>
            <Button onClick={handleResend} disabled={isResending || !email} className="bg-primary hover:bg-primary/90">
              {isResending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Resend Verification Email"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
        <CardDescription>
          We've sent a verification link to <span className="font-medium text-foreground">{email || "your email"}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          Click the link in the email to verify your account. If you don't see it, check your spam folder.
        </p>
        <div className="flex flex-col gap-3">
          <Button
            variant="outline"
            onClick={handleResend}
            disabled={isResending || !email}
            className="w-full bg-transparent"
          >
            {isResending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              "Resend Verification Email"
            )}
          </Button>
          <Link href="/login" className="w-full">
            <Button variant="ghost" className="w-full">
              Back to Sign In
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <p className="text-lg font-medium">Loading...</p>
            </div>
          </CardContent>
        </Card>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
