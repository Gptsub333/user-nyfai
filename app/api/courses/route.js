import { NextResponse } from "next/server"
import Airtable from "airtable"

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_COURSES = process.env.AIRTABLE_COURSES_TABLE

export async function GET() {
  try {
    // Fetch records from Airtable with the correct field names
    const records = await base(TABLE_COURSES)
      .select({
        fields: [
          "Course Title",
          "Description",
          "Level",
          "Duration",
          "Number of Students",
          "Rating (1-5)",
          "Course Image",
          "External Link",
        ],
      })
      .all()

    // Map the records to your frontend data structure
    const courses = records.map((record) => ({
      id: record.id,
      title: record.fields["Course Title"],
      description: record.fields.Description,
      level: record.fields.Level,
      duration: record.fields.Duration,
      students: record.fields["Number of Students"],
      rating: record.fields["Rating (1-5)"],
      image: record.fields["Course Image"],
      externalLink: record.fields["External Link"],
    }))

    return NextResponse.json(courses, { status: 200 })
  } catch (error) {
    console.error("Error fetching courses from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch courses from Airtable" }, { status: 500 })
  }
}
