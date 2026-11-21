import openpyxl
import json
import os

BASE = "vinayak-vch3-data"
OUT = "data"
os.makedirs(OUT, exist_ok=True)

def sheet_to_records(ws):
    rows = list(ws.iter_rows(values_only=True))
    if not rows:
        return []
    # Find header row (first row with mostly non-None values)
    header_idx = 0
    for i, row in enumerate(rows):
        non_none = sum(1 for v in row if v is not None)
        if non_none >= 2:
            header_idx = i
            break
    headers = []
    for j, v in enumerate(rows[header_idx]):
        h = str(v).strip() if v else f"col_{j}"
        headers.append(h)
    records = []
    for row in rows[header_idx+1:]:
        rec = {}
        all_none = True
        for h, v in zip(headers, row):
            if v is not None:
                all_none = False
                rec[h] = v if not isinstance(v, float) or v != int(v) else int(v)
            else:
                rec[h] = None
        if not all_none:
            records.append(rec)
    return records

files = {
    "procurement_sop": f"{BASE}/01_process/Vinayak_procurement_SOP_12_steps.xlsx",
    "waterproofing_quantities": f"{BASE}/02_site_requirements/A_Amara_Waterproofing_quantities_Tower-2.xlsx",
    "road_boq": f"{BASE}/02_site_requirements/B_BOQ_Internal_Road_Work_Aquina.xlsx",
    "erp_item_codes": f"{BASE}/04_item_codes/ERP_item_codes_waterproofing.xlsx",
    "vendor_list": f"{BASE}/05_vendors/Contractor_list_Aquina.xlsx",
}

for name, path in files.items():
    print(f"\nProcessing: {name}")
    wb = openpyxl.load_workbook(path, data_only=True)
    result = {}
    for sheet in wb.sheetnames:
        ws = wb[sheet]
        records = sheet_to_records(ws)
        result[sheet] = records
        print(f"  Sheet '{sheet}': {len(records)} records")
        # Print first 3 for preview
        for r in records[:3]:
            print(f"    {r}")

    out_path = f"{OUT}/{name}.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(result, f, indent=2, default=str, ensure_ascii=False)
    print(f"  -> Saved to {out_path}")

# Also save the text files as JSON
text_data = {
    "site_requirements": [
        {
            "id": "req_waterproofing_amara_t2",
            "project": "Amara",
            "category": "Waterproofing",
            "scope": "Tower-2",
            "source": "email",
            "from": "Vinayak Amara / Arijit Dey (QS & Billing Engineer)",
            "to": "Soham Saha (Sr. Engineer, Contracts & Planning)",
            "date": "2026-11-16",
            "description": "Internal waterproofing works for Tower 2 - Ground Floor, 1st Floor, 3rd Floor onwards including all typical floors. Scope includes waterproofing of all toilets/W.C., kitchens, wash areas, balconies, open terraces and F.R.P. works.",
            "timeline": "November 2026 to June 2028",
            "note": "Mock-up floor waterproofing by Purvyakruti as approved. Other floors to be finalized after tender evaluation.",
            "attachment": "A_Amara_Waterproofing_quantities_Tower-2.xlsx"
        },
        {
            "id": "req_road_work_aquina",
            "project": "Aquina",
            "category": "Road Work",
            "scope": "Internal Road",
            "source": "email",
            "from": "Dipon Senapati (QS & Billing Engineer)",
            "to": "Vinayak Projects",
            "date": "2026-10-22",
            "description": "Internal road work for Aquina Project. Permanent road with paver-block finish, designed for 45 MT load capacity as per Fire Authority FSR recommendation.",
            "commencement_date": "2026-10-26",
            "completion_date": "2027-03-31",
            "recommended_contractor": "Matur Enterprise (Rajat Da, existing road contractor of Vinayak 21 Acres)",
            "attachment": "B_BOQ_Internal_Road_Work_Aquina.xlsx, B_Internal_Road_Aquina_drawing.pdf"
        }
    ],
    "rfq_template": {
        "subject": "SEEKING QUOTATION FOR {WORK_TYPE} WORK AT VINAYAK {PROJECT}",
        "from": "Soham Saha, Sr. Engineer, Contracts & Planning, Vinayak Group",
        "standard_terms": [
            "PF & ESI registration required.",
            "TDS will be deducted as per Govt. norms.",
            "5% Security deposit will be released after 12 months of total completion of work.",
            "GST will be paid extra.",
            "Water & Electricity at a point and Labour hutment will be provided.",
            "Safety PPE cost will be under Contractor's scope."
        ],
        "body": "Please find attached the description of work along with this mail. You are requested to kindly submit your commercial quotation in accordance with the specifications mentioned in the attached file as well as below mentioned points."
    }
}

with open(f"{OUT}/site_requirements.json", "w", encoding="utf-8") as f:
    json.dump(text_data, f, indent=2, ensure_ascii=False)
print(f"\n  -> Saved site_requirements.json and rfq_template")

print("\n✅ All data extracted to ./data/ folder")
