import { SST_RATES } from "../data/seedData";

// ─── FORMATTING ──────────────────────────────────────────────────────────────
export const fmtRM = n =>
  "RM " + Number(n).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fmtK = n =>
  n >= 1000 ? "RM " + (n / 1000).toFixed(1) + "k" : fmtRM(n);

export const fmtDate = iso =>
  iso ? new Date(iso).toLocaleDateString("en-MY", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// ─── SST ─────────────────────────────────────────────────────────────────────
export const getSSTRate  = code => SST_RATES.find(r => r.code === code)?.rate ?? 0;
export const getSSTLabel = code => SST_RATES.find(r => r.code === code)?.label ?? code;

// ─── INVOICE CALCULATION ─────────────────────────────────────────────────────
export function calcLines(items = []) {
  let subtotal = 0, sstTotal = 0;
  const rows = items.map(it => {
    const qty       = parseFloat(it.qty)       || 0;
    const unitPrice = parseFloat(it.unitPrice) || 0;
    const lineAmt   = qty * unitPrice;
    const lineSst   = lineAmt * getSSTRate(it.sstCode || "EX");
    subtotal  += lineAmt;
    sstTotal  += lineSst;
    return { ...it, qty, unitPrice, lineAmt, lineSst };
  });
  return { rows, subtotal, sstTotal, total: subtotal + sstTotal };
}

// ─── AGING ───────────────────────────────────────────────────────────────────
export const TODAY_DATE = new Date("2026-04-13");

export function daysDiff(dueDate) {
  if (!dueDate) return 0;
  return Math.floor((TODAY_DATE - new Date(dueDate)) / 86400000);
}

export function getBucket(daysOverdue) {
  if (daysOverdue <   0) return "current";
  if (daysOverdue <=  30) return "b1_30";
  if (daysOverdue <=  60) return "b31_60";
  if (daysOverdue <=  90) return "b61_90";
  if (daysOverdue <= 120) return "b91_120";
  return "b120plus";
}

// ─── ID GENERATOR ────────────────────────────────────────────────────────────
export const nextId = (prefix, list) =>
  `${prefix}-${String(list.length + 1).padStart(3, "0")}`;

// ─── DATE HELPERS ────────────────────────────────────────────────────────────
export const todayStr = () => new Date().toISOString().slice(0, 10);
