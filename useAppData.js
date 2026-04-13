import { useState, useCallback } from "react";
import {
  INITIAL_INVOICES,
  INITIAL_DOS,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_BILLS,
} from "../data/seedData";

// ─── GLOBAL STATE HOOK ───────────────────────────────────────────────────────
// Every module imports this hook to read/write shared data.
// This ensures Invoices, Aging, Dashboard all see the same records.

export function useAppData() {
  const [invoices,   setInvoices]   = useState(INITIAL_INVOICES);
  const [dos,        setDos]        = useState(INITIAL_DOS);
  const [customers,  setCustomers]  = useState(INITIAL_CUSTOMERS);
  const [suppliers,  setSuppliers]  = useState(INITIAL_SUPPLIERS);
  const [bills,      setBills]      = useState(INITIAL_BILLS);

  // ── INVOICE ACTIONS ──────────────────────────────────────────────────────
  const addInvoice = useCallback(inv => {
    setInvoices(p => [inv, ...p]);
  }, []);

  const updateInvoice = useCallback((id, patch) => {
    setInvoices(p => p.map(inv => inv.id === id ? { ...inv, ...patch } : inv));
  }, []);

  const submitToMyInvois = useCallback(id => {
    setInvoices(p => p.map(inv =>
      inv.id === id
        ? {
            ...inv,
            status: inv.status === "draft" ? "pending" : inv.status,
            uin:  inv.uin  || "UIN-" + Math.floor(Math.random() * 900000 + 100000),
            einv: inv.einv || "MYINVOIS-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
          }
        : inv
    ));
  }, []);

  const markInvoicePaid = useCallback(id => {
    setInvoices(p => p.map(inv => inv.id === id ? { ...inv, status: "paid" } : inv));
  }, []);

  // ── DO ACTIONS ───────────────────────────────────────────────────────────
  const addDO = useCallback(doc => {
    setDos(p => [doc, ...p]);
  }, []);

  const markDODelivered = useCallback((id, receivedBy = "Customer Rep") => {
    setDos(p => p.map(d =>
      d.id === id
        ? { ...d, status: "delivered", deliveryDate: "2026-04-13", receivedBy, receivedDate: "2026-04-13", signature: true }
        : d
    ));
  }, []);

  const linkDOToInvoice = useCallback((doId, invoiceId) => {
    setDos(p => p.map(d =>
      d.id === doId ? { ...d, status: "invoiced", invoiceRef: invoiceId } : d
    ));
  }, []);

  // ── CUSTOMER ACTIONS ─────────────────────────────────────────────────────
  const addCustomer = useCallback(c => {
    setCustomers(p => [...p, c]);
  }, []);

  // ── BILL ACTIONS ─────────────────────────────────────────────────────────
  const addBill = useCallback(b => {
    setBills(p => [b, ...p]);
  }, []);

  const markBillPaid = useCallback(id => {
    setBills(p => p.map(b => b.id === id ? { ...b, paid: b.amount } : b));
  }, []);

  // ── LOOKUPS ──────────────────────────────────────────────────────────────
  const getCustomer  = useCallback(id => customers.find(c => c.id === id),  [customers]);
  const getSupplier  = useCallback(id => suppliers.find(s => s.id === id),  [suppliers]);
  const getDO        = useCallback(id => dos.find(d => d.id === id),        [dos]);

  return {
    // state
    invoices, dos, customers, suppliers, bills,
    // invoice actions
    addInvoice, updateInvoice, submitToMyInvois, markInvoicePaid,
    // do actions
    addDO, markDODelivered, linkDOToInvoice,
    // customer actions
    addCustomer,
    // bill actions
    addBill, markBillPaid,
    // lookups
    getCustomer, getSupplier, getDO,
  };
}
