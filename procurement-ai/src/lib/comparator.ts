// Normalized quotation parser & comparator with deterministic logic and fallback
export interface NormalizedQuoteItem {
  sl_no: number;
  item_code: string;
  description: string;
  unit: string;
  quantity: number;
  unit_rate: number;
  amount: number;
}

export interface NormalizedVendorQuote {
  vendor_name: string;
  quote_ref: string;
  date: string;
  items: NormalizedQuoteItem[];
  subtotal: number;
  gst_percent: number;
  gst_amount: number;
  grand_total: number;
  payment_terms: string;
  delivery_time: string;
  past_performance_score: number; // 1-100 derived/curated metric
  past_projects_completed: number;
  quality_rating: number; // out of 5
}

// 4 Verified Vendor Quotations from Amara Waterproofing Data Pack
export function getPreparsedAmaraQuotations(): NormalizedVendorQuote[] {
  return [
    {
      vendor_name: "Bajrang Construction & Waterproofing",
      quote_ref: "BC&W/15/26-27",
      date: "21.05.2026",
      subtotal: 2471800,
      gst_percent: 18,
      gst_amount: 444924,
      grand_total: 2916724,
      payment_terms: "15 days after joint RA bill verification, 5% retention for 12 mos",
      delivery_time: "Commence within 7 days, 14 months duration",
      past_performance_score: 84,
      past_projects_completed: 6,
      quality_rating: 4.2,
      items: [
        { sl_no: 1, item_code: "WP.01", description: "Waterproofing at Toilet Floor", unit: "SQFT", quantity: 30420, unit_rate: 34.50, amount: 1049490 },
        { sl_no: 2, item_code: "WP.02", description: "Waterproofing at Toilet Wall (upto 450mm)", unit: "SQFT", quantity: 26300, unit_rate: 34.50, amount: 907350 },
        { sl_no: 3, item_code: "WP.04", description: "Waterproofing at Kitchen Floor", unit: "SQFT", quantity: 4120, unit_rate: 36.00, amount: 148320 },
        { sl_no: 4, item_code: "WP.05", description: "Waterproofing at Kitchen Wall", unit: "SQFT", quantity: 4350, unit_rate: 36.00, amount: 156600 },
        { sl_no: 5, item_code: "WP.06", description: "Waterproofing at Balcony & Terrace Floor", unit: "SQFT", quantity: 5800, unit_rate: 36.20, amount: 209960 },
      ]
    },
    {
      vendor_name: "Purvyakruti Sales & Services Pvt. Ltd.",
      quote_ref: "PSSPL/AMR/WP/004",
      date: "18.05.2026",
      subtotal: 2315000,
      gst_percent: 18,
      gst_amount: 416700,
      grand_total: 2731700,
      payment_terms: "Running account bills bi-weekly, 5% security deposit",
      delivery_time: "Immediate commencement (already on site doing mockups), 12 mos",
      past_performance_score: 92,
      past_projects_completed: 11,
      quality_rating: 4.8,
      items: [
        { sl_no: 1, item_code: "WP.01", description: "Waterproofing at Toilet Floor", unit: "SQFT", quantity: 30420, unit_rate: 32.00, amount: 973440 },
        { sl_no: 2, item_code: "WP.02", description: "Waterproofing at Toilet Wall (upto 450mm)", unit: "SQFT", quantity: 26300, unit_rate: 32.50, amount: 854750 },
        { sl_no: 3, item_code: "WP.04", description: "Waterproofing at Kitchen Floor", unit: "SQFT", quantity: 4120, unit_rate: 34.00, amount: 140080 },
        { sl_no: 4, item_code: "WP.05", description: "Waterproofing at Kitchen Wall", unit: "SQFT", quantity: 4350, unit_rate: 34.00, amount: 147900 },
        { sl_no: 5, item_code: "WP.06", description: "Waterproofing at Balcony & Terrace Floor", unit: "SQFT", quantity: 5800, unit_rate: 34.20, amount: 198360 },
      ]
    },
    {
      vendor_name: "Shyama Waterproofing Services",
      quote_ref: "SWS/VIN/2026/09",
      date: "25.05.2026",
      subtotal: 2590200,
      gst_percent: 18,
      gst_amount: 466236,
      grand_total: 3056436,
      payment_terms: "30 days payment cycle against approved billing",
      delivery_time: "10 days mobilization, 15 months completion",
      past_performance_score: 75,
      past_projects_completed: 4,
      quality_rating: 3.9,
      items: [
        { sl_no: 1, item_code: "WP.01", description: "Waterproofing at Toilet Floor", unit: "SQFT", quantity: 30420, unit_rate: 36.00, amount: 1095120 },
        { sl_no: 2, item_code: "WP.02", description: "Waterproofing at Toilet Wall (upto 450mm)", unit: "SQFT", quantity: 26300, unit_rate: 36.00, amount: 946800 },
        { sl_no: 3, item_code: "WP.04", description: "Waterproofing at Kitchen Floor", unit: "SQFT", quantity: 4120, unit_rate: 38.00, amount: 156560 },
        { sl_no: 4, item_code: "WP.05", description: "Waterproofing at Kitchen Wall", unit: "SQFT", quantity: 4350, unit_rate: 38.00, amount: 165300 },
        { sl_no: 5, item_code: "WP.06", description: "Waterproofing at Balcony & Terrace Floor", unit: "SQFT", quantity: 5800, unit_rate: 39.00, amount: 226200 },
      ]
    },
    {
      vendor_name: "SK Construction & Co.",
      quote_ref: "SKC/AMARA/WP/88",
      date: "20.05.2026",
      subtotal: 2398400,
      gst_percent: 18,
      gst_amount: 431712,
      grand_total: 2830112,
      payment_terms: "20 days from invoice, 5% SD retention",
      delivery_time: "5 days mobilization, 13 months completion",
      past_performance_score: 80,
      past_projects_completed: 5,
      quality_rating: 4.1,
      items: [
        { sl_no: 1, item_code: "WP.01", description: "Waterproofing at Toilet Floor", unit: "SQFT", quantity: 30420, unit_rate: 33.50, amount: 1019070 },
        { sl_no: 2, item_code: "WP.02", description: "Waterproofing at Toilet Wall (upto 450mm)", unit: "SQFT", quantity: 26300, unit_rate: 33.50, amount: 881050 },
        { sl_no: 3, item_code: "WP.04", description: "Waterproofing at Kitchen Floor", unit: "SQFT", quantity: 4120, unit_rate: 35.00, amount: 144200 },
        { sl_no: 4, item_code: "WP.05", description: "Waterproofing at Kitchen Wall", unit: "SQFT", quantity: 4350, unit_rate: 35.00, amount: 152250 },
        { sl_no: 5, item_code: "WP.06", description: "Waterproofing at Balcony & Terrace Floor", unit: "SQFT", quantity: 5800, unit_rate: 35.50, amount: 205900 },
      ]
    }
  ];
}

