// API Route: Capture site requirement (Step 1)
import { NextRequest, NextResponse } from "next/server";
import { captureRequirement } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Missing 'input' field (string)" },
        { status: 400 }
      );
    }

    const structured = await captureRequirement(input);
    return NextResponse.json({ success: true, data: structured });
  } catch (error) {
    console.error("Capture requirement error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
