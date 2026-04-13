// ─── SST MANAGER DATA & CONSTANTS ────────────────────────────────────────────

export const SST_FILING_PERIODS = [
  { label:"Mar–Apr 2026", due:"31 May 2026",  status:"current"  },
  { label:"Jan–Feb 2026", due:"31 Mar 2026",  status:"overdue"  },
  { label:"Nov–Dec 2025", due:"31 Jan 2026",  status:"paid"     },
  { label:"Sep–Oct 2025", due:"30 Nov 2025",  status:"paid"     },
];

// SST classification codes (distinct from SST_RATES in seedData which are for invoice line items)
export const SST_CODES = [
  { code:"TX-S6",   desc:"Taxable Service (6%)",   rate:0.06, type:"service" },
  { code:"TX-G10",  desc:"Taxable Goods (10%)",     rate:0.10, type:"goods"   },
  { code:"TX-G5",   desc:"Taxable Goods (5%)",      rate:0.05, type:"goods"   },
  { code:"EX",      desc:"Exempt Supply",           rate:0,    type:"exempt"  },
  { code:"ZR",      desc:"Zero-rated (Export)",     rate:0,    type:"zero"    },
  { code:"OS",      desc:"Out of Scope",            rate:0,    type:"oos"     },
];

export const INITIAL_SST_RETURNS = [
  { period:"Nov–Dec 2025", due:"31 Jan 2026",  output:6200,  input:980,  net:5220, status:"paid",    ref:"SST-2025-006", paidDate:"2026-01-28" },
  { period:"Jan–Feb 2026", due:"31 Mar 2026",  output:5850,  input:1100, net:4750, status:"overdue", ref:"SST-2026-001", paidDate:null         },
  { period:"Mar–Apr 2026", due:"31 May 2026",  output:7680,  input:1230, net:6450, status:"current", ref:"SST-2026-002", paidDate:null         },
];
