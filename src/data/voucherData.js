// ─── PAYMENT & RECEIPT VOUCHER SEED DATA ────────────────────────────────────

export const PAYMENT_METHODS = [
  "Cheque",
  "Bank Transfer (IBG)",
  "Bank Transfer (RENTAS)",
  "Cash",
  "Online Banking",
  "TT (Telegraphic Transfer)",
];

export const ACCOUNTS = [
  "1000 - Cash at Bank (Maybank)",
  "1010 - Petty Cash",
  "2000 - Accounts Payable",
  "5100 - Staff Costs",
  "5200 - Office Rental",
  "5300 - Utilities",
  "5400 - Marketing",
  "5600 - Professional Fees",
];

export const INITIAL_PVS = [
  { id:"PV-2026-001", date:"2026-04-01", payee:"JLL Properties Sdn Bhd",    payeeType:"supplier", supplierId:"SUPP-002", method:"Bank Transfer (IBG)",    chequeNo:"", bankRef:"IBG240401001",    amount:3500.00, description:"Office Rental - April 2026",          account:"5200 - Office Rental",     billRef:"BILL-2026-002", preparedBy:"Ahmad Razali",      approvedBy:"Mohd Haziq", status:"approved", paid:true  },
  { id:"PV-2026-002", date:"2026-04-02", payee:"AWS (Amazon Web Services)",  payeeType:"supplier", supplierId:"SUPP-001", method:"Bank Transfer (RENTAS)", chequeNo:"", bankRef:"RENTAS240402001", amount:1890.00, description:"AWS Cloud Services - Mar 2026",        account:"5300 - Utilities",         billRef:"BILL-2026-001", preparedBy:"Siti Aisyah",       approvedBy:"Mohd Haziq", status:"approved", paid:true  },
  { id:"PV-2026-003", date:"2026-04-05", payee:"Meta Ads (Facebook)",        payeeType:"supplier", supplierId:"SUPP-005", method:"Bank Transfer (IBG)",    chequeNo:"", bankRef:"",               amount:600.00,  description:"Facebook Ads Balance - Feb 2026",     account:"5400 - Marketing",         billRef:"BILL-2026-005", preparedBy:"Priya Subramaniam", approvedBy:"",          status:"pending",  paid:false },
  { id:"PV-2026-004", date:"2026-04-08", payee:"Petty Cash Replenishment",   payeeType:"other",    supplierId:"",         method:"Cash",                  chequeNo:"", bankRef:"",               amount:350.00,  description:"Petty Cash Top-up April 2026",        account:"1010 - Petty Cash",        billRef:"",              preparedBy:"Siti Aisyah",       approvedBy:"Mohd Haziq", status:"approved", paid:true  },
  { id:"PV-2026-005", date:"2026-04-10", payee:"Lim & Partners (Audit)",     payeeType:"supplier", supplierId:"SUPP-007", method:"Cheque",                chequeNo:"MBB 012345", bankRef:"",    amount:4000.00, description:"Partial Payment - Audit Fee FY2025",  account:"5600 - Professional Fees", billRef:"BILL-2026-007", preparedBy:"Ahmad Razali",      approvedBy:"Mohd Haziq", status:"approved", paid:true  },
];

export const INITIAL_RVS = [
  { id:"RV-2026-001", date:"2026-04-01", receivedFrom:"Alchemy Corp Sdn Bhd",  customerId:"CUST-001", method:"Bank Transfer (IBG)",    chequeNo:"", bankRef:"IBG-ALCHEM-001",  amount:11275.40, description:"Full Payment - INV-2026-001",    invoiceRef:"INV-2026-001", receivedBy:"Siti Aisyah",  status:"confirmed" },
  { id:"RV-2026-002", date:"2026-04-07", receivedFrom:"TechNova Pte Ltd",      customerId:"CUST-003", method:"Bank Transfer (RENTAS)", chequeNo:"", bankRef:"",                amount:4100.00,  description:"Partial Payment - INV-2026-003", invoiceRef:"INV-2026-003", receivedBy:"Ahmad Razali", status:"confirmed" },
  { id:"RV-2026-003", date:"2026-04-09", receivedFrom:"Mega Retail Group Bhd", customerId:"CUST-005", method:"Cheque",                chequeNo:"CIMB 887766", bankRef:"", amount:10000.00, description:"Partial Payment - INV-2026-004", invoiceRef:"INV-2026-004", receivedBy:"Siti Aisyah",  status:"pending"   },
];
