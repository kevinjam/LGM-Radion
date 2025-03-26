// src/app/api/events/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock data (replace with actual database query)
    const events = [
      {
        name: "Command Your Week",
        description: "Awake the donwn",
        time: "04:30 AM - 05:15PM",
        date: "Monday",
      },
        {
            name: "Lunch Hour",
            description: "Lunch Hour Family Fellowship",
            time: "1:00 PM - 2:00 PM",
            date: "Monday",
          },
          {
            name: "Overnight",
            description: "Friday of the month 6PM - 9PM",
            time: "10:00 PM - 3:00 AM",
            date: "Friday",
          },
          {
            name: "Sunday Service",
            description: "Sermons and Worship",
            time: "09:00 AM - 12:00 PM",
            date: "Sunday",
          },
         
    ];

    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}