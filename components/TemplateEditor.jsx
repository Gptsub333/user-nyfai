"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { GripVertical, User } from "lucide-react"

export default function TemplateEditor({ initialSections = [], onChange, readOnly = false }) {
  const [sections, setSections] = useState(initialSections)
  const [draggedSection, setDraggedSection] = useState(null)
  const [uploadingImages, setUploadingImages] = useState(new Set())
  const dragCounter = useRef(0)

  useEffect(() => {
    if (initialSections && initialSections.length > 0) {
      setSections(initialSections)
    }
  }, [initialSections])

  const updateSections = useCallback(
    (newSections) => {
      setSections(newSections)
      onChange?.(newSections)
    },
    [onChange],
  )

  const updateSection = (id, content) => {
    updateSections(sections.map((section) => (section.id === id ? { ...section, content } : section)))
  }

  const moveSection = (fromIndex, toIndex) => {
    const newSections = [...sections]
    const [movedSection] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, movedSection)

    // Update order
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }))

    updateSections(updatedSections)
  }

  const handleImageUpload = async (sectionId, file) => {
    if (!file) return

    setUploadingImages((prev) => new Set(prev).add(sectionId))

    try {
      // Convert file to base64
      const base64String = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result
          resolve(result.split(",")[1]) // Remove data:image/...;base64, prefix
        }
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      const fileName = `blog-image-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`
      const bucketName = "nyfai-website-image"

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: base64String, bucketName, fileName }),
      })

      if (!uploadRes.ok) throw new Error("Failed to upload image")

      const data = await uploadRes.json()

      // Update section with uploaded image URL
      const section = sections.find((s) => s.id === sectionId)
      if (section) {
        updateSection(sectionId, {
          ...section.content,
          url: data.imageUrl,
          alt: section.content.alt || file.name.split(".")[0],
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingImages((prev) => {
        const newSet = new Set(prev)
        newSet.delete(sectionId)
        return newSet
      })
    }
  }

  const handleDragStart = (e, sectionId, index) => {
    setDraggedSection(sectionId)
    e.dataTransfer.setData("text/plain", index.toString())
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    const dragIndex = Number.parseInt(e.dataTransfer.getData("text/plain"))

    if (dragIndex !== dropIndex) {
      moveSection(dragIndex, dropIndex)
    }

    setDraggedSection(null)
    dragCounter.current = 0
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    dragCounter.current++
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    dragCounter.current--
  }

  const renderSection = (section, index) => {
    const isDragging = draggedSection === section.id

    return (
      <div
        key={section.id}
        className={`template-section ${isDragging ? "dragging" : ""}`}
        draggable={!readOnly}
        onDragStart={(e) => handleDragStart(e, section.id, index)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        <div className="flex items-start gap-3">
          {!readOnly && (
            <div className="flex flex-col gap-1 pt-1">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
            </div>
          )}

          <div className="flex-1">{renderSectionContent(section, false)}</div>
        </div>
      </div>
    )
  }

  const renderSectionContent = (section, isEditing) => {
    switch (section.type) {
      case "header":
        return (
          <div className="space-y-2">
            <div
              className={`font-bold ${
                section.content.level === 1
                  ? "text-3xl"
                  : section.content.level === 2
                    ? "text-2xl"
                    : section.content.level === 3
                      ? "text-xl"
                      : "text-lg"
              }`}
            >
              {section.content.text}
            </div>
          </div>
        )

      case "paragraph":
        return (
          <div className="space-y-2">
            <p className="text-foreground leading-relaxed">{section.content.text}</p>
          </div>
        )

      case "quote":
        return (
          <div className="space-y-2">
            <blockquote className="border-l-4 border-primary pl-4 italic">
              <p className="text-lg text-foreground mb-2">"{section.content.text}"</p>
              {section.content.author && (
                <cite className="text-sm text-muted-foreground">— {section.content.author}</cite>
              )}
            </blockquote>
          </div>
        )

      case "user":
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {section.content.avatar ? (
                  <img
                    src={section.content.avatar || "/placeholder.svg"}
                    alt={section.content.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-primary" />
                )}
              </div>
              <div>
                <h4 className="font-semibold">{section.content.name}</h4>
                <p className="text-sm text-muted-foreground">{section.content.bio}</p>
              </div>
            </div>
          </div>
        )

      case "image":
        return (
          <div className="space-y-2">
            <div className="space-y-2">
              {section.content.url && (
                <img
                  src={section.content.url || "/placeholder.svg"}
                  alt={section.content.alt || section.content.caption}
                  className="w-full rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
              )}
              {section.content.caption && (
                <p className="text-sm text-muted-foreground text-center italic">{section.content.caption}</p>
              )}
            </div>
          </div>
        )

      case "list":
        return (
          <div className="space-y-2">
            <div>
              {section.content.ordered ? (
                <ol className="list-decimal list-inside space-y-1">
                  {section.content.items.map((item, index) => (
                    <li key={index} className="text-foreground">
                      {item}
                    </li>
                  ))}
                </ol>
              ) : (
                <ul className="list-disc list-inside space-y-1">
                  {section.content.items.map((item, index) => (
                    <li key={index} className="text-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )

      case "divider":
        return (
          <div className="space-y-2">
            <div className="border-t border-border my-4"></div>
          </div>
        )

      case "code":
        return (
          <div className="space-y-2">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">{section.content.code}</code>
            </pre>
          </div>
        )

      case "link":
        return (
          <div className="space-y-2">
            <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
              <a
                href={section.content.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium"
              >
                {section.content.text || section.content.url}
              </a>
              {section.content.description && (
                <p className="text-sm text-muted-foreground mt-1">{section.content.description}</p>
              )}
            </div>
          </div>
        )

      default:
        return <div className="text-muted-foreground">Unknown section type</div>
    }
  }

  if (readOnly) {
    return (
      <div className="space-y-6">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <div key={section.id}>{renderSectionContent(section, false)}</div>
          ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sections.sort((a, b) => a.order - b.order).map((section, index) => renderSection(section, index))}
    </div>
  )
}
