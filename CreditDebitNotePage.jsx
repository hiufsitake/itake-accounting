import React, { useState } from "react";
import { T } from "../components/tokens";
import { MY_COMPANY } from "../data/seedData";
import { calcLines, fmtRM } from "../utils/helpers";

const nextId = (prefix, list) => `${prefix}-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, "0")}`;

const CN_REASONS = ["Pricing Error","Goods Returned","Service Not Rendered","Duplicate Invoice","Discount Granted","Quantity Adjustment","Cancelled Order","Other"];
const DN_REASONS = ["Additional Charges","Price Increase","Underbilling","Additional Services","Interest on Overdue","Short Delivery Correction","Other"];

const SEED_CN = [
  { id:"CN-2026-001", date:"2026-04-03", invoiceRef:"INV-2026-003", customerId:"CUST-003", customerName:"TechNova Pte Ltd", reason:"Pricing Error", description:"Correction of hourly rate: billed RM180 should be RM160 for 10 hours", amount:200.00, sst:12.00, total:212.00, status:"issued", einv:"MYINVOIS-CN-A1B2" },
  { id:"CN-2026-002", date:"2026-04-08", invoiceRef:"INV-2026-004", customerId:"CUST-005", customerName:"Mega Retail Group Bhd", reason:"Discount Granted", description:"Loyalty discount 5% on annual licence fee", amount:1100.00, sst:66.00, total:1166.00, status:"draft", einv:null },
];

const SEED_DN = [
  { id:"DN-2026-001", date:"2026-04-05", invoiceRef:"INV-2026-002", customerId:"CUST-002", customerName:"Blue Horizon Sdn Bhd", reason:"Additional Services", description:"Additional customisation hours not in original scope: 5hrs × RM200", amount:1000.00, sst:60.00, total:1060.00, status:"issued", einv:"MYINVOIS-DN-C3D4" },
];

const docCss = `
.ndoc{background:#fff;width:700px;padding:48px 52px;font-family:'IBM Plex Sans',sans-serif;color:#18160f;font-size:12px;box-shadow:0 4px 28px #00000028;position:relative}
.ndoc-wm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:70px;font-weight:900;opacity:.04;pointer-events:none;white-space:nowrap;font-family:'Lora',serif}
.ndoc-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:16px;border-bottom:2px solid #18160f}
.ndoc-type{font-family:'Lora',serif;font-size:26px;font-weight:700;text-align:right;line-height:1}
.ndoc-num{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#4a4440;text-align:right;margin-top:4px}
.ndoc-co{font-family:'Lora',serif;font-size:16px;font-weight:700;color:#18160f;margin-bottom:3px}
.ndoc-det{font-size:10px;color:#6a6258;line-height:1.7}
.ndoc-parties{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:18px;padding-bottom:16px;border-bottom:1px solid #e5e2db}
.ndoc-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;background:#f7f6f3;padding:11px 14px;border-radius:7px;margin-bottom:18px}
.nm-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9a9388;margin-bottom:2px}
.nm-val{font-size:12px;font-weight:600;color:#18160f}
.ndoc-tbl{width:100%;border-collapse:collapse;margin-bottom:16px;font-size:11.5px}
.ndoc-tbl th{text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9a9388;padding:6px 8px;border-bottom:1.5px solid #e5e2db}
.ndoc-tbl th:last-child{text-align:right}
.ndoc-tbl td{padding:8px 8px;border-bottom:1px solid #f0ede8;color:#4a4440}
.ndoc-tbl td:last-child{text-align:right;font-family:'IBM Plex Mono',monospace;font-weight:600}
`;

