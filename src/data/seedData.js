export const TODAY = "2026-04-13";

const daysAgo = n => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
};
const daysAhead = n => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

// ─── COMPANIES ────────────────────────────────────────────────────────────────
export const COMPANIES = [
  {
    id:        "ISOL",
    name:      "iTake Solutions Sdn Bhd",
    shortName: "iTake Solutions",
    reg:       "202101234567 (1234567-S)",
    sst:       "W10-2345-32001234",
    tin:       "C1234567890",
    address:   "Unit 5-1, Menara iTake, Jalan Ampang,\n50450 Kuala Lumpur, Malaysia",
    phone:     "+603-2345 6789",
    email:     "billing@itake.com.my",
    bank:      "Maybank | 5642 1234 5678",
    color:     "#3b82f6",
  },
  {
    id:        "IOPT",
    name:      "iTake Optimization Sdn Bhd",
    shortName: "iTake Optimization",
    reg:       "202201345678 (2345678-O)",
    sst:       "W10-3456-32002345",
    tin:       "C2345678901",
    address:   "Unit 5-2, Menara iTake, Jalan Ampang,\n50450 Kuala Lumpur, Malaysia",
    phone:     "+603-2345 6790",
    email:     "billing@itakeopt.com.my",
    bank:      "CIMB Bank | 8001 2345 6789",
    color:     "#8b5cf6",
  },
  {
    id:        "IENR",
    name:      "iTake Energy Sdn Bhd",
    shortName: "iTake Energy",
    reg:       "202301456789 (3456789-E)",
    sst:       "W10-4567-32003456",
    tin:       "C3456789012",
    address:   "Unit 5-3, Menara iTake, Jalan Ampang,\n50450 Kuala Lumpur, Malaysia",
    phone:     "+603-2345 6791",
    email:     "billing@itakeenergy.com.my",
    bank:      "RHB Bank | 2122 3456 7890",
    color:     "#f59e0b",
  },
];

export const SST_RATES = [
  { code: "S6",   label: "Service Tax 6%",     rate: 0.06 },
  { code: "ST10", label: "Sales Tax 10%",       rate: 0.10 },
  { code: "ST5",  label: "Sales Tax 5%",        rate: 0.05 },
  { code: "EX",   label: "SST Exempt",          rate: 0    },
  { code: "ZR",   label: "Zero-rated (Export)", rate: 0    },
  { code: "OS",   label: "Out of Scope",        rate: 0    },
];

// ─── SHARED MASTER DATA ───────────────────────────────────────────────────────
export const INITIAL_CUSTOMERS = [
  { id: "CUST-001", name: "Alchemy Corp Sdn Bhd",       tin: "C2584719200", reg: "9876543-B", sst: "W10-9876-32009876", address: "Level 8, Tower B, KL Eco City,\nNo. 3, Jalan Bangsar, 59200 Kuala Lumpur", creditLimit: 50000,  paymentTerms: 30 },
  { id: "CUST-002", name: "Blue Horizon Sdn Bhd",        tin: "C3810029100", reg: "2345678-B", sst: "",                  address: "No. 45, Jalan PJU 1A/3,\nAra Damansara, 47301 Petaling Jaya, Selangor",    creditLimit: 30000,  paymentTerms: 30 },
  { id: "CUST-003", name: "TechNova Pte Ltd",            tin: "C9910023000", reg: "3456789-C", sst: "W10-1234-32001111", address: "18 Raffles Quay, #30-01\nSingapore 048582",                                   creditLimit: 80000,  paymentTerms: 60 },
  { id: "CUST-004", name: "Green Earth Trading",         tin: "",            reg: "4567890-D", sst: "",                  address: "Lot 3, Jalan Industri,\n68000 Ampang, Selangor",                               creditLimit: 10000,  paymentTerms: 30 },
  { id: "CUST-005", name: "Mega Retail Group Bhd",       tin: "C5500112200", reg: "5678901-E", sst: "W10-5678-32005678", address: "Lot 10, Jalan Semarak,\n50450 Kuala Lumpur",                                   creditLimit: 100000, paymentTerms: 45 },
  { id: "CUST-006", name: "Sunrise Logistics Sdn Bhd",   tin: "C6601223300", reg: "6789012-F", sst: "",                  address: "No. 22, Jalan Kilang,\n41150 Klang, Selangor",                                 creditLimit: 25000,  paymentTerms: 30 },
  { id: "CUST-007", name: "Pinnacle Ventures Sdn Bhd",   tin: "C7702334400", reg: "7890123-G", sst: "W10-7890-32007890", address: "Suite 18-8, Menara Pinnacle,\nJalan P. Ramlee, 50250 Kuala Lumpur",            creditLimit: 150000, paymentTerms: 60 },
];

