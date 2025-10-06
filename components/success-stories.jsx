"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Plus } from "lucide-react"
import { set } from "date-fns"
import { fi } from "date-fns/locale"

export default function SuccessStory() {
    const [stories, setStories] = useState([])
    const [loading, setLoading] = useState(false)

    // Modal controls
    const [isAddOpen, setIsAddOpen] = useState(false)
    const [isEditOpen, setIsEditOpen] = useState(false)

    const [addLoading, setAddLoading] = useState(false)



    // Forms
    const [newForm, setNewForm] = useState({
        company: "",
        result: "",
        quote: "",
        author: "",
        stars: 5,
    })

    const [editForm, setEditForm] = useState({
        id: "",
        company: "",
        result: "",
        quote: "",
        author: "",
        stars: 5,
    })

    // Fetch success stories
    const fetchStories = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/success-stories")
            const data = await res.json()
            setStories(data)
        } catch (err) {
            console.error("Error fetching stories:", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchStories()
    }, [])





    // Open edit modal with values
    const openEditModal = (story) => {
        setEditForm({
            id: story.id,
            company: story.company,
            result: story.result,
            quote: story.quote,
            author: story.author,
            stars: story.stars || 5,
        })
        setIsEditOpen(true)
    }

    return (
        <div className="mb-16 relative">
            {/* Header with button */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-center flex-1">Partner Success Stories</h2>

            </div>

            {/* Story grid */}
            {loading ? (
                <p className="text-center">Loading stories...</p>
            ) : (
                <div className="grid md:grid-cols-2 gap-8">
                    {stories.map((story) => (
                        <Card
                            key={story.id}
                            className="bg-gradient-to-br from-[#1a729c]/10 to-purple-50 dark:from-[#1a729c]/20 dark:to-purple-950/20 border-none"
                        >
                            <CardContent className="p-6">
                                <div className="text-2xl font-bold text-[#1a729c] mb-2">{story.result}</div>
                                <blockquote className="text-sm italic mb-4">"{story.quote}"</blockquote>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-semibold text-sm">{story.company}</div>
                                        <div className="text-xs text-muted-foreground">{story.author}</div>
                                    </div>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < (story.stars || 0)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-gray-300"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>


                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}


        </div>
    )
}
