import React, { useState } from "react";
import { T } from "../components/tokens";
import { MY_COMPANY } from "../data/seedData";

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtRM  = n => "RM " + Number(n).toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const nextId = (prefix, list) => `${prefix}-${new Date().getFullYear()}-${String(list.length + 1).padStart(3, "0")}`;

const PAYMENT_METHODS = ["Cheque", "Bank Transfer (IBG)", "Bank Transfer (RENTAS)", "Cash", "Online Banking", "TT (Telegraphic Transfer)"];
const ACCOUNTS        = ["1000 - Cash at Bank (Maybank)", "1010 - Petty Cash", "2000 - Accounts Payable", "5100 - Staff Costs", "5200 - Office Rental", "5300 - Utilities", "5400 - Marketing", "5600 - Professional Fees"];

// ─── SEED DATA ────────────────────────────────────────────────────────────────
const SEED_PV = [
  { id:"PV-2026-001", date:"2026-04-01", payee:"JLL Properties Sdn Bhd",    payeeType:"supplier", supplierId:"SUPP-002", method:"Bank Transfer (IBG)", chequeNo:"", bankRef:"IBG240401001", amount:3500.00, description:"Office Rental - April 2026",          account:"5200 - Office Rental",     billRef:"BILL-2026-002", preparedBy:"Ahmad Razali", approvedBy:"Mohd Haziq",   status:"approved", paid:true  },
  { id:"PV-2026-002", date:"2026-04-02", payee:"AWS (Amazon Web Services)",  payeeType:"supplier", supplierId:"SUPP-001", method:"Bank Transfer (RENTAS)", chequeNo:"", bankRef:"RENTAS240402001", amount:1890.00, description:"AWS Cloud Services - Mar 2026", account:"5300 - Utilities",         billRef:"BILL-2026-001", preparedBy:"Siti Aisyah",  approvedBy:"Mohd Haziq",   status:"approved", paid:true  },
  { id:"PV-2026-003", date:"2026-04-05", payee:"Meta Ads (Facebook)",        payeeType:"supplier", supplierId:"SUPP-005", method:"Bank Transfer (IBG)", chequeNo:"", bankRef:"",               amount:600.00,  description:"Facebook Ads Balance - Feb 2026",   account:"5400 - Marketing",         billRef:"BILL-2026-005", preparedBy:"Priya Subramaniam", approvedBy:"",    status:"pending", paid:false },
  { id:"PV-2026-004", date:"2026-04-08", payee:"Petty Cash Replenishment",   payeeType:"other",    supplierId:"",         method:"Cash",               chequeNo:"", bankRef:"",               amount:350.00,  description:"Petty Cash Top-up April 2026",      account:"1010 - Petty Cash",        billRef:"",              preparedBy:"Siti Aisyah",  approvedBy:"Mohd Haziq",   status:"approved", paid:true  },
  { id:"PV-2026-005", date:"2026-04-10", payee:"Lim & Partners (Audit)",     payeeType:"supplier", supplierId:"SUPP-007", method:"Cheque",             chequeNo:"MBB 012345", bankRef:"",    amount:4000.00, description:"Partial Payment - Audit Fee FY2025",account:"5600 - Professional Fees", billRef:"BILL-2026-007", preparedBy:"Ahmad Razali", approvedBy:"Mohd Haziq",   status:"approved", paid:true  },
];

const SEED_RV = [
  { id:"RV-2026-001", date:"2026-04-01", receivedFrom:"Alchemy Corp Sdn Bhd", customerId:"CUST-001", method:"Bank Transfer (IBG)", chequeNo:"", bankRef:"IBG-ALCHEM-001", amount:11275.40, description:"Full Payment - INV-2026-001",  invoiceRef:"INV-2026-001", receivedBy:"Siti Aisyah",  status:"confirmed" },
  { id:"RV-2026-002", date:"2026-04-07", receivedFrom:"TechNova Pte Ltd",     customerId:"CUST-003", method:"Bank Transfer (RENTAS)", chequeNo:"", bankRef:"",            amount:4100.00,  description:"Partial Payment - INV-2026-003", invoiceRef:"INV-2026-003", receivedBy:"Ahmad Razali", status:"confirmed" },
  { id:"RV-2026-003", date:"2026-04-09", receivedFrom:"Mega Retail Group Bhd",customerId:"CUST-005", method:"Cheque",             chequeNo:"CIMB 887766", bankRef:"",      amount:10000.00, description:"Partial Payment - INV-2026-004", invoiceRef:"INV-2026-004", receivedBy:"Siti Aisyah",  status:"pending" },
];

