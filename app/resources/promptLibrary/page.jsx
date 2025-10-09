"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, FileText, Mic, Search, User, Brain, Star } from "lucide-react"

// Define category-to-icon mapping object
const categoryIcons = {
  Writing: User,
  Research: Search,
  Communication: Mic,
  Analysis: Brain,
  Creative: Star,
}

const fetchPrompts = async () => {
  const response = await fetch("/api/prompts")
  if (!response.ok) {
    throw new Error("Failed to fetch prompts")
  }
  return await response.json()
}

export default function PromptLibraryPage() {
  const [prompts, setPrompts] = useState([])
  const [copiedId, setCopiedId] = useState(null)
  const [fetchingPrmompts, setFetchingPrmompts] = useState(true)

  // Fetch prompts when the component mounts
  useEffect(() => {
    const getPrompts = async () => {
      setFetchingPrmompts(true)
      try {
        const data = await fetchPrompts()
        const promptsWithIcons = data.map((prompt) => ({
          ...prompt,
          icon: categoryIcons[prompt.category] || FileText,
        }))
        setPrompts(promptsWithIcons)
      } catch (error) {
        console.error("Error fetching prompts:", error)
      } finally {
        setFetchingPrmompts(false)
      }
    }
    getPrompts()
  }, [])

  if (fetchingPrmompts) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Professional Prompts</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#165881] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Prompts...</p>
          </div>
        </div>
      </div>
    )
  }

  // Copy prompt content to clipboard
  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy text:", err)
    }
  }

  return (
    <div className="min-h-screen bg-background py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            <FileText className="w-3 h-3 mr-1" />
            AI Prompt Library
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Professional AI Prompts</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Curated collection of powerful prompts for writing, editing, research, and communication. Each prompt is
            designed to help you work more effectively with AI tools.
          </p>
        </div>

        {/* Prompts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {prompts.map((prompt) => (
            <Card
              key={prompt.id}
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer h-full flex flex-col relative group"
            >
              <CardHeader className="flex-1">
                <div className="flex items-center justify-between mb-3">
                  {React.createElement(prompt.icon, { className: "h-8 w-8 text-[#165881]" })}
                  <Badge variant="outline" className="text-xs">
                    {prompt.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg mb-2">{prompt.title}</CardTitle>
                <p className="text-sm text-muted-foreground flex-1">{prompt.description}</p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <Badge variant="secondary" className="text-xs">
                      {prompt.category}
                    </Badge>
                  </div>

                  <div className="flex items-center ml-2 space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyToClipboard(prompt.content, prompt.id)
                      }}
                      className="flex items-center space-x-1 p-1.5"
                    >
                      <Copy className="h-4 w-4" />
                      <span>{copiedId === prompt.id ? "Copied!" : "Copy"}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
