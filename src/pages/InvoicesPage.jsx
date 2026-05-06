import React, { useState } from "react";
import { T } from "../components/tokens";
import { calcLines, fmtRM, nextId, getSSTRate, getSSTLabel } from "../utils/helpers";
import { SST_RATES } from "../data/seedData";

function StatusBadge({ s }) {
  const m={paid:"bg",pending:"ba",overdue:"br",draft:"bk"};
  const l={paid:"✓ Paid",pending:"Pending",overdue:"Overdue",draft:"Draft"};
  return <span className={`badge ${m[s]||"bk"}`}>{l[s]||s}</span>;
}

// ─── PRINT-READY INVOICE ──────────────────────────────────────────────────────
const invDocCss = `
.inv-doc{background:#fff;width:794px;min-height:1000px;padding:52px 56px;box-shadow:0 8px 40px #00000040;font-family:'IBM Plex Sans',sans-serif;color:#18160f;position:relative;font-size:12px}
.inv-wm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:80px;font-weight:900;opacity:.03;pointer-events:none;white-space:nowrap;font-family:'Lora',serif}
.inv-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px}
.inv-co-name{font-family:'Lora',serif;font-size:20px;color:#18160f;font-weight:700;margin-bottom:3px}
.inv-co-det{font-size:10.5px;color:#6a6258;line-height:1.75}
.inv-type{font-family:'Lora',serif;font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#d4310a;text-align:right;line-height:1}
.inv-num{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#4a4440;margin-top:5px;text-align:right}
.inv-parties{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:24px;padding-bottom:20px;border-bottom:1.5px solid #e5e2db}
.dp-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9a9388;margin-bottom:5px}
.dp-name{font-size:13px;font-weight:600;color:#18160f;margin-bottom:3px}
.dp-det{font-size:10.5px;color:#6a6258;line-height:1.7}
.inv-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;padding:14px 18px;background:#f7f6f3;border-radius:7px}
.dm-l{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9a9388;margin-bottom:3px}
.dm-v{font-size:12px;font-weight:600;color:#18160f}
.inv-tbl{width:100%;border-collapse:collapse;margin-bottom:22px}
.inv-tbl th{text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9a9388;padding:7px 9px;border-bottom:1.5px solid #e5e2db}
.inv-tbl th:not(:first-child){text-align:right}
.inv-tbl td{padding:9px 9px;font-size:11.5px;border-bottom:1px solid #f0ede8;color:#4a4440;vertical-align:top}
.inv-tbl td:not(:first-child){text-align:right;font-family:'IBM Plex Mono',monospace}
.inv-tbl tr:last-child td{border-bottom:none}
`;

