"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function EpisodesPage() {
  const [episodes, setEpisodes] = useState([
    {
      title: "",
      episode: "",
      link: "",
      description: "",
      image: "",
    },
  ])
  const [fetchingEpisodes, setFetchingEpisodes] = useState(true)

  useEffect(() => {
    const fetchEpisodes = async () => {
      setFetchingEpisodes(true)
      try {
        const res = await fetch("/api/episodes")
        const data = await res.json()
        setEpisodes(data)
      } catch (error) {
        console.error("Error fetching episodes:", error)
      } finally {
        setFetchingEpisodes(false)
      }
    }

    fetchEpisodes()
  }, [])

  if (fetchingEpisodes) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Episodes</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a729c] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Episodes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-10 md:pt-33 lg:pt-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">AI Series Episodes</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Welcome to our AI series! Watch the latest episodes where we dive deep into how AI is transforming various
            industries and processes. Stay tuned for new insights in every episode!
          </p>
        </div>

        {/* Episodes List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {episodes.map((episode, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col border-[#1a729c] rounded-3xl max-w-sm mx-auto w-full"
            >
              <div className="relative w-full aspect-square overflow-hidden max-w-70 max-h-60">
                <img
                  src={episode.image || "/placeholder.svg"}
                  alt={episode.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>

              <CardHeader className="flex-grow pb-2 min-h-[180px]">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span>{episode.episode}</span>
                  <span>•</span>
                  <span>2 min read</span>
                </div>
                <CardTitle className="text-xl text-[#1a729c] line-clamp-2 mb-3 font-bold leading-tight">
                  {episode.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{episode.description}</p>
              </CardHeader>
              <CardContent className="pt-0 pb-6">
                {episode.link ? (
                  <a href={episode.link} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button className="text-[#1a729c] border-[#1a729c] bg-[#165881] text-white transition-all w-full rounded-xl">
                      Watch {episode.episode}
                    </Button>
                  </a>
                ) : (
                  <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed rounded-xl">
                    {episode.episode} - Coming Soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}