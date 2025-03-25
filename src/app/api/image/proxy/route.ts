// src/app/api/image/proxy/route.ts
import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");

  if (!url) {
    console.error("Invalid URL parameter:", url);
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  console.log("Proxying image from:", url);

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
      responseType: "arraybuffer",
    });
    console.log("Image Fetch Response Status:", response.status, response.statusText);
    const contentType = response.headers["content-type"] || "image/png";
    console.log("Image Content-Type:", contentType);
    console.log("Image Buffer Length:", response.data.length, "bytes");

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: unknown) {
    console.error("Error proxying image:", error);
    return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}