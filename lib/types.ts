// Types matching the backend Java models

export interface User {
  id: string
  name: string
  email: string
  profileImageUrl?: string
  subscriptionPlan: "basic" | "premium" | "pro"
  emailVerified: boolean
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  id: string
  name: string
  email: string
  profileImageUrl?: string
  subscriptionPlan: string
  emailVerified: boolean
  token: string
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  name: string
  password: string
  profileImageUrl?: string
}

export interface Template {
  theme: string
  colorPalette: string[]
}

export interface ProfileInfo {
  profilePreviewUrl?: string
  fullName: string
  designation: string
  summary: string
}

export interface ContactInfo {
  email: string
  phone: string
  location: string
  linkedIn?: string
  github?: string
  website?: string
}

export interface WorkExperience {
  company: string
  role: string
  startDate: string
  endDate: string
  description: string
}

export interface Education {
  degree: string
  Institution: string
  startDate: string
  endDate: string
}

export interface Skill {
  name: string
  progress: number
}

export interface Project {
  title: string
  description: string
  github?: string
  liveDemo?: string
}

export interface Certification {
  title: string
  issuer: string
  year: string
}

export interface Language {
  name: string
  progress: number
}

export interface Resume {
  _id?: string
  id?: string
  userId: string
  title: string
  thumbnailLink?: string
  template?: Template
  profileInfo?: ProfileInfo
  contactInfo?: ContactInfo
  workExperience?: WorkExperience[]
  education?: Education[]
  skill?: Skill[]
  project?: Project[]
  certification?: Certification[]
  languages?: Language[]
  interests?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface CreateResumeRequest {
  title: string
}

export interface Payment {
  id: string
  userId: string
  razorpayOrderId: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  amount: number
  currency: string
  planType: string
  status: string
  receipt: string
  createdAt: string
  updatedAt: string
}

export interface ApiError {
  message: string
  status?: number
}