function NoteDocument({ note, type, onClose }) {
  const isCN  = type === "cn";
  const color = isCN ? T.amber : T.red;
  const label = isCN ? "Credit Note" : "Debit Note";
  return (
    <div style={{ position:"fixed",inset:0,background:"#2a2520",zIndex:400,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <style>{docCss}</style>
      <div style={{ background:T.sidebar,padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <span style={{ fontSize:13.5,fontWeight:600,color:"#c8c0b4" }}>{isCN?"🟡":"🔴"} {note.id} — {label}</span>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={() => window.print()}>🖨️ Print</button>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:28,display:"flex",justifyContent:"center" }}>
        <div className="ndoc">
          {note.status==="draft" && <div className="ndoc-wm">DRAFT</div>}
          <div className="ndoc-hdr">
            <div>
              <div className="ndoc-co">{MY_COMPANY.name}</div>
              <div className="ndoc-det">SSM: {MY_COMPANY.reg}<br/>SST: {MY_COMPANY.sst} · TIN: {MY_COMPANY.tin}<br/>{MY_COMPANY.address}</div>
            </div>
            <div>
              <div className="ndoc-type" style={{ color }}>{label}</div>
              <div className="ndoc-num">{note.id}</div>
              {note.einv && <div style={{ marginTop:5,background:"#e8f0ff",border:"1px solid #b0c8f8",borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,color:"#1040b0",textAlign:"right" }}>✓ MyInvois: {note.einv}</div>}
            </div>
          </div>

          <div className="ndoc-parties">
            <div>
              <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"#9a9388",marginBottom:5 }}>Issued By</div>
              <div style={{ fontSize:13,fontWeight:600,marginBottom:2 }}>{MY_COMPANY.name}</div>
              <div style={{ fontSize:10.5,color:"#6a6258" }}>TIN: {MY_COMPANY.tin}<br/>SST: {MY_COMPANY.sst}</div>
            </div>
            <div>
              <div style={{ fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:1.5,color:"#9a9388",marginBottom:5 }}>Issued To</div>
              <div style={{ fontSize:13,fontWeight:600,marginBottom:2 }}>{note.customerName}</div>
              <div style={{ fontSize:10.5,color:"#6a6258" }}>Ref Invoice: {note.invoiceRef}</div>
            </div>
          </div>

          <div className="ndoc-meta">
            {[["Note Date",note.date],["Original Invoice",note.invoiceRef],["Reason",note.reason]].map(([l,v]) => (
              <div key={l}><div className="nm-lbl">{l}</div><div className="nm-val">{v}</div></div>
            ))}
          </div>

          <table className="ndoc-tbl">
            <thead>
              <tr>
                <th>Description</th>
                <th style={{ textAlign:"right" }}>Amount (RM)</th>
                <th style={{ textAlign:"right" }}>SST (RM)</th>
                <th style={{ textAlign:"right" }}>Total (RM)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ fontWeight:600,color:"#18160f" }}>{note.description}</td>
                <td>{fmtRM(note.amount)}</td>
                <td style={{ color:"#a85c00" }}>{fmtRM(note.sst)}</td>
                <td style={{ color,fontWeight:700 }}>{fmtRM(note.total)}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:18 }}>
            <div style={{ width:260 }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:12.5,padding:"4px 0",color:"#4a4440" }}><span>Amount (excl. SST)</span><span className="mono">{fmtRM(note.amount)}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:12.5,padding:"4px 0",color:"#a85c00" }}><span>SST</span><span className="mono">{fmtRM(note.sst)}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700,padding:"8px 0 5px",borderTop:"2px solid #18160f",marginTop:4,color }}>
                <span>{isCN ? "Total Credit" : "Total Debit"}</span><span className="mono">{fmtRM(note.total)}</span>
              </div>
            </div>
          </div>

          <div style={{ background: isCN ? "#fef7ec" : "#fef2ee", border:`1px solid ${isCN?T.amberBorder:T.redBorder}`, borderRadius:7, padding:"10px 14px", fontSize:11, color: isCN ? T.amber : T.red, marginBottom:14 }}>
            <strong>{isCN ? "This Credit Note reduces" : "This Debit Note increases"}</strong> the value of Invoice {note.invoiceRef} by <strong>{fmtRM(note.total)}</strong>. {isCN ? "Customer account will be credited." : "Customer account will be debited."}
          </div>

          <div style={{ fontSize:9.5,color:"#9a9388",borderTop:"1px solid #e5e2db",paddingTop:10 }}>
            Issued under SST Act 2018 (Malaysia).{note.einv?` Validated by LHDN MyInvois: ${note.einv}.`:""} This document must be retained for 7 years per Income Tax Act 1967 s82.
          </div>
        </div>
      </div>
    </div>
  );
}

