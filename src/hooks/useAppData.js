import { useState, useCallback } from "react";
import { COMPANIES, COMPANY_SEED } from "../data/seedData";

export function useAppData(companyId) {
  const [store, setStore] = useState(() => ({
    ISOL: { ...COMPANY_SEED.ISOL },
    IOPT: { ...COMPANY_SEED.IOPT },
    IENR: { ...COMPANY_SEED.IENR },
  }));

  const upd = useCallback((field, fn) =>
    setStore(p => ({ ...p, [companyId]: { ...p[companyId], [field]: fn(p[companyId][field]) } })),
    [companyId]
  );

  // ── INVOICE ACTIONS ──────────────────────────────────────────────────────
  const addInvoice = useCallback(inv =>
    upd("invoices", p => [inv, ...p]), [upd]);

  const updateInvoice = useCallback((id, patch) =>
    upd("invoices", p => p.map(inv => inv.id === id ? { ...inv, ...patch } : inv)), [upd]);

  const submitToMyInvois = useCallback(id =>
    upd("invoices", p => p.map(inv =>
      inv.id === id
        ? { ...inv, status: inv.status === "draft" ? "pending" : inv.status,
            uin:  inv.uin  || "UIN-" + Math.floor(Math.random() * 900000 + 100000),
            einv: inv.einv || "MYINVOIS-" + Math.random().toString(36).slice(2, 10).toUpperCase() }
        : inv
    )), [upd]);

  const markInvoicePaid = useCallback(id =>
    upd("invoices", p => p.map(inv => inv.id === id ? { ...inv, status: "paid" } : inv)), [upd]);

  // ── DO ACTIONS ───────────────────────────────────────────────────────────
  const addDO = useCallback(doc =>
    upd("dos", p => [doc, ...p]), [upd]);

  const markDODelivered = useCallback((id, receivedBy = "Customer Rep") =>
    upd("dos", p => p.map(d =>
      d.id === id
        ? { ...d, status: "delivered", deliveryDate: "2026-04-13", receivedBy, receivedDate: "2026-04-13", signature: true }
        : d
    )), [upd]);

  const linkDOToInvoice = useCallback((doId, invoiceId) =>
    upd("dos", p => p.map(d =>
      d.id === doId ? { ...d, status: "invoiced", invoiceRef: invoiceId } : d
    )), [upd]);

  // ── CUSTOMER ACTIONS ─────────────────────────────────────────────────────
  const addCustomer = useCallback(c =>
    upd("customers", p => [...p, c]), [upd]);

  // ── BILL ACTIONS ─────────────────────────────────────────────────────────
  const addBill = useCallback(b =>
    upd("bills", p => [b, ...p]), [upd]);

  const markBillPaid = useCallback(id =>
    upd("bills", p => p.map(b => b.id === id ? { ...b, paid: b.amount } : b)), [upd]);

  // ── LOOKUPS ──────────────────────────────────────────────────────────────
  const d = store[companyId];

  const getCustomer = useCallback(id => d.customers.find(c => c.id === id), [d.customers]);
  const getSupplier = useCallback(id => d.suppliers.find(s => s.id === id), [d.suppliers]);
  const getDO       = useCallback(id => d.dos.find(doc => doc.id === id),   [d.dos]);

  return {
    company: COMPANIES.find(c => c.id === companyId),
    invoices: d.invoices, dos: d.dos, customers: d.customers, suppliers: d.suppliers, bills: d.bills,
    addInvoice, updateInvoice, submitToMyInvois, markInvoicePaid,
    addDO, markDODelivered, linkDOToInvoice,
    addCustomer,
    addBill, markBillPaid,
    getCustomer, getSupplier, getDO,
  };
}
