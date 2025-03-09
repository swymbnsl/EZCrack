import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Question from "@/models/questions-model";

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
    const unit = url.searchParams.get("unit");
    const subjectId = url.searchParams.get("subjectId");
    console.log("Extracted unit:", unit, "subjectId:", subjectId);

    if (!unit || !subjectId) {
      console.log("Missing required params - unit or subjectId");
      return NextResponse.json(
        { error: "Unit Number and subjectId are required" },
        { status: 400 }
      );
    }

    console.log("Connecting to database...");
    await connectToDB();
    console.log("Database connection established");

    console.log("Querying questions with unit:", unit, "subjectId:", subjectId);
    const foundQuestions = await Question.find({
      unit: unit,
      subjectId: subjectId,
    }).lean();
    console.log("Query result:", foundQuestions);

    if (!foundQuestions) {
      console.log("No questions found");
      return NextResponse.json(
        { error: "Questions not found" },
        { status: 404 }
      );
    }

    console.log("Returning", foundQuestions.length, "questions");
    return NextResponse.json({ foundQuestions });
  } catch (error) {
    console.error("Error fetching unit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
