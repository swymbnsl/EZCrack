import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Subject from "@/models/subjects-model";

interface RouteParams {
  params: {
    subjectId: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const { subjectId } = await params;
  if (!subjectId) {
    return NextResponse.json(
      { error: "Subject ID is required" },
      { status: 400 }
    );
  }

  try {
    await connectToDB();

    const subject = await Subject.findById(subjectId).lean();

    if (!subject) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json({ subject });
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
