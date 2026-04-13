import React, { useState } from "react";
import { T } from "../components/tokens";
import { calcLines, fmtRM, nextId } from "../utils/helpers";
import { MY_COMPANY, SST_RATES } from "../data/seedData";

function StatusBadge({ s }) {
  const m = { "pending":"ba","delivered":"bg","invoiced":"bp" };
  const l = { "pending":"Pending Delivery","delivered":"✓ Delivered","invoiced":"Invoiced" };
  return <span className={`badge ${m[s]||"bk"}`}>{l[s]||s}</span>;
}

// ─── PRINT-READY DO DOCUMENT ─────────────────────────────────────────────────
const docCss = `
.doc{background:#fff;width:794px;min-height:1000px;padding:52px 56px;box-shadow:0 8px 40px #00000040;font-family:'IBM Plex Sans',sans-serif;color:#18160f;position:relative;font-size:12px}
.doc-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:30px}
.doc-co-name{font-family:'Lora',serif;font-size:20px;color:#18160f;font-weight:700;margin-bottom:3px}
.doc-co-det{font-size:10.5px;color:#6a6258;line-height:1.75}
.doc-type{font-family:'Lora',serif;font-size:28px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1649a0;text-align:right;line-height:1}
.doc-num{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#4a4440;margin-top:5px;text-align:right}
.doc-parties{display:grid;grid-template-columns:1fr 1fr;gap:28px;margin-bottom:24px;padding-bottom:20px;border-bottom:1.5px solid #e5e2db}
.dp-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1.5px;color:#9a9388;margin-bottom:5px}
.dp-name{font-size:13px;font-weight:600;color:#18160f;margin-bottom:3px}
.dp-det{font-size:10.5px;color:#6a6258;line-height:1.7}
.doc-meta{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:24px;padding:14px 18px;background:#f7f6f3;border-radius:7px}
.dm-l{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9a9388;margin-bottom:3px}
.dm-v{font-size:12px;font-weight:600;color:#18160f}
.doc-tbl{width:100%;border-collapse:collapse;margin-bottom:22px}
.doc-tbl th{text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9a9388;padding:7px 9px;border-bottom:1.5px solid #e5e2db}
.doc-tbl th:not(:first-child){text-align:right}
.doc-tbl td{padding:9px 9px;font-size:11.5px;border-bottom:1px solid #f0ede8;color:#4a4440;vertical-align:top}
.doc-tbl td:not(:first-child){text-align:right;font-family:'IBM Plex Mono',monospace}
.doc-tbl tr:last-child td{border-bottom:none}
.sig-box{border:1.5px dashed #c8c3ba;border-radius:8px;padding:16px 18px;margin-top:16px}
.sig-title{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9a9388;margin-bottom:10px}
.sig-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.sig-field{border-top:1px solid #c8c3ba;padding-top:6px;font-size:9.5px;color:#9a9388}
.sig-filled{font-size:12px;font-weight:600;color:#18160f;margin-bottom:4px}
`;

