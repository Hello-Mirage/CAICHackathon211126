"""Re-extract procurement SOP and road BOQ as clean JSON, plus extract PDFs."""
import openpyxl
import json
import os

OUT = "data"

# ===== 1. RE-EXTRACT PROCUREMENT SOP =====
print("=== Re-extracting Procurement SOP ===")
wb = openpyxl.load_workbook("vinayak-vch3-data/01_process/Vinayak_procurement_SOP_12_steps.xlsx", data_only=True)
ws = wb.active

# The Excel is a horizontal flowchart. Let's read all cells and find step data.
all_data = []
for row in ws.iter_rows(values_only=True):
    all_data.append([str(c).strip() if c is not None else "" for c in row])

# Print raw data to understand layout
print(f"  Rows: {len(all_data)}, Max cols: {max(len(r) for r in all_data)}")
for i, row in enumerate(all_data):
    non_empty = [(j, v) for j, v in enumerate(row) if v]
    if non_empty:
        print(f"  Row {i}: {non_empty}")

# Parse: Row 0 has step names, Row 1 has step numbers, Row 2 has descriptions
# Based on the data we saw: pairs of (step_name, step_number, description)
sop_steps = []
# The data seems to be in column pairs
# Let's collect all step info
step_names_raw = []
step_nums_raw = []
step_descs_raw = []

for row in all_data:
    for cell in row:
        if cell.startswith("Step"):
            # Extract step number
            parts = cell.replace("\n", " ").strip()
            step_nums_raw.append(parts)

# Manual extraction from what we know
sop_steps = [
    {"step": 1, "name": "BOQ Receival", "description": "Receipt of the BOQ (Bill of Quantities) from the respective Site Team for the proposed scope of work."},
    {"step": 2, "name": "BOQ Checking", "description": "Preliminary scrutiny and random verification of the submitted BOQ to check the quantities, item descriptions and completeness of the scope. In case of any discrepancies, anomalies or missing details, the same shall be communicated to the respective Site Team for necessary clarification and rectification."},
    {"step": 3, "name": "Corrected BOQ Receival", "description": "Receipt of the duly corrected and revised BOQ from the Site Team, incorporating the necessary modifications and clarifications."},
    {"step": 4, "name": "Preparation of Tender Documents", "description": "Preparation of the tender document after finalisation of the scope of work, technical specifications, terms of reference and other relevant requirements."},
    {"step": 5, "name": "Tender Floating", "description": "Floating of the tender to a minimum of three (3) eligible and relevant vendors/contractors for obtaining competitive quotations."},
    {"step": 6, "name": "Comparative Statement", "description": "Collection of quotations through necessary follow-ups with the participating vendors and preparation of a Comparative Statement (CS) based on the received quotations."},
    {"step": 7, "name": "Rate Negotiation", "description": "Conducting rate negotiations with the shortlisted vendors, supported by appropriate rate analysis and market benchmarking, wherever applicable."},
    {"step": 8, "name": "Management Approval", "description": "Submission of the finalised Comparative Statement, negotiated rates and relevant rate analysis to Management for review and approval."},
    {"step": 9, "name": "Vendor Registration", "description": "Upon receipt of Management approval, forwarding the Vendor Registration Form to the selected contractor/vendor for submission along with the requisite supporting documents. (if required)"},
    {"step": 10, "name": "Work Order Creation", "description": "Upon successful completion of vendor registration and verification by the Accounts Department, preparation of the Work Order (WO), incorporating the approved scope of work, BOQ, rates, payment terms and applicable terms and conditions."},
    {"step": 11, "name": "Management Approval (WO)", "description": "Submission of the drafted Work Order to Management for final review and approval, followed by execution/signing by the duly authorised signatory."},
    {"step": 12, "name": "Work Order Floating", "description": "Floating of the signed work order to the respective vendor & site team."},
]

with open(f"{OUT}/procurement_sop.json", "w", encoding="utf-8") as f:
    json.dump({"steps": sop_steps, "total_steps": 12, "source": "Vinayak Group Procurement SOP"}, f, indent=2, ensure_ascii=False)
print(f"  ✅ Saved {len(sop_steps)} steps to procurement_sop.json")


# ===== 2. RE-EXTRACT ROAD BOQ =====
print("\n=== Re-extracting Road BOQ ===")
wb = openpyxl.load_workbook("vinayak-vch3-data/02_site_requirements/B_BOQ_Internal_Road_Work_Aquina.xlsx", data_only=True)

road_data = {}
for sheet_name in wb.sheetnames:
    ws = wb[sheet_name]
    print(f"\n  Sheet: {sheet_name} ({ws.max_row} rows x {ws.max_column} cols)")
    
    rows = []
    for row in ws.iter_rows(values_only=True):
        clean = [v for v in row if v is not None]
        if clean:  # skip entirely empty rows
            row_dict = {}
            for i, v in enumerate(row):
                if v is not None:
                    row_dict[f"c{i}"] = v if not isinstance(v, float) or v != int(v) else int(v)
            if row_dict:
                rows.append(row_dict)
    
    road_data[sheet_name] = rows
    print(f"  → {len(rows)} non-empty rows")
    for r in rows[:3]:
        vals = list(r.values())[:5]
        print(f"    {vals}")

