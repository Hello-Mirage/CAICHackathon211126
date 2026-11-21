// API Route: Run the full procurement pipeline
import { NextRequest, NextResponse } from "next/server";
import {
  captureRequirement,
  matchItemCodes,
  draftRFQ,
  generateComparativeStatement,
  generateRecommendation,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { input, quotations } = await req.json();

    if (!input) {
      return NextResponse.json(
        { error: "Missing 'input' field" },
        { status: 400 }
      );
    }

    const pipeline: Record<string, unknown> = {};

    // Step 1: Capture requirement
    pipeline.step1_requirement = await captureRequirement(input);

    // Step 2: Match item codes
    pipeline.step2_matched_codes = await matchItemCodes(
      pipeline.step1_requirement as Record<string, unknown>
    );

    // Step 3: Draft RFQ
    pipeline.step3_rfq = await draftRFQ(
      pipeline.step1_requirement as Record<string, unknown>,
      pipeline.step2_matched_codes as Record<string, unknown>
    );

    // Steps 4-6 require quotations
    if (quotations && Array.isArray(quotations) && quotations.length > 0) {
      // Step 5: Comparative statement (quotations already normalized)
      pipeline.step5_comparison = await generateComparativeStatement(quotations);

      // Step 6: Recommendation
      pipeline.step6_recommendation = await generateRecommendation(
        pipeline.step5_comparison as Record<string, unknown>
      );
    }

    return NextResponse.json({ success: true, pipeline });
  } catch (error) {
    console.error("Pipeline error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
