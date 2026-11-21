// API Route: Normalize vendor quotation (Step 4)
import { NextRequest, NextResponse } from "next/server";
import { normalizeQuotation } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  try {
    const { quotationText, vendorName } = await req.json();

    if (!quotationText || !vendorName) {
      return NextResponse.json(
        { error: "Missing 'quotationText' and/or 'vendorName' fields" },
        { status: 400 }
      );
    }

    const normalized = await normalizeQuotation(quotationText, vendorName);
    return NextResponse.json({ success: true, data: normalized });
  } catch (error) {
    console.error("Normalize quotation error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
