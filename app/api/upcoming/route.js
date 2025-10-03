import Airtable from "airtable"

const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID)

const TABLE_EVENTS = "Upcoming events" // The name of the Airtable table

// GET: Fetch all events
export async function GET() {
  try {
    const records = await base(TABLE_EVENTS).select().all() // Fetch all events
    const events = records.map((record) => ({
      id: record.id,
      heading: record.fields["Event Heading"], // Update field name
      image: record.fields["Event Image"], // Update field name
      location: record.fields["Location"], // Update field name
      date: record.fields["Date"], // Update field name
      time: record.fields["Time"], // Update field name
      honor: record.fields["Honors"], // Note: API uses "Honors" with capital H
      description: record.fields["Description"], // Update field name
      url: record.fields["Event URL"], // Update field name
    }))
    return new Response(JSON.stringify(events), { status: 200 })
  } catch (error) {
    return new Response("Failed to fetch events", { status: 500 })
  }
}