export const INITIAL_SUPPLIERS = [
  { id: "SUPP-001", name: "AWS (Amazon Web Services)",   tin: "NA",          reg: "Foreign",   address: "410 Terry Ave N, Seattle, WA 98109, USA",           paymentTerms: 30 },
  { id: "SUPP-002", name: "JLL Properties Sdn Bhd",      tin: "C1100293000", reg: "1029384-A", address: "Level 26, Menara IMC, Jalan Sultan Ismail, KL",      paymentTerms: 30 },
  { id: "SUPP-003", name: "Percetakan Nasional Bhd",     tin: "C2200384000", reg: "2038475-B", address: "Jalan Chan Sow Lin, 55554 Kuala Lumpur",             paymentTerms: 14 },
  { id: "SUPP-004", name: "Telekom Malaysia Bhd",        tin: "C3300475000", reg: "128740-A",  address: "Level 51, North Wing, Menara TM, Jalan Pantai Baru", paymentTerms: 30 },
  { id: "SUPP-005", name: "Meta Ads (Facebook)",         tin: "NA",          reg: "Foreign",   address: "1 Hacker Way, Menlo Park, CA 94025, USA",            paymentTerms: 30 },
  { id: "SUPP-006", name: "Computech Supplies Sdn Bhd",  tin: "C4400566000", reg: "3047586-C", address: "No. 8, Jalan Teknologi, Taman Sains Selangor",        paymentTerms: 30 },
  { id: "SUPP-007", name: "Lim & Partners (Audit)",      tin: "C5500657000", reg: "4058697-D", address: "Unit 9-1, Wisma Lim, Jalan Ampang, 50450 KL",        paymentTerms: 30 },
];

// ─── iTAKE SOLUTIONS SEED DATA ────────────────────────────────────────────────
const ISOL_DOS = [
  {
    id: "DO-2026-001", date: "2026-04-01", deliveryDate: "2026-04-01",
    status: "invoiced", invoiceRef: "INV-2026-001", customerId: "CUST-001",
    deliverTo: "Warehouse A, Basement 2, KL Eco City",
    items: [
      { desc: "Dell Laptop XPS 15",          partNo: "DELL-XPS-15", qty: 5,  unit: "unit", unitPrice: 5800, sstCode: "ST10" },
      { desc: "Wireless Mouse Logitech MX3", partNo: "LOG-MX3-BK",  qty: 10, unit: "unit", unitPrice: 180,  sstCode: "ST10" },
    ],
    receivedBy: "Ahmad Fauzi", receivedDate: "2026-04-01", signature: true, remarks: "All items received in good condition.",
  },
  {
    id: "DO-2026-002", date: "2026-04-05", deliveryDate: "2026-04-07",
    status: "delivered", invoiceRef: null, customerId: "CUST-002",
    deliverTo: "Main Office, Level 3",
    items: [
      { desc: "Ergonomic Office Chair", partNo: "CHAIR-ERG-BK", qty: 20, unit: "unit", unitPrice: 680,  sstCode: "ST10" },
      { desc: "Standing Desk 180cm",    partNo: "DESK-STD-180",  qty: 5,  unit: "unit", unitPrice: 1480, sstCode: "ST10" },
    ],
    receivedBy: "Siti Nurhaliza", receivedDate: "2026-04-07", signature: true, remarks: "",
  },
  {
    id: "DO-2026-003", date: "2026-04-10", deliveryDate: "",
    status: "pending", invoiceRef: null, customerId: "CUST-004",
    deliverTo: "Store Room, Ground Floor",
    items: [
      { desc: "Recycled Cardboard Boxes (Large)", partNo: "BOX-LG-RCY",  qty: 500, unit: "box",  unitPrice: 2.50, sstCode: "EX" },
      { desc: "Biodegradable Packaging Tape",     partNo: "TAPE-BIO-50", qty: 100, unit: "roll", unitPrice: 4.80, sstCode: "EX" },
    ],
    receivedBy: "", receivedDate: "", signature: false, remarks: "",
  },
];

