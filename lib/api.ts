import type { AuthResponse, LoginRequest, RegisterRequest, Resume, CreateResumeRequest, Payment } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

class ApiClient {
  private getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (token) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  private async requestWithFormData<T>(endpoint: string, formData: FormData, method = "PUT"): Promise<T> {
    const token = this.getToken()
    const headers: HeadersInit = {}

    if (token) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers,
      body: formData,
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }))
      throw new Error(error.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async verifyEmail(token: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/auth/verify-email?token=${token}`)
  }

  async resendVerification(email: string): Promise<{ message: string }> {
    return this.request<{ message: string }>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async getProfile(): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/profile")
  }

  async uploadProfileImage(file: File): Promise<{ profileImageUrl: string }> {
    const formData = new FormData()
    formData.append("image", file)

    return this.requestWithFormData<{ profileImageUrl: string }>("/auth/upload-image", formData, "POST")
  }

  // Resume endpoints
  async createResume(data: CreateResumeRequest): Promise<Resume> {
    return this.request<Resume>("/resumes", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getResumes(): Promise<Resume[]> {
    return this.request<Resume[]>("/resumes")
  }

  async getResumeById(id: string): Promise<Resume> {
    return this.request<Resume>(`/resumes/${id}`)
  }

  async updateResume(id: string, data: Partial<Resume>): Promise<Resume> {
    return this.request<Resume>(`/resumes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async uploadResumeImages(
    id: string,
    thumbnail?: File,
    profileImage?: File,
  ): Promise<{ thumbnailLink?: string; profilePreviewUrl?: string }> {
    const formData = new FormData()
    if (thumbnail) formData.append("thumbnail", thumbnail)
    if (profileImage) formData.append("profileImage", profileImage)

    return this.requestWithFormData(`/resumes/${id}/upload-images`, formData)
  }

  async deleteResume(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/resumes/${id}`, {
      method: "DELETE",
    })
  }

  // Payment endpoints
  async createPaymentOrder(
    planType: string,
  ): Promise<{ orderId: string; amount: number; currency: string; receipt: string }> {
    return this.request<{ orderId: string; amount: number; currency: string; receipt: string }>(
      "/payment/create-order",
      {
        method: "POST",
        body: JSON.stringify({ planType }),
      },
    )
  }

  async verifyPayment(data: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }): Promise<{ message: string; status: string }> {
    return this.request<{ message: string; status: string }>("/payment/verify", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getPaymentHistory(): Promise<Payment[]> {
    return this.request<Payment[]>("/payment/history")
  }

  // Templates endpoint
  async getTemplates(): Promise<{ theme: string; colorPalette: string[] }[]> {
    return this.request("/templates")
  }

  async sendResumeEmail(
    resumeId: string,
    recipientEmail: string,
    subject = "Resume Application",
    message = "Please find my resume attached.\n\nBest Regards",
  ): Promise<{ success: boolean; message: string }> {
    const token = this.getToken()
    const headers: HeadersInit = {}
    if (token) {
      ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
    }

    // First get the resume data to generate PDF
    const resume = await this.getResumeById(resumeId)

    // Generate PDF from resume data (create a simple PDF blob)
    const pdfContent = this.generateResumePDF(resume)
    const pdfBlob = new Blob([pdfContent], { type: "application/pdf" })
    const pdfFile = new File([pdfBlob], `${resume.title || "resume"}.pdf`, { type: "application/pdf" })

    const formData = new FormData()
    formData.append("recipientEmail", recipientEmail)
    formData.append("subject", subject)
    formData.append("message", message)
    formData.append("pdfFile", pdfFile)
    const response = await fetch(`${API_BASE_URL}/email/send-resume`, {
      method: "POST",
      headers,
      body: formData,
      credentials: "include",
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to send email" }))
      throw new Error(error.message)
    }

    return response.json()
  }

  // Helper to generate simple PDF content (placeholder - you may want to use a proper PDF library)
  private generateResumePDF(resume: Resume): string {
    // This creates a simple text representation
    // For production, consider using a PDF library like jsPDF or html2pdf
    let content = `${resume.profileInfo?.fullName || "Resume"}\n\n`

    if (resume.profileInfo?.headline) {
      content += `${resume.profileInfo.headline}\n\n`
    }

    if (resume.profileInfo?.summary) {
      content += `Summary:\n${resume.profileInfo.summary}\n\n`
    }

    if (resume.contactInfo) {
      content += `Contact:\n`
      if (resume.contactInfo.email) content += `Email: ${resume.contactInfo.email}\n`
      if (resume.contactInfo.phone) content += `Phone: ${resume.contactInfo.phone}\n`
      if (resume.contactInfo.location) content += `Location: ${resume.contactInfo.location}\n`
      content += "\n"
    }

    if (resume.workExperience?.length) {
      content += `Work Experience:\n`
      resume.workExperience.forEach((exp) => {
        content += `- ${exp.jobTitle} at ${exp.companyName}\n`
      })
      content += "\n"
    }

    if (resume.education?.length) {
      content += `Education:\n`
      resume.education.forEach((edu) => {
        content += `- ${edu.degree} from ${edu.institutionName}\n`
      })
      content += "\n"
    }

    if (resume.skills?.length) {
      content += `Skills:\n`
      resume.skills.forEach((skill) => {
        content += `- ${skill.name}\n`
      })
    }

    return content
  }
}

export const api = new ApiClient()
