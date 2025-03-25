// src/pages/api/rss/proxy.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.query;

  if (!url || typeof url !== "string") {
    console.error("Invalid URL parameter:", url);
    return res.status(400).json({ error: "URL is required" });
  }

  console.log("Proxying RSS feed from:", url);

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    console.log("RSS Fetch Response Status:", response.status, response.statusText);
    if (!response.ok) {
      console.error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }

    const text = await response.text();
    console.log("RSS Feed Response Length:", text.length, "characters");
    res.setHeader("Content-Type", "text/xml");
    res.send(text);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error proxying RSS feed:", error.message, error.stack);
    } else {
      console.error("Error proxying RSS feed:", error);
    }
    res.status(500).json({ error: "Failed to fetch RSS feed" });
  }
}