"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Play, Clock, Users, Star } from "lucide-react"
import Certifications from "@/components/certifications"
import Instructors from "@/components/Instructors"
import Loader from "@/components/Loader"

export default function OnlineCourse() {
  const [courses, setCourses] = useState([])
  const [fetchingCourses, setFetchingCourses] = useState(true)

  // Fetch courses from the backend (API route)
  useEffect(() => {
    const fetchCourses = async () => {
      setFetchingCourses(true)
      try {
        const res = await fetch("/api/courses")
        const data = await res.json()
        setCourses(data)
      } catch (error) {
        console.error("Error fetching courses:", error)
      } finally {
        setFetchingCourses(false)
      }
    }

    fetchCourses()
  }, [])

  if (fetchingCourses) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Professional courses</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#165881] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Courses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 md:py-20 lg:py-30 ">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <BookOpen className="w-3 h-3 mr-1" />
            Empowering learners through practical AI education
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Master AI with Real-World Impact</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Practical, comprehensive training tailored to business leaders, project managers, and innovators. Learn
            actionable strategies and frameworks you can implement immediately to drive meaningful results.
          </p>
        </div>

        {/* Learning Paths */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Professional Learning Paths</h2>
          </div>

          {/* Display Courses */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fetchingCourses ? (
              <Loader />
            ) : (
              courses.map((course, index) => (
                <Card
                  key={index}
                  className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col h-full relative"
                >
                  {course.image ? (
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
                      <Play className="h-12 w-12 text-[#165881]" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge
                        variant={
                          course.level === "Beginner"
                            ? "secondary"
                            : course.level === "Intermediate"
                              ? "default"
                              : course.level === "Advanced"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {course.level}
                      </Badge>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium text-[#165881]">{course.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-[#165881]" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-[#165881]" />
                        <span>{course.students.toLocaleString()} students</span>
                      </div>
                    </div>

                    {course.progress > 0 && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    )}

                    {course.externalLink ? (
                      <a href={course.externalLink} target="_blank" rel="noopener noreferrer">
                        <Button className="w-full bg-[#165881] transition-all">View Course</Button>
                      </a>
                    ) : (
                      <Button className="w-full text-[#165881] border-[#165881] hover:bg-[#165881] hover:text-white transition-all">
                        {course.progress > 0 ? "Continue Learning" : "View Course"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Certifications */}
        <Certifications />

        {/* Instructors */}
        <Instructors />
      </div>
    </div>
  )
}
