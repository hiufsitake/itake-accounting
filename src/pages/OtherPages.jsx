import React from "react";
import { T } from "../components/tokens";

export function Dashboard({ data }) {
  const { invoices, dos, customers } = data;
  const overdue  = invoices.filter(i => i.status === "overdue").length;
  const pending  = invoices.filter(i => i.status === "pending").length;
  const delivered = dos.filter(d => d.status === "delivered").length;

  return (
    <div>
      <div className="alert al-a" style={{ marginBottom: 18 }}>
        <span>⚡</span>
        <div>
          <strong>Quick Status:</strong> {overdue} overdue invoice(s), {delivered} DO(s) awaiting invoice, {pending} invoice(s) pending payment.
        </div>
      </div>
      <div className="stats-4">
        {[
          { lbl: "Total Customers",      val: customers.length,  sub: "Active accounts"        },
          { lbl: "Open Invoices",         val: pending + overdue, sub: `${overdue} overdue`     },
          { lbl: "DOs Pending Invoice",   val: delivered,         sub: "Ready to invoice"       },
          { lbl: "e-Invoice Validated",   val: invoices.filter(i=>i.uin).length, sub: "MyInvois UIN issued" },
        ].map(s => (
          <div className="card card-pad" key={s.lbl}>
            <div className="stat-lbl">{s.lbl}</div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="card card-pad" style={{ color: T.inkMid, fontSize: 13, lineHeight: 1.7 }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 16, color: T.ink, marginBottom: 10 }}>
          🚧 Full Dashboard — coming next
        </div>
        Use the sidebar to navigate to <strong>Delivery Orders</strong>, <strong>Tax Invoices</strong>, and <strong>Aging Report</strong> — all connected with shared live data.
      </div>
    </div>
  );
}

export function SSTPage() {
  return (
    <div className="card card-pad" style={{ color: T.inkMid, fontSize: 13, lineHeight: 1.8 }}>
      <div style={{ fontFamily: "'Lora', serif", fontSize: 16, color: T.ink, marginBottom: 10 }}>🏛️ SST Manager — coming next</div>
      SST output/input tracking, bimonthly return filing, rate reference guide (S6, ST10, ST5, EX, ZR).
    </div>
  );
}

export function EInvoicePage({ data }) {
  const { invoices } = data;
  const validated = invoices.filter(i => i.uin);
  const pending   = invoices.filter(i => !i.uin);
  return (
    <div>
      <div className="stats-3">
        <div className="card card-pad"><div className="stat-lbl">Validated by LHDN</div><div className="stat-val" style={{ color: T.green }}>{validated.length}</div></div>
        <div className="card card-pad"><div className="stat-lbl">Pending Submission</div><div className="stat-val" style={{ color: T.amber }}>{pending.length}</div></div>
        <div className="card card-pad"><div className="stat-lbl">Phase 4 Active</div><div className="stat-val">✓</div><div className="stat-sub">RM1M–5M since Jan 2026</div></div>
      </div>
      <div className="card card-pad" style={{ color: T.inkMid, fontSize: 13 }}>
        <div style={{ fontFamily: "'Lora', serif", fontSize: 16, color: T.ink, marginBottom: 10 }}>📋 e-Invoice Module — coming next</div>
        Full MyInvois queue, 55-field validator, UIN tracking, 72-hour cancellation window.
      </div>
    </div>
  );
}

export function BillsPage({ data }) {
  const { bills, suppliers } = data;
  const getSupplier = id => suppliers.find(s => s.id === id);
  return (
    <div>
      <div className="tc">
        <div className="tc-head"><span className="tc-title">Bills & Expenses ({bills.length})</span></div>
        <table>
          <thead>
            <tr><th>Bill ID</th><th>Supplier</th><th>Description</th><th>Due</th><th>Amount</th><th>Paid</th><th>Outstanding</th></tr>
          </thead>
          <tbody>
            {bills.map(b => {
              const sup = getSupplier(b.supplierId);
              const outstanding = b.amount - b.paid;
              return (
                <tr key={b.id}>
                  <td className="mono" style={{ color: T.blue, fontSize: 12 }}>{b.id}</td>
                  <td style={{ fontWeight: 600, color: T.ink }}>{sup?.name || b.supplierId}</td>
                  <td style={{ color: T.inkMid }}>{b.desc}</td>
                  <td style={{ color: T.inkLight }}>{b.due}</td>
                  <td className="mono">{b.amount.toLocaleString("en-MY", { minimumFractionDigits: 2 })}</td>
                  <td className="mono" style={{ color: T.green }}>{b.paid.toLocaleString("en-MY", { minimumFractionDigits: 2 })}</td>
                  <td className="mono" style={{ fontWeight: 600, color: outstanding > 0 ? T.red : T.green }}>
                    {outstanding.toLocaleString("en-MY", { minimumFractionDigits: 2 })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CompliancePage() {
  const items = [
    { event: "SST Return (Jan–Feb 2026)",    due: "31 Mar 2026", status: "overdue",  law: "SST Act 2018",         body: "RMCD" },
    { event: "CP204 Instalment (Apr 2026)",  due: "15 Apr 2026", status: "due-soon", law: "Income Tax Act 1967",  body: "LHDN" },
    { event: "SST Return (Mar–Apr 2026)",    due: "31 May 2026", status: "upcoming", law: "SST Act 2018",         body: "RMCD" },
    { event: "Annual Return (SSM FY2026)",   due: "30 Jun 2026", status: "upcoming", law: "Companies Act 2016",   body: "SSM"  },
    { event: "Audited Financial Statements", due: "30 Jun 2026", status: "upcoming", law: "Companies Act 2016",   body: "SSM"  },
    { event: "e-Invoice Phase 4 Compliance", due: "1 Jan 2026",  status: "active",   law: "LHDN MyInvois 2.1",   body: "LHDN" },
    { event: "7-Year Record Retention",      due: "Ongoing",     status: "active",   law: "Income Tax Act 1967",  body: "LHDN" },
  ];
  const cls = { overdue:"br", "due-soon":"ba", upcoming:"bb", active:"bg" };
  return (
    <div>
      <div className="alert al-r"><span>⚠️</span><div><strong>2 Overdue:</strong> SST Return (Jan–Feb) and CP500 instalment. File immediately to avoid penalties.</div></div>
      <div className="tc">
        <div className="tc-head"><span className="tc-title">Compliance Calendar 2026</span></div>
        <table>
          <thead><tr><th>Obligation</th><th>Law</th><th>Authority</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            {items.map((it, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600, color: T.ink }}>{it.event}</td>
                <td style={{ fontSize: 12, color: T.inkLight }}>{it.law}</td>
                <td><span className="badge bb" style={{ fontSize: 10 }}>{it.body}</span></td>
                <td>{it.due}</td>
                <td><span className={`badge ${cls[it.status] || "bk"}`}>{it.status.replace("-", " ")}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
