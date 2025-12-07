"use client"

import type { Resume } from "@/lib/types"
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react"

interface ResumePreviewProps {
  resume: Resume
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const { profileInfo, contactInfo, workExperience, education, skill, project, certification, languages, interests } =
    resume

  return (
    <div className="bg-white text-gray-900 p-8 min-h-full shadow-lg">
      {/* Header */}
      <header className="border-b border-gray-200 pb-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{profileInfo?.fullName || "Your Name"}</h1>
        <p className="text-lg text-emerald-600 font-medium mt-1">{profileInfo?.designation || "Your Title"}</p>

        {/* Contact Info */}
        {contactInfo && (
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-600">
            {contactInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {contactInfo.email}
              </span>
            )}
            {contactInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {contactInfo.phone}
              </span>
            )}
            {contactInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {contactInfo.location}
              </span>
            )}
            {contactInfo.linkedIn && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" />
                {contactInfo.linkedIn}
              </span>
            )}
            {contactInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3" />
                {contactInfo.github}
              </span>
            )}
            {contactInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {contactInfo.website}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Summary */}
      {profileInfo?.summary && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">
            Professional Summary
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">{profileInfo.summary}</p>
        </section>
      )}

      {/* Experience */}
      {workExperience && workExperience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Work Experience</h2>
          <div className="space-y-4">
            {workExperience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.role}</h3>
                    <p className="text-sm text-emerald-600">{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate}
                  </span>
                </div>
                {exp.description && <p className="text-sm text-gray-700 mt-2">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu, i) => (
              <div key={i} className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                  <p className="text-sm text-gray-600">{edu.Institution}</p>
                </div>
                <span className="text-sm text-gray-500">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skill && skill.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {skill.map((s, i) => (
              <span key={i} className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full">
                {s.name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {project && project.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Projects</h2>
          <div className="space-y-3">
            {project.map((proj, i) => (
              <div key={i}>
                <h3 className="font-semibold text-gray-900">{proj.title}</h3>
                {proj.description && <p className="text-sm text-gray-700 mt-1">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications */}
      {certification && certification.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Certifications</h2>
          <div className="space-y-2">
            {certification.map((cert, i) => (
              <div key={i} className="flex justify-between">
                <div>
                  <span className="font-medium text-gray-900">{cert.title}</span>
                  <span className="text-gray-600"> - {cert.issuer}</span>
                </div>
                <span className="text-sm text-gray-500">{cert.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages && languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Languages</h2>
          <div className="flex flex-wrap gap-4">
            {languages.map((lang, i) => (
              <div key={i} className="text-sm">
                <span className="font-medium text-gray-900">{lang.name}</span>
                <span className="text-gray-500 ml-1">
                  (
                  {lang.progress >= 90
                    ? "Native"
                    : lang.progress >= 75
                      ? "Fluent"
                      : lang.progress >= 50
                        ? "Intermediate"
                        : "Basic"}
                  )
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Interests */}
      {interests && interests.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-3">Interests</h2>
          <p className="text-sm text-gray-700">{interests.join(" • ")}</p>
        </section>
      )}
    </div>
  )
}
