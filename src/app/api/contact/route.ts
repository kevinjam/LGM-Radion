// src/app/api/contact/route.ts
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

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, contactInfo, message } = await request.json();

    // Validate the input
    if (!name || !contactInfo || !message) {
      return NextResponse.json(
        { error: "All fields (name, contactInfo, message) are required" },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = await connectToDatabase();
    const db = client.db("radioMuOne"); // Use your database name
    const collection = db.collection("contacts");

    // Save the form data to MongoDB
    const result = await collection.insertOne({
      name,
      contactInfo,
      message,
      submittedAt: new Date(),
    });

    return NextResponse.json(
      { message: "Form submitted successfully", id: result.insertedId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving form data to MongoDB:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 }
    );
  } finally {
    // Reset the clientPromise to ensure a fresh connection on the next request
    clientPromise = null;
  }
}