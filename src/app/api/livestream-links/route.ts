// church-radio/src/app/api/livestream-links/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const links = await db
      .collection("livestream_links")
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(links, { status: 200 });
  } catch (error) {
    console.error("Error fetching livestream links:", error);
    return NextResponse.json(
      { error: "Failed to fetch livestream links" },
      { status: 500 }
    );
  }
}