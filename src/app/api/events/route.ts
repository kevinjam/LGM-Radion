// src/app/api/events/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const events = await db
      .collection("upcoming_events")
      .find(
        {},
        {
          projection: {
            name: 1,
            description: 1,
            time: 1,
            date: 1,
            _id: 0,
          },
        }
      )
      .toArray();
      console.log("Fetched events from database:");
    console.log("Fetched events:", events);

    return NextResponse.json(events, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "GET",
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}