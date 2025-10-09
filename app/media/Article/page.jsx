"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Plus, Minus } from "lucide-react"
import BlogDetail from "../../../components/BlogDetail"
import { useBlogContext } from "../../../contexts/BlogContext"

export default function Articles() {
  const {
    blogListCache,
    fetchBlogList,
    saveScrollPosition,
    restoreScrollPosition,
    currentPage: contextCurrentPage,
    setCurrentPage: setContextCurrentPage,
    filters,
    setFilters,
  } = useBlogContext()

  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [blogData, setBlogData] = useState([])

  const [searchTerm, setSearchTerm] = useState(filters.searchTerm)
  const [selectedTypes, setSelectedTypes] = useState(filters.selectedTypes)
  const [selectedCategories, setSelectedCategories] = useState(filters.selectedCategories)
  const [selectedIndustries, setSelectedIndustries] = useState(filters.selectedIndustries)

  const [isTypeExpanded, setIsTypeExpanded] = useState(true)
  const [isCategoryExpanded, setIsCategoryExpanded] = useState(true)
  const [isIndustryExpanded, setIsIndustryExpanded] = useState(true)
  const [showMoreTypes, setShowMoreTypes] = useState(false)
  const [showMoreCategories, setShowMoreCategories] = useState(false)
  const [showMoreIndustries, setShowMoreIndustries] = useState(false)
  const [fetchingArticles, setFetchingArticles] = useState(false)

  const [selectedBlogForView, setSelectedBlogForView] = useState(null)
  const [isViewingBlog, setIsViewingBlog] = useState(false)

  const blogsPerPage = 9

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

  const fetchArticles = async (forceRefresh = false) => {
    setLoading(true)
    setFetchingArticles(true)
    try {
      const data = await fetchBlogList(forceRefresh)
      setBlogData(data)
    } catch (error) {
      console.error("Error fetching articles:", error)
      setBlogData([])
    } finally {
      setLoading(false)
      setFetchingArticles(false)
    }
  }

  useEffect(() => {
    if (blogListCache) {
      console.log("[v0] Using cached blog list data")
      setBlogData(blogListCache)
      setLoading(false)
      setTimeout(() => {
        restoreScrollPosition()
      }, 100)
    } else {
      console.log("[v0] No cache found, fetching blog list")
      fetchArticles()
    }
  }, [blogListCache, restoreScrollPosition])

  useEffect(() => {
    if (!blogData || blogData.length === 0) {
      setFilteredBlogs([])
      return
    }

    const filtered = blogData.filter((blog) => {
      const matchesSearch =
        !searchTerm ||
        blog.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesType = selectedTypes.length === 0 || selectedTypes.includes(blog.type)
      const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(blog.category)
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(blog.industry)

      return matchesSearch && matchesType && matchesCategory && matchesIndustry
    })

    setFilteredBlogs(filtered)
    console.log(`[v0] Filtered ${filtered.length} blogs from ${blogData.length} total`)
  }, [blogData, searchTerm, selectedTypes, selectedCategories, selectedIndustries])

  useEffect(() => {
    setFilters({
      searchTerm,
      selectedTypes,
      selectedCategories,
      selectedIndustries,
    })
  }, [searchTerm, selectedTypes, selectedCategories, selectedIndustries])

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]))
  }

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleIndustryChange = (industry) => {
    setSelectedIndustries((prev) =>
      prev.includes(industry) ? prev.filter((i) => i !== industry) : [...prev, industry],
    )
  }

  const clearAllFilters = () => {
    setSelectedTypes([])
    setSelectedCategories([])
    setSelectedIndustries([])
    setSearchTerm("")
  }

  const renderFilterOptions = (options, selectedOptions, handleChange, showMore, setShowMore) => {
    const visibleOptions = showMore ? options : options.slice(0, 6)
    const hasMoreOptions = options.length > 6

    return (
      <div className="space-y-3">
        {visibleOptions.map((option) => (
          <label key={option} className="flex items-center space-x-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={selectedOptions.includes(option)}
              onChange={() => handleChange(option)}
              className="w-4 h-4 text-[#165881] bg-white/10 border-white/20 rounded focus:ring-[#165881]/50 focus:ring-2"
            />
            <span className="text-gray-300 group-hover:text-white transition-colors">{option}</span>
          </label>
        ))}
        {hasMoreOptions && (
          <button
            onClick={() => setShowMore(!showMore)}
            className="flex items-center gap-2 text-[#165881] hover:text-white text-sm font-medium transition-colors"
          >
            {showMore ? "Show Less" : "Show More"}
            {showMore ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          </button>
        )}
      </div>
    )
  }

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)
  const startIndex = (contextCurrentPage - 1) * blogsPerPage
  const currentBlogs = filteredBlogs.slice(startIndex, startIndex + blogsPerPage)

  const handlePageChange = (page) => {
    setContextCurrentPage(page)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleBlogClick = (blog) => {
    saveScrollPosition()
    setSelectedBlogForView(blog.id)
    setIsViewingBlog(true)
  }

  const handleBackToList = () => {
    setIsViewingBlog(false)
    setSelectedBlogForView(null)
    restoreScrollPosition()
  }

  const handleBlogDeleted = (deletedId) => {
    setBlogData((prev) => prev.filter((blog) => blog.id !== deletedId))
  }

  if (isViewingBlog && selectedBlogForView) {
    return <BlogDetail blogId={selectedBlogForView} onBack={handleBackToList} onBlogDeleted={handleBlogDeleted} />
  }

  return (
    <div className="min-h-screen bg-[#010817]">
      <div className="bg-gradient-to-r  text-white pt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col items-center justify-between">
            <h1 className="text-5xl md:text-4xl font-bold mb-6 text-balance">Articles & Insights</h1>
            <div>

              <p className="text-xl text-blue-100 max-w-4xl text-center leading-relaxed">
                Discover the latest trends, insights, and expert perspectives on artificial intelligence, technology,
                and digital transformation. Stay informed with our comprehensive collection of articles, case studies,
                and industry analysis.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-white text-xl">Loading articles...</div>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-80 space-y-6">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-4 pr-10 py-3 bg-white/10 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#165881]/50 focus:border-[#165881] outline-none text-white placeholder-gray-300"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
                </div>
              </div>

              {(selectedTypes.length > 0 ||
                selectedCategories.length > 0 ||
                selectedIndustries.length > 0 ||
                searchTerm) && (
                  <button
                    onClick={clearAllFilters}
                    className="bg-gradient-to-r from-[#165881] to-[#165881] text-white px-6 py-3 rounded-xl hover:from-[#165881] hover:to-[#165881] transition-all duration-300 flex items-center gap-2 font-medium shadow-lg w-full justify-center"
                  >
                    CLEAR ALL ✕
                  </button>
                )}

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                <button
                  onClick={() => setIsTypeExpanded(!isTypeExpanded)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="font-semibold text-white">Type</h3>
                  {isTypeExpanded ? (
                    <Minus className="w-5 h-5 text-[#165881]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#165881]" />
                  )}
                </button>
                {isTypeExpanded &&
                  renderFilterOptions(typeOptions, selectedTypes, handleTypeChange, showMoreTypes, setShowMoreTypes)}
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                <button
                  onClick={() => setIsCategoryExpanded(!isCategoryExpanded)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="font-semibold text-white">Category</h3>
                  {isCategoryExpanded ? (
                    <Minus className="w-5 h-5 text-[#165881]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#165881]" />
                  )}
                </button>
                {isCategoryExpanded &&
                  renderFilterOptions(
                    categoryOptions,
                    selectedCategories,
                    handleCategoryChange,
                    showMoreCategories,
                    setShowMoreCategories,
                  )}
              </div>

              <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-6 rounded-xl shadow-xl">
                <button
                  onClick={() => setIsIndustryExpanded(!isIndustryExpanded)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <h3 className="font-semibold text-white">Industry</h3>
                  {isIndustryExpanded ? (
                    <Minus className="w-5 h-5 text-[#165881]" />
                  ) : (
                    <Plus className="w-5 h-5 text-[#165881]" />
                  )}
                </button>
                {isIndustryExpanded &&
                  renderFilterOptions(
                    industryOptions,
                    selectedIndustries,
                    handleIndustryChange,
                    showMoreIndustries,
                    setShowMoreIndustries,
                  )}
              </div>
            </div>

            <div className="flex-1">
              {currentBlogs.length === 0 && !loading && (
                <div className="text-center py-20">
                  <div className="text-gray-400 text-lg mb-4">Your article will be here</div>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}

              {currentBlogs.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {currentBlogs.map((blog) => (
                    <div
                      key={blog.id}
                      className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl shadow-xl overflow-hidden hover:shadow-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer flex flex-col"
                      onClick={() => handleBlogClick(blog)}
                    >
                      <div className="relative w-full aspect-video overflow-hidden">
                        <img
                          src={blog.image || "/placeholder.svg"}
                          alt={blog.title || "Article image"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                        <div className="absolute bottom-3 left-3 text-xs text-white/90 bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
                          {blog.date ? new Date(blog.date).toLocaleDateString() : "No date"}
                        </div>
                      </div>
                      <div className="p-5 flex flex-col flex-grow">
                        <h3 className="text-base font-semibold text-white mb-3 line-clamp-2 leading-snug group-hover:text-[#165881] transition-colors min-h-[3rem]">
                          {blog.title || "Untitled"}
                        </h3>
                        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed mb-4 flex-grow">
                          {blog.excerpt || "No excerpt available"}
                        </p>
                        <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                          <div className="w-7 h-7 bg-gradient-to-r from-[#165881] to-[#165881] rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                            <span className="text-xs font-medium text-white">
                              {(blog.author || "Unknown")
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <span className="text-xs text-gray-300 font-medium truncate">{blog.author || "Unknown Author"}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handlePageChange(contextCurrentPage - 1)}
                    disabled={contextCurrentPage === 1}
                    className="flex items-center gap-1 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg transition-all duration-200"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Prev
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-12 h-12 rounded-lg font-medium transition-all duration-200 ${contextCurrentPage === page
                          ? "bg-gradient-to-r from-[#165881] to-[#165881] text-white shadow-lg"
                          : "text-gray-300 hover:text-white hover:bg-white/10"
                          }`}
                      >
                        {page}
                      </button>
                    )
                  })}

                  <button
                    onClick={() => handlePageChange(contextCurrentPage + 1)}
                    disabled={contextCurrentPage === totalPages}
                    className="flex items-center gap-1 px-6 py-3 text-gray-300 hover:text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-medium rounded-lg transition-all duration-200"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}