import { NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import Unit from "@/models/units-model";

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ unitId: string }> }
) => {
  try {
    const { unitId } = await params;

    if (!unitId) {
      return NextResponse.json(
        { error: "Unit ID is required" },
        { status: 400 }
      );
    }

    await connectToDB();

    const unit = await Unit.findById(unitId).lean();

    if (!unit) {
      return NextResponse.json({ error: "Unit not found" }, { status: 404 });
    }

    return NextResponse.json({ unit });
  } catch (error) {
    console.error("Error fetching unit:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
