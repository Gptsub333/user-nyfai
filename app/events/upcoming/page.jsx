"use client"
import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, ExternalLink } from "lucide-react"

export default function UpcomingEvents() {
  const [events, setEvents] = useState([])
  const [fetchingEvents, setFetchingEvents] = useState(true)

  // Fetch Events
  const fetchEvents = async () => {
    setFetchingEvents(true)
    try {
      const res = await fetch("/api/upcoming")
      const data = await res.json()
      setEvents(data)
      console.log(data)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setFetchingEvents(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  if (fetchingEvents) {
    return (
      <div className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Upcoming Events</h2>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a729c] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading Events...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="py-24 bg-background px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <Calendar className="w-3 h-3 mr-1" />
              Upcoming Events
            </Badge>
            <h1 className="text-4xl font-bold mb-4 mt-6">Upcoming Events</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Workshops, talks, and live sessions built to help you apply AI fast. Online or in person, always hands-on,
              never theoretical.
            </p>
          </div>

          <div className="space-y-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="group flex flex-col md:flex-row bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden hover:shadow-[0_0_40px_#2563eb40] transition duration-300"
              >
                <div className="md:w-80 h-48 md:h-auto">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.heading}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 p-6 md:p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#1a729c] transition">
                      {event.heading}
                    </h3>
                  </div>

                  <div className="text-sm text-neutral-400 space-y-1 mb-4">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-white">Location:</span> {event.location}
                    </p>

                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span className="text-white">Date:</span> {event.date}
                    </p>

                    <p className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-white">Time:</span> {event.time}
                    </p>

                    <p className="flex items-center gap-2">
                      <span className="text-white">Honor of the meet:</span> {event.honor}
                    </p>
                  </div>

                  <p className="text-neutral-300 text-sm leading-relaxed mb-4">{event.description}</p>

                  <a
                    href={event.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-purple-400 text-sm font-medium hover:text-purple-300 transition"
                  >
                    View Event Details
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