const ISOL_INVOICES = [
  {
    id: "INV-2026-001", date: "2026-04-01", due: daysAhead(17),
    status: "paid", doRef: "DO-2026-001", customerId: "CUST-001",
    items: [
      { desc: "Dell Laptop XPS 15",          partNo: "DELL-XPS-15", qty: 5,  unit: "unit", unitPrice: 5800, sstCode: "ST10" },
      { desc: "Wireless Mouse Logitech MX3", partNo: "LOG-MX3-BK",  qty: 10, unit: "unit", unitPrice: 180,  sstCode: "ST10" },
    ],
    notes: "Payment received via bank transfer. Thank you.",
    uin: "UIN-884421", einv: "MYINVOIS-A1B2C3D4",
  },
  {
    id: "INV-2026-002", date: "2026-04-05", due: daysAhead(22),
    status: "pending", doRef: null, customerId: "CUST-002",
    items: [
      { desc: "Payroll Processing Module", partNo: "SW-PAY-001", qty: 1, unit: "module",  unitPrice: 3800, sstCode: "S6" },
      { desc: "Data Migration (one-time)",  partNo: "SVC-MIG-01", qty: 1, unit: "service", unitPrice: 650,  sstCode: "EX" },
    ],
    notes: "Payment due within 30 days.", uin: null, einv: null,
  },
  {
    id: "INV-2026-003", date: "2026-03-28", due: daysAgo(15),
    status: "overdue", doRef: null, customerId: "CUST-003",
    items: [
      { desc: "ERP Integration Consulting", partNo: "SVC-ERP-HR", qty: 40, unit: "hour",   unitPrice: 180, sstCode: "S6" },
      { desc: "Custom Report Development",  partNo: "SVC-RPT-01", qty: 5,  unit: "report", unitPrice: 200, sstCode: "S6" },
    ],
    notes: "OVERDUE — please remit immediately.",
    uin: "UIN-771334", einv: "MYINVOIS-D4E5F6G7",
  },
  {
    id: "INV-2026-004", date: daysAgo(65), due: daysAgo(35),
    status: "overdue", doRef: null, customerId: "CUST-005",
    items: [
      { desc: "Annual Software Licence (Enterprise)", partNo: "LIC-ENT-2026", qty: 1, unit: "year", unitPrice: 22000, sstCode: "S6" },
    ],
    notes: "Second notice — payment 35 days overdue.", uin: "UIN-662230", einv: "MYINVOIS-E5F6G7H8",
  },
  {
    id: "INV-2026-005", date: daysAgo(145), due: daysAgo(115),
    status: "overdue", doRef: null, customerId: "CUST-007",
    items: [
      { desc: "System Implementation (Phase 1)", partNo: "SVC-IMP-P1", qty: 1, unit: "project", unitPrice: 35000, sstCode: "S6" },
    ],
    notes: "Final notice — legal action may be initiated.", uin: "UIN-551119", einv: "MYINVOIS-F6G7H8I9",
  },
];

const ISOL_BILLS = [
  { id: "BILL-2026-001", supplierId: "SUPP-001", date: "2026-04-01", due: daysAhead(17), amount: 1890.00, paid: 1890.00, desc: "AWS Cloud Services (Mar 2026)" },
  { id: "BILL-2026-002", supplierId: "SUPP-002", date: "2026-04-01", due: daysAhead(5),  amount: 3500.00, paid: 0,       desc: "Office Rental (Apr 2026)" },
  { id: "BILL-2026-003", supplierId: "SUPP-003", date: "2026-03-10", due: daysAgo(8),    amount: 670.00,  paid: 0,       desc: "Printing & Stationery" },
  { id: "BILL-2026-004", supplierId: "SUPP-004", date: "2026-02-28", due: daysAgo(40),   amount: 420.00,  paid: 0,       desc: "TM Unifi Business (Feb)" },
  { id: "BILL-2026-005", supplierId: "SUPP-005", date: "2026-02-01", due: daysAgo(72),   amount: 1200.00, paid: 600.00,  desc: "Facebook Ads (Jan–Feb)" },
  { id: "BILL-2026-006", supplierId: "SUPP-006", date: "2025-12-15", due: daysAgo(110),  amount: 4800.00, paid: 0,       desc: "IT Equipment Supplies" },
  { id: "BILL-2026-007", supplierId: "SUPP-007", date: "2025-11-01", due: daysAgo(155),  amount: 8000.00, paid: 4000.00, desc: "Annual Audit Fee FY2025" },
];

