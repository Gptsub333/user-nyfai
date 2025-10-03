import Airtable from "airtable"
import { NextResponse } from "next/server"

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_EVENTS = "AI prompt library" // The name of the Airtable table

export async function GET() {
  try {
    // Fetch all records from Airtable
    const records = await base(TABLE_EVENTS).select().all()

    // Map the records to your frontend data structure
    const prompts = records.map((record) => ({
      id: record.id,
      title: record.fields["Title"], // Assuming 'Title' is the primary field
      description: record.fields.Description,
      content: record.fields["Prompt Content"],
      category: record.fields.Category,
      difficulty: record.fields["Difficulty Level"],
    }))

    return NextResponse.json(prompts, { status: 200 })
  } catch (error) {
    console.error("Error fetching prompts from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch prompts from Airtable" }, { status: 500 })
  }
}
