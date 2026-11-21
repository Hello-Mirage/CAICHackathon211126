// Extract text from all PDFs in vinayak-vch3-data
const fs = require("fs");
const path = require("path");
const { PDFParse } = require("pdf-parse");

const BASE = path.join(__dirname, "..", "..", "vinayak-vch3-data");
const OUT = path.join(__dirname, "..", "data");

async function extractPDF(filePath, outputName) {
  console.log(`\nExtracting: ${path.basename(filePath)}`);
  try {
    const buffer = fs.readFileSync(filePath);
    const parser = new PDFParse(filePath);
    const data = await parser.parse();
    
    // Collect text from all pages
    let fullText = "";
    let pageCount = 0;
    for (const page of data.pages) {
      pageCount++;
      const pageText = page.lines.map(l => l.text || l.toString()).join("\n");
      fullText += `\n--- PAGE ${pageCount} ---\n${pageText}`;
    }
    
    console.log(`  Pages: ${pageCount}`);
    console.log(`  Text length: ${fullText.length} chars`);
    console.log(`  First 500 chars:\n${fullText.substring(0, 500)}`);
    
    // Save raw text
    const txtPath = path.join(OUT, `${outputName}.txt`);
    fs.writeFileSync(txtPath, fullText, "utf-8");
    console.log(`  → Saved to ${txtPath}`);
    
    return {
      filename: path.basename(filePath),
      pages: pageCount,
      text_length: fullText.length,
      text: fullText,
      output_file: `${outputName}.txt`
    };
  } catch (err) {
    console.error(`  ❌ Error: ${err.message}`);
    return {
      filename: path.basename(filePath),
      error: err.message,
      text: ""
    };
  }
}

async function main() {
  if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });
  
  // 1. Extract quotation PDFs
  const quotationDir = path.join(BASE, "06_quotations");
  const quotationFiles = fs.readdirSync(quotationDir).filter(f => f.endsWith(".pdf"));
  
  console.log("=== Extracting Quotation PDFs ===");
  const quotations = [];
  for (const file of quotationFiles) {
    const vendorName = file.replace("Quotation_", "").replace(".pdf", "");
    const result = await extractPDF(
      path.join(quotationDir, file),
      `quotation_raw_${vendorName}`
    );
    result.vendor_name = vendorName;
    quotations.push(result);
  }
  
  // 2. Extract tender BOQ PDF
  console.log("\n=== Extracting Tender BOQ PDF ===");
  const tenderResult = await extractPDF(
    path.join(BASE, "03_tender", "BOQ_Specification_Waterproofing_Amara_Tower-2_rates_blank.pdf"),
    "tender_boq_raw"
  );
  
  // 3. Save summary
  const summary = {
    quotations: quotations.map(q => ({
      vendor_name: q.vendor_name,
      filename: q.filename,
      pages: q.pages,
      text_length: q.text_length,
      has_text: q.text_length > 100,
      output_file: q.output_file,
      error: q.error || null
    })),
    tender_boq: {
      filename: tenderResult.filename,
      pages: tenderResult.pages,
      text_length: tenderResult.text_length,
      has_text: tenderResult.text_length > 100,
      output_file: tenderResult.output_file
    }
  };
  
  fs.writeFileSync(
    path.join(OUT, "pdf_extraction_summary.json"),
    JSON.stringify(summary, null, 2),
    "utf-8"
  );
  
  // 4. Save all quotation texts as a single JSON for RAG
  const quotationsJSON = quotations.map(q => ({
    vendor_name: q.vendor_name,
    filename: q.filename,
    text: q.text || "",
    pages: q.pages,
    is_scan: (q.text_length || 0) < 200  // likely a scan if very little text extracted
  }));
  
  fs.writeFileSync(
    path.join(OUT, "quotations_extracted.json"),
    JSON.stringify(quotationsJSON, null, 2),
    "utf-8"
  );
  
  console.log("\n=== Summary ===");
  for (const q of quotations) {
    const status = q.error ? "❌ ERROR" : (q.text_length < 200 ? "⚠️ SCAN?" : "✅ OK");
    console.log(`  ${q.vendor_name}: ${status} (${q.text_length || 0} chars, ${q.pages || 0} pages)`);
  }
  console.log(`  Tender BOQ: ${tenderResult.text_length > 100 ? "✅ OK" : "⚠️ SCAN?"} (${tenderResult.text_length} chars)`);
  console.log("\n✅ All PDFs extracted");
}

main().catch(console.error);
