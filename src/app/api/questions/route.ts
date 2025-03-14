import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Question from "@/models/questions-model";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
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
      subjectId: subjectId,
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
};
