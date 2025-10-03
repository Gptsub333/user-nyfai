"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"

export default function Instructors() {
  const [instructors, setInstructors] = useState([])
  const [fetchingInstructors, setFetchingInstructors] = useState(true)

  // Fetch instructors from the backend
  useEffect(() => {
    const fetchInstructors = async () => {
      setFetchingInstructors(true)
      try {
        const res = await fetch("/api/instructors")
        const data = await res.json()
        setInstructors(data)
      } catch (error) {
        console.error("Error fetching instructors:", error)
      } finally {
        setFetchingInstructors(false)
      }
    }

    fetchInstructors()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold">Meet Your Instructors</h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {instructors.map((instructor, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-6 text-center">
              {instructor.avatar ? (
                <img
                  src={instructor.avatar || "/placeholder.svg"}
                  alt={`${instructor.name} avatar`}
                  className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border border-[#1a729c]"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-[#1a729c]" />
                </div>
              )}
              <h3 className="font-semibold text-lg mb-1">{instructor.name}</h3>
              <p className="text-[#1a729c] text-sm mb-1">{instructor.title}</p>
              {instructor.experience && (
                <p className="text-muted-foreground text-xs mb-3">{instructor.experience} experience</p>
              )}
              <p className="text-sm">{instructor.bio}</p>
              {instructor.profileLink && (
                <div className="mt-4">
                  <a
                    href={instructor.profileLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#1a729c] hover:underline text-sm"
                  >
                    View Profile
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
