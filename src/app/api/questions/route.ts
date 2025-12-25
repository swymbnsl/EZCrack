import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Question from "@/models/questions-model";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const unit = url.searchParams.get("unit");
    const subjectId = url.searchParams.get("subjectId");

    if (!unit || !subjectId) {
      return NextResponse.json(
        { error: "Unit Number and subjectId are required" },
        { status: 400 }
      );
    }

    await connectToDB();
    const foundQuestions = await Question.find({
      unit: unit,
      subject_id: subjectId,
    }).lean();

    if (!foundQuestions) {
      return NextResponse.json(
        { error: "Questions not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ foundQuestions });
  } catch (error) {
    console.error("Error fetching unit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
