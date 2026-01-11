import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Branch from "@/models/branch-model";

interface BranchDocument {
  name: string;
  subject_ids: Array<{
    _id: string;
    name: string;
    subject_code: string;
    credits: number;
  }>;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const branch = url.searchParams.get("branch")?.toLowerCase();
    const sem = url.searchParams.get("sem");

    if (!branch || !sem) {
      return NextResponse.json(
        { error: "Branch and semester are required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const branchDoc = (await Branch.findOne({ name: branch + sem })
      .populate({
        path: "subject_ids",
        select: "_id name subject_code credits",
      })
      .lean()) as BranchDocument | null;

    if (!branchDoc) {
      return NextResponse.json({ subjects: [] });
    }

    return NextResponse.json({ subjects: branchDoc.subject_ids });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
