import React, { useState, useMemo } from "react";
import { T } from "../components/tokens";
import { calcLines, fmtRM } from "../utils/helpers";

const PERIODS = [
  { label:"Mar–Apr 2026", due:"31 May 2026",  status:"current"  },
  { label:"Jan–Feb 2026", due:"31 Mar 2026",  status:"overdue"  },
  { label:"Nov–Dec 2025", due:"31 Jan 2026",  status:"paid"     },
  { label:"Sep–Oct 2025", due:"30 Nov 2025",  status:"paid"     },
];

const SST_CODES = [
  { code:"TX-S6",   desc:"Taxable Service (6%)",         rate:0.06,  type:"service" },
  { code:"TX-G10",  desc:"Taxable Goods (10%)",           rate:0.10,  type:"goods"   },
  { code:"TX-G5",   desc:"Taxable Goods (5%)",            rate:0.05,  type:"goods"   },
  { code:"EX",      desc:"Exempt Supply",                 rate:0,     type:"exempt"  },
  { code:"ZR",      desc:"Zero-rated (Export)",           rate:0,     type:"zero"    },
  { code:"OS",      desc:"Out of Scope",                  rate:0,     type:"oos"     },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const SEED_RETURNS = [
  { period:"Nov–Dec 2025", due:"31 Jan 2026",  output:6200,  input:980,  net:5220,  status:"paid",    ref:"SST-2025-006", paidDate:"2026-01-28" },
  { period:"Jan–Feb 2026", due:"31 Mar 2026",  output:5850,  input:1100, net:4750,  status:"overdue", ref:"SST-2026-001", paidDate:null },
  { period:"Mar–Apr 2026", due:"31 May 2026",  output:7680,  input:1230, net:6450,  status:"current", ref:"SST-2026-002", paidDate:null },
];

export default function SSTManagerPage({ data }) {
  const { invoices = [], bills = [] } = data || {};
  const [tab,     setTab]     = useState("overview");
  const [period,  setPeriod]  = useState(PERIODS[0].label);

  // Compute SST from live invoices
  const sstOutput = useMemo(() => {
    return invoices.reduce((sum, inv) => {
      const { sstTotal } = calcLines(inv.items);
      return sum + sstTotal;
    }, 0);
  }, [invoices]);

  // Breakdown by code from invoices
  const codeBreakdown = useMemo(() => {
    const map = {};
    SST_CODES.forEach(c => { map[c.code] = { ...c, taxable:0, sst:0 }; });
    invoices.forEach(inv => {
      inv.items.forEach(it => {
        const { lineAmt, lineSst } = calcLines([it]).rows[0];
        const code = it.sstCode || "EX";
        if (map[code]) { map[code].taxable += lineAmt; map[code].sst += lineSst; }
      });
    });
    return Object.values(map).filter(c => c.taxable > 0 || c.sst > 0);
  }, [invoices]);

  const totalTaxable = codeBreakdown.reduce((s,c) => s+c.taxable, 0);
  const totalSST     = codeBreakdown.reduce((s,c) => s+c.sst, 0);
  const inputSST     = 1230; // from bills (simplified)
  const netSST       = totalSST - inputSST;

  return (
    <div>
      <div className="alert al-r">
        <span>⚠️</span>
        <div><strong>SST Return (Jan–Feb 2026) OVERDUE.</strong> Due 31 Mar 2026. File immediately via MySST portal (mysst.customs.gov.my). Penalty: 5%–25% of tax due for late filing.</div>
      </div>

      <div className="tabs">
        <div className={`tab ${tab==="overview"?"active":""}`}  onClick={()=>setTab("overview")}>📊 Overview</div>
        <div className={`tab ${tab==="returns"?"active":""}`}   onClick={()=>setTab("returns")}>📋 Returns</div>
        <div className={`tab ${tab==="breakdown"?"active":""}`} onClick={()=>setTab("breakdown")}>🔍 Tax Breakdown</div>
        <div className={`tab ${tab==="rates"?"active":""}`}     onClick={()=>setTab("rates")}>📘 Rate Guide</div>
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <>
          <div className="stats-4">
            <div className="card card-pad">
              <div className="stat-lbl">Output SST (Apr 2026)</div>
              <div className="stat-val" style={{ color:T.red, fontSize:17 }}>{fmtRM(totalSST)}</div>
              <div className="stat-sub">Collected from customers</div>
            </div>
            <div className="card card-pad">
              <div className="stat-lbl">Input SST (Apr 2026)</div>
              <div className="stat-val" style={{ fontSize:17 }}>{fmtRM(inputSST)}</div>
              <div className="stat-sub">Paid to suppliers</div>
            </div>
            <div className="card card-pad" style={{ background:T.redLight,borderColor:T.redBorder }}>
              <div className="stat-lbl">Net SST Payable</div>
              <div className="stat-val" style={{ color:T.red, fontSize:17 }}>{fmtRM(netSST)}</div>
              <div className="stat-sub">Due 31 May 2026 to RMCD</div>
            </div>
            <div className="card card-pad">
              <div className="stat-lbl">Total Taxable Revenue</div>
              <div className="stat-val" style={{ fontSize:16 }}>{fmtRM(totalTaxable)}</div>
              <div className="stat-sub">Subject to SST</div>
            </div>
          </div>

          {/* Net SST calculation */}
          <div className="card card-pad" style={{ marginBottom:16 }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.ink,marginBottom:14,fontFamily:"'Lora',serif" }}>SST Computation — March/April 2026</div>
            {[
              ["Output SST (collected from customers)", totalSST, T.red],
              ["Less: Input SST (paid to suppliers)",  -inputSST, T.green],
            ].map(([l,v,c]) => (
              <div key={l} style={{ display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:`1px solid ${T.border}`,fontSize:13 }}>
                <span style={{ color:T.inkMid }}>{l}</span>
                <span className="mono" style={{ fontWeight:600,color:c }}>{v<0?`(${fmtRM(Math.abs(v))})`:fmtRM(v)}</span>
              </div>
            ))}
            <div style={{ display:"flex",justifyContent:"space-between",padding:"12px 0 6px",fontSize:16,fontWeight:700,color:T.red }}>
              <span>NET SST PAYABLE TO RMCD</span>
              <span className="mono">{fmtRM(netSST)}</span>
            </div>
            <div style={{ marginTop:10,background:T.amberLight,border:`1px solid ${T.amberBorder}`,borderRadius:7,padding:"9px 12px",fontSize:12,color:T.amber }}>
              📅 <strong>Due: 31 May 2026</strong> · Submit via <strong>MySSTPortal (mysst.customs.gov.my)</strong> · Reference: FORM SST-02
            </div>
          </div>

          {/* Registration info */}
          <div className="card card-pad">
            <div style={{ fontSize:13,fontWeight:700,color:T.ink,marginBottom:12,fontFamily:"'Lora',serif" }}>Registration Status</div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
              {[
                ["SST Registration No.", "W10-2345-32001234"],
                ["Registration Date",    "1 September 2018"],
                ["Tax Type",             "Service Tax (6%)"],
                ["Filing Frequency",     "Every 2 months"],
                ["Threshold",            "RM500,000/year"],
                ["Portal",               "mysst.customs.gov.my"],
              ].map(([l,v]) => (
                <div key={l} style={{ background:T.stripe,borderRadius:7,padding:"10px 12px" }}>
                  <div style={{ fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,color:T.inkLight,marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:13,fontWeight:600,color:T.ink }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── RETURNS ── */}
      {tab === "returns" && (
        <>
          <div className="alert al-b">
            <span>📋</span>
            <div><strong>Filing Cycle: Every 2 months.</strong> Must file SST-02 return even if nil. Submit and pay by the last day of the following month. Late penalty: 5%–25% of tax due.</div>
          </div>
          <div className="tc">
            <div className="tc-head"><span className="tc-title">SST Filing History & Schedule</span></div>
            <table>
              <thead><tr><th>Taxable Period</th><th>Return Ref</th><th>Due Date</th><th style={{textAlign:"right"}}>Output SST</th><th style={{textAlign:"right"}}>Input SST</th><th style={{textAlign:"right"}}>Net Payable</th><th>Paid Date</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {SEED_RETURNS.map(r => (
                  <tr key={r.period}>
                    <td style={{ fontWeight:600,color:T.ink }}>{r.period}</td>
                    <td className="mono" style={{ fontSize:11,color:T.inkLight }}>{r.ref}</td>
                    <td style={{ color: r.status==="overdue"?T.red:T.inkLight }}>{r.due}</td>
                    <td className="mono" style={{ textAlign:"right",color:T.red }}>{fmtRM(r.output)}</td>
                    <td className="mono" style={{ textAlign:"right",color:T.green }}>{fmtRM(r.input)}</td>
                    <td className="mono" style={{ textAlign:"right",fontWeight:700 }}>{fmtRM(r.net)}</td>
                    <td style={{ fontSize:12,color:T.inkLight }}>{r.paidDate||"—"}</td>
                    <td>
                      {r.status==="paid"    && <span className="badge bg">✓ Filed & Paid</span>}
                      {r.status==="overdue" && <span className="badge br">⚠ Overdue</span>}
                      {r.status==="current" && <span className="badge ba">Upcoming</span>}
                    </td>
                    <td>
                      {r.status==="overdue" && <button className="btn btn-red btn-xs">File Now</button>}
                      {r.status==="current" && <button className="btn btn-out btn-xs">Prepare</button>}
                      {r.status==="paid"    && <button className="btn btn-out btn-xs">View</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── BREAKDOWN ── */}
      {tab === "breakdown" && (
        <>
          <div className="card card-pad" style={{ marginBottom:16 }}>
            <div style={{ fontSize:13,fontWeight:700,color:T.ink,marginBottom:12,fontFamily:"'Lora',serif" }}>SST by Tax Code — April 2026 (from live invoices)</div>
            <div style={{ overflowX:"auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>SST Code</th><th>Description</th><th>Rate</th>
                    <th style={{textAlign:"right"}}>Taxable Amount</th>
                    <th style={{textAlign:"right"}}>SST Amount</th>
                    <th style={{textAlign:"right"}}>% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {codeBreakdown.map(c => (
                    <tr key={c.code}>
                      <td><span style={{ fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:12,background:T.stripe,padding:"2px 8px",borderRadius:4 }}>{c.code}</span></td>
                      <td style={{ color:T.inkMid }}>{c.desc}</td>
                      <td style={{ fontWeight:700,color:c.rate>0?T.amber:T.inkLight }}>{c.rate>0?`${(c.rate*100).toFixed(0)}%`:"—"}</td>
                      <td className="mono" style={{ textAlign:"right" }}>{fmtRM(c.taxable)}</td>
                      <td className="mono" style={{ textAlign:"right",fontWeight:600,color:c.sst>0?T.red:T.inkLight }}>{c.sst>0?fmtRM(c.sst):"—"}</td>
                      <td style={{ textAlign:"right",color:T.inkMid }}>
                        {totalTaxable>0?((c.taxable/totalTaxable)*100).toFixed(1):0}%
                        <div style={{ height:3,borderRadius:2,background:T.border,marginTop:3,overflow:"hidden" }}>
                          <div style={{ height:"100%",background:T.accent,width:`${totalTaxable>0?(c.taxable/totalTaxable)*100:0}%` }}/>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr style={{ background:T.stripe }}>
                    <td colSpan={3} style={{ fontWeight:700,color:T.ink }}>TOTAL</td>
                    <td className="mono" style={{ textAlign:"right",fontWeight:700 }}>{fmtRM(totalTaxable)}</td>
                    <td className="mono" style={{ textAlign:"right",fontWeight:700,color:T.red }}>{fmtRM(totalSST)}</td>
                    <td style={{ textAlign:"right",fontWeight:700 }}>100%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── RATE GUIDE ── */}
      {tab === "rates" && (
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16 }}>
          <div className="card card-pad">
            <div style={{ fontFamily:"'Lora',serif",fontSize:15,fontWeight:700,color:T.ink,marginBottom:12 }}>🏛️ Malaysia SST Structure 2025–2026</div>
            <div style={{ fontSize:11.5,color:T.inkMid,lineHeight:1.8 }}>
              Malaysia does <strong style={{ color:T.ink }}>not</strong> have GST. The Sales and Service Tax (SST) was reinstated in September 2018, replacing GST.<br/><br/>
              <strong style={{ color:T.ink }}>Service Tax (6%)</strong> is charged by registered service providers on prescribed taxable services — IT, consulting, hotels, restaurants, telecoms, insurance, etc.<br/><br/>
              <strong style={{ color:T.ink }}>Sales Tax (5% or 10%)</strong> is single-stage at manufacturer or importer level on taxable goods.<br/><br/>
              Register with RMCD if taxable turnover ≥ <strong style={{ color:T.ink }}>RM500,000/year</strong>.
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ fontFamily:"'Lora',serif",fontSize:15,fontWeight:700,color:T.ink,marginBottom:12 }}>📋 SST Tax Codes</div>
            {[
              { code:"TX-S6",   rate:"6%",  label:"Taxable Service",    col:T.blue  },
              { code:"TX-G10",  rate:"10%", label:"Taxable Goods",      col:T.red   },
              { code:"TX-G5",   rate:"5%",  label:"Reduced Rate Goods", col:T.amber },
              { code:"EX",      rate:"0%",  label:"Exempt Supply",      col:T.green },
              { code:"ZR",      rate:"0%",  label:"Zero-rated (Export)",col:T.green },
              { code:"OS",      rate:"0%",  label:"Out of Scope",       col:T.inkLight },
            ].map(c => (
              <div key={c.code} style={{ display:"flex",gap:10,alignItems:"center",padding:"7px 0",borderBottom:`1px solid ${T.border}22` }}>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,fontSize:12,background:T.stripe,padding:"2px 8px",borderRadius:4,minWidth:64,textAlign:"center" }}>{c.code}</span>
                <span style={{ flex:1,fontSize:12.5,color:T.inkMid }}>{c.label}</span>
                <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontWeight:700,color:c.col }}>{c.rate}</span>
              </div>
            ))}
          </div>

          <div className="card card-pad">
            <div style={{ fontFamily:"'Lora',serif",fontSize:15,fontWeight:700,color:T.ink,marginBottom:12 }}>📅 Filing Deadlines</div>
            {[
              ["Jan–Feb period",  "31 March"],
              ["Mar–Apr period",  "31 May"],
              ["May–Jun period",  "31 July"],
              ["Jul–Aug period",  "30 September"],
              ["Sep–Oct period",  "30 November"],
              ["Nov–Dec period",  "31 January (following year)"],
            ].map(([p,d]) => (
              <div key={p} style={{ display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:`1px solid ${T.border}22`,fontSize:12.5 }}>
                <span style={{ color:T.inkMid }}>{p}</span>
                <span style={{ fontWeight:600,color:T.ink }}>{d}</span>
              </div>
            ))}
            <div style={{ marginTop:10,padding:"8px 10px",background:T.redLight,border:`1px solid ${T.redBorder}`,borderRadius:6,fontSize:11,color:T.red }}>
              ⚠ Late filing penalty: <strong>5%–25%</strong> of tax due. Payment must accompany the return.
            </div>
          </div>

          <div className="card card-pad">
            <div style={{ fontFamily:"'Lora',serif",fontSize:15,fontWeight:700,color:T.ink,marginBottom:12 }}>🛠️ July 2025 SST Changes</div>
            <div style={{ fontSize:11.5,color:T.inkMid,lineHeight:1.8 }}>
              Effective <strong style={{ color:T.ink }}>1 July 2025</strong>, Malaysia expanded SST scope:<br/><br/>
              • <strong style={{ color:T.ink }}>New service categories</strong> added to the taxable services list<br/>
              • <strong style={{ color:T.ink }}>Luxury goods</strong> (high-value watches, handbags, jewellery) subject to higher Sales Tax rates<br/>
              • <strong style={{ color:T.ink }}>Expanded B2B services</strong> now subject to 8% Service Tax on specified professional services<br/>
              • Review your service/product classification against the updated First and Second Schedule of the SST Act 2018
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
