import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Question from "@/models/questions-model";

export const GET = async (
  req: Request,
  { params }: { params: { subjectId: string } }
) => {
  try {
    const { subjectId } = params;

    if (!subjectId) {
      return NextResponse.json(
        { error: "Subject ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const foundQuestions = await Question.find({
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
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
