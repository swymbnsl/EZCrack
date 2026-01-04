import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Unit from "@/models/units-model";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const subject_id = searchParams.get("subject_id");

    if (!subject_id) {
      return NextResponse.json(
        { error: "Subject ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();
    const units = await Unit.find({ subject_id }).populate("subject_id", "name").lean();

    return NextResponse.json({ units });
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