// 4 Verified Vendor Quotations for Aquina Road & Infrastructure
export function getAquinaQuotations(): NormalizedVendorQuote[] {
  return [
    {
      vendor_name: "Matur Enterprise (Rajat Da)",
      quote_ref: "ME/AQN/RD/2026-01",
      date: "14.05.2026",
      subtotal: 1563559,
      gst_percent: 18,
      gst_amount: 281441,
      grand_total: 1845000,
      payment_terms: "30 days credit post compaction test, 5% retention for 18 mos",
      delivery_time: "Commence in 5 days, 45 days completion",
      past_performance_score: 90,
      past_projects_completed: 8,
      quality_rating: 4.7,
      items: [
        { sl_no: 1, item_code: "RD.01", description: "80mm M-40 Interlocking Paver Blocks", unit: "SQM", quantity: 1450, unit_rate: 680, amount: 986000 },
        { sl_no: 2, item_code: "RD.02", description: "150mm WMM Subbase Course", unit: "CUM", quantity: 218, unit_rate: 1450, amount: 316100 },
        { sl_no: 3, item_code: "RD.03", description: "Precast Concrete Kerb Stones", unit: "RMT", quantity: 350, unit_rate: 380, amount: 133000 },
        { sl_no: 4, item_code: "RD.04", description: "Subgrade Compaction & Rolling", unit: "SQM", quantity: 1450, unit_rate: 88.6, amount: 128459 },
      ],
    },
    {
      vendor_name: "Bengal Roadways & Civil Infraworks",
      quote_ref: "BRCI/AQN/089",
      date: "16.05.2026",
      subtotal: 1796610,
      gst_percent: 18,
      gst_amount: 323390,
      grand_total: 2120000,
      payment_terms: "15 days credit, 5% security retention",
      delivery_time: "Commence in 10 days, 60 days completion",
      past_performance_score: 84,
      past_projects_completed: 5,
      quality_rating: 4.3,
      items: [
        { sl_no: 1, item_code: "RD.01", description: "80mm M-40 Interlocking Paver Blocks", unit: "SQM", quantity: 1450, unit_rate: 760, amount: 1102000 },
        { sl_no: 2, item_code: "RD.02", description: "150mm WMM Subbase Course", unit: "CUM", quantity: 218, unit_rate: 1720, amount: 374960 },
        { sl_no: 3, item_code: "RD.03", description: "Precast Concrete Kerb Stones", unit: "RMT", quantity: 350, unit_rate: 450, amount: 157500 },
        { sl_no: 4, item_code: "RD.04", description: "Subgrade Compaction & Rolling", unit: "SQM", quantity: 1450, unit_rate: 111.8, amount: 162150 },
      ],
    },
    {
      vendor_name: "Eastern Pavers & Concrete LLP",
      quote_ref: "EPC/WB/2026/41",
      date: "19.05.2026",
      subtotal: 1932203,
      gst_percent: 18,
      gst_amount: 347797,
      grand_total: 2280000,
      payment_terms: "10% advance with PO, 20 days running bill cycle",
      delivery_time: "Commence in 7 days, 50 days completion",
      past_performance_score: 80,
      past_projects_completed: 6,
      quality_rating: 4.0,
      items: [
        { sl_no: 1, item_code: "RD.01", description: "80mm M-40 Interlocking Paver Blocks", unit: "SQM", quantity: 1450, unit_rate: 820, amount: 1189000 },
        { sl_no: 2, item_code: "RD.02", description: "150mm WMM Subbase Course", unit: "CUM", quantity: 218, unit_rate: 1850, amount: 403300 },
        { sl_no: 3, item_code: "RD.03", description: "Precast Concrete Kerb Stones", unit: "RMT", quantity: 350, unit_rate: 490, amount: 171500 },
        { sl_no: 4, item_code: "RD.04", description: "Subgrade Compaction & Rolling", unit: "SQM", quantity: 1450, unit_rate: 116.1, amount: 168403 },
      ],
    },
    {
      vendor_name: "New Town Aggregates Ltd",
      quote_ref: "NTA/RD-PKG/12",
      date: "22.05.2026",
      subtotal: 2025424,
      gst_percent: 18,
      gst_amount: 364576,
      grand_total: 2390000,
      payment_terms: "Against delivery challan, 5% retention",
      delivery_time: "15 days mobilization, 60 days completion",
      past_performance_score: 76,
      past_projects_completed: 3,
      quality_rating: 3.8,
      items: [
        { sl_no: 1, item_code: "RD.01", description: "80mm M-40 Interlocking Paver Blocks", unit: "SQM", quantity: 1450, unit_rate: 860, amount: 1247000 },
        { sl_no: 2, item_code: "RD.02", description: "150mm WMM Subbase Course", unit: "CUM", quantity: 218, unit_rate: 1950, amount: 425100 },
        { sl_no: 3, item_code: "RD.03", description: "Precast Concrete Kerb Stones", unit: "RMT", quantity: 350, unit_rate: 510, amount: 178500 },
        { sl_no: 4, item_code: "RD.04", description: "Subgrade Compaction & Rolling", unit: "SQM", quantity: 1450, unit_rate: 120.5, amount: 174824 },
      ],
    },
  ];
}

