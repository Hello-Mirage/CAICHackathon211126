// Central data loader for all procurement context
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function loadJSON(filename: string) {
  try {
    const filepath = path.join(DATA_DIR, filename);
    if (fs.existsSync(filepath)) {
      return JSON.parse(fs.readFileSync(filepath, "utf-8"));
    }
  } catch {}
  try {
    const fallback = path.join(process.cwd(), "procurement-ai", "data", filename);
    if (fs.existsSync(fallback)) {
      return JSON.parse(fs.readFileSync(fallback, "utf-8"));
    }
  } catch {}
  return {};
}

export interface ERPItemCode {
  "Sl No": number;
  "Item Code": string;
  "Item Description": string;
}

export interface Vendor {
  Contractor: string;
}

export interface SiteRequirement {
  id: string;
  project: string;
  category: string;
  scope: string;
  source: string;
  from: string;
  to: string;
  date: string;
  description: string;
  timeline?: string;
  commencement_date?: string;
  completion_date?: string;
  recommended_contractor?: string;
  note?: string;
  attachment: string;
}

export interface RFQTemplate {
  subject: string;
  from: string;
  standard_terms: string[];
  body: string;
}

export function getERPItemCodes(): ERPItemCode[] {
  const data = loadJSON("erp_item_codes.json");
  return data["ERP ITEM CODE"];
}

export function getVendorList(): Vendor[] {
  const data = loadJSON("vendor_list.json");
  return data["Contractor List"];
}

export function getSiteRequirements(): SiteRequirement[] {
  const data = loadJSON("site_requirements.json");
  return data.site_requirements;
}

export function getRFQTemplate(): RFQTemplate {
  const data = loadJSON("site_requirements.json");
  return data.rfq_template;
}

export function getProcurementSOP() {
  return loadJSON("procurement_sop.json");
}

export function getWaterproofingQuantities() {
  return loadJSON("waterproofing_quantities.json");
}

export function getRoadBOQ() {
  return loadJSON("road_boq.json");
}

// Build a context string for RAG - all data as a compact reference
export function buildRAGContext(): string {
  const itemCodes = getERPItemCodes();
  const vendors = getVendorList();
  const requirements = getSiteRequirements();
  const rfqTemplate = getRFQTemplate();
  const waterproofing = getWaterproofingQuantities();

  return `
=== VINAYAK GROUP PROCUREMENT DATA ===

== ERP ITEM CODES (Waterproofing) ==
${itemCodes.map((ic) => `${ic["Item Code"]}: ${ic["Item Description"]}`).join("\n")}

== VENDOR / CONTRACTOR LIST (Aquina Project) ==
${vendors.map((v) => v.Contractor).join(", ")}

== ACTIVE SITE REQUIREMENTS ==
${requirements.map((r) => `
[${r.id}] Project: ${r.project} | Category: ${r.category} | Scope: ${r.scope}
From: ${r.from} | Date: ${r.date}
Description: ${r.description}
${r.timeline ? `Timeline: ${r.timeline}` : ""}
${r.commencement_date ? `Commencement: ${r.commencement_date} | Completion: ${r.completion_date}` : ""}
${r.recommended_contractor ? `Recommended Contractor: ${r.recommended_contractor}` : ""}
${r.note ? `Note: ${r.note}` : ""}
`).join("\n")}

== RFQ TEMPLATE ==
Subject Format: ${rfqTemplate.subject}
From: ${rfqTemplate.from}
Body: ${rfqTemplate.body}
Standard Terms:
${rfqTemplate.standard_terms.map((t, i) => `${i + 1}. ${t}`).join("\n")}

== WATERPROOFING QUANTITIES (Amara Tower-2) ==
${JSON.stringify(waterproofing["WO ITEM-WISE BOQ"], null, 2)}

== VINAYAK STANDARD TERMS ==
1. PF & ESI registration required
2. TDS deducted as per Govt. norms
3. 5% Security deposit released after 12 months of total completion
4. GST paid extra
5. Water & Electricity at a point and Labour hutment provided
6. Safety PPE cost under Contractor's scope
`.trim();
}
