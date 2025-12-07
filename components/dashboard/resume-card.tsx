"use client"

import { useState } from "react"
import Link from "next/link"
import type { Resume } from "@/lib/types"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { MoreVertical, Edit, Trash2, Copy, Mail, FileText, Calendar, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ResumeCardProps {
  resume: Resume
  onDelete: (id: string) => void
}

export function ResumeCard({ resume, onDelete }: ResumeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEmailDialog, setShowEmailDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [emailForm, setEmailForm] = useState({
    recipientEmail: "",
    subject: "Resume Application",
    message: "Please find my resume attached.\n\nBest Regards",
  })

  const resumeId = resume._id || resume.id || ""

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await api.deleteResume(resumeId)
      toast.success("Resume deleted successfully")
      onDelete(resumeId)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete resume")
    } finally {
      setIsDeleting(false)
      setShowDeleteDialog(false)
    }
  }

  const handleSendEmail = async () => {
    if (!emailForm.recipientEmail) {
      toast.error("Please enter recipient email")
      return
    }

    setIsSendingEmail(true)
    try {
      await api.sendResumeEmail(resumeId, emailForm.recipientEmail, emailForm.subject, emailForm.message)
      toast.success(`Resume sent successfully to ${emailForm.recipientEmail}`)
      setShowEmailDialog(false)
      setEmailForm({
        recipientEmail: "",
        subject: "Resume Application",
        message: "Please find my resume attached.\n\nBest Regards",
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send email")
    } finally {
      setIsSendingEmail(false)
    }
  }

  const formattedDate = resume.updatedAt
    ? formatDistanceToNow(new Date(resume.updatedAt), { addSuffix: true })
    : "Recently"

  return (
    <>
      <Card className="group border-border bg-card hover:border-primary/50 transition-colors">
        <CardContent className="p-0">
          <Link href={`/dashboard/resumes/${resumeId}`}>
            <div className="aspect-[3/4] bg-muted/30 relative overflow-hidden rounded-t-lg">
              {resume.thumbnailLink ? (
                <img
                  src={resume.thumbnailLink || "/placeholder.svg"}
                  alt={resume.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <FileText className="w-12 h-12" />
                  <span className="text-sm">Preview not available</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Link>
        </CardContent>
        <CardFooter className="p-4 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <Link href={`/dashboard/resumes/${resumeId}`}>
              <h3 className="font-semibold truncate hover:text-primary transition-colors">{resume.title}</h3>
            </Link>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <Calendar className="w-3 h-3" />
              <span>Updated {formattedDate}</span>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/resumes/${resumeId}`} className="flex items-center gap-2">
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Copy className="w-4 h-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEmailDialog(true)} className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Send via Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="text-destructive focus:text-destructive flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{resume.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Send Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Resume via Email</DialogTitle>
            <DialogDescription>Send "{resume.title}" as a PDF attachment to an email address.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipientEmail">Recipient Email *</Label>
              <Input
                id="recipientEmail"
                type="email"
                placeholder="recruiter@company.com"
                value={emailForm.recipientEmail}
                onChange={(e) => setEmailForm({ ...emailForm, recipientEmail: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Resume Application"
                value={emailForm.subject}
                onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Your message..."
                rows={4}
                value={emailForm.message}
                onChange={(e) => setEmailForm({ ...emailForm, message: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isSendingEmail}>
              {isSendingEmail ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
