import { NextResponse } from "next/server"
import Airtable from "airtable"

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_EPISODES = process.env.AIRTABLE_EPISODES_TABLE

export async function GET() {
  try {
    // Fetch all episodes from Airtable in ascending order by Episode Number
    const records = await base(TABLE_EPISODES)
      .select({
        sort: [{ field: "Episode Number", direction: "asc" }],
      })
      .all()

    // Map the records into the format you want to return
    const episodes = records.map((record) => ({
      id: record.id,
      title: record.fields["Episode Title"],
      episode: record.fields["Episode Number"],
      description: record.fields.Description,
      link: record.fields["Episode URL"] || "",
      image: record.fields.Image, // Assuming 'Image' is an attachment field
    }))

    return NextResponse.json(episodes, { status: 200 })
  } catch (error) {
    console.error("Error fetching episodes from Airtable:", error)
    return NextResponse.json({ error: "Failed to fetch episodes" }, { status: 500 })
  }
}
