import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Subject from "@/models/subjects-model";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const subject = await Subject.findById(subjectId).populate("units_ids");

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json(subject.units_ids, { status: 200 });
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
