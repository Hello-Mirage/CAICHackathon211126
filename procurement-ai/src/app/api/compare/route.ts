// API Route: Generate comparative statement (Step 5)
import { NextRequest, NextResponse } from "next/server";
import { generateComparativeStatement } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { quotations } = await req.json();

    if (!quotations || !Array.isArray(quotations)) {
      return NextResponse.json(
        { error: "Missing 'quotations' array" },
        { status: 400 }
      );
    }

    const comparison = await generateComparativeStatement(quotations);
    return NextResponse.json({ success: true, data: comparison });
  } catch (error) {
    console.error("Comparative statement error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
