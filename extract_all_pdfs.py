import pypdf
import os
import glob
import json

OUT_DIR = "data"
os.makedirs(OUT_DIR, exist_ok=True)

quotations = []
for f in glob.glob("vinayak-vch3-data/06_quotations/*.pdf"):
    filename = os.path.basename(f)
    vendor_name = filename.replace("Quotation_", "").replace(".pdf", "")
    reader = pypdf.PdfReader(f)
    pages_text = []
    for i, p in enumerate(reader.pages):
        t = p.extract_text() or ""
        pages_text.append(f"--- PAGE {i+1} ---\n{t.strip()}")
    
    full_text = "\n\n".join(pages_text)
    
    # Save individual text file
    txt_path = os.path.join(OUT_DIR, f"quotation_raw_{vendor_name}.txt")
    with open(txt_path, "w", encoding="utf-8") as out_f:
        out_f.write(full_text)
        
    quotations.append({
        "vendor_name": vendor_name,
        "filename": filename,
        "pages": len(reader.pages),
        "text_length": len(full_text),
        "text": full_text
    })
    print(f"Extracted {vendor_name}: {len(reader.pages)} pages, {len(full_text)} chars")

with open(os.path.join(OUT_DIR, "quotations_extracted.json"), "w", encoding="utf-8") as f:
    json.dump(quotations, f, indent=2, ensure_ascii=False)

# Also extract blank tender BOQ
tender_path = "vinayak-vch3-data/03_tender/BOQ_Specification_Waterproofing_Amara_Tower-2_rates_blank.pdf"
if os.path.exists(tender_path):
    reader = pypdf.PdfReader(tender_path)
    tender_pages = []
    for i, p in enumerate(reader.pages):
        t = p.extract_text() or ""
        tender_pages.append(f"--- PAGE {i+1} ---\n{t.strip()}")
    tender_text = "\n\n".join(tender_pages)
    with open(os.path.join(OUT_DIR, "tender_boq_raw.txt"), "w", encoding="utf-8") as out_f:
        out_f.write(tender_text)
    with open(os.path.join(OUT_DIR, "tender_boq.json"), "w", encoding="utf-8") as out_f:
        json.dump({"filename": os.path.basename(tender_path), "pages": len(reader.pages), "text": tender_text}, out_f, indent=2, ensure_ascii=False)
    print(f"Extracted Tender BOQ: {len(reader.pages)} pages, {len(tender_text)} chars")

print("All PDF text extraction completed!")
