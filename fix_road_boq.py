"""Better extraction of Road BOQ - parse MB Overall and BOM sheets properly."""
import openpyxl
import json

OUT = "data"
wb = openpyxl.load_workbook("vinayak-vch3-data/02_site_requirements/B_BOQ_Internal_Road_Work_Aquina.xlsx", data_only=True)

result = {
    "project": "AQUINA",
    "sub_project": "Internal Road Work – Main Gate to Tower-2 (Flat-B side)",
    "source": "BOQ / BOM of Road Work, Aquina dt. 16.10.2026",
    "prepared_on": "16.10.2026"
}

# ===== Parse BOQ sheet =====
print("=== Parsing BOQ Sheet ===")
ws = wb["BOQ"]
all_rows = list(ws.iter_rows(values_only=True))

# Find the actual item rows - they have a serial number in column 0
boq_items = []
in_items = False
for row in all_rows:
    vals = list(row)
    str_vals = [str(v).strip() if v else "" for v in vals]
    
    # Look for "Sl No" header
    if any("Sl" in s for s in str_vals[:3]) and any("No" in s for s in str_vals[:3]):
        in_items = True
        # Identify key column positions from this header
        print(f"  Header found: {[s for s in str_vals if s][:10]}")
        continue
    
    if in_items:
        # First cell should be a number (serial number)
        if vals[0] is not None and isinstance(vals[0], (int, float)):
            sl = int(vals[0]) if isinstance(vals[0], float) and vals[0] == int(vals[0]) else vals[0]
            # Collect non-None values
            item = {
                "sl_no": sl,
                "description": str(vals[1]).strip() if vals[1] else "",
                "unit": str(vals[2]).strip() if vals[2] else "",
            }
            # Look for quantity and rate values
            nums = [v for v in vals[3:] if isinstance(v, (int, float)) and v != 0]
            if nums:
                item["quantity"] = nums[0] if len(nums) > 0 else None
            boq_items.append(item)
            print(f"  Item {sl}: {item['description'][:60]} | {item.get('unit', '')} | qty={item.get('quantity', 'N/A')}")

result["boq_items"] = boq_items
print(f"  Total BOQ items: {len(boq_items)}")

# ===== Parse MB Overall sheet =====
print("\n=== Parsing MB Overall Sheet ===")
ws = wb["MB Overall"]
all_rows = list(ws.iter_rows(values_only=True))

mb_items = []
current_item = None
in_data = False

for row in all_rows:
    vals = list(row)
    str_vals = [str(v).strip() if v else "" for v in vals]
    
    # Skip empty rows
    if all(v is None for v in vals):
        continue
    
    # Find header
    if "Item No." in str_vals or "Item No" in str_vals:
        in_data = True
        continue
    
    if in_data:
        # Check if this is an item header (has text in description column)
        if vals[1] and isinstance(vals[1], str) and len(str(vals[1])) > 10:
            if current_item:
                mb_items.append(current_item)
            current_item = {
                "item_no": str(vals[0]).strip() if vals[0] else "",
                "description": str(vals[1]).strip(),
                "unit": str(vals[2]).strip() if vals[2] else "",
                "measurements": [],
                "total_quantity": None
            }
        elif current_item and any(isinstance(v, (int, float)) for v in vals[3:7]):
            # This is a measurement row
            meas = {
                "no": vals[3] if vals[3] else None,
                "length": vals[4] if vals[4] else None,
                "breadth": vals[5] if vals[5] else None,
                "height": vals[6] if vals[6] else None,
                "quantity": vals[7] if vals[7] else None,
                "remarks": str(vals[8]).strip() if vals[8] else None
            }
            current_item["measurements"].append(meas)
            if vals[7]:
                current_item["total_quantity"] = vals[7]

if current_item:
    mb_items.append(current_item)

result["measurement_book"] = mb_items
print(f"  Total MB items: {len(mb_items)}")
for item in mb_items[:5]:
    print(f"    {item['item_no']}: {item['description'][:50]} | {item['unit']} | qty={item.get('total_quantity', 'N/A')}")

# ===== Parse BOM Calculation sheet =====
print("\n=== Parsing BOM Calculation Sheet ===")
ws = wb["BOM Calculation"]
all_rows = list(ws.iter_rows(values_only=True))

bom_items = []
in_data = False

for row in all_rows:
    vals = list(row)
    str_vals = [str(v).strip() if v else "" for v in vals]
    
    if "SL NO" in str_vals:
        in_data = True
        continue
    
    if in_data and vals[0] is not None and isinstance(vals[0], (int, float)):
        item = {
            "sl_no": int(vals[0]) if isinstance(vals[0], float) else vals[0],
            "boq_sl_no": int(vals[1]) if vals[1] and isinstance(vals[1], (int, float)) else vals[1],
            "boq_item": str(vals[2]).strip() if vals[2] else "",
            "material": str(vals[3]).strip() if vals[3] else "",
            "quantity": vals[4] if vals[4] else None,
            "thickness_m": vals[6] if len(vals) > 6 and vals[6] else None,
            "net_material_qty": vals[9] if len(vals) > 9 and vals[9] else None,
            "material_uom": str(vals[10]).strip() if len(vals) > 10 and vals[10] else "",
            "wastage_pct": vals[11] if len(vals) > 11 and vals[11] else None,
            "total_qty_with_wastage": vals[12] if len(vals) > 12 and vals[12] else None,
            "basis": str(vals[13]).strip() if len(vals) > 13 and vals[13] else "",
        }
        bom_items.append(item)
        print(f"    {item['sl_no']}: {item['material']} | qty={item.get('total_qty_with_wastage', 'N/A')} {item['material_uom']}")

result["bill_of_materials"] = bom_items
print(f"  Total BOM items: {len(bom_items)}")

# Save
with open(f"{OUT}/road_boq.json", "w", encoding="utf-8") as f:
    json.dump(result, f, indent=2, default=str, ensure_ascii=False)

print(f"\n✅ Saved clean road_boq.json")
