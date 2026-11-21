// API Route: Draft RFQ emails (Step 3)
import { NextRequest, NextResponse } from "next/server";
import { draftRFQ } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { requirement, matchedCodes } = await req.json();

    if (!requirement || !matchedCodes) {
      return NextResponse.json(
        { error: "Missing 'requirement' and/or 'matchedCodes' fields" },
        { status: 400 }
      );
    }

    const rfq = await draftRFQ(requirement, matchedCodes);
    return NextResponse.json({ success: true, data: rfq });
  } catch (error) {
    console.error("Draft RFQ error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