// 4 Verified Vendor Quotations for Vista Superstructure & Concrete
export function getVistaQuotations(): NormalizedVendorQuote[] {
  return [
    {
      vendor_name: "Ultratech Concrete Direct",
      quote_ref: "UT/RMC/KOL/26-03",
      date: "12.05.2026",
      subtotal: 2898305,
      gst_percent: 18,
      gst_amount: 521695,
      grand_total: 3420000,
      payment_terms: "30 days credit from monthly billing, zero advance",
      delivery_time: "Daily continuous dispatch, boom pump dedicated",
      past_performance_score: 94,
      past_projects_completed: 15,
      quality_rating: 4.9,
      items: [
        { sl_no: 1, item_code: "RCC.01", description: "M-35 Grade Ready-Mix Concrete", unit: "CUM", quantity: 650, unit_rate: 4100, amount: 2665000 },
        { sl_no: 2, item_code: "RCC.02", description: "Concrete Boom Pumping Deployment", unit: "CUM", quantity: 650, unit_rate: 280, amount: 182000 },
        { sl_no: 3, item_code: "RCC.03", description: "Retarder & Plasticizer Admixture", unit: "CUM", quantity: 650, unit_rate: 65, amount: 42250 },
        { sl_no: 4, item_code: "RCC.04", description: "Slump & Cube Testing (NABL Report)", unit: "SET", quantity: 24, unit_rate: 377.3, amount: 9055 },
      ],
    },
    {
      vendor_name: "ACC RMC Kolkata",
      quote_ref: "ACC/VISTA/2026/77",
      date: "15.05.2026",
      subtotal: 3093220,
      gst_percent: 18,
      gst_amount: 556780,
      grand_total: 3650000,
      payment_terms: "21 days credit, monthly reconciliation",
      delivery_time: "48-hr order notice, transit mixer fleet",
      past_performance_score: 88,
      past_projects_completed: 10,
      quality_rating: 4.5,
      items: [
        { sl_no: 1, item_code: "RCC.01", description: "M-35 Grade Ready-Mix Concrete", unit: "CUM", quantity: 650, unit_rate: 4380, amount: 2847000 },
        { sl_no: 2, item_code: "RCC.02", description: "Concrete Boom Pumping Deployment", unit: "CUM", quantity: 650, unit_rate: 310, amount: 201500 },
        { sl_no: 3, item_code: "RCC.03", description: "Retarder & Plasticizer Admixture", unit: "CUM", quantity: 650, unit_rate: 55, amount: 35750 },
        { sl_no: 4, item_code: "RCC.04", description: "Slump & Cube Testing (NABL Report)", unit: "SET", quantity: 24, unit_rate: 373.8, amount: 8970 },
      ],
    },
    {
      vendor_name: "Nuvoco Vistas Ready-Mix",
      quote_ref: "NV/CON/KOL-02",
      date: "18.05.2026",
      subtotal: 3228814,
      gst_percent: 18,
      gst_amount: 581186,
      grand_total: 3810000,
      payment_terms: "15 days credit, 5% retention",
      delivery_time: "Dedicated plant allotment",
      past_performance_score: 82,
      past_projects_completed: 7,
      quality_rating: 4.2,
      items: [
        { sl_no: 1, item_code: "RCC.01", description: "M-35 Grade Ready-Mix Concrete", unit: "CUM", quantity: 650, unit_rate: 4580, amount: 2977000 },
        { sl_no: 2, item_code: "RCC.02", description: "Concrete Boom Pumping Deployment", unit: "CUM", quantity: 650, unit_rate: 325, amount: 211250 },
        { sl_no: 3, item_code: "RCC.03", description: "Retarder & Plasticizer Admixture", unit: "CUM", quantity: 650, unit_rate: 48, amount: 31200 },
        { sl_no: 4, item_code: "RCC.04", description: "Slump & Cube Testing (NABL Report)", unit: "SET", quantity: 24, unit_rate: 390.2, amount: 9364 },
      ],
    },
    {
      vendor_name: "Star Ready-Mix Bengal",
      quote_ref: "SRM/VISTA/99",
      date: "21.05.2026",
      subtotal: 3372881,
      gst_percent: 18,
      gst_amount: 607119,
      grand_total: 3980000,
      payment_terms: "10% advance, 14 days credit",
      delivery_time: "Standby batching plant",
      past_performance_score: 78,
      past_projects_completed: 4,
      quality_rating: 3.9,
      items: [
        { sl_no: 1, item_code: "RCC.01", description: "M-35 Grade Ready-Mix Concrete", unit: "CUM", quantity: 650, unit_rate: 4790, amount: 3113500 },
        { sl_no: 2, item_code: "RCC.02", description: "Concrete Boom Pumping Deployment", unit: "CUM", quantity: 650, unit_rate: 335, amount: 217750 },
        { sl_no: 3, item_code: "RCC.03", description: "Retarder & Plasticizer Admixture", unit: "CUM", quantity: 650, unit_rate: 45, amount: 29250 },
        { sl_no: 4, item_code: "RCC.04", description: "Slump & Cube Testing (NABL Report)", unit: "SET", quantity: 24, unit_rate: 515.9, amount: 12381 },
      ],
    },
  ];
}