function InvoiceDocument({ inv, customer, onClose, company }) {
  const { rows, subtotal, sstTotal, total } = calcLines(inv.items);
  return (
    <div style={{position:"fixed",inset:0,background:"#2a2520",zIndex:400,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{invDocCss}</style>
      <div style={{background:T.sidebar,padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{fontSize:13.5,fontWeight:600,color:"#c8c0b4"}}>🧾 {inv.id} — Tax Invoice</span>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-out btn-sm" style={{color:"#c8c0b4",borderColor:"#4a4440"}} onClick={()=>window.print()}>🖨️ Print</button>
          <button className="btn btn-out btn-sm" style={{color:"#c8c0b4",borderColor:"#4a4440"}} onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:28,display:"flex",justifyContent:"center"}}>
        <div className="inv-doc">
          {inv.status==="draft"&&<div className="inv-wm">DRAFT</div>}
          {inv.status==="overdue"&&<div className="inv-wm">OVERDUE</div>}
          <div className="inv-hdr">
            <div>
              <div className="inv-co-name">{company.name}</div>
              <div className="inv-co-det">SSM: {company.reg}<br/>SST: {company.sst} · TIN: {company.tin}<br/>{company.address}<br/>{company.phone} · {company.email}</div>
            </div>
            <div>
              <div className="inv-type">Tax Invoice</div>
              <div className="inv-num">{inv.id}</div>
              {inv.doRef&&<div style={{fontSize:10,background:"#edf2fd",border:"1px solid #b4c8f5",color:"#1649a0",padding:"3px 8px",borderRadius:4,marginTop:5,textAlign:"right",fontWeight:700}}>📦 DO: {inv.doRef}</div>}
              {inv.uin&&<div style={{fontSize:10,background:"#edf7f2",border:"1px solid #aad9c0",color:"#1a6b3c",padding:"3px 8px",borderRadius:4,marginTop:4,textAlign:"right",fontWeight:700}}>✓ {inv.uin}</div>}
            </div>
          </div>
          <div className="inv-parties">
            <div><div className="dp-lbl">Bill From</div><div className="dp-name">{company.name}</div><div className="dp-det">TIN: {company.tin}<br/>SST: {company.sst}<br/>SSM: {company.reg}</div></div>
            <div><div className="dp-lbl">Bill To</div><div className="dp-name">{customer?.name}</div><div className="dp-det">{customer?.tin&&<>TIN: {customer.tin}<br/></>}{customer?.reg&&<>SSM: {customer.reg}<br/></>}{customer?.sst&&<>SST: {customer.sst}<br/></>}<span style={{whiteSpace:"pre-line"}}>{customer?.address}</span></div></div>
          </div>
          <div className="inv-meta">
            {[["Invoice Date",inv.date],["Due Date",inv.due||"—"],["Currency","MYR"],["DO Reference",inv.doRef||"—"]].map(([l,v])=>(
              <div key={l}><div className="dm-l">{l}</div><div className="dm-v">{v}</div></div>
            ))}
          </div>
          <table className="inv-tbl">
            <thead><tr><th>#</th><th>Description</th><th>Part No.</th><th>Qty</th><th>Unit Price (RM)</th><th>SST</th><th>Amount (RM)</th></tr></thead>
            <tbody>
              {rows.map((it,i)=>(
                <tr key={i}>
                  <td style={{color:"#9a9388",textAlign:"left"}}>{i+1}</td>
                  <td style={{textAlign:"left"}}><div style={{fontWeight:600,color:"#18160f"}}>{it.desc}</div><div style={{fontSize:9.5,color:"#9a9388"}}>{getSSTLabel(it.sstCode||"EX")}</div></td>
                  <td style={{fontSize:10.5,color:"#9a9388"}}>{it.partNo||"—"}</td>
                  <td>{it.qty} {it.unit}</td>
                  <td>{fmtRM(it.unitPrice)}</td>
                  <td>{getSSTRate(it.sstCode||"EX")===0?"—":fmtRM(it.lineSst)}</td>
                  <td style={{fontWeight:600,color:"#18160f"}}>{fmtRM(it.lineAmt+it.lineSst)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}>
            <div style={{width:270}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",color:"#4a4440"}}><span>Subtotal (excl. SST)</span><span style={{fontFamily:"'IBM Plex Mono',monospace"}}>{fmtRM(subtotal)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",color:"#a85c00"}}><span>SST Amount</span><span style={{fontFamily:"'IBM Plex Mono',monospace"}}>{fmtRM(sstTotal)}</span></div>
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:16,padding:"8px 0 5px",borderTop:"2px solid #18160f",marginTop:4}}><span>TOTAL DUE (MYR)</span><span style={{fontFamily:"'IBM Plex Mono',monospace"}}>{fmtRM(total)}</span></div>
            </div>
          </div>
          <div style={{paddingTop:18,borderTop:"1px solid #e5e2db",display:"grid",gridTemplateColumns:"1fr auto",gap:20}}>
            <div>
              <div style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#9a9388",marginBottom:4}}>Payment</div>
              <div style={{fontSize:10.5,color:"#6a6258",lineHeight:1.7}}>{company.bank}<br/>Reference: {inv.id}</div>
              {inv.notes&&<><div style={{fontSize:9.5,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:"#9a9388",marginTop:10,marginBottom:4}}>Notes</div><div style={{fontSize:10.5,color:"#6a6258",lineHeight:1.7}}>{inv.notes}</div></>}
              <div style={{fontSize:9,color:"#9a9388",marginTop:10}}>Tax Invoice under SST Act 2018 (Malaysia). SST Reg: {company.sst}.{inv.uin?` LHDN MyInvois UIN: ${inv.uin}.`:""}</div>
            </div>
            {inv.uin&&<div style={{display:"flex",flexDirection:"column",alignItems:"flex-end"}}>
              <div style={{width:56,height:56,background:"#f0ede8",border:"1px solid #e0ddd8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,borderRadius:6,marginBottom:4}}>📱</div>
              <div style={{fontSize:9,color:"#9a9388",textAlign:"right"}}>Verify on MyInvois</div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NEW INVOICE MODAL ────────────────────────────────────────────────────────
function NewInvoiceModal({ onClose, onSave, nextInvId, customers, dos }) {
  const deliveredDOs = dos.filter(d => d.status === "delivered");
  const [f, setF] = useState({ id:nextInvId, date:"2026-04-13", due:"", customerId:"", doRef:"", items:[{desc:"",partNo:"",qty:1,unit:"service",unitPrice:"",sstCode:"S6"}], notes:"Payment due within 30 days.\nBank Transfer: Maybank 5642 1234 5678" });
  const setIt = (i,k,v) => setF(p=>{const a=[...p.items];a[i]={...a[i],[k]:v};return{...p,items:a}});
  const addIt = () => setF(p=>({...p,items:[...p.items,{desc:"",partNo:"",qty:1,unit:"service",unitPrice:"",sstCode:"S6"}]}));

  const loadFromDO = doId => {
    const doc = dos.find(d => d.id === doId);
    if (!doc) return;
    setF(p => ({ ...p, doRef: doId, customerId: doc.customerId, items: doc.items.map(it=>({...it,unitPrice:String(it.unitPrice)})) }));
  };

  const {subtotal,sstTotal,total} = calcLines(f.items.map(it=>({...it,qty:parseFloat(it.qty)||0,unitPrice:parseFloat(it.unitPrice)||0})));
  const valid = f.customerId && f.items.every(it=>it.desc&&it.unitPrice);

  const save = (status) => {
    const inv = {
      ...f, status,
      uin:  status==="pending" ? "UIN-"+Math.floor(Math.random()*900000+100000) : null,
      einv: status==="pending" ? "MYINVOIS-"+Math.random().toString(36).slice(2,10).toUpperCase() : null,
    };
    onSave(inv);
  };

  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" style={{width:740}} onClick={e=>e.stopPropagation()}>
        <div className="mh"><div className="mt">New Tax Invoice</div><div className="ms">SST Act 2018 & LHDN e-Invoice compliant</div></div>
        <div className="mb">
          {deliveredDOs.length>0&&(
            <div className="alert al-g" style={{marginBottom:12}}>
              <span>📦</span>
              <div style={{fontSize:12}}>
                <strong>{deliveredDOs.length} delivered DO(s) ready to invoice:</strong>{" "}
                {deliveredDOs.map(d=>(
                  <button key={d.id} className="btn btn-grn btn-xs" style={{marginLeft:6}} onClick={()=>loadFromDO(d.id)}>Load {d.id}</button>
                ))}
              </div>
            </div>
          )}
          <div className="fr3">
            <div className="fg"><label className="fl">Invoice No.</label><input className="fi fi-mono" value={f.id} onChange={e=>setF(p=>({...p,id:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Invoice Date</label><input className="fi" type="date" value={f.date} onChange={e=>setF(p=>({...p,date:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Due Date</label><input className="fi" type="date" value={f.due} onChange={e=>setF(p=>({...p,due:e.target.value}))}/></div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Customer *</label>
              <select className="fi" value={f.customerId} onChange={e=>setF(p=>({...p,customerId:e.target.value}))}>
                <option value="">Select customer...</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">DO Reference</label><input className="fi fi-mono" value={f.doRef} onChange={e=>setF(p=>({...p,doRef:e.target.value}))} placeholder="DO-2026-XXX (optional)"/></div>
          </div>
          <div className="sdiv" style={{marginBottom:8}}>Line Items</div>
          <div style={{fontSize:9.5,fontWeight:700,color:T.inkLight,display:"grid",gridTemplateColumns:"2.5fr 90px 70px 80px 100px 90px 28px",gap:6,padding:"5px 6px",background:T.stripe,borderRadius:6,textTransform:"uppercase",letterSpacing:.7,marginBottom:4}}>
            <span>Description</span><span>Part No.</span><span>Qty</span><span>Unit</span><span>Unit Price</span><span>SST</span><span/>
          </div>
          {f.items.map((it,i)=>{
            const la=(parseFloat(it.qty)||0)*(parseFloat(it.unitPrice)||0);
            const ls=la*getSSTRate(it.sstCode||"EX");
            return (
              <div key={i} style={{display:"grid",gridTemplateColumns:"2.5fr 90px 70px 80px 100px 90px 28px",gap:6,alignItems:"center",marginBottom:4}}>
                <input className="fi" style={{padding:"6px 8px",fontSize:12}} value={it.desc} onChange={e=>setIt(i,"desc",e.target.value)} placeholder="Description"/>
                <input className="fi fi-mono" style={{padding:"6px 7px",fontSize:11}} value={it.partNo||""} onChange={e=>setIt(i,"partNo",e.target.value)} placeholder="SKU"/>
                <input className="fi fi-mono" style={{padding:"6px 7px",fontSize:12,textAlign:"center"}} type="number" value={it.qty} onChange={e=>setIt(i,"qty",e.target.value)}/>
                <input className="fi" style={{padding:"6px 7px",fontSize:12}} value={it.unit} onChange={e=>setIt(i,"unit",e.target.value)}/>
                <input className="fi fi-mono" style={{padding:"6px 7px",fontSize:12,textAlign:"right"}} type="number" value={it.unitPrice} onChange={e=>setIt(i,"unitPrice",e.target.value)} placeholder="0.00"/>
                <select className="fi" style={{padding:"6px 5px",fontSize:11}} value={it.sstCode} onChange={e=>setIt(i,"sstCode",e.target.value)}>
                  {SST_RATES.map(r=><option key={r.code} value={r.code}>{r.code}</option>)}
                </select>
                <button onClick={()=>f.items.length>1&&setF(p=>({...p,items:p.items.filter((_,j)=>j!==i)}))} style={{width:24,height:24,border:"none",background:"transparent",cursor:"pointer",color:T.inkLight,fontSize:15,borderRadius:4}}>×</button>
              </div>
            );
          })}
          <button className="btn btn-out btn-sm" onClick={addIt} style={{marginTop:4,marginBottom:12}}>+ Add Line</button>
          <div style={{background:T.stripe,border:`1px solid ${T.border}`,borderRadius:8,padding:"12px 14px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}><span>Subtotal (excl. SST)</span><span className="mono">{fmtRM(subtotal)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:T.amber,marginBottom:3}}><span>SST</span><span className="mono">{fmtRM(sstTotal)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:16,fontWeight:700,paddingTop:8,borderTop:`1px solid ${T.border}`}}><span>TOTAL PAYABLE</span><span className="mono">{fmtRM(total)}</span></div>
          </div>
          <div className="fg"><label className="fl">Notes / Payment Terms</label><textarea className="fi" rows={2} value={f.notes} onChange={e=>setF(p=>({...p,notes:e.target.value}))} style={{resize:"vertical",fontSize:12}}/></div>
        </div>
        <div className="mf">
          <button className="btn btn-out" onClick={onClose}>Cancel</button>
          <div style={{display:"flex",gap:8}}>
            <button className="btn btn-out" onClick={()=>valid&&save("draft")} disabled={!valid}>Save Draft</button>
            <button className="btn btn-red" onClick={()=>valid&&save("pending")} disabled={!valid}>Create & Submit to MyInvois →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN INVOICES PAGE ───────────────────────────────────────────────────────
export default function InvoicesPage({ data }) {
  const { invoices, dos, customers, addInvoice, markInvoicePaid, submitToMyInvois, linkDOToInvoice, getCustomer } = data;
  const [filter, setFilter] = useState("all");
  const [modal,  setModal]  = useState(null);
  const nid = nextId("INV-2026", invoices);

  const saveInvoice = inv => {
    addInvoice(inv);
    if (inv.doRef) linkDOToInvoice(inv.doRef, inv.id);
    setModal(null);
  };

  const filtered = invoices.filter(inv => filter === "all" || inv.status === filter);

  const totalByStatus = s => invoices.filter(i=>i.status===s).reduce((sum,i)=>sum+calcLines(i.items).total,0);

  return (
    <div>
      <div className="stats-4">
        {[
          {lbl:"Total Invoiced",    val:fmtRM(invoices.reduce((s,i)=>s+calcLines(i.items).total,0)), sub:`${invoices.length} invoices`},
          {lbl:"Paid",             val:fmtRM(totalByStatus("paid")),    sub:`${invoices.filter(i=>i.status==="paid").length} invoices`,    c:T.green},
          {lbl:"Outstanding",      val:fmtRM(totalByStatus("pending")), sub:`${invoices.filter(i=>i.status==="pending").length} pending`,  c:T.amber},
          {lbl:"Overdue",          val:fmtRM(totalByStatus("overdue")), sub:`${invoices.filter(i=>i.status==="overdue").length} invoices`, c:T.red, bg:T.redLight, bc:T.redBorder},
        ].map(s=>(
          <div className="card card-pad" key={s.lbl} style={{background:s.bg,borderColor:s.bc}}>
            <div className="stat-lbl">{s.lbl}</div>
            <div className="stat-val" style={{color:s.c||T.ink}}>{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",gap:6}}>
          {["all","draft","pending","overdue","paid"].map(f=>(
            <button key={f} className={`btn btn-sm ${filter===f?"btn-dark":"btn-out"}`} onClick={()=>setFilter(f)}>
              {f==="all"?"All":f.charAt(0).toUpperCase()+f.slice(1)}
            </button>
          ))}
        </div>
        <button className="btn btn-red btn-sm" onClick={()=>setModal("new")}>＋ New Invoice</button>
      </div>

      <div className="tc">
        <div className="tc-head">
          <span className="tc-title">Tax Invoices ({filtered.length})</span>
          <span style={{fontSize:11,color:T.inkLight}}>Click row to preview</span>
        </div>
        <table>
          <thead><tr><th>Invoice No.</th><th>Customer</th><th>DO Ref</th><th>Date</th><th>Due</th><th>Subtotal</th><th>SST</th><th>Total</th><th>e-Invoice</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {filtered.map(inv=>{
              const cust = getCustomer(inv.customerId);
              const {subtotal,sstTotal,total} = calcLines(inv.items);
              return (
                <tr key={inv.id} onClick={()=>setModal({type:"view",inv})}>
                  <td className="mono" style={{color:T.red,fontWeight:600,fontSize:12}}>{inv.id}</td>
                  <td><div style={{fontWeight:600,color:T.ink}}>{cust?.name||inv.customerId}</div></td>
                  <td onClick={e=>e.stopPropagation()}>{inv.doRef?<span className="badge bb" style={{fontSize:10}}>{inv.doRef}</span>:<span style={{color:T.inkLight,fontSize:12}}>—</span>}</td>
                  <td style={{color:T.inkLight}}>{inv.date}</td>
                  <td style={{color:inv.status==="overdue"?T.red:T.inkLight}}>{inv.due||"—"}</td>
                  <td className="mono" style={{fontSize:12}}>{fmtRM(subtotal)}</td>
                  <td className="mono" style={{fontSize:12,color:T.amber}}>{fmtRM(sstTotal)}</td>
                  <td className="mono" style={{fontWeight:600}}>{fmtRM(total)}</td>
                  <td onClick={e=>e.stopPropagation()}>
                    {inv.uin
                      ? <div><span className="einv-b">✓ UIN</span><div style={{fontSize:9.5,color:T.inkLight,marginTop:1,fontFamily:"'IBM Plex Mono',monospace"}}>{inv.uin}</div></div>
                      : <button className="btn btn-out btn-xs" onClick={e=>{e.stopPropagation();submitToMyInvois(inv.id)}}>Submit →</button>}
                  </td>
                  <td><StatusBadge s={inv.status}/></td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",gap:5}}>
                      <button className="btn btn-out btn-xs" onClick={e=>{e.stopPropagation();setModal({type:"view",inv})}}>👁</button>
                      {inv.status==="pending"&&<button className="btn btn-grn btn-xs" onClick={e=>{e.stopPropagation();markInvoicePaid(inv.id)}}>Paid</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal==="new"&&<NewInvoiceModal onClose={()=>setModal(null)} onSave={saveInvoice} nextInvId={nid} customers={customers} dos={dos}/>}
      {modal?.type==="view"&&<InvoiceDocument inv={modal.inv} customer={getCustomer(modal.inv.customerId)} onClose={()=>setModal(null)} company={data.company}/>}
    </div>
  );
}
