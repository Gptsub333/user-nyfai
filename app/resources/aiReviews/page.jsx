"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, ChevronDown } from "lucide-react"

/**
 * @typedef {Object} AIReview
 * @property {string} id
 * @property {string} toolName
 * @property {string} description
 * @property {string} image
 * @property {number} rating
 * @property {string[]} pros
 * @property {string[]} cons
 * @property {string} useCase
 */

export default function AIReviewsPage() {
  const [reviews, setReviews] = useState([])
  const [fetchLoading, setFetchLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filterQuery, setFilterQuery] = useState("")

  const filterOptions = [
    "Content Creation",
    "Data Analysis",
    "Image Generation",
    "Code Development",
    "Customer Support",
    "Marketing & Advertising",
    "Research & Documentation",
    "Design & Creative Work",
    "Business Intelligence",
    "Automation & Workflows",
    "Education & Training",
    "Personal Productivity",
    "Sales & Lead Generation",
    "Video & Audio Processing",
    "Translation & Language",
  ]

  const filteredOptions = filterOptions.filter((option) => option.toLowerCase().includes(filterQuery.toLowerCase()))

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter = !selectedFilter || review.useCase.toLowerCase().includes(selectedFilter.toLowerCase())

    return matchesSearch && matchesFilter
  })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      setFetchLoading(true)
      const response = await fetch("/api/ai-reviews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        console.error("Fetch error:", response.status, response.statusText)
        throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log("Raw API response:", data)

      const transformedReviews = data
        .map((review) => ({
          id: review.id,
          toolName: review.name || review["Tool Name"] || "",
          description: review.description || review.Description || "",
          image: review.image || review["Tool Image"] || "/placeholder.svg",
          rating: review.rating || review["Rating (1-5 stars)"] || 0,
          pros:
            typeof review.pros === "string"
              ? review.pros.split(",").map((p) => p.trim())
              : typeof review.Pros === "string"
                ? review.Pros.split(",").map((p) => p.trim())
                : review.pros || review.Pros || [],
          cons:
            typeof review.cons === "string"
              ? review.cons.split(",").map((c) => c.trim())
              : typeof review.Cons === "string"
                ? review.Cons.split(",").map((c) => c.trim())
                : review.cons || review.Cons || [],
          useCase: Array.isArray(review.bestUseCase)
            ? review.bestUseCase.join(", ")
            : Array.isArray(review["Best Use Case"])
              ? review["Best Use Case"].join(", ")
              : review.bestUseCase || review["Best Use Case"] || "",
        }))
        .filter((review) => review.toolName)

      console.log("Transformed reviews:", transformedReviews)
      setReviews(transformedReviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      alert(`Failed to fetch reviews: ${error.message}`)
    } finally {
      setFetchLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  if (fetchLoading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a729c] mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reviews...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <Star className="w-3 h-3 mr-1" />
            AI Tool Reviews
          </Badge>
          <h1 className="text-4xl font-bold mb-4">No-Nonsense AI Tool Reviews</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Honest, practical reviews of AI tools with real-world use cases, pros and cons, and actionable insights for
            business leaders.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto">
          <div className="flex-1">
            <Input
              type="text"
              placeholder={`Search ${reviews.length} agents...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 text-base border-2 border-gray-300 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
            />
          </div>

          <div className="relative flex-1">
            <div className="relative">
              <Input
                type="text"
                placeholder="Filter by tag..."
                value={filterQuery}
                onChange={(e) => {
                  setFilterQuery(e.target.value)
                  setIsFilterOpen(true)
                }}
                onFocus={() => setIsFilterOpen(true)}
                className="w-full h-12 text-base border-2 border-[#1a729c] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors pr-10"
              />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>
            </div>

            {isFilterOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#165881] border-2 border-gray-200 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto">
                <div className="p-2">
                  {filteredOptions.length > 0 ? (
                    filteredOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSelectedFilter(option)
                          setFilterQuery(option)
                          setIsFilterOpen(false)
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-[#010817] rounded transition-colors flex items-center gap-2"
                      >
                        <input
                          type="checkbox"
                          checked={selectedFilter === option}
                          readOnly
                          className="w-4 h-4 text-cyan-400 border-gray-300 rounded focus:ring-cyan-400"
                        />
                        {option}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-sm text-gray-500">No matching tags found</div>
                  )}
                  {selectedFilter && (
                    <button
                      onClick={() => {
                        setSelectedFilter("")
                        setFilterQuery("")
                        setIsFilterOpen(false)
                      }}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded transition-colors text-red-600 border-t border-gray-200 mt-1 pt-3"
                    >
                      Clear filter
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {isFilterOpen && <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredReviews.map((review) => (
            <Card
              key={review.id}
              className="relative group hover:shadow-lg transition-all duration-300 bg-card/60 backdrop-blur border border-border/60"
            >
              <div className="aspect-video overflow-hidden rounded-t-lg">
                <img
                  src={review.image || "/placeholder.svg"}
                  alt={review.toolName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{review.toolName}</CardTitle>
                  <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">{review.description}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="font-semibold text-green-600 text-sm mb-1">Pros:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {review.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-green-500 mt-0.5">•</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-red-600 text-sm mb-1">Cons:</h4>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {review.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-red-500 mt-0.5">•</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 border-t border-border/60">
                    <h4 className="font-semibold text-sm mb-1">Best for:</h4>
                    <p className="text-xs text-muted-foreground">{review.useCase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && !fetchLoading && (
          <div className="text-center py-12">
            <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            {searchQuery || selectedFilter ? (
              <>
                <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedFilter("")
                  }}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
                <p className="text-muted-foreground">Check back later for AI tool reviews!</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
