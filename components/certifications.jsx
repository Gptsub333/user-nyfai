"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Certifications() {
  const [certifications, setCertifications] = useState([])
  const [fetchingCertifications, setFetchingCertifications] = useState(true)

  // Fetch certifications from the backend
  useEffect(() => {
    const fetchCertifications = async () => {
      setFetchingCertifications(true)
      try {
        const res = await fetch("/api/certifications")
        const data = await res.json()
        setCertifications(data)
      } catch (error) {
        console.error("Error fetching certifications:", error)
      } finally {
        setFetchingCertifications(false)
      }
    }

    fetchCertifications()
  }, [])

  return (
    <div className="mb-16">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Professional Certifications</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {certifications.map((cert, index) => (
          <Card key={index} className="border-2 border-[#165881]/20 relative">
            <CardHeader>
              <div className="flex items-center space-x-2 mb-2">
                <Award className="h-6 w-6 text-[#165881]" />
                <Badge variant="outline">{cert.badge}</Badge>
              </div>
              <CardTitle className="">{cert.title}</CardTitle>
              <CardDescription>{cert.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                <span>{cert.duration} program</span>
                <span>{cert.projects} hands-on projects</span>
              </div>
              {cert.learnMoreUrl ? (
                <a href={cert.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full bg-transparent text-[#165881] border-[#165881]">
                    Learn More
                  </Button>
                </a>
              ) : (
                <Button variant="outline" className="w-full bg-transparent text-[#165881] border-[#165881]">
                  Learn More
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