// ─── PRINT CSS ────────────────────────────────────────────────────────────────
const docCss = `
.vdoc{background:#fff;width:680px;padding:44px 48px;font-family:'IBM Plex Sans',sans-serif;color:#18160f;font-size:12px;box-shadow:0 4px 28px #00000028}
.vdoc-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;padding-bottom:18px;border-bottom:2px solid #18160f}
.vdoc-co{font-family:'Lora',serif;font-size:17px;font-weight:700;color:#18160f;margin-bottom:3px}
.vdoc-det{font-size:10px;color:#6a6258;line-height:1.7}
.vdoc-type{font-family:'Lora',serif;font-size:24px;font-weight:700;text-align:right;line-height:1}
.vdoc-num{font-family:'IBM Plex Mono',monospace;font-size:12px;color:#4a4440;text-align:right;margin-top:4px}
.vdoc-meta{display:grid;grid-template-columns:1fr 1fr;gap:14px;background:#f7f6f3;padding:12px 14px;border-radius:7px;margin-bottom:18px}
.vm-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9a9388;margin-bottom:2px}
.vm-val{font-size:12.5px;font-weight:600;color:#18160f}
.vdoc-body{margin-bottom:18px}
.vdoc-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f0ede8;font-size:12.5px}
.vdoc-row:last-child{border-bottom:none}
.vdoc-total{display:flex;justify-content:space-between;padding:12px 14px;background:#18160f;color:#fff;border-radius:7px;margin-bottom:18px}
.vdoc-total-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.vdoc-total-val{font-family:'IBM Plex Mono',monospace;font-size:20px;font-weight:500}
.vdoc-sigs{display:grid;grid-template-columns:1fr 1fr 1fr;gap:20px;margin-top:24px;padding-top:16px;border-top:1px solid #e5e2db}
.vsig{border-top:1px solid #c8c3ba;padding-top:5px;font-size:9px;color:#9a9388;margin-top:28px}
.vdoc-stamp{border:2px solid #1a6b3c;border-radius:50%;width:80px;height:80px;display:flex;align-items:center;justify-content:center;text-align:center;font-size:9px;font-weight:700;color:#1a6b3c;text-transform:uppercase;letter-spacing:.5px;margin-left:auto}
.vdoc-wm{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(-30deg);font-size:60px;font-weight:900;opacity:.04;pointer-events:none;white-space:nowrap;font-family:'Lora',serif}
`;

