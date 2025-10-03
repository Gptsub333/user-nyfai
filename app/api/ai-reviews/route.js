import { NextResponse } from "next/server"
import Airtable from "airtable"

// Initialize Airtable with API Key and Base ID
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_AI_REVIEW = "AI Tool Review" // The name of the table in Airtable

// GET: Fetch all AI Tool Reviews
export async function GET() {
  try {
    // Fetch records from Airtable with the correct field names
    const records = await base(TABLE_AI_REVIEW)
      .select({
        fields: ["Tool Name", "Description", "Tool Image", "Rating (1-5 stars)", "Pros", "Cons", "Best Use Case"],
      })
      .all()

    // Map the records to the frontend data structure
    const reviews = records.map((record) => ({
      id: record.id,
      name: record.fields["Tool Name"], // Primary field
      description: record.fields.Description,
      image: record.fields["Tool Image"],
      rating: record.fields["Rating (1-5 stars)"],
      pros: record.fields.Pros,
      cons: record.fields.Cons,
      bestUseCase: record.fields["Best Use Case"],
    }))

    return NextResponse.json(reviews, { status: 200 })
  } catch (error) {
    console.error("Error fetching AI tool reviews from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch AI tool reviews" }, { status: 500 })
  }
}
