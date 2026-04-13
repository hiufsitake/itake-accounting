import React, { useState, useMemo } from "react";
import { T } from "../components/tokens";
import { MY_COMPANY } from "../data/seedData";
import { calcLines, fmtRM } from "../utils/helpers";

const PERIODS = ["April 2026","March 2026","February 2026","January 2026","December 2025","November 2025"];

const docCss = `
.soa-doc{background:#fff;width:720px;min-height:900px;padding:48px 52px;font-family:'IBM Plex Sans',sans-serif;color:#18160f;font-size:12px;box-shadow:0 4px 28px #00000028}
.soa-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #18160f}
.soa-co{font-family:'Lora',serif;font-size:17px;font-weight:700;color:#18160f;margin-bottom:3px}
.soa-co-det{font-size:10px;color:#6a6258;line-height:1.7}
.soa-type{font-family:'Lora',serif;font-size:22px;font-weight:700;color:#1649a0;text-align:right;line-height:1}
.soa-period{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#4a4440;text-align:right;margin-top:4px}
.soa-parties{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:18px;background:#f7f6f3;padding:14px 16px;border-radius:7px}
.soa-p-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9a9388;margin-bottom:4px}
.soa-p-name{font-size:13px;font-weight:600;color:#18160f;margin-bottom:2px}
.soa-p-det{font-size:10.5px;color:#6a6258;line-height:1.6}
.soa-tbl{width:100%;border-collapse:collapse;margin-bottom:18px;font-size:11.5px}
.soa-tbl th{text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9a9388;padding:7px 8px;border-bottom:1.5px solid #e5e2db;background:#f7f6f3}
.soa-tbl td{padding:8px 8px;border-bottom:1px solid #f0ede8;color:#4a4440;vertical-align:top}
.soa-tbl tr:last-child td{border-bottom:none}
.soa-summary{display:flex;justify-content:flex-end;margin-bottom:18px}
.soa-sum-inner{width:300px}
.soa-sum-row{display:flex;justify-content:space-between;padding:5px 0;font-size:12.5px;border-bottom:1px solid #f0ede8}
.soa-sum-row.final{font-size:15px;font-weight:700;padding:9px 0 5px;border-top:2px solid #18160f;border-bottom:none;margin-top:3px}
.soa-aging{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:18px}
.sa-cell{background:#f7f6f3;border-radius:6px;padding:9px 10px;text-align:center}
.sa-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:#9a9388;margin-bottom:4px}
.sa-val{font-family:'IBM Plex Mono',monospace;font-size:13px;font-weight:600}
`;

