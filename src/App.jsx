import React, { useState } from "react";
import { GLOBAL_CSS } from "./components/tokens";
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

export default function App() {
  const [page, setPage] = useState("dashboard");
  const data = useAppData();

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
        <Sidebar page={page} setPage={setPage} badges={badges} />
        <div className="main">
          <div className="topbar">
            <div className="page-h">{PAGE_TITLES[page] || page}</div>
            <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em" }}>ITAKE Group — Accounting</div>
          </div>
          <div className="body">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
