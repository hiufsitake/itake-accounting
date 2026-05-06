import React, { useState, useRef, useEffect } from "react";
import { GLOBAL_CSS } from "./components/tokens";
import { COMPANIES } from "./data/seedData";
import { useAppData } from "./hooks/useAppData";
import Sidebar from "./components/Sidebar";

import DeliveryOrdersPage from "./pages/DeliveryOrdersPage";
import InvoicesPage from "./pages/InvoicesPage";
import CreditDebitNotePage from "./pages/CreditDebitNotePage";
import StatementOfAccountPage from "./pages/StatementOfAccountPage";
import VouchersPage from "./pages/VouchersPage";
import AgingReportPage from "./pages/AgingReportPage";
import SSTManagerPage from "./pages/SSTManagerPage";
import PayrollPage from "./pages/PayrollPage";
import { Dashboard, BillsPage, EInvoicePage, CompliancePage } from "./pages/OtherPages";

const PAGE_TITLES = {
  dashboard:  "Dashboard",
  dos:        "Delivery Orders",
  invoices:   "Tax Invoices",
  cdnotes:    "Credit / Debit Notes",
  soa:        "Statement of Account",
  vouchers:   "Payment Vouchers",
  bills:      "Bills & Expenses",
  aging:      "Aging Report",
  sst:        "SST Manager",
  einvoice:   "e-Invoice (MyInvois)",
  payroll:    "Payroll & HR",
  compliance: "Compliance Centre",
};

function CompanySwitcher({ activeId, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const active = COMPANIES.find(c => c.id === activeId);

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: "flex", alignItems: "center", gap: 8,
          background: "transparent", border: "2px solid #f1f5f9",
          borderRadius: 9999, padding: "6px 14px 6px 10px",
          cursor: "pointer", fontFamily: "Inter, sans-serif",
        }}
      >
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: active.color, flexShrink: 0 }} />
        <span style={{ fontSize: 11, fontWeight: 700, color: "#0f172a" }}>{active.shortName}</span>
        <span style={{ fontSize: 9, color: "#94a3b8", marginLeft: 2 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          background: "#fff", border: "2px solid #f1f5f9", borderRadius: 16,
          boxShadow: "0 12px 40px rgba(0,0,0,0.12)", width: 260, zIndex: 999, overflow: "hidden",
        }}>
          <div style={{ padding: "8px 12px 6px", fontSize: 9, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.15em" }}>
            iTake Group — Switch Company
          </div>
          {COMPANIES.map(co => (
            <div
              key={co.id}
              onClick={() => { onChange(co.id); setOpen(false); }}
              style={{
                display: "flex", alignItems: "flex-start", gap: 10,
                padding: "10px 14px", cursor: "pointer",
                background: co.id === activeId ? "#f8fafc" : "transparent",
                borderTop: "1px solid #f1f5f9",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"}
              onMouseLeave={e => e.currentTarget.style.background = co.id === activeId ? "#f8fafc" : "transparent"}
            >
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: co.color, flexShrink: 0, marginTop: 3 }} />
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>{co.name}</div>
              </div>
              {co.id === activeId && (
                <span style={{ marginLeft: "auto", fontSize: 11, color: co.color, fontWeight: 700 }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [activeCompanyId, setActiveCompanyId] = useState("ISOL");
  const data = useAppData(activeCompanyId);

  const { invoices, dos } = data;
  const badges = {
    dosPending:       dos.filter(d => d.status === "delivered").length,
    invOverdue:       invoices.filter(i => i.status === "overdue").length,
    complianceAlerts: 2,
  };

  const renderPage = () => {
    switch (page) {
      case "dashboard":  return <Dashboard data={data} />;
      case "dos":        return <DeliveryOrdersPage data={data} />;
      case "invoices":   return <InvoicesPage data={data} />;
      case "cdnotes":    return <CreditDebitNotePage data={data} />;
      case "soa":        return <StatementOfAccountPage data={data} />;
      case "vouchers":   return <VouchersPage data={data} />;
      case "bills":      return <BillsPage data={data} />;
      case "aging":      return <AgingReportPage data={data} />;
      case "sst":        return <SSTManagerPage data={data} />;
      case "einvoice":   return <EInvoicePage data={data} />;
      case "payroll":    return <PayrollPage />;
      case "compliance": return <CompliancePage />;
      default:           return <Dashboard data={data} />;
    }
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div className="app">
        <Sidebar page={page} setPage={setPage} badges={badges} activeCompany={data.company} />
        <div className="main">
          <div className="topbar">
            <div className="page-h">{PAGE_TITLES[page] || page}</div>
            <CompanySwitcher activeId={activeCompanyId} onChange={setActiveCompanyId} />
          </div>
          <div className="body">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