function NewNoteModal({ type, onClose, onSave, nextId: nid, customers, invoices }) {
  const isCN    = type === "cn";
  const reasons = isCN ? CN_REASONS : DN_REASONS;
  const [f, setF] = useState({ id:nid, date:"2026-04-13", invoiceRef:"", customerId:"", customerName:"", reason:reasons[0], description:"", amount:"", sstRate:0.06 });

  const amt  = parseFloat(f.amount) || 0;
  const sst  = amt * f.sstRate;
  const tot  = amt + sst;
  const valid = f.customerId && f.amount && f.description && f.invoiceRef;

  const loadFromInvoice = invId => {
    const inv = invoices.find(i => i.id === invId);
    if (!inv) return;
    setF(p => ({ ...p, invoiceRef: invId, customerId: inv.customerId }));
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mh">
          <div className="mt">New {isCN ? "Credit Note" : "Debit Note"}</div>
          <div className="ms">{isCN ? "Reduces the value of an existing invoice (refund / discount / correction)" : "Increases the value of an existing invoice (additional charges)"}</div>
        </div>
        <div className="mb">
          <div className="alert al-b" style={{ marginBottom:12 }}>
            <span>📋</span>
            <div style={{ fontSize:12 }}>Per LHDN e-Invoice rules: {isCN ? "Credit Notes" : "Debit Notes"} must reference the original invoice and be submitted to MyInvois. After the 72-hour cancellation window, only {isCN?"a Credit Note":"a Debit Note"} can adjust an invoice.</div>
          </div>
          <div className="fr3">
            <div className="fg"><label className="fl">{isCN?"CN":"DN"} Number</label><input className="fi fi-mono" value={f.id} onChange={e=>setF(p=>({...p,id:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Date</label><input className="fi" type="date" value={f.date} onChange={e=>setF(p=>({...p,date:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Reason</label>
              <select className="fi" value={f.reason} onChange={e=>setF(p=>({...p,reason:e.target.value}))}>
                {reasons.map(r=><option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Original Invoice *</label>
              <select className="fi" value={f.invoiceRef} onChange={e=>loadFromInvoice(e.target.value)}>
                <option value="">-- Select Invoice --</option>
                {invoices.filter(i=>i.status!=="draft").map(i=><option key={i.id} value={i.id}>{i.id}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Customer *</label>
              <select className="fi" value={f.customerId} onChange={e=>{const c=customers.find(x=>x.id===e.target.value);setF(p=>({...p,customerId:e.target.value,customerName:c?.name||""}));}}>
                <option value="">-- Select Customer --</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
          <div className="fg"><label className="fl">Description / Narration *</label><input className="fi" value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} placeholder="Explain the adjustment..."/></div>
          <div className="fr2">
            <div className="fg"><label className="fl">Amount (excl. SST) (RM) *</label><input className="fi fi-mono" type="number" value={f.amount} onChange={e=>setF(p=>({...p,amount:e.target.value}))}/></div>
            <div className="fg"><label className="fl">SST Rate</label>
              <select className="fi" value={f.sstRate} onChange={e=>setF(p=>({...p,sstRate:parseFloat(e.target.value)}))}>
                <option value={0.06}>Service Tax 6%</option>
                <option value={0.10}>Sales Tax 10%</option>
                <option value={0.05}>Sales Tax 5%</option>
                <option value={0}>SST Exempt</option>
              </select>
            </div>
          </div>
          {f.amount && (
            <div style={{ background:isCN?T.amberLight:T.redLight,border:`1px solid ${isCN?T.amberBorder:T.redBorder}`,borderRadius:8,padding:"10px 13px" }}>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3 }}><span>Amount</span><span className="mono">{fmtRM(amt)}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:13,color:T.amber,marginBottom:3 }}><span>SST</span><span className="mono">{fmtRM(sst)}</span></div>
              <div style={{ display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:700,paddingTop:8,borderTop:`1px solid ${isCN?T.amberBorder:T.redBorder}`,color:isCN?T.amber:T.red }}>
                <span>Total {isCN?"Credit":"Debit"}</span><span className="mono">{fmtRM(tot)}</span>
              </div>
            </div>
          )}
        </div>
        <div className="mf">
          <button className="btn btn-out" onClick={onClose}>Cancel</button>
          <div style={{ display:"flex",gap:8 }}>
            <button className="btn btn-out" onClick={()=>valid&&onSave({...f,amount:amt,sst,total:tot,status:"draft",einv:null})} disabled={!valid}>Save Draft</button>
            <button className="btn btn-dark" onClick={()=>valid&&onSave({...f,amount:amt,sst,total:tot,status:"issued",einv:"MYINVOIS-"+Math.random().toString(36).slice(2,8).toUpperCase()})} disabled={!valid}>Issue & Submit MyInvois</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CreditDebitNotePage({ data }) {
  const { customers = [], invoices = [] } = data || {};
  const [tab,   setTab]   = useState("cn");
  const [cns,   setCNs]   = useState(SEED_CN);
  const [dns,   setDNs]   = useState(SEED_DN);
  const [modal, setModal] = useState(null);

  const nextCN = nextId("CN-2026", cns);
  const nextDN = nextId("DN-2026", dns);

  return (
    <div>
      <div className="alert al-b">
        <span>📋</span>
        <div><strong>LHDN e-Invoice Rule:</strong> Once the 72-hour cancellation window has passed, invoices cannot be cancelled — only adjusted via Credit Note (reduce) or Debit Note (increase). Both must be submitted to MyInvois and will receive their own UIN.</div>
      </div>

      <div className="tabs">
        <div className={`tab ${tab==="cn"?"active":""}`} onClick={()=>setTab("cn")}>🟡 Credit Notes ({cns.length})</div>
        <div className={`tab ${tab==="dn"?"active":""}`} onClick={()=>setTab("dn")}>🔴 Debit Notes ({dns.length})</div>
      </div>

      {/* ── CREDIT NOTES ── */}
      {tab === "cn" && (
        <>
          <div className="stats-3">
            <div className="card card-pad"><div className="stat-lbl">Total Credit Notes</div><div className="stat-val">{cns.length}</div></div>
            <div className="card card-pad"><div className="stat-lbl">Total Credits Issued</div><div className="stat-val" style={{color:T.amber}}>{fmtRM(cns.filter(c=>c.status==="issued").reduce((s,c)=>s+c.total,0))}</div></div>
            <div className="card card-pad"><div className="stat-lbl">MyInvois Validated</div><div className="stat-val" style={{color:T.green}}>{cns.filter(c=>c.einv).length}</div></div>
          </div>
          <div className="tc">
            <div className="tc-head">
              <span className="tc-title">Credit Notes — reduce invoice value</span>
              <button className="btn btn-out btn-sm" style={{ borderColor:T.amber,color:T.amber }} onClick={()=>setModal("newCN")}>＋ New Credit Note</button>
            </div>
            <table>
              <thead><tr><th>CN No.</th><th>Date</th><th>Customer</th><th>Original Invoice</th><th>Reason</th><th style={{textAlign:"right"}}>Amount</th><th style={{textAlign:"right"}}>Total (incl. SST)</th><th>MyInvois</th><th>Status</th><th/></tr></thead>
              <tbody>
                {cns.map(cn => (
                  <tr key={cn.id} onClick={()=>setModal({type:"viewCN",note:cn})}>
                    <td className="mono" style={{color:T.amber,fontWeight:600,fontSize:12}}>{cn.id}</td>
                    <td style={{color:T.inkLight}}>{cn.date}</td>
                    <td style={{fontWeight:600,color:T.ink}}>{cn.customerName}</td>
                    <td onClick={e=>e.stopPropagation()}><span className="badge br" style={{fontSize:10}}>{cn.invoiceRef}</span></td>
                    <td style={{fontSize:12,color:T.inkMid}}>{cn.reason}</td>
                    <td className="mono" style={{textAlign:"right",fontSize:12}}>{fmtRM(cn.amount)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:600,color:T.amber}}>{fmtRM(cn.total)}</td>
                    <td onClick={e=>e.stopPropagation()}>{cn.einv?<span className="einv-b">✓ UIN</span>:<span style={{fontSize:11,color:T.amber}}>Pending</span>}</td>
                    <td><span className={`badge ${cn.status==="issued"?"ba":"bk"}`}>{cn.status==="issued"?"Issued":"Draft"}</span></td>
                    <td onClick={e=>e.stopPropagation()}><button className="btn btn-out btn-xs" onClick={e=>{e.stopPropagation();setModal({type:"viewCN",note:cn})}}>👁</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── DEBIT NOTES ── */}
      {tab === "dn" && (
        <>
          <div className="stats-3">
            <div className="card card-pad"><div className="stat-lbl">Total Debit Notes</div><div className="stat-val">{dns.length}</div></div>
            <div className="card card-pad"><div className="stat-lbl">Total Debits Issued</div><div className="stat-val" style={{color:T.red}}>{fmtRM(dns.filter(d=>d.status==="issued").reduce((s,d)=>s+d.total,0))}</div></div>
            <div className="card card-pad"><div className="stat-lbl">MyInvois Validated</div><div className="stat-val" style={{color:T.green}}>{dns.filter(d=>d.einv).length}</div></div>
          </div>
          <div className="tc">
            <div className="tc-head">
              <span className="tc-title">Debit Notes — increase invoice value</span>
              <button className="btn btn-out btn-sm" style={{ borderColor:T.red,color:T.red }} onClick={()=>setModal("newDN")}>＋ New Debit Note</button>
            </div>
            <table>
              <thead><tr><th>DN No.</th><th>Date</th><th>Customer</th><th>Original Invoice</th><th>Reason</th><th style={{textAlign:"right"}}>Amount</th><th style={{textAlign:"right"}}>Total (incl. SST)</th><th>MyInvois</th><th>Status</th><th/></tr></thead>
              <tbody>
                {dns.map(dn => (
                  <tr key={dn.id} onClick={()=>setModal({type:"viewDN",note:dn})}>
                    <td className="mono" style={{color:T.red,fontWeight:600,fontSize:12}}>{dn.id}</td>
                    <td style={{color:T.inkLight}}>{dn.date}</td>
                    <td style={{fontWeight:600,color:T.ink}}>{dn.customerName}</td>
                    <td onClick={e=>e.stopPropagation()}><span className="badge br" style={{fontSize:10}}>{dn.invoiceRef}</span></td>
                    <td style={{fontSize:12,color:T.inkMid}}>{dn.reason}</td>
                    <td className="mono" style={{textAlign:"right",fontSize:12}}>{fmtRM(dn.amount)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:600,color:T.red}}>{fmtRM(dn.total)}</td>
                    <td onClick={e=>e.stopPropagation()}>{dn.einv?<span className="einv-b">✓ UIN</span>:<span style={{fontSize:11,color:T.amber}}>Pending</span>}</td>
                    <td><span className={`badge ${dn.status==="issued"?"br":"bk"}`}>{dn.status==="issued"?"Issued":"Draft"}</span></td>
                    <td onClick={e=>e.stopPropagation()}><button className="btn btn-out btn-xs" onClick={e=>{e.stopPropagation();setModal({type:"viewDN",note:dn})}}>👁</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal==="newCN"           && <NewNoteModal type="cn" onClose={()=>setModal(null)} onSave={n=>{setCNs(p=>[n,...p]);setModal(null)}} nextId={nextCN} customers={customers} invoices={invoices}/>}
      {modal==="newDN"           && <NewNoteModal type="dn" onClose={()=>setModal(null)} onSave={n=>{setDNs(p=>[n,...p]);setModal(null)}} nextId={nextDN} customers={customers} invoices={invoices}/>}
      {modal?.type==="viewCN"    && <NoteDocument note={modal.note} type="cn" onClose={()=>setModal(null)}/>}
      {modal?.type==="viewDN"    && <NoteDocument note={modal.note} type="dn" onClose={()=>setModal(null)}/>}
    </div>
  );
}