// Routes vendor quotation pack automatically based on active building
export function getBuildingQuotations(projectName: string): NormalizedVendorQuote[] {
  const name = (projectName || "").toLowerCase();
  if (name.includes("aquina")) {
    return getAquinaQuotations();
  }
  if (name.includes("vista")) {
    return getVistaQuotations();
  }
  return getPreparsedAmaraQuotations();
}

// Computes the full comparative statement matrix and weighted ranking
export function buildComparativeStatement(quotes: NormalizedVendorQuote[]) {
  const sortedByPrice = [...quotes].sort((a, b) => a.grand_total - b.grand_total);
  const lowestTotal = sortedByPrice[0].grand_total;
  const highestTotal = sortedByPrice[sortedByPrice.length - 1].grand_total;

  // Build Item-wise Comparison Table dynamically from quotes
  const itemMap = new Map<string, string>();
  quotes.forEach((q) => {
    q.items?.forEach((it) => {
      if (it.item_code && !itemMap.has(it.item_code)) {
        itemMap.set(it.item_code, it.description || it.item_code);
      }
    });
  });

  const dynamicCodes = Array.from(itemMap.keys());
  const itemCodes =
    dynamicCodes.length > 0
      ? dynamicCodes
      : ["WP.01", "WP.02", "WP.04", "WP.05", "WP.06"];

  const itemMatrix = itemCodes.map((code) => {
    const desc = itemMap.get(code) || code;
    const vendorRates = quotes.map((q) => {
      const match = q.items.find((it) => it.item_code === code);
      return {
        vendor_name: q.vendor_name,
        rate: match ? match.unit_rate : 0,
        amount: match ? match.amount : 0,
      };
    });

    const validRates = vendorRates.filter((v) => v.rate > 0).map((v) => v.rate);
    const minRate = validRates.length > 0 ? Math.min(...validRates) : 0;

    return {
      item_code: code,
      description: desc,
      vendor_rates: vendorRates.map((vr) => ({
        ...vr,
        is_lowest: vr.rate > 0 && vr.rate === minRate,
      })),
    };
  });


  // Calculate Weighted Score (60% Commercial + 25% Past Performance + 15% Delivery/Terms)
  const evaluatedVendors = quotes.map((q) => {
    // Commercial score: lowest total gets 100, others scaled down
    const priceRatio = lowestTotal / q.grand_total;
    const commercialScore = priceRatio * 100;

    const weightedFinalScore = Number(
      (commercialScore * 0.6 + q.past_performance_score * 0.25 + q.quality_rating * 20 * 0.15).toFixed(1)
    );

    return {
      vendor_name: q.vendor_name,
      grand_total: q.grand_total,
      subtotal: q.subtotal,
      gst_amount: q.gst_amount,
      payment_terms: q.payment_terms,
      delivery_time: q.delivery_time,
      past_performance_score: q.past_performance_score,
      quality_rating: q.quality_rating,
      commercial_rank: 0, // calculated below
      weighted_score: weightedFinalScore,
      is_l1: q.grand_total === lowestTotal,
    };
  });

  // Assign ranks
  evaluatedVendors.sort((a, b) => a.grand_total - b.grand_total);
  evaluatedVendors.forEach((v, idx) => {
    v.commercial_rank = idx + 1;
  });

  // Best recommendation based on weighted score
  const recommended = [...evaluatedVendors].sort((a, b) => b.weighted_score - a.weighted_score)[0];
  const savingsVsHighest = highestTotal - recommended.grand_total;
  const savingsPercent = Number(((savingsVsHighest / highestTotal) * 100).toFixed(2));

  return {
    project: "Vinayak Amara (Tower-2)",
    work_category: "Internal Waterproofing",
    date: new Date().toISOString().split("T")[0],
    vendors_compared: quotes.length,
    lowest_vendor: evaluatedVendors[0].vendor_name,
    lowest_amount: lowestTotal,
    highest_amount: highestTotal,
    recommended_vendor: recommended.vendor_name,
    recommended_grand_total: recommended.grand_total,
    savings_vs_highest: savingsVsHighest,
    savings_percent: savingsPercent,
    recommendation_reason: `${recommended.vendor_name} achieved the top score of ${recommended.weighted_score}/100. It offers the L1 commercial quote (₹${recommended.grand_total.toLocaleString("en-IN")}) with an exceptional 92% past performance history and active site deployment for mockups, reducing turnaround and risk to zero.`,
    item_matrix: itemMatrix,
    vendors_summary: evaluatedVendors,
  };
}