// ─── PV DOCUMENT ──────────────────────────────────────────────────────────────
function PVDocument({ pv, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"#2a2520",zIndex:400,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <style>{docCss}</style>
      <div style={{ background:T.sidebar,padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <span style={{ fontSize:13.5,fontWeight:600,color:"#c8c0b4" }}>💸 {pv.id} — Payment Voucher</span>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={() => window.print()}>🖨️ Print</button>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:28,display:"flex",justifyContent:"center" }}>
        <div className="vdoc" style={{ position:"relative" }}>
          {!pv.paid && <div className="vdoc-wm">UNPAID</div>}
          <div className="vdoc-hdr">
            <div>
              <div className="vdoc-co">{MY_COMPANY.name}</div>
              <div className="vdoc-det">SSM: {MY_COMPANY.reg}<br/>{MY_COMPANY.address}<br/>{MY_COMPANY.phone}</div>
            </div>
            <div>
              <div className="vdoc-type" style={{ color: T.red }}>Payment Voucher</div>
              <div className="vdoc-num">{pv.id}</div>
              {pv.paid && <div style={{ marginTop:6,background:T.greenLight,border:`1px solid ${T.greenBorder}`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,color:T.green,textAlign:"right" }}>✓ PAID</div>}
            </div>
          </div>

          <div className="vdoc-meta">
            {[["Date",pv.date],["Payee",pv.payee],["Payment Method",pv.method],["Bank Ref / Cheque No.",pv.bankRef||pv.chequeNo||"—"],["Account Charged",pv.account],["Bill / Invoice Ref",pv.billRef||"—"]].map(([l,v]) => (
              <div key={l}><div className="vm-lbl">{l}</div><div className="vm-val">{v}</div></div>
            ))}
          </div>

          <div className="vdoc-body">
            <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.inkLight,marginBottom:8 }}>Payment Details</div>
            <div className="vdoc-row"><span style={{ color:T.inkMid }}>Description</span><span style={{ fontWeight:600,color:T.ink }}>{pv.description}</span></div>
            <div className="vdoc-row" style={{ color:T.amber }}><span>Amount</span><span className="mono" style={{ fontWeight:700 }}>{fmtRM(pv.amount)}</span></div>
          </div>

          <div className="vdoc-total">
            <span className="vdoc-total-lbl">Total Payment (MYR)</span>
            <span className="vdoc-total-val">{fmtRM(pv.amount)}</span>
          </div>

          <div style={{ fontSize:10,color:T.inkLight,marginBottom:16 }}>
            Amount in words: <strong style={{ color:T.ink }}>{amountToWords(pv.amount)} Malaysian Ringgit Only</strong>
          </div>

          <div className="vdoc-sigs">
            <div><div style={{ height:32 }}/><div className="vsig">Prepared By<br/><strong style={{ color:T.ink }}>{pv.preparedBy}</strong></div></div>
            <div><div style={{ height:32 }}/><div className="vsig">Approved By<br/><strong style={{ color:T.ink }}>{pv.approvedBy||"Pending"}</strong></div></div>
            <div><div style={{ height:32 }}/><div className="vsig">Received By (Payee)<br/>Date: _______________</div></div>
          </div>

          <div style={{ marginTop:16,fontSize:10,color:T.inkLight,borderTop:`1px solid ${T.border}`,paddingTop:10 }}>
            This Payment Voucher is an official accounting document of {MY_COMPANY.name}. Authorised for payment as per above. File with supporting documents for audit trail per Companies Act 2016 s245.
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── RV DOCUMENT ──────────────────────────────────────────────────────────────
function RVDocument({ rv, onClose }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"#2a2520",zIndex:400,display:"flex",flexDirection:"column",overflow:"hidden" }}>
      <style>{docCss}</style>
      <div style={{ background:T.sidebar,padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0 }}>
        <span style={{ fontSize:13.5,fontWeight:600,color:"#c8c0b4" }}>🧾 {rv.id} — Receipt Voucher</span>
        <div style={{ display:"flex",gap:8 }}>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={() => window.print()}>🖨️ Print</button>
          <button className="btn btn-out btn-sm" style={{ color:"#c8c0b4",borderColor:"#4a4440" }} onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div style={{ flex:1,overflowY:"auto",padding:28,display:"flex",justifyContent:"center" }}>
        <div className="vdoc" style={{ position:"relative" }}>
          <div className="vdoc-hdr">
            <div>
              <div className="vdoc-co">{MY_COMPANY.name}</div>
              <div className="vdoc-det">SSM: {MY_COMPANY.reg}<br/>{MY_COMPANY.address}<br/>{MY_COMPANY.phone}</div>
            </div>
            <div>
              <div className="vdoc-type" style={{ color: T.green }}>Receipt Voucher</div>
              <div className="vdoc-num">{rv.id}</div>
              <div style={{ marginTop:6,background:rv.status==="confirmed"?T.greenLight:T.amberLight,border:`1px solid ${rv.status==="confirmed"?T.greenBorder:T.amberBorder}`,borderRadius:4,padding:"2px 8px",fontSize:10,fontWeight:700,color:rv.status==="confirmed"?T.green:T.amber,textAlign:"right" }}>
                {rv.status==="confirmed"?"✓ CONFIRMED":"⏳ PENDING"}
              </div>
            </div>
          </div>

          <div className="vdoc-meta">
            {[["Date Received",rv.date],["Received From",rv.receivedFrom],["Payment Method",rv.method],["Bank Ref / Cheque No.",rv.bankRef||rv.chequeNo||"—"],["Invoice Reference",rv.invoiceRef||"—"],["Received By",rv.receivedBy]].map(([l,v]) => (
              <div key={l}><div className="vm-lbl">{l}</div><div className="vm-val">{v}</div></div>
            ))}
          </div>

          <div className="vdoc-body">
            <div style={{ fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,color:T.inkLight,marginBottom:8 }}>Payment Received</div>
            <div className="vdoc-row"><span style={{ color:T.inkMid }}>Description</span><span style={{ fontWeight:600,color:T.ink }}>{rv.description}</span></div>
            <div className="vdoc-row" style={{ color:T.green }}><span>Amount Received</span><span className="mono" style={{ fontWeight:700 }}>{fmtRM(rv.amount)}</span></div>
          </div>

          <div className="vdoc-total" style={{ background: T.green }}>
            <span className="vdoc-total-lbl">Total Received (MYR)</span>
            <span className="vdoc-total-val">{fmtRM(rv.amount)}</span>
          </div>

          <div style={{ fontSize:10,color:T.inkLight,marginBottom:16 }}>
            Amount in words: <strong style={{ color:T.ink }}>{amountToWords(rv.amount)} Malaysian Ringgit Only</strong>
          </div>

          <div className="vdoc-sigs">
            <div><div style={{ height:32 }}/><div className="vsig">Received By<br/><strong style={{ color:T.ink }}>{rv.receivedBy}</strong></div></div>
            <div><div style={{ height:32 }}/><div className="vsig">Verified By<br/>Date: _______________</div></div>
            <div>
              {rv.status==="confirmed" && (
                <div className="vdoc-stamp">✓<br/>Payment<br/>Received</div>
              )}
            </div>
          </div>

          <div style={{ marginTop:16,fontSize:10,color:T.inkLight,borderTop:`1px solid ${T.border}`,paddingTop:10 }}>
            This Receipt Voucher confirms receipt of the above payment. Please retain this receipt for your records. {MY_COMPANY.name} · {MY_COMPANY.reg}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── AMOUNT TO WORDS (simplified) ────────────────────────────────────────────
function amountToWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const toWords = num => {
    if (num === 0) return "";
    if (num < 20)  return ones[num] + " ";
    if (num < 100) return tens[Math.floor(num/10)] + " " + ones[num%10] + " ";
    return ones[Math.floor(num/100)] + " Hundred " + toWords(num%100);
  };
  const ringgit = Math.floor(n);
  const sen     = Math.round((n - ringgit) * 100);
  let result    = toWords(ringgit).trim();
  if (sen > 0)  result += ` and ${toWords(sen).trim()} Sen`;
  return result || "Zero";
}

// ─── NEW PV MODAL ─────────────────────────────────────────────────────────────
function NewPVModal({ onClose, onSave, nextId: nid, suppliers }) {
  const [f, setF] = useState({ id:nid, date:"2026-04-13", payee:"", payeeType:"supplier", supplierId:"", method:"Bank Transfer (IBG)", chequeNo:"", bankRef:"", amount:"", description:"", account:ACCOUNTS[0], billRef:"", preparedBy:"", approvedBy:"", status:"pending", paid:false });
  const valid = f.payee && f.amount && f.description;
  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mh"><div className="mt">New Payment Voucher</div><div className="ms">Internal document authorising payment — attach supporting bill/invoice</div></div>
        <div className="mb">
          <div className="fr3">
            <div className="fg"><label className="fl">PV Number</label><input className="fi fi-mono" value={f.id} onChange={e=>setF(p=>({...p,id:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Date *</label><input className="fi" type="date" value={f.date} onChange={e=>setF(p=>({...p,date:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Payment Method</label>
              <select className="fi" value={f.method} onChange={e=>setF(p=>({...p,method:e.target.value}))}>
                {PAYMENT_METHODS.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Payee (Name) *</label>
              <select className="fi" value={f.supplierId} onChange={e=>{const s=suppliers.find(x=>x.id===e.target.value);setF(p=>({...p,supplierId:e.target.value,payee:s?.name||""}));}}>
                <option value="">-- Select Supplier --</option>
                {suppliers.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Or Enter Payee Manually</label><input className="fi" value={f.payee} onChange={e=>setF(p=>({...p,payee:e.target.value}))} placeholder="Other payee name"/></div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Cheque No. / Bank Ref</label><input className="fi fi-mono" value={f.bankRef||f.chequeNo} onChange={e=>setF(p=>({...p,bankRef:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Bill / Invoice Reference</label><input className="fi fi-mono" value={f.billRef} onChange={e=>setF(p=>({...p,billRef:e.target.value}))} placeholder="BILL-2026-XXX"/></div>
          </div>
          <div className="fg"><label className="fl">Account to Debit</label>
            <select className="fi" value={f.account} onChange={e=>setF(p=>({...p,account:e.target.value}))}>
              {ACCOUNTS.map(a=><option key={a}>{a}</option>)}
            </select>
          </div>
          <div className="fg"><label className="fl">Description / Narration *</label><input className="fi" value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} placeholder="e.g. Office Rental April 2026"/></div>
          <div className="fr3">
            <div className="fg"><label className="fl">Amount (RM) *</label><input className="fi fi-mono" type="number" value={f.amount} onChange={e=>setF(p=>({...p,amount:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Prepared By</label><input className="fi" value={f.preparedBy} onChange={e=>setF(p=>({...p,preparedBy:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Approved By</label><input className="fi" value={f.approvedBy} onChange={e=>setF(p=>({...p,approvedBy:e.target.value}))}/></div>
          </div>
          {f.amount && <div style={{ background:T.stripe,border:`1px solid ${T.border}`,borderRadius:7,padding:"10px 13px",fontSize:13 }}>
            <strong>Total Payment: </strong><span className="mono" style={{ fontWeight:700,color:T.ink }}>{fmtRM(parseFloat(f.amount)||0)}</span>
            <div style={{ fontSize:11,color:T.inkLight,marginTop:3 }}>In words: {amountToWords(parseFloat(f.amount)||0)} Malaysian Ringgit Only</div>
          </div>}
        </div>
        <div className="mf">
          <button className="btn btn-out" onClick={onClose}>Cancel</button>
          <div style={{ display:"flex",gap:8 }}>
            <button className="btn btn-out" onClick={()=>valid&&onSave({...f,amount:parseFloat(f.amount),status:"pending",paid:false})} disabled={!valid}>Save (Pending)</button>
            <button className="btn btn-dark" onClick={()=>valid&&onSave({...f,amount:parseFloat(f.amount),status:"approved",paid:true})} disabled={!valid}>Approve & Pay 💸</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── NEW RV MODAL ─────────────────────────────────────────────────────────────
function NewRVModal({ onClose, onSave, nextId: nid, customers }) {
  const [f, setF] = useState({ id:nid, date:"2026-04-13", receivedFrom:"", customerId:"", method:"Bank Transfer (IBG)", chequeNo:"", bankRef:"", amount:"", description:"", invoiceRef:"", receivedBy:"", status:"confirmed" });
  const valid = f.receivedFrom && f.amount && f.description;
  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mh"><div className="mt">New Receipt Voucher</div><div className="ms">Acknowledge incoming payment from customer</div></div>
        <div className="mb">
          <div className="fr3">
            <div className="fg"><label className="fl">RV Number</label><input className="fi fi-mono" value={f.id} onChange={e=>setF(p=>({...p,id:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Date Received *</label><input className="fi" type="date" value={f.date} onChange={e=>setF(p=>({...p,date:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Payment Method</label>
              <select className="fi" value={f.method} onChange={e=>setF(p=>({...p,method:e.target.value}))}>
                {PAYMENT_METHODS.map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Received From *</label>
              <select className="fi" value={f.customerId} onChange={e=>{const c=customers.find(x=>x.id===e.target.value);setF(p=>({...p,customerId:e.target.value,receivedFrom:c?.name||""}));}}>
                <option value="">-- Select Customer --</option>
                {customers.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Bank Ref / Cheque No.</label><input className="fi fi-mono" value={f.bankRef} onChange={e=>setF(p=>({...p,bankRef:e.target.value}))}/></div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Invoice Reference</label><input className="fi fi-mono" value={f.invoiceRef} onChange={e=>setF(p=>({...p,invoiceRef:e.target.value}))} placeholder="INV-2026-XXX"/></div>
            <div className="fg"><label className="fl">Received By</label><input className="fi" value={f.receivedBy} onChange={e=>setF(p=>({...p,receivedBy:e.target.value}))}/></div>
          </div>
          <div className="fg"><label className="fl">Description *</label><input className="fi" value={f.description} onChange={e=>setF(p=>({...p,description:e.target.value}))} placeholder="e.g. Full Payment - INV-2026-001"/></div>
          <div className="fg"><label className="fl">Amount Received (RM) *</label><input className="fi fi-mono" type="number" value={f.amount} onChange={e=>setF(p=>({...p,amount:e.target.value}))}/></div>
          {f.amount && <div style={{ background:T.greenLight,border:`1px solid ${T.greenBorder}`,borderRadius:7,padding:"10px 13px",fontSize:13 }}>
            <strong>Amount Received: </strong><span className="mono" style={{ fontWeight:700,color:T.green }}>{fmtRM(parseFloat(f.amount)||0)}</span>
          </div>}
        </div>
        <div className="mf">
          <button className="btn btn-out" onClick={onClose}>Cancel</button>
          <button className="btn btn-grn" onClick={()=>valid&&onSave({...f,amount:parseFloat(f.amount)})} disabled={!valid}>Confirm Receipt ✓</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function VouchersPage({ data }) {
  const { suppliers = [], customers = [] } = data || {};
  const [tab,   setTab]   = useState("pv");
  const [pvs,   setPVs]   = useState(SEED_PV);
  const [rvs,   setRVs]   = useState(SEED_RV);
  const [modal, setModal] = useState(null);

  const nextPV = nextId("PV-2026", pvs);
  const nextRV = nextId("RV-2026", rvs);

  const savePV = pv => { setPVs(p => [pv, ...p]); setModal(null); };
  const saveRV = rv => { setRVs(p => [rv, ...p]); setModal(null); };

  const pvPaid     = pvs.filter(p => p.paid).reduce((s, p) => s + p.amount, 0);
  const pvPending  = pvs.filter(p => !p.paid).reduce((s, p) => s + p.amount, 0);
  const rvTotal    = rvs.filter(r => r.status === "confirmed").reduce((s, r) => s + r.amount, 0);

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${tab==="pv"?"active":""}`} onClick={()=>setTab("pv")}>💸 Payment Vouchers ({pvs.length})</div>
        <div className={`tab ${tab==="rv"?"active":""}`} onClick={()=>setTab("rv")}>🧾 Receipt Vouchers ({rvs.length})</div>
      </div>

      {/* ── PAYMENT VOUCHERS ── */}
      {tab === "pv" && (
        <>
          <div className="stats-4">
            <div className="card card-pad"><div className="stat-lbl">Total PVs</div><div className="stat-val">{pvs.length}</div></div>
            <div className="card card-pad"><div className="stat-lbl">Paid</div><div className="stat-val" style={{color:T.green}}>{fmtRM(pvPaid)}</div><div className="stat-sub">{pvs.filter(p=>p.paid).length} vouchers</div></div>
            <div className="card card-pad" style={{background:T.amberLight,borderColor:T.amberBorder}}><div className="stat-lbl">Pending Approval</div><div className="stat-val" style={{color:T.amber}}>{fmtRM(pvPending)}</div></div>
            <div className="card card-pad"><div className="stat-lbl">This Month</div><div className="stat-val" style={{fontSize:15}}>{fmtRM(pvs.reduce((s,p)=>s+p.amount,0))}</div></div>
          </div>

          <div className="tc">
            <div className="tc-head">
              <span className="tc-title">Payment Vouchers</span>
              <button className="btn btn-dark btn-sm" onClick={()=>setModal("newPV")}>＋ New PV</button>
            </div>
            <table>
              <thead><tr><th>PV No.</th><th>Date</th><th>Payee</th><th>Description</th><th>Method</th><th>Bill Ref</th><th style={{textAlign:"right"}}>Amount</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {pvs.map(pv => (
                  <tr key={pv.id} onClick={()=>setModal({type:"viewPV",pv})}>
                    <td className="mono" style={{color:T.red,fontWeight:600,fontSize:12}}>{pv.id}</td>
                    <td style={{color:T.inkLight}}>{pv.date}</td>
                    <td style={{fontWeight:600,color:T.ink}}>{pv.payee}</td>
                    <td style={{color:T.inkMid,fontSize:12}}>{pv.description}</td>
                    <td style={{fontSize:12,color:T.inkLight}}>{pv.method}</td>
                    <td onClick={e=>e.stopPropagation()}>{pv.billRef?<span className="badge bb" style={{fontSize:10}}>{pv.billRef}</span>:<span style={{color:T.inkLight}}>—</span>}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:600}}>{fmtRM(pv.amount)}</td>
                    <td>
                      {pv.paid
                        ? <span className="badge bg">✓ Paid</span>
                        : pv.status==="approved"
                          ? <span className="badge ba">Approved</span>
                          : <span className="badge bk">Pending</span>}
                    </td>
                    <td onClick={e=>e.stopPropagation()}>
                      <div style={{display:"flex",gap:5}}>
                        <button className="btn btn-out btn-xs" onClick={e=>{e.stopPropagation();setModal({type:"viewPV",pv})}}>👁</button>
                        {!pv.paid && <button className="btn btn-grn btn-xs" onClick={e=>{e.stopPropagation();setPVs(p=>p.map(x=>x.id===pv.id?{...x,paid:true,status:"approved"}:x))}}>Pay</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── RECEIPT VOUCHERS ── */}
      {tab === "rv" && (
        <>
          <div className="stats-3">
            <div className="card card-pad"><div className="stat-lbl">Total RVs</div><div className="stat-val">{rvs.length}</div></div>
            <div className="card card-pad"><div className="stat-lbl">Confirmed Receipts</div><div className="stat-val" style={{color:T.green}}>{fmtRM(rvTotal)}</div><div className="stat-sub">{rvs.filter(r=>r.status==="confirmed").length} receipts</div></div>
            <div className="card card-pad"><div className="stat-lbl">Pending Confirmation</div><div className="stat-val" style={{color:T.amber}}>{rvs.filter(r=>r.status==="pending").length}</div></div>
          </div>

          <div className="tc">
            <div className="tc-head">
              <span className="tc-title">Receipt Vouchers</span>
              <button className="btn btn-grn btn-sm" onClick={()=>setModal("newRV")}>＋ New RV</button>
            </div>
            <table>
              <thead><tr><th>RV No.</th><th>Date</th><th>Received From</th><th>Description</th><th>Method</th><th>Invoice Ref</th><th style={{textAlign:"right"}}>Amount</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {rvs.map(rv => (
                  <tr key={rv.id} onClick={()=>setModal({type:"viewRV",rv})}>
                    <td className="mono" style={{color:T.green,fontWeight:600,fontSize:12}}>{rv.id}</td>
                    <td style={{color:T.inkLight}}>{rv.date}</td>
                    <td style={{fontWeight:600,color:T.ink}}>{rv.receivedFrom}</td>
                    <td style={{color:T.inkMid,fontSize:12}}>{rv.description}</td>
                    <td style={{fontSize:12,color:T.inkLight}}>{rv.method}</td>
                    <td onClick={e=>e.stopPropagation()}>{rv.invoiceRef?<span className="badge br" style={{fontSize:10}}>{rv.invoiceRef}</span>:<span style={{color:T.inkLight}}>—</span>}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:600,color:T.green}}>{fmtRM(rv.amount)}</td>
                    <td><span className={`badge ${rv.status==="confirmed"?"bg":"ba"}`}>{rv.status==="confirmed"?"✓ Confirmed":"Pending"}</span></td>
                    <td onClick={e=>e.stopPropagation()}>
                      <button className="btn btn-out btn-xs" onClick={e=>{e.stopPropagation();setModal({type:"viewRV",rv})}}>👁</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {modal==="newPV"          && <NewPVModal onClose={()=>setModal(null)} onSave={savePV} nextId={nextPV} suppliers={suppliers}/>}
      {modal==="newRV"          && <NewRVModal onClose={()=>setModal(null)} onSave={saveRV} nextId={nextRV} customers={customers}/>}
      {modal?.type==="viewPV"   && <PVDocument pv={modal.pv} onClose={()=>setModal(null)}/>}
      {modal?.type==="viewRV"   && <RVDocument rv={modal.rv} onClose={()=>setModal(null)}/>}
    </div>
  );
}