// ─── iTAKE OPTIMIZATION SEED DATA ────────────────────────────────────────────
const IOPT_INVOICES = [
  {
    id: "INV-2026-001", date: "2026-04-02", due: daysAhead(20),
    status: "pending", doRef: null, customerId: "CUST-003",
    items: [
      { desc: "Business Process Optimization (Phase 1)", partNo: "SVC-OPT-01", qty: 1, unit: "project", unitPrice: 18000, sstCode: "S6" },
    ],
    notes: "Payment due within 30 days.", uin: null, einv: null,
  },
  {
    id: "INV-2026-002", date: "2026-03-15", due: daysAgo(28),
    status: "overdue", doRef: null, customerId: "CUST-005",
    items: [
      { desc: "Supply Chain Optimization Consulting", partNo: "SVC-SCO-01", qty: 20, unit: "hour", unitPrice: 250, sstCode: "S6" },
    ],
    notes: "Payment overdue. Please remit immediately.", uin: "UIN-334411", einv: "MYINVOIS-B2C3D4E5",
  },
];

const IOPT_BILLS = [
  { id: "BILL-2026-001", supplierId: "SUPP-002", date: "2026-04-01", due: daysAhead(5),  amount: 2800.00, paid: 0,       desc: "Office Rental (Apr 2026)" },
  { id: "BILL-2026-002", supplierId: "SUPP-007", date: "2025-11-01", due: daysAgo(155),  amount: 6000.00, paid: 3000.00, desc: "Annual Audit Fee FY2025" },
];

// ─── iTAKE ENERGY SEED DATA ───────────────────────────────────────────────────
const IENR_INVOICES = [
  {
    id: "INV-2026-001", date: "2026-04-08", due: daysAhead(15),
    status: "pending", doRef: null, customerId: "CUST-004",
    items: [
      { desc: "Solar Panel Installation & Commissioning", partNo: "ENR-SOL-01", qty: 1, unit: "project", unitPrice: 45000, sstCode: "EX" },
    ],
    notes: "Payment due within 30 days.", uin: null, einv: null,
  },
  {
    id: "INV-2026-002", date: "2026-04-01", due: daysAhead(8),
    status: "paid", doRef: null, customerId: "CUST-006",
    items: [
      { desc: "Energy Audit & Report", partNo: "ENR-AUD-01", qty: 1, unit: "report", unitPrice: 8500, sstCode: "S6" },
    ],
    notes: "Thank you for your payment.", uin: "UIN-445522", einv: "MYINVOIS-C3D4E5F6",
  },
];

const IENR_BILLS = [
  { id: "BILL-2026-001", supplierId: "SUPP-002", date: "2026-04-01", due: daysAhead(5),  amount: 3200.00, paid: 0,       desc: "Office Rental (Apr 2026)" },
  { id: "BILL-2026-002", supplierId: "SUPP-001", date: "2026-04-01", due: daysAhead(17), amount: 950.00,  paid: 950.00,  desc: "Cloud & IoT Services (Mar 2026)" },
];

// ─── COMPANY SEED MAP ─────────────────────────────────────────────────────────
export const COMPANY_SEED = {
  ISOL: { invoices: ISOL_INVOICES, dos: ISOL_DOS,  customers: INITIAL_CUSTOMERS, suppliers: INITIAL_SUPPLIERS, bills: ISOL_BILLS },
  IOPT: { invoices: IOPT_INVOICES, dos: [],         customers: INITIAL_CUSTOMERS, suppliers: INITIAL_SUPPLIERS, bills: IOPT_BILLS },
  IENR: { invoices: IENR_INVOICES, dos: [],         customers: INITIAL_CUSTOMERS, suppliers: INITIAL_SUPPLIERS, bills: IENR_BILLS },
};

// Legacy exports kept for backward compatibility with payroll/SST/voucher pages
export const INITIAL_DOS       = ISOL_DOS;
export const INITIAL_INVOICES  = ISOL_INVOICES;
export const INITIAL_BILLS     = ISOL_BILLS;
export const MY_COMPANY        = COMPANIES[0];
