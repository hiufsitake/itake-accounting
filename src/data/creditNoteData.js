// ─── CREDIT / DEBIT NOTE SEED DATA & CONSTANTS ───────────────────────────────

export const CN_REASONS = [
  "Pricing Error",
  "Goods Returned",
  "Service Not Rendered",
  "Duplicate Invoice",
  "Discount Granted",
  "Quantity Adjustment",
  "Cancelled Order",
  "Other",
];

export const DN_REASONS = [
  "Additional Charges",
  "Price Increase",
  "Underbilling",
  "Additional Services",
  "Interest on Overdue",
  "Short Delivery Correction",
  "Other",
];

export const INITIAL_CNS = [
  { id:"CN-2026-001", date:"2026-04-03", invoiceRef:"INV-2026-003", customerId:"CUST-003", customerName:"TechNova Pte Ltd",       reason:"Pricing Error",    description:"Correction of hourly rate: billed RM180 should be RM160 for 10 hours", amount:200.00,  sst:12.00, total:212.00,  status:"issued", einv:"MYINVOIS-CN-A1B2" },
  { id:"CN-2026-002", date:"2026-04-08", invoiceRef:"INV-2026-004", customerId:"CUST-005", customerName:"Mega Retail Group Bhd", reason:"Discount Granted", description:"Loyalty discount 5% on annual licence fee",                               amount:1100.00, sst:66.00, total:1166.00, status:"draft",  einv:null                },
];

export const INITIAL_DNS = [
  { id:"DN-2026-001", date:"2026-04-05", invoiceRef:"INV-2026-002", customerId:"CUST-002", customerName:"Blue Horizon Sdn Bhd",  reason:"Additional Services", description:"Additional customisation hours not in original scope: 5hrs × RM200",   amount:1000.00, sst:60.00, total:1060.00, status:"issued", einv:"MYINVOIS-DN-C3D4" },
];
