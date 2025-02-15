import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Branch from "@/models/branch-model";
import Subject from "@/models/subjects-model";
interface BranchDocument {
  name: string;
  subject_ids: Array<{
    _id: string;
    name: string;
    semester: number;
  }>;
}

export const GET = async (req: Request) => {
  try {
    const url = new URL(req.url);
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
      .populate<{ subject_ids: BranchDocument["subject_ids"] }>("subject_ids")
      .lean()) as BranchDocument | null;

    if (!branchDoc) {
      console.log("Branch not found");
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
};
