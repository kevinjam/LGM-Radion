// src/app/api/events/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Mock data (replace with actual database query)
    const events = [
        {
            name: "Lunch Hour",
            description: "Lunch Hour Family Fellowship",
            time: "1:00 PM",
            date: "Monday",
          },
          {
            name: "Overnight",
            description: "Except for every 1st Friday of the month",
            time: "10:00 PM - 4:00 AM",
            date: "Friday",
          },
          {
            name: "Sunday Service",
            description: "Sermons and Worship",
            time: "09:00 AM - 12:00 PM",
            date: "Sunday",
          },
          // {
          //   name: "Prayer",
          //   description: "Prayer",
          //   time: "09:00 AM - 10:00 PM",
          //   date: "Sunday",
          // }
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