import { NextResponse } from "next/server"
import Airtable from "airtable"

// Initialize Airtable with API Key and Base ID
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_INSTRUCTORS = "Meet Your Instructors" // The name of the table in Airtable

// GET: Fetch all instructors
export async function GET() {
  try {
    // Fetch records from Airtable with the correct field names
    const records = await base(TABLE_INSTRUCTORS)
      .select({
        fields: ["Instructor Name", "Title/Position", "Experience", "Bio", "Profile Image", "Profile Link"],
      })
      .all()

    // Map the records to the frontend data structure
    const instructors = records.map((record) => ({
      id: record.id,
      name: record.fields["Instructor Name"], // Primary field
      title: record.fields["Title/Position"],
      experience: record.fields.Experience,
      bio: record.fields.Bio,
      avatar: record.fields["Profile Image"],
      profileLink: record.fields["Profile Link"],
    }))

    return NextResponse.json(instructors, { status: 200 })
  } catch (error) {
    console.error("Error fetching instructors from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch instructors" }, { status: 500 })
  }
}