function SOADocument({ customer, transactions, period, onClose }) {
  const openingBalance = 0;
  const totalInvoiced  = transactions.filter(t=>t.type==="invoice").reduce((s,t)=>s+t.amount,0);
  const totalPaid      = transactions.filter(t=>t.type==="payment").reduce((s,t)=>s+t.amount,0);
  const totalCN        = transactions.filter(t=>t.type==="cn").reduce((s,t)=>s+t.amount,0);
  const totalDN        = transactions.filter(t=>t.type==="dn").reduce((s,t)=>s+t.amount,0);
  const closingBalance = openingBalance + totalInvoiced + totalDN - totalPaid - totalCN;

  // Aging of closing balance
  const overdueInvs = transactions.filter(t=>t.type==="invoice"&&t.outstanding>0);

  return (
    <div style={{ position:"fixed",inset:0,background:"#2a2520",zIndex:400,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <style>{docCss}</style>
      <div style={{ background:T.sidebar,padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <span style={{ fontSize:13.5,fontWeight:600,color:"#c8c0b4" }}>📄 Statement of Account — {customer.name}</span>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={()=>window.print()}>🖨️ Print / Send</button>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:28,display:"flex",justifyContent:"center" }}>
        <div className="soa-doc">
          <div className="soa-hdr">
            <div>
              <div className="soa-co">{MY_COMPANY.name}</div>
              <div className="soa-co-det">SSM: {MY_COMPANY.reg}<br/>SST: {MY_COMPANY.sst}<br/>{MY_COMPANY.address}<br/>{MY_COMPANY.phone} · {MY_COMPANY.email}</div>
            </div>
            <div>
              <div className="soa-type">Statement of Account</div>
              <div className="soa-period">{period}</div>
              <div style={{ marginTop:6,fontSize:10,color:"#9a9388",textAlign:"right" }}>Printed: 13 April 2026</div>
            </div>
          </div>

          <div className="soa-parties">
            <div>
              <div className="soa-p-lbl">Account Holder</div>
              <div className="soa-p-name">{customer.name}</div>
              <div className="soa-p-det">
                {customer.tin&&<>TIN: {customer.tin}<br/></>}
                {customer.reg&&<>SSM: {customer.reg}<br/></>}
                <span style={{ whiteSpace:"pre-line" }}>{customer.address}</span>
              </div>
            </div>
            <div>
              <div className="soa-p-lbl">Account Summary</div>
              <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:4 }}>
                {[
                  ["Credit Limit", fmtRM(customer.creditLimit||0)],
                  ["Payment Terms", `Net ${customer.paymentTerms||30} days`],
                  ["Statement Period", period],
                  ["Currency", "MYR"],
                ].map(([l,v])=>(
                  <div key={l}><div style={{ fontSize:9,color:"#9a9388" }}>{l}</div><div style={{ fontSize:11.5,fontWeight:600,color:"#18160f" }}>{v}</div></div>
                ))}
              </div>
            </div>
          </div>

          {/* Aging summary */}
          <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#9a9388",marginBottom:8 }}>Outstanding Aging</div>
          <div className="soa-aging">
            {[
              { label:"Current",      color:T.green,  val: overdueInvs.filter(t=>(t.daysOverdue||0)<0).reduce((s,t)=>s+(t.outstanding||0),0) },
              { label:"1–30 Days",    color:T.blue,   val: overdueInvs.filter(t=>(t.daysOverdue||0)>=0&&(t.daysOverdue||0)<=30).reduce((s,t)=>s+(t.outstanding||0),0) },
              { label:"31–90 Days",   color:T.amber,  val: overdueInvs.filter(t=>(t.daysOverdue||0)>30&&(t.daysOverdue||0)<=90).reduce((s,t)=>s+(t.outstanding||0),0) },
              { label:">90 Days",     color:T.red,    val: overdueInvs.filter(t=>(t.daysOverdue||0)>90).reduce((s,t)=>s+(t.outstanding||0),0) },
            ].map(a=>(
              <div className="sa-cell" key={a.label}>
                <div className="sa-lbl">{a.label}</div>
                <div className="sa-val" style={{ color:a.color }}>{fmtRM(a.val)}</div>
              </div>
            ))}
          </div>

          {/* Transaction table */}
          <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#9a9388",marginBottom:8 }}>Transaction History</div>
          <table className="soa-tbl">
            <thead>
              <tr>
                <th>Date</th><th>Reference</th><th>Description</th>
                <th style={{ textAlign:"right" }}>Debit (RM)</th>
                <th style={{ textAlign:"right" }}>Credit (RM)</th>
                <th style={{ textAlign:"right" }}>Balance (RM)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ color:"#9a9388" }}>B/F</td>
                <td>—</td>
                <td style={{ color:"#9a9388",fontStyle:"italic" }}>Opening Balance</td>
                <td style={{ textAlign:"right" }}>—</td>
                <td style={{ textAlign:"right" }}>—</td>
                <td style={{ textAlign:"right",fontFamily:"'IBM Plex Mono',monospace",fontWeight:600 }}>{fmtRM(openingBalance)}</td>
              </tr>
              {transactions.map((t,i) => {
                const isDebit = t.type==="invoice"||t.type==="dn";
                return (
                  <tr key={i}>
                    <td style={{ color:"#9a9388" }}>{t.date}</td>
                    <td style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:isDebit?T.red:T.green,fontWeight:600 }}>{t.ref}</td>
                    <td>
                      <div style={{ fontWeight:600,color:"#18160f" }}>{t.description}</div>
                      {t.type==="invoice"&&t.outstanding>0&&<div style={{ fontSize:10,color:T.red }}>Outstanding: {fmtRM(t.outstanding)}</div>}
                    </td>
                    <td style={{ textAlign:"right",fontFamily:"'IBM Plex Mono',monospace",color:T.red }}>{isDebit?fmtRM(t.amount):"—"}</td>
                    <td style={{ textAlign:"right",fontFamily:"'IBM Plex Mono',monospace",color:T.green }}>{!isDebit?fmtRM(t.amount):"—"}</td>
                    <td style={{ textAlign:"right",fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:"#18160f" }}>{fmtRM(t.runningBalance)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Summary */}
          <div className="soa-summary">
            <div className="soa-sum-inner">
              <div className="soa-sum-row"><span>Opening Balance</span><span className="mono">{fmtRM(openingBalance)}</span></div>
              <div className="soa-sum-row"><span>Total Invoiced</span><span className="mono" style={{ color:T.red }}>+ {fmtRM(totalInvoiced)}</span></div>
              {totalDN>0&&<div className="soa-sum-row"><span>Debit Notes</span><span className="mono" style={{ color:T.red }}>+ {fmtRM(totalDN)}</span></div>}
              {totalCN>0&&<div className="soa-sum-row"><span>Credit Notes</span><span className="mono" style={{ color:T.green }}>- {fmtRM(totalCN)}</span></div>}
              <div className="soa-sum-row"><span>Total Payments Received</span><span className="mono" style={{ color:T.green }}>- {fmtRM(totalPaid)}</span></div>
              <div className={`soa-sum-row final`} style={{ color: closingBalance > 0 ? T.red : T.green }}>
                <span>BALANCE DUE</span><span className="mono">{fmtRM(Math.abs(closingBalance))}{closingBalance<0?" (CR)":""}</span>
              </div>
            </div>
          </div>

          {closingBalance > 0 && (
            <div style={{ background:T.redLight,border:`1px solid ${T.redBorder}`,borderRadius:7,padding:"10px 14px",marginBottom:14,fontSize:11,color:T.red }}>
              <strong>Amount Due: {fmtRM(closingBalance)}</strong> — Please settle outstanding balance promptly. For queries, contact {MY_COMPANY.email} or {MY_COMPANY.phone}.
            </div>
          )}

          <div style={{ fontSize:10,color:"#9a9388",borderTop:"1px solid #e5e2db",paddingTop:10 }}>
            This statement is for account reference only. Please verify all entries and notify us of any discrepancies within 7 days. Payment to: {MY_COMPANY.bank}. Ref: Account No. {customer.id}.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatementOfAccountPage({ data }) {
  const { invoices = [], customers = [] } = data || {};
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [period,           setPeriod]            = useState(PERIODS[0]);
  const [viewModal,        setViewModal]         = useState(null);

  // Build transaction list for a customer
  const buildTransactions = (customerId) => {
    const custInvs = invoices.filter(i => i.customerId === customerId);
    let running = 0;
    const txns = [];
    custInvs.forEach(inv => {
      const { total } = calcLines(inv.items);
      const paid      = inv.status === "paid" ? total : 0;
      const outstanding = total - paid;
      const daysOverdue = inv.due ? Math.floor((new Date("2026-04-13") - new Date(inv.due)) / 86400000) : 0;
      running += total;
      txns.push({ date:inv.date, ref:inv.id, description:`Tax Invoice — ${inv.items.length} item(s)`, type:"invoice", amount:total, outstanding, daysOverdue, runningBalance:running });
      if (paid > 0) {
        running -= paid;
        txns.push({ date:inv.due||inv.date, ref:"PMT-"+inv.id, description:`Payment Received for ${inv.id}`, type:"payment", amount:paid, runningBalance:running });
      }
    });
    return txns.sort((a,b) => a.date.localeCompare(b.date));
  };

  const customerSummaries = useMemo(() => {
    return customers.map(c => {
      const txns    = buildTransactions(c.id);
      const balance = txns.length > 0 ? txns[txns.length - 1].runningBalance : 0;
      const overdue = invoices.filter(i => i.customerId === c.id && i.status === "overdue").length;
      return { ...c, balance, overdue, txnCount: txns.length };
    }).filter(c => c.txnCount > 0);
  }, [customers, invoices]);

  return (
    <div>
      <div className="alert al-b">
        <span>📄</span>
        <div><strong>Statement of Account</strong> is sent monthly to customers showing all invoices, payments, credit notes, and current balance due. Essential for AR follow-up and dispute resolution.</div>
      </div>

      <div style={{ display:"flex",gap:10,alignItems:"center",marginBottom:16 }}>
        <label className="fl" style={{ margin:0 }}>Period:</label>
        <select className="fi" style={{ width:200 }} value={period} onChange={e => setPeriod(e.target.value)}>
          {PERIODS.map(p => <option key={p}>{p}</option>)}
        </select>
      </div>

      <div className="stats-3" style={{ marginBottom:16 }}>
        <div className="card card-pad"><div className="stat-lbl">Customers with Transactions</div><div className="stat-val">{customerSummaries.length}</div></div>
        <div className="card card-pad"><div className="stat-lbl">Total AR Balance</div><div className="stat-val" style={{color:T.red,fontSize:16}}>{fmtRM(customerSummaries.reduce((s,c)=>s+c.balance,0))}</div></div>
        <div className="card card-pad"><div className="stat-lbl">Customers with Overdue</div><div className="stat-val" style={{color:T.amber}}>{customerSummaries.filter(c=>c.overdue>0).length}</div></div>
      </div>

      <div className="tc">
        <div className="tc-head">
          <span className="tc-title">Customer Accounts — {period}</span>
          <span style={{ fontSize:11,color:T.inkLight }}>Click row to view & print Statement of Account</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Credit Limit</th>
              <th>Payment Terms</th>
              <th>Transactions</th>
              <th style={{ textAlign:"right" }}>Balance Due</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customerSummaries.map(c => (
              <tr key={c.id} onClick={() => { setSelectedCustomer(c); setViewModal("soa"); }}>
                <td>
                  <div style={{ fontWeight:600,color:T.ink }}>{c.name}</div>
                  <div style={{ fontSize:11,color:T.inkLight }}>{c.id}</div>
                </td>
                <td className="mono" style={{ fontSize:12 }}>{fmtRM(c.creditLimit||0)}</td>
                <td style={{ fontSize:12,color:T.inkMid }}>Net {c.paymentTerms||30} days</td>
                <td style={{ color:T.inkMid }}>{c.txnCount} entries</td>
                <td className="mono" style={{ textAlign:"right",fontWeight:700,fontSize:13,color:c.balance>0?T.red:T.green }}>
                  {fmtRM(Math.abs(c.balance))}{c.balance<0?" CR":""}
                </td>
                <td>
                  {c.balance<=0
                    ? <span className="badge bg">✓ Settled</span>
                    : c.overdue>0
                      ? <span className="badge br">⚠ Overdue</span>
                      : <span className="badge ba">Outstanding</span>}
                </td>
                <td onClick={e=>e.stopPropagation()}>
                  <button className="btn btn-out btn-xs" onClick={e=>{e.stopPropagation();setSelectedCustomer(c);setViewModal("soa");}}>
                    📄 View SOA
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {viewModal==="soa" && selectedCustomer && (
        <SOADocument
          customer={selectedCustomer}
          transactions={buildTransactions(selectedCustomer.id)}
          period={period}
          onClose={() => setViewModal(null)}
        />
      )}
    </div>
  );
}
