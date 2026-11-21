// API Route: Get all reference data (for frontend display)
import { NextResponse } from "next/server";
import {
  getERPItemCodes,
  getVendorList,
  getSiteRequirements,
  getRFQTemplate,
  getProcurementSOP,
  getWaterproofingQuantities,
  getRoadBOQ,
} from "@/lib/data";

export async function GET() {
  try {
    const data = {
      erpItemCodes: getERPItemCodes(),
      vendors: getVendorList(),
      siteRequirements: getSiteRequirements(),
      rfqTemplate: getRFQTemplate(),
      procurementSOP: getProcurementSOP(),
      waterproofingQuantities: getWaterproofingQuantities(),
      roadBOQ: getRoadBOQ(),
    };

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Data fetch error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
