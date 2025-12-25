import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { Contributor } from "@/models/contributors-model";


export async function GET() {
  try {
    await connectToDB();

    // Fetch all contributors and populate subject names
    const contributors = await Contributor.find({})
      .populate('subject_ids', 'name')
      .sort({
        "subject_ids": -1
      })
      .lean();

    return NextResponse.json({ contributors }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contributors:", error);
    return NextResponse.json(
      { error: "Failed to fetch contributors" },
      { status: 500 }
    );
  }
} 