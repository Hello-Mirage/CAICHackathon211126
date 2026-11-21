// Gemini API client for AI procurement logic
import { buildRAGContext } from "./data";

function getGeminiUrl() {
  const key = process.env.GEMINI_API_KEY || "";
  const model = "gemini-2.0-flash";
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
}

interface GeminiResponse {
  candidates?: {
    content: {
      parts: { text: string }[];
    };
  }[];
}

async function callGemini(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set");
  }

  const url = getGeminiUrl();
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: {
        parts: [{ text: systemPrompt }],
      },
      contents: [
        {
          role: "user",
          parts: [{ text: userPrompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${response.status} - ${err}`);
  }

  const data: GeminiResponse = await response.json();
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  
  // Clean markdown code fence if returned
  const cleaned = rawText.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
  return cleaned;
}

// STEP 1: Capture & structure a site requirement
export async function captureRequirement(rawInput: string) {
  const context = buildRAGContext();
  const systemPrompt = `You are a procurement assistant for Vinayak Group, a Kolkata residential developer.
Your job is to parse raw site requirement messages (emails, WhatsApp texts, voice transcriptions) into structured procurement requests.

Here is the company's procurement data for reference:
${context}

Parse the input into a structured JSON object with these fields:
{
  "project": "project name",
  "category": "work category (e.g., Waterproofing, Road Work, Plumbing, Electrical)",
  "scope": "specific scope description",
  "items": [
    {
      "description": "item description",
      "quantity": number or null,
      "unit": "UOM (SQM, RM, CUM, etc.)",
      "specifications": "any specs mentioned"
    }
  ],
  "urgency": "low | medium | high | critical",
  "requested_by": "person name and role if mentioned",
  "site": "site/tower/floor details",
  "timeline": "mentioned timeline",
  "notes": "any additional context",
  "raw_input": "the original input text"
}

If information is missing, set it to null. Infer the category from context when possible.`;

  const result = await callGemini(systemPrompt, `Parse this site requirement:\n\n${rawInput}`);
  return JSON.parse(result);
}

// STEP 2: Match to ERP item codes
export async function matchItemCodes(requirement: Record<string, unknown>) {
  const context = buildRAGContext();
  const systemPrompt = `You are a procurement assistant for Vinayak Group.
Your job is to match procurement requirement items to existing ERP item codes from Vinayak's Farvision ERP system.

Here is the ERP data:
${context}

For each item in the requirement, find the best matching ERP item code(s).
Return JSON:
{
  "matches": [
    {
      "requirement_item": "description from requirement",
      "matched_codes": [
        {
          "item_code": "ERP code",
          "item_description": "ERP description",
          "confidence": "high | medium | low",
          "match_reason": "why this matches"
        }
      ],
      "is_new_item": false,
      "suggested_new_code": null,
      "duplicate_flags": ["list of similar/duplicate ERP codes found"]
    }
  ],
  "summary": "brief summary of matching results"
}

Flag any near-duplicate ERP codes you find (similar descriptions, different codes).
If no good match exists, set is_new_item to true and suggest a new code following the naming convention.`;

  const result = await callGemini(systemPrompt, `Match these requirement items to ERP codes:\n\n${JSON.stringify(requirement, null, 2)}`);
  return JSON.parse(result);
}

// STEP 3: Draft RFQ emails
export async function draftRFQ(requirement: Record<string, unknown>, matchedCodes: Record<string, unknown>) {
  const context = buildRAGContext();
  const systemPrompt = `You are a procurement assistant for Vinayak Group.
Your job is to draft RFQ (Request for Quotation) emails to send to vendors.

Here is the company data:
${context}

Draft professional RFQ emails following Vinayak's standard format.
Return JSON:
{
  "rfq_emails": [
    {
      "to_vendor_category": "type of vendor to send to",
      "suggested_vendors": ["vendor names from the list"],
      "subject": "email subject",
      "body": "complete email body",
      "attachments_needed": ["list of documents to attach"],
      "terms": ["standard terms included"]
    }
  ],
  "boq_summary": "summary of the BOQ to be attached"
}`;

  const result = await callGemini(
    systemPrompt,
    `Draft RFQ emails for this requirement:\n\nRequirement: ${JSON.stringify(requirement, null, 2)}\n\nMatched ERP Codes: ${JSON.stringify(matchedCodes, null, 2)}`
  );
  return JSON.parse(result);
}

// STEP 4: Parse & normalize vendor quotations
export async function normalizeQuotation(quotationText: string, vendorName: string) {
  const context = buildRAGContext();
  const systemPrompt = `You are a procurement assistant for Vinayak Group.
Your job is to parse vendor quotations (which come in various formats) and normalize them into a standard comparable format.

Reference data:
${context}

Parse the quotation and return JSON:
{
  "vendor_name": "vendor name",
  "quotation_date": "date",
  "validity": "quote validity period",
  "line_items": [
    {
      "sl_no": number,
      "description": "item description",
      "erp_code_match": "matched ERP code if identifiable",
      "quantity": number,
      "unit": "UOM",
      "unit_rate": number,
      "amount": number,
      "gst_percent": number or null,
      "gst_amount": number or null,
      "total_with_gst": number or null
    }
  ],
  "subtotal": number,
  "gst_total": number or null,
  "grand_total": number,
  "payment_terms": "payment terms stated",
  "delivery_time": "delivery/completion timeline",
  "freight_charges": "freight terms",
  "warranty": "warranty terms if any",
  "special_conditions": ["any special conditions"],
  "inclusions": ["what's included"],
  "exclusions": ["what's excluded"]
}

Normalize all amounts to INR. If GST is mentioned as inclusive, break it out. If rates are per SFT, also convert to SQM.`;

  const result = await callGemini(
    systemPrompt,
    `Parse and normalize this quotation from ${vendorName}:\n\n${quotationText}`
  );
  return JSON.parse(result);
}

// STEP 5: Generate comparative statement
export async function generateComparativeStatement(normalizedQuotations: Record<string, unknown>[]) {
  const context = buildRAGContext();
  const systemPrompt = `You are a procurement assistant for Vinayak Group.
Your job is to create a comparative statement that ranks vendors based on price and other factors.

Reference data:
${context}

Create a comprehensive comparative statement. Return JSON:
{
  "comparison_title": "title of this comparison",
  "date": "today's date",
  "project": "project name",
  "work_category": "category",
  "vendors_compared": number,
  "item_comparison": [
    {
      "item_description": "item",
      "erp_code": "code",
      "unit": "UOM",
      "quantity": number,
      "vendor_rates": [
        {
          "vendor_name": "name",
          "unit_rate": number,
          "total_amount": number,
          "is_lowest": boolean
        }
      ]
    }
  ],
  "vendor_summary": [
    {
      "vendor_name": "name",
      "total_quoted_amount": number,
      "gst_amount": number,
      "grand_total": number,
      "delivery_time": "timeline",
      "payment_terms": "terms",
      "price_rank": number,
      "score": number,
      "strengths": ["list"],
      "weaknesses": ["list"]
    }
  ],
  "recommendation": {
    "recommended_vendor": "vendor name",
    "reasoning": "detailed reasoning",
    "savings_vs_highest": number,
    "savings_percent": number,
    "conditions": ["any conditions for the recommendation"]
  }
}`;

  const result = await callGemini(
    systemPrompt,
    `Generate a comparative statement for these vendor quotations:\n\n${JSON.stringify(normalizedQuotations, null, 2)}`
  );
  return JSON.parse(result);
}

// STEP 6: Generate HOD recommendation
export async function generateRecommendation(comparativeStatement: Record<string, unknown>) {
  const systemPrompt = `You are a procurement assistant for Vinayak Group.
Generate a formal recommendation memo to the HOD for vendor approval.

Return JSON:
{
  "memo_to": "HOD designation",
  "memo_from": "Contracts & Planning",
  "date": "today's date",
  "subject": "subject line",
  "summary": "executive summary (2-3 lines)",
  "recommended_vendor": "vendor name",
  "recommended_amount": number,
  "reasoning": [
    "point 1",
    "point 2"
  ],
  "comparison_highlights": "key comparison points",
  "risk_factors": ["any risks noted"],
  "action_required": "what HOD needs to do",
  "approval_status": "pending"
}`;

  const result = await callGemini(
    systemPrompt,
    `Generate an HOD recommendation based on this comparative statement:\n\n${JSON.stringify(comparativeStatement, null, 2)}`
  );
  return JSON.parse(result);
}
