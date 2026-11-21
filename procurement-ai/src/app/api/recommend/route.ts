// API Route: Generate HOD recommendation (Step 6)
import { NextRequest, NextResponse } from "next/server";
import { generateRecommendation } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { comparativeStatement } = await req.json();

    if (!comparativeStatement) {
      return NextResponse.json(
        { error: "Missing 'comparativeStatement' field" },
        { status: 400 }
      );
    }

    const recommendation = await generateRecommendation(comparativeStatement);
    return NextResponse.json({ success: true, data: recommendation });
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