function DODocument({ doc, customer, onClose }) {
  const { rows, subtotal, sstTotal, total } = calcLines(doc.items);
  return (
    <div style={{ position:"fixed",inset:0,background:"#2a2520",zIndex:400,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <style>{docCss}</style>
      <div style={{ background:T.sidebar,padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <span style={{ fontSize:13.5,fontWeight:600,color:"#c8c0b4" }}>📦 {doc.id} — Delivery Order</span>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={() => window.print()}>🖨️ Print</button>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:28,display:"flex",justifyContent:"center" }}>
        <div className="doc">
          <div className="doc-hdr">
            <div>
              <div className="doc-co-name">{MY_COMPANY.name}</div>
              <div className="doc-co-det">SSM: {MY_COMPANY.reg}<br/>SST: {MY_COMPANY.sst} · TIN: {MY_COMPANY.tin}<br/>{MY_COMPANY.address}<br/>{MY_COMPANY.phone} · {MY_COMPANY.email}</div>
            </div>
            <div><div className="doc-type">Delivery Order</div><div className="doc-num">{doc.id}</div>{doc.invoiceRef&&<div style={{fontSize:10,background:"#f5f0ff",border:"1px solid #d4b8f8",color:"#6b21a8",padding:"3px 8px",borderRadius:4,marginTop:5,textAlign:"right",fontWeight:700}}>🧾 {doc.invoiceRef}</div>}</div>
          </div>
          <div className="doc-parties">
            <div><div className="dp-lbl">Delivered By</div><div className="dp-name">{MY_COMPANY.name}</div><div className="dp-det">TIN: {MY_COMPANY.tin}<br/>SSM: {MY_COMPANY.reg}</div></div>
            <div><div className="dp-lbl">Delivered To</div><div className="dp-name">{customer?.name}</div><div className="dp-det">{customer?.tin&&<>TIN: {customer.tin}<br/></>}{customer?.reg&&<>SSM: {customer.reg}<br/></>}<span style={{whiteSpace:"pre-line"}}>{customer?.address}</span></div></div>
          </div>
          <div className="doc-meta">
            {[["DO Number",doc.id],["DO Date",doc.date],["Delivery Date",doc.deliveryDate||"—"],["Deliver To",doc.deliverTo||"—"]].map(([l,v])=>(
              <div key={l}><div className="dm-l">{l}</div><div className="dm-v">{v}</div></div>
            ))}
          </div>
          <table className="doc-tbl">
            <thead><tr><th>#</th><th>Item Description</th><th>Part No.</th><th>Qty</th><th>Unit</th><th>Unit Price (RM)</th><th>Amount (RM)</th></tr></thead>
            <tbody>
              {rows.map((it,i)=>(
                <tr key={i}>
                  <td style={{color:"#9a9388",fontSize:10.5,textAlign:"left"}}>{i+1}</td>
                  <td style={{fontWeight:600,color:"#18160f",textAlign:"left"}}>{it.desc}</td>
                  <td style={{fontSize:10.5,color:"#9a9388"}}>{it.partNo||"—"}</td>
                  <td>{it.qty}</td><td style={{color:"#9a9388"}}>{it.unit}</td>
                  <td>{fmtRM(it.unitPrice)}</td>
                  <td style={{fontWeight:600,color:"#18160f"}}>{fmtRM(it.lineAmt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}>
            <div style={{width:260}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",color:"#4a4440"}}><span>Subtotal (excl. SST)</span><span style={{fontFamily:"'IBM Plex Mono',monospace"}}>{fmtRM(subtotal)}</span></div>
              {sstTotal>0&&<div style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"4px 0",color:"#a85c00"}}><span>SST</span><span style={{fontFamily:"'IBM Plex Mono',monospace"}}>{fmtRM(sstTotal)}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",fontWeight:700,fontSize:15,padding:"8px 0 5px",borderTop:"2px solid #18160f",marginTop:4}}><span>TOTAL VALUE (MYR)</span><span style={{fontFamily:"'IBM Plex Mono',monospace"}}>{fmtRM(total)}</span></div>
            </div>
          </div>
          {doc.remarks&&<div style={{marginBottom:16,padding:"10px 14px",background:"#f7f6f3",borderRadius:7,fontSize:11,color:"#6a6258"}}><strong style={{color:"#4a4440"}}>Remarks:</strong> {doc.remarks}</div>}
          <div className="sig-box">
            <div className="sig-title">Acknowledgement of Receipt — Please sign and return a copy</div>
            <div className="sig-grid">
              <div>{doc.receivedBy&&<div className="sig-filled">{doc.receivedBy}</div>}<div className="sig-field">Received By (Name & Signature)</div></div>
              <div>{doc.receivedDate&&<div className="sig-filled">{doc.receivedDate}</div>}<div className="sig-field">Date Received</div></div>
              <div>{doc.signature&&<div className="sig-filled" style={{color:"#1a6b3c"}}>✓ Goods Verified</div>}<div className="sig-field">Condition / Stamp</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NEW DO FORM ──────────────────────────────────────────────────────────────
function NewDOModal({ onClose, onSave, nextId: nid, customers }) {
  const [f, setF] = useState({ id:nid, date:"2026-04-13", deliveryDate:"", customerId:"", deliverTo:"", items:[{desc:"",partNo:"",qty:1,unit:"unit",unitPrice:"",sstCode:"ST10"}], remarks:"" });
  const setIt = (i,k,v) => setF(p=>{const a=[...p.items];a[i]={...a[i],[k]:v};return{...p,items:a}});
  const addIt = () => setF(p=>({...p,items:[...p.items,{desc:"",partNo:"",qty:1,unit:"unit",unitPrice:"",sstCode:"ST10"}]}));
  const delIt = i => setF(p=>({...p,items:p.items.filter((_,j)=>j!==i)}));
  const {subtotal,sstTotal,total} = calcLines(f.items.map(it=>({...it,qty:parseFloat(it.qty)||0,unitPrice:parseFloat(it.unitPrice)||0})));
  const valid = f.customerId && f.items.every(it=>it.desc&&it.unitPrice);

  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="mh"><div className="mt">New Delivery Order</div><div className="ms">Issue before delivering goods. Customer signs this as proof of receipt.</div></div>
        <div className="mb">
          <div className="fr3">
            <div className="fg"><label className="fl">DO Number</label><input className="fi fi-mono" value={f.id} onChange={e=>setF(p=>({...p,id:e.target.value}))}/></div>
            <div className="fg"><label className="fl">DO Date *</label><input className="fi" type="date" value={f.date} onChange={e=>setF(p=>({...p,date:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Expected Delivery</label><input className="fi" type="date" value={f.deliveryDate} onChange={e=>setF(p=>({...p,deliveryDate:e.target.value}))}/></div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Customer *</label>
              <select className="fi" value={f.customerId} onChange={e=>setF(p=>({...p,customerId:e.target.value}))}>
                <option value="">Select customer...</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Deliver To (Location)</label><input className="fi" value={f.deliverTo} onChange={e=>setF(p=>({...p,deliverTo:e.target.value}))} placeholder="e.g. Warehouse B, Level 2"/></div>
          </div>
          <div className="sdiv" style={{marginBottom:8}}>Items</div>
          <div style={{fontSize:9.5,fontWeight:700,color:T.inkLight,display:"grid",gridTemplateColumns:"2.5fr 90px 70px 80px 100px 90px 28px",gap:6,padding:"5px 6px",background:T.stripe,borderRadius:6,textTransform:"uppercase",letterSpacing:.7,marginBottom:4}}>
            <span>Description</span><span>Part No.</span><span>Qty</span><span>Unit</span><span>Unit Price</span><span>SST</span><span/>
          </div>
          {f.items.map((it,i)=>(
            <div key={i} style={{display:"grid",gridTemplateColumns:"2.5fr 90px 70px 80px 100px 90px 28px",gap:6,alignItems:"center",marginBottom:4}}>
              <input className="fi" style={{padding:"6px 8px",fontSize:12}} value={it.desc} onChange={e=>setIt(i,"desc",e.target.value)} placeholder="Item description"/>
              <input className="fi fi-mono" style={{padding:"6px 7px",fontSize:11}} value={it.partNo} onChange={e=>setIt(i,"partNo",e.target.value)} placeholder="SKU"/>
              <input className="fi fi-mono" style={{padding:"6px 7px",fontSize:12,textAlign:"center"}} type="number" value={it.qty} onChange={e=>setIt(i,"qty",e.target.value)}/>
              <input className="fi" style={{padding:"6px 7px",fontSize:12}} value={it.unit} onChange={e=>setIt(i,"unit",e.target.value)}/>
              <input className="fi fi-mono" style={{padding:"6px 7px",fontSize:12,textAlign:"right"}} type="number" value={it.unitPrice} onChange={e=>setIt(i,"unitPrice",e.target.value)} placeholder="0.00"/>
              <select className="fi" style={{padding:"6px 5px",fontSize:11}} value={it.sstCode} onChange={e=>setIt(i,"sstCode",e.target.value)}>
                {SST_RATES.map(r=><option key={r.code} value={r.code}>{r.code}</option>)}
              </select>
              <button onClick={()=>f.items.length>1&&delIt(i)} style={{width:24,height:24,border:"none",background:"transparent",cursor:"pointer",color:T.inkLight,fontSize:15,borderRadius:4}}>×</button>
            </div>
          ))}
          <button className="btn btn-out btn-sm" onClick={addIt} style={{marginTop:4}}>+ Add Item</button>
          <div style={{background:T.stripe,border:`1px solid ${T.border}`,borderRadius:8,padding:"12px 14px",marginTop:12}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,marginBottom:3}}><span>Subtotal</span><span className="mono">{fmtRM(subtotal)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:T.amber,marginBottom:3}}><span>SST</span><span className="mono">{fmtRM(sstTotal)}</span></div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:15,fontWeight:700,paddingTop:8,borderTop:`1px solid ${T.border}`}}><span>Total Value</span><span className="mono">{fmtRM(total)}</span></div>
          </div>
          <div className="fg" style={{marginTop:12}}><label className="fl">Remarks</label><input className="fi" value={f.remarks} onChange={e=>setF(p=>({...p,remarks:e.target.value}))} placeholder="Special instructions..."/></div>
        </div>
        <div className="mf">
          <button className="btn btn-out" onClick={onClose}>Cancel</button>
          <button className="btn btn-dark" onClick={()=>valid&&onSave({...f,status:"pending",invoiceRef:null,receivedBy:"",receivedDate:"",signature:false})} disabled={!valid}>Create DO 📦</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN DO PAGE ─────────────────────────────────────────────────────────────
export default function DeliveryOrdersPage({ data }) {
  const { dos, customers, markDODelivered, addDO, linkDOToInvoice, getCustomer } = data;
  const [modal, setModal] = useState(null);
  const nid = nextId("DO-2026", dos);

  const saveDO = doc => { addDO(doc); setModal(null); };
  const doDelivered = id => { markDODelivered(id); };

  return (
    <div>
      {dos.filter(d=>d.status==="delivered").length>0&&(
        <div className="alert al-a"><span>⚡</span><div><strong>{dos.filter(d=>d.status==="delivered").length} DO(s) delivered but not yet invoiced.</strong> Go to Tax Invoices to convert them.</div></div>
      )}
      <div className="stats-4">
        {[
          {lbl:"Total DOs",val:dos.length,sub:"All records"},
          {lbl:"Pending Delivery",val:dos.filter(d=>d.status==="pending").length,sub:"Not yet delivered",c:T.amber},
          {lbl:"Delivered",val:dos.filter(d=>d.status==="delivered").length,sub:"Awaiting invoice",c:T.green},
          {lbl:"Invoiced",val:dos.filter(d=>d.status==="invoiced").length,sub:"Fully processed",c:T.purple},
        ].map(s=>(
          <div className="card card-pad" key={s.lbl}>
            <div className="stat-lbl">{s.lbl}</div>
            <div className="stat-val" style={{color:s.c||T.ink}}>{s.val}</div>
            <div className="stat-sub">{s.sub}</div>
          </div>
        ))}
      </div>
      <div className="tc">
        <div className="tc-head">
          <span className="tc-title">Delivery Orders ({dos.length})</span>
          <button className="btn btn-dark btn-sm" onClick={()=>setModal("new")}>＋ New DO</button>
        </div>
        <table>
          <thead><tr><th>DO No.</th><th>Customer</th><th>DO Date</th><th>Delivery Date</th><th>Items</th><th>Value (RM)</th><th>Invoice Ref</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {dos.map(d=>{
              const cust = getCustomer(d.customerId);
              const {total} = calcLines(d.items);
              return (
                <tr key={d.id} onClick={()=>setModal({type:"view",doc:d})}>
                  <td className="mono" style={{color:T.blue,fontWeight:600,fontSize:12}}>{d.id}</td>
                  <td style={{fontWeight:600,color:T.ink}}>{cust?.name||d.customerId}</td>
                  <td style={{color:T.inkLight}}>{d.date}</td>
                  <td style={{color:d.deliveryDate?T.inkLight:T.amber}}>{d.deliveryDate||"Pending"}</td>
                  <td style={{color:T.inkMid}}>{d.items.length} item(s)</td>
                  <td className="mono" style={{fontWeight:600}}>{fmtRM(total)}</td>
                  <td onClick={e=>e.stopPropagation()}>{d.invoiceRef?<span className="badge bp">🧾 {d.invoiceRef}</span>:<span style={{color:T.inkLight,fontSize:12}}>—</span>}</td>
                  <td><StatusBadge s={d.status}/></td>
                  <td onClick={e=>e.stopPropagation()}>
                    <div style={{display:"flex",gap:5}}>
                      <button className="btn btn-out btn-xs" onClick={e=>{e.stopPropagation();setModal({type:"view",doc:d})}}>👁</button>
                      {d.status==="pending"&&<button className="btn btn-grn btn-xs" onClick={e=>{e.stopPropagation();doDelivered(d.id)}}>✓ Delivered</button>}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {modal==="new"&&<NewDOModal onClose={()=>setModal(null)} onSave={saveDO} nextId={nid} customers={customers}/>}
      {modal?.type==="view"&&<DODocument doc={modal.doc} customer={getCustomer(modal.doc.customerId)} onClose={()=>setModal(null)}/>}
    </div>
  );
}
