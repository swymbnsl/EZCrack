import { connectToDB } from "@/lib/mongoose";
import { NextResponse } from "next/server";
import { Contributor } from "@/models/contributors-model";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ subjectId: string }> }
) {
  try {
    await connectToDB();
    const { subjectId } = await params;

    const contributor = await Contributor.findOne(
      { "subject_ids": subjectId },
      {
        name: 1,
        branch: 1,
        semester: 1,
        avatar: 1,
        linkedinUrl: 1,
        "subject_ids": 1,
      }
    )
    .populate('subject_ids', 'name')
    .lean();

    if (!contributor) {
      return NextResponse.json(
        { message: "No contributor found for this subject" },
        { status: 404 }
      );
    }

    return NextResponse.json({ contributor });
  } catch (error) {
    console.error("Error fetching subject contributor:", error);
    return NextResponse.json(
      { message: "Error fetching subject contributor" },
      { status: 500 }
    );
  }
} 