import React, { useState, useMemo } from "react";
import { T } from "../components/tokens";
import { calcLines, fmtRM, fmtK, daysDiff, getBucket } from "../utils/helpers";

const BUCKETS = [
  { key:"current",  label:"Current",     color:T.green,  dim:T.greenLight  },
  { key:"b1_30",    label:"1–30 Days",   color:T.blue,   dim:T.blueLight   },
  { key:"b31_60",   label:"31–60 Days",  color:T.amber,  dim:T.amberLight  },
  { key:"b61_90",   label:"61–90 Days",  color:"#f07030",dim:"#fff3e8"     },
  { key:"b91_120",  label:"91–120 Days", color:T.red,    dim:T.redLight    },
  { key:"b120plus", label:">120 Days",   color:"#a01020",dim:"#fce8e8"     },
];

function buildAR(invoices, getCustomer) {
  const map = {};
  invoices.forEach(inv => {
    const cust = getCustomer(inv.customerId);
    const name = cust?.name || inv.customerId;
    const { total } = calcLines(inv.items);
    // how much is still outstanding (simplified: paid = fully paid)
    const outstanding = inv.status === "paid" ? 0 : total;
    if (outstanding <= 0) return;
    if (!map[name]) map[name] = { name, entries: [], buckets: Object.fromEntries(BUCKETS.map(b=>[b.key,0])), total: 0 };
    const overdue = daysDiff(inv.due);
    const bkt = getBucket(overdue);
    map[name].buckets[bkt] += outstanding;
    map[name].total += outstanding;
    map[name].entries.push({ id: inv.id, due: inv.due, outstanding, overdue, bucket: bkt });
  });
  return Object.values(map).sort((a,b) => b.total - a.total);
}

function buildAP(bills, getSupplier) {
  const map = {};
  bills.forEach(b => {
    const sup = getSupplier(b.supplierId);
    const name = sup?.name || b.supplierId;
    const outstanding = b.amount - b.paid;
    if (outstanding <= 0) return;
    if (!map[name]) map[name] = { name, entries: [], buckets: Object.fromEntries(BUCKETS.map(bk=>[bk.key,0])), total: 0 };
    const overdue = daysDiff(b.due);
    const bkt = getBucket(overdue);
    map[name].buckets[bkt] += outstanding;
    map[name].total += outstanding;
    map[name].entries.push({ id: b.id, due: b.due, outstanding, overdue, bucket: bkt, desc: b.desc });
  });
  return Object.values(map).sort((a,b) => b.total - a.total);
}

function BucketLabel({ bucket, days }) {
  const b = BUCKETS.find(x => x.key === bucket);
  if (!b) return null;
  const text = days < 0 ? `Due in ${Math.abs(days)}d` : days === 0 ? "Due today" : `${days}d overdue`;
  return <span className="badge" style={{ background: b.dim, color: b.color, border: `1px solid ${b.color}30`, fontSize: 10 }}>{text}</span>;
}

