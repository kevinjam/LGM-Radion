// src/app/api/rss/cache/route.ts
import { NextResponse } from "next/server";
import Parser from "rss-parser";

const parser = new Parser();
let cache: Parser.Output<Parser.Item> | null = null;
let lastFetched: number | null = null;

export async function GET() {
  const now = Date.now();
  if (cache && lastFetched && now - lastFetched < 15 * 60 * 1000) {
    return NextResponse.json(cache);
  }

  try {
    const feed = await parser.parseURL(
      "https://rss.castbox.fm/everest/e57bc6de67a146ab89a245ae0fda60a5.xml"
    );
    cache = feed;
    lastFetched = now;
    return NextResponse.json(feed);
  } catch (error) {
    console.error("Error fetching RSS feed:", error);
    return NextResponse.json({ error: "Failed to fetch RSS feed" }, { status: 500 });
  }
}