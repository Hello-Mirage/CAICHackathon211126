// API Route: Match to ERP item codes (Step 2)
import { NextRequest, NextResponse } from "next/server";
import { matchItemCodes } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { requirement } = await req.json();

    if (!requirement) {
      return NextResponse.json(
        { error: "Missing 'requirement' field" },
        { status: 400 }
      );
    }

    const matches = await matchItemCodes(requirement);
    return NextResponse.json({ success: true, data: matches });
  } catch (error) {
    console.error("Match item codes error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
