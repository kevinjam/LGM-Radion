// src/app/api/prayer-requests/route.ts
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// Disable Next.js body parser to handle raw request body
export const config = {
  api: {
    bodyParser: true,
  },
};

// MongoDB connection (cached to avoid reconnecting on every request)
let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

async function connectToDatabase() {
  if (clientPromise) {
    return clientPromise; // Return the cached promise if it exists
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set");
  }

  client = new MongoClient(uri);
  clientPromise = client.connect().then((connectedClient) => {
    console.log("Connected to MongoDB");
    return connectedClient;
  });

  return clientPromise;
}

// GET handler to retrieve prayer requests (recent ones only)
export async function GET(request: Request) {
  try {
    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db("latterglory"); // Use the database name from your connection string
    const collection = db.collection("prayer_requests");
    console.log(request)
    // Retrieve the most recent prayer requests (limit to 20)
    // Only show partial data (no email/phone) for privacy
    const prayerRequests = await collection
      .find({})
      .sort({ createdAt: -1 })
      .limit(20)
      .project({ 
        name: 1, 
        request: 1, 
        createdAt: 1 
      })
      .toArray();

    return NextResponse.json(
      { prayerRequests },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error retrieving prayer requests:", error);
    return NextResponse.json(
      { error: "Failed to retrieve prayer requests" },
      { status: 500 }
    );
  }
}

// POST handler for adding new prayer requests
export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, email, phoneNumber, request: prayerRequest } = await request.json();

    // Validate the input
    if (!name || !prayerRequest) {
      return NextResponse.json(
        { error: "Name and prayer request are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db("latterglory"); // Use the database name from your connection string
    const collection = db.collection("prayer_requests");

    // Save the prayer request to MongoDB
    const result = await collection.insertOne({
      name,
      email,
      phoneNumber,
      request: prayerRequest,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Prayer request submitted successfully", id: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving prayer request to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to submit prayer request" },
      { status: 500 }
    );
  }
}