function AgingTable({ rows, grandTotal, bucketFilter }) {
  const [expanded, setExpanded] = useState({});
  const toggle = name => setExpanded(p => ({ ...p, [name]: !p[name] }));

  const totals = BUCKETS.reduce((acc,b) => ({ ...acc, [b.key]: rows.reduce((s,r) => s + r.buckets[b.key], 0) }), {});

  const filtered = bucketFilter ? rows.filter(r => r.buckets[bucketFilter] > 0) : rows;

  return (
    <div className="tc">
      <div className="tc-head">
        <span className="tc-title">{filtered.length} record(s)</span>
        <span style={{ fontSize: 11, color: T.inkLight }}>Click row to expand</span>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th style={{ width: 28 }}/>
              <th>Name</th>
              {BUCKETS.map(b => <th key={b.key} style={{ textAlign:"right", color: b.color+"cc" }}>{b.label}</th>)}
              <th style={{ textAlign:"right" }}>Total Outstanding</th>
              <th style={{ textAlign:"right" }}>Distribution</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <React.Fragment key={r.name}>
                <tr onClick={() => toggle(r.name)} style={{ background: expanded[r.name] ? T.stripe : "transparent" }}>
                  <td style={{ textAlign:"center", fontSize: 12, color: T.inkLight }}>{expanded[r.name] ? "▼" : "▶"}</td>
                  <td>
                    <div style={{ fontWeight: 700, color: T.ink }}>{r.name}</div>
                    <div style={{ fontSize: 11, color: T.inkLight }}>{r.entries.length} invoice(s)</div>
                  </td>
                  {BUCKETS.map(b => (
                    <td key={b.key} style={{ textAlign:"right", fontFamily:"'IBM Plex Mono',monospace", fontSize: 12, color: r.buckets[b.key] > 0 ? b.color : T.inkLight }}>
                      {r.buckets[b.key] > 0 ? fmtRM(r.buckets[b.key]) : "—"}
                    </td>
                  ))}
                  <td style={{ textAlign:"right", fontFamily:"'IBM Plex Mono',monospace", fontWeight: 700, color: T.ink, fontSize: 13 }}>{fmtRM(r.total)}</td>
                  <td>
                    <div style={{ display:"flex", height: 6, borderRadius: 3, overflow:"hidden", gap: 1, width: 80, marginLeft:"auto" }}>
                      {BUCKETS.map(b => r.buckets[b.key] > 0 && (
                        <div key={b.key} style={{ background: b.color, width: `${(r.buckets[b.key]/r.total)*100}%` }}/>
                      ))}
                    </div>
                  </td>
                </tr>
                {expanded[r.name] && r.entries.map(e => (
                  <tr key={e.id} style={{ background: "#f9f8f5" }}>
                    <td/>
                    <td style={{ paddingLeft: 28 }}>
                      <span className="mono" style={{ color: T.red, fontSize: 11.5, fontWeight: 600 }}>{e.id}</span>
                      {e.desc && <span style={{ color: T.inkLight, fontSize: 11, marginLeft: 8 }}>{e.desc}</span>}
                      <span style={{ color: T.inkLight, fontSize: 11, marginLeft: 8 }}>Due: {e.due}</span>
                    </td>
                    {BUCKETS.map(b => (
                      <td key={b.key} style={{ textAlign:"right", fontFamily:"'IBM Plex Mono',monospace", fontSize: 11.5, color: e.bucket === b.key ? b.color : T.inkLight }}>
                        {e.bucket === b.key ? fmtRM(e.outstanding) : "—"}
                      </td>
                    ))}
                    <td style={{ textAlign:"right", fontFamily:"'IBM Plex Mono',monospace", fontWeight: 600, fontSize: 12, color: T.inkMid }}>{fmtRM(e.outstanding)}</td>
                    <td><BucketLabel bucket={e.bucket} days={e.overdue}/></td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
            {/* TOTALS */}
            <tr style={{ background: T.stripe }}>
              <td style={{ background: T.stripe }}/>
              <td style={{ fontWeight: 700, color: T.ink, fontSize: 12, textTransform:"uppercase", letterSpacing:.5 }}>TOTAL</td>
              {BUCKETS.map(b => (
                <td key={b.key} style={{ textAlign:"right", fontFamily:"'IBM Plex Mono',monospace", fontWeight: 700, color: b.color, fontSize: 12 }}>
                  {totals[b.key] > 0 ? fmtRM(totals[b.key]) : "—"}
                </td>
              ))}
              <td style={{ textAlign:"right", fontFamily:"'IBM Plex Mono',monospace", fontWeight: 700, color: T.ink, fontSize: 13 }}>{fmtRM(grandTotal)}</td>
              <td/>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AgingReportPage({ data }) {
  const { invoices, bills, getCustomer, getSupplier } = data;
  const [tab,          setTab]          = useState("ar");
  const [bucketFilter, setBucketFilter] = useState(null);

  const arRows = useMemo(() => buildAR(invoices, getCustomer), [invoices, getCustomer]);
  const apRows = useMemo(() => buildAP(bills, getSupplier),    [bills, getSupplier]);

  const rows       = tab === "ar" ? arRows : apRows;
  const grandTotal = rows.reduce((s,r) => s + r.total, 0);
  const totals     = BUCKETS.reduce((acc,b) => ({ ...acc, [b.key]: rows.reduce((s,r) => s + r.buckets[b.key], 0) }), {});
  const critical   = (totals.b91_120 || 0) + (totals.b120plus || 0);
  const critPct    = grandTotal > 0 ? ((critical / grandTotal) * 100).toFixed(1) : 0;

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${tab==="ar"?"active":""}`} onClick={()=>{setTab("ar");setBucketFilter(null)}}>📥 Accounts Receivable (AR)</div>
        <div className={`tab ${tab==="ap"?"active":""}`} onClick={()=>{setTab("ap");setBucketFilter(null)}}>📤 Accounts Payable (AP)</div>
      </div>

      {tab==="ar" && critical > 0 && (
        <div className="alert al-r"><span>🚨</span><div><strong>Critical: {fmtRM(critical)}</strong> ({critPct}% of AR) is over 90 days overdue. Consider bad debt provision under MPERS. Legal action may be required.</div></div>
      )}
      {tab==="ap" && (totals.b31_60+totals.b61_90+totals.b91_120+totals.b120plus) > 0 && (
        <div className="alert al-a"><span>⚠️</span><div><strong>Overdue payables detected.</strong> Late payments risk penalties and supplier relationship damage.</div></div>
      )}

      {/* Summary cards */}
      <div className="stats-4">
        <div className="card card-pad"><div className="stat-lbl">Total Outstanding</div><div className="stat-val">{fmtRM(grandTotal)}</div><div className="stat-sub">{rows.length} {tab==="ar"?"customers":"suppliers"}</div></div>
        <div className="card card-pad"><div className="stat-lbl">Current (Not Due)</div><div className="stat-val" style={{color:T.green}}>{fmtRM(totals.current||0)}</div><div className="stat-sub">{grandTotal>0?((totals.current/grandTotal)*100).toFixed(1):0}% of total</div></div>
        <div className="card card-pad"><div className="stat-lbl">1–60 Days Overdue</div><div className="stat-val" style={{color:T.amber}}>{fmtRM((totals.b1_30||0)+(totals.b31_60||0))}</div><div className="stat-sub">Needs follow-up</div></div>
        <div className="card card-pad" style={{background:T.redLight,borderColor:T.redBorder}}><div className="stat-lbl">&gt;90 Days Critical</div><div className="stat-val" style={{color:T.red}}>{fmtRM(critical)}</div><div className="stat-sub">{critPct}% — bad debt risk</div></div>
      </div>

      {/* Bucket selector */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        <button className={`btn btn-sm ${!bucketFilter?"btn-dark":"btn-out"}`} onClick={()=>setBucketFilter(null)}>All Buckets</button>
        {BUCKETS.map(b => (
          <button key={b.key} className="btn btn-sm btn-out"
            style={bucketFilter===b.key?{background:b.dim,color:b.color,borderColor:b.color+"50",fontWeight:700}:{}}
            onClick={()=>setBucketFilter(bucketFilter===b.key?null:b.key)}>
            {b.label} {totals[b.key]>0&&<span className="mono" style={{fontSize:10}}>({fmtK(totals[b.key])})</span>}
          </button>
        ))}
      </div>

      {/* Stacked bar */}
      {grandTotal > 0 && (
        <div className="card card-pad" style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 10 }}>Aging Distribution</div>
          <div style={{ display:"flex", height: 24, borderRadius: 6, overflow:"hidden", gap: 2, marginBottom: 8 }}>
            {BUCKETS.filter(b=>(totals[b.key]||0)>0).map(b=>{
              const pct = (totals[b.key]/grandTotal)*100;
              return <div key={b.key} style={{ width:`${pct}%`, background:b.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, fontWeight:700, color:"#fff", opacity:.85 }}>{pct>8?`${pct.toFixed(0)}%`:""}</div>;
            })}
          </div>
          <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
            {BUCKETS.filter(b=>(totals[b.key]||0)>0).map(b=>(
              <div key={b.key} style={{ display:"flex", alignItems:"center", gap:5, fontSize:11, color:T.inkMid }}>
                <div style={{ width:8, height:8, borderRadius:2, background:b.color, flexShrink:0 }}/>
                {b.label}: <strong style={{ color:T.ink }}>{fmtRM(totals[b.key])}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      <AgingTable rows={rows} grandTotal={grandTotal} bucketFilter={bucketFilter}/>
    </div>
  );
}
