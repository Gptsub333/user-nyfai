"use client"

import { ArrowLeft, Clock } from "lucide-react"
import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useBlogContext } from "../contexts/BlogContext"

const TemplateEditor = dynamic(() => import("./TemplateEditor"), {
  ssr: false,
  loading: () => <div className="text-gray-400 text-center py-8">Loading editor...</div>,
})

export default function BlogDetail({ blogId, onBack, onBlogDeleted }) {
  const { fetchBlog } = useBlogContext()

  const [blog, setBlog] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Dropdown options from the Articles page
  const typeOptions = ["Case Studies", "Courses", "Podcasts", "Tech", "Use Cases", "Webinars", "Research", "Tutorials"]
  const categoryOptions = [
    "Technology",
    "Analytics",
    "Comms & PR",
    "Content",
    "Strategy",
    "Implementation",
    "Best Practices",
  ]
  const industryOptions = [
    "Healthcare",
    "Marketing Agencies",
    "Media",
    "Recreation",
    "Retail",
    "Software",
    "Transportation",
    "Travel",
    "Finance",
    "Education",
  ]

  const fetchBlogData = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log(`[v0] BlogDetail: Starting fetch for blog ID: ${blogId}`)

      const blogData = await fetchBlog(blogId)
      console.log(`[v0] BlogDetail: Successfully fetched blog data:`, blogData)
      setBlog(blogData)
    } catch (err) {
      console.error("Error fetching blog:", err)
      if (err.message === "Blog not found") {
        setBlog(null) // Explicitly set to null for not found case
      }
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (blogId) {
      fetchBlogData()
    }
  }, [blogId])

  const convertEditorJSToTemplate = (blocks) => {
    return blocks.map((block, index) => {
      switch (block.type) {
        case "header":
          return {
            id: `converted-header-${index}`,
            type: "header",
            content: { text: block.data.text, level: block.data.level },
            order: index,
          }
        case "paragraph":
          return {
            id: `converted-paragraph-${index}`,
            type: "paragraph",
            content: { text: block.data.text },
            order: index,
          }
        case "quote":
          return {
            id: `converted-quote-${index}`,
            type: "quote",
            content: { text: block.data.text, author: block.data.caption || "" },
            order: index,
          }
        default:
          return {
            id: `converted-paragraph-${index}`,
            type: "paragraph",
            content: { text: block.data.text || "Converted content" },
            order: index,
          }
      }
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground text-xl mb-4">Loading blog...</div>
          <div className="text-muted-foreground">Please wait while we fetch the content</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-destructive text-xl mb-4">Error: {error}</div>
          <button onClick={onBack} className="text-primary hover:text-primary/80 transition-colors">
            Back to Articles
          </button>
        </div>
      </div>
    )
  }

  if (!loading && !blog && !error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-foreground text-xl mb-4">Loading....</div>
          <div className="text-muted-foreground mb-4">The requested blog will be here.</div>
          <button onClick={onBack} className="text-primary hover:text-primary/80 transition-colors">
            Back to Articles
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-[#1a729c] text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#165881] to-[#165881]"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Articles
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-blue-100 mb-4">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{blog.readTime || "5 Min Read"}</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{blog.title}</h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-blue-100">By</span>
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {(blog.author || "Unknown")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                </div>
                <span className="font-medium text-white">{blog.author}</span>
                <span className="text-blue-100">
                  on {blog.date ? new Date(blog.date).toLocaleDateString() : "No date"}
                </span>
              </div>
            </div>

            <div className="relative">
              <div className="bg-black/20 rounded-lg p-8 backdrop-blur-sm">
                <img
                  src={blog.image || "/placeholder.svg"}
                  alt={blog.title}
                  className="w-full h-64 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-card border border-border rounded-lg shadow-2xl p-8 md:p-12 backdrop-blur-sm">
          {blog.excerpt && (
            <div className="mb-8 pb-8 border-b border-border">
              <p className="text-xl text-muted-foreground leading-relaxed font-medium italic">{blog.excerpt}</p>
            </div>
          )}

          <div className="prose prose-lg max-w-none">
            {(() => {
              let displayContent = null

              try {
                if (blog.content && blog.content.trim() !== "") {
                  if (typeof blog.content === "string") {
                    const parsed = JSON.parse(blog.content)
                    if (Array.isArray(parsed)) {
                      displayContent = parsed
                    } else if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
                      // Convert old EditorJS format
                      displayContent = convertEditorJSToTemplate(parsed.blocks)
                    }
                  } else if (Array.isArray(blog.content)) {
                    displayContent = blog.content
                  }
                }
              } catch (error) {
                console.error("Error parsing content for display:", error)
              }

              if (displayContent && displayContent.length > 0) {
                return <TemplateEditor initialSections={displayContent} readOnly={true} />
              } else {
                return <div className="text-muted-foreground italic">No content available</div>
              }
            })()}
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-wrap gap-2">
              {blog.category && (
                <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-medium">
                  {blog.category}
                </span>
              )}
              {blog.type && (
                <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-full text-sm font-medium">
                  {blog.type}
                </span>
              )}
              {blog.industry && (
                <span className="bg-purple-500/20 text-purple-400 border border-purple-500/30 px-3 py-1 rounded-full text-sm font-medium">
                  {blog.industry}
                </span>
              )}
              {blog.tags &&
                (Array.isArray(blog.tags) ? blog.tags : blog.tags.split(",").map((tag) => tag.trim())).map(
                  (tag, index) => (
                    <span
                      key={index}
                      className="bg-muted text-muted-foreground border border-border px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ),
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
