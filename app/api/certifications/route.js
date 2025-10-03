import { NextResponse } from "next/server"
import Airtable from "airtable"

// Initialize Airtable with API Key and Base ID
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_CERTIFICATIONS = "Certification" // The name of the table in Airtable

// GET: Fetch all certifications
export async function GET() {
  try {
    // Fetch records from Airtable with the correct field names
    const records = await base(TABLE_CERTIFICATIONS)
      .select({
        fields: [
          "Certification Title",
          "Description",
          "Certification Level",
          "Program Duration",
          "Number of Projects",
          "Learn More URL",
        ],
      })
      .all()

    // Map the records to the frontend data structure
    const certifications = records.map((record) => ({
      id: record.id,
      title: record.fields["Certification Title"], // Primary field
      description: record.fields.Description,
      level: record.fields["Certification Level"],
      duration: record.fields["Program Duration"],
      projects: record.fields["Number of Projects"],
      learnMoreUrl: record.fields["Learn More URL"],
    }))

    return NextResponse.json(certifications, { status: 200 })
  } catch (error) {
    console.error("Error fetching certifications from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch certifications" }, { status: 500 })
  }
}