# Now let's do a smarter extraction of the BOQ sheet
ws_boq = wb["BOQ"]
boq_items = []
# Find the actual data rows - look for rows with Sl No
header_found = False
headers = []
for row in ws_boq.iter_rows(values_only=True):
    vals = list(row)
    # Look for the header row containing "Sl No" or similar
    str_vals = [str(v).strip() if v else "" for v in vals]
    
    if any("Sl" in s and "No" in s for s in str_vals) and not header_found:
        # This is the header row
        headers = [str(v).strip() if v else f"col_{i}" for i, v in enumerate(vals)]
        header_found = True
        print(f"\n  Found BOQ headers: {[h for h in headers if h and 'col_' not in h]}")
        continue
    
    if header_found:
        # Check if this row has a serial number (first non-None value is a number)
        non_none = [(i, v) for i, v in enumerate(vals) if v is not None]
        if non_none:
            item = {}
            for i, v in enumerate(vals):
                if i < len(headers) and v is not None:
                    h = headers[i]
                    if h and "col_" not in h:
                        item[h] = v if not isinstance(v, float) or v != int(v) else int(v)
            if item and len(item) > 1:
                boq_items.append(item)

road_data["BOQ_parsed"] = boq_items
print(f"\n  Parsed BOQ items: {len(boq_items)}")
for item in boq_items[:3]:
    print(f"    {item}")

with open(f"{OUT}/road_boq.json", "w", encoding="utf-8") as f:
    json.dump(road_data, f, indent=2, default=str, ensure_ascii=False)
print(f"\n  ✅ Saved road_boq.json")


# ===== 3. CREATE SAMPLE INPUTS =====
print("\n=== Creating Sample Inputs ===")
samples = {
    "whatsapp_messages": [
        {
            "id": "wa_01",
            "type": "whatsapp",
            "text": "Sir urgent requirement for waterproofing work at Amara Tower 2. Need to start ground floor and first floor toilets ASAP. Purvyakruti was doing mockup floor but for remaining floors we need new contractor. Pls send WO at earliest. - Arijit",
            "from": "Arijit Dey",
            "timestamp": "2026-11-15T09:30:00+05:30"
        },
        {
            "id": "wa_02", 
            "type": "whatsapp",
            "text": "Rahul sir, Aquina site road is in bad condition. We need permanent internal road from main gate to Tower-2 side. Matur Enterprise (Rajat da) can start by end of October. Need BOQ approval and work order. Load capacity should be 45MT as per fire authority. Paver block finish as per landscape architect plan.",
            "from": "Molay Das",
            "timestamp": "2026-10-20T14:15:00+05:30"
        },
        {
            "id": "wa_03",
            "type": "whatsapp", 
            "text": "Need cement urgently for Tower 3 column casting. 500 bags OPC 53 grade. Delivery by tomorrow if possible. Current stock only 50 bags left.",
            "from": "Site Engineer",
            "timestamp": "2026-11-18T07:45:00+05:30"
        }
    ],
    "voice_transcriptions": [
        {
            "id": "vn_01",
            "type": "voice_note",
            "text": "Haan sir... yeh Amara Tower 2 ka waterproofing ka kaam hai... toilet aur kitchen dono ka karna hai... ground floor se lekar 23rd floor tak... total around 1200 square meter floor area hoga... aur wall bhi karna hai 450mm height tak... urgently chahiye sir... November se start karna hai",
            "from": "Site Engineer (Amara)",
            "timestamp": "2026-11-14T16:20:00+05:30",
            "language": "Hindi-English mix"
        },
        {
            "id": "vn_02",
            "type": "voice_note",
            "text": "Sir road work BOQ bhej raha hoon... Aquina project ka internal road hai main gate se Tower-2 tak... total length around 200 meter hoga... paver block finish chahiye... 45 ton load capacity rakhna hai fire authority ne bola hai... Matur Enterprise ko dena hai kaam... woh 21 Acres mein bhi road banaye the",
            "from": "Dipon Senapati",
            "timestamp": "2026-10-21T11:00:00+05:30",
            "language": "Hindi-English mix"
        }
    ]
}

with open(f"{OUT}/sample_inputs.json", "w", encoding="utf-8") as f:
    json.dump(samples, f, indent=2, ensure_ascii=False)
print("  ✅ Saved sample_inputs.json")

print("\n✅ Phase 1 partial complete (SOP + Road BOQ + Samples)")
print("⏳ Still need: PDF extraction for quotations and tender BOQ")
