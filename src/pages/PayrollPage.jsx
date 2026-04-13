import React, { useState, useMemo } from "react";
import { T } from "../components/tokens";

// ─── 2026 MALAYSIA STATUTORY RATES ───────────────────────────────────────────
// Sources: KWSP, PERKESO, LHDN — updated Jan 2026

const EPF = {
  // Malaysian citizen / PR under 60
  employeeRate: 0.11,          // 11%
  employerRateLow:  0.13,      // 13% if gross ≤ RM5,000
  employerRateHigh: 0.12,      // 12% if gross > RM5,000
  // Age 55–60
  employeeRate55: 0.055,
  employerRate55: 0.065,
  // Foreign worker (from Oct 2025)
  foreignEmployee: 0.02,
  foreignEmployer: 0.02,
};

const SOCSO_TABLE = [
  // [wageFloor, wageCeil, employee, employer]  — capped at RM6,000
  [0,     29.99,  0,     0     ],
  [30,    49.99,  0.10,  0.40  ],
  [50,    69.99,  0.20,  0.60  ],
  [70,    99.99,  0.30,  0.80  ],
  [100,   139.99, 0.40,  1.10  ],
  [140,   199.99, 0.50,  1.50  ],
  [200,   299.99, 0.70,  2.25  ],
  [300,   399.99, 1.05,  3.15  ],
  [400,   499.99, 1.35,  4.10  ],
  [500,   599.99, 1.70,  5.10  ],
  [600,   699.99, 2.00,  6.00  ],
  [700,   799.99, 2.35,  7.00  ],
  [800,   899.99, 2.65,  7.95  ],
  [900,   999.99, 3.00,  9.00  ],
  [1000,  1099.99,3.30,  9.90  ],
  [1100,  1199.99,3.65,  10.90 ],
  [1200,  1299.99,3.95,  11.85 ],
  [1300,  1399.99,4.30,  12.85 ],
  [1400,  1499.99,4.60,  13.80 ],
  [1500,  1599.99,4.95,  14.85 ],
  [1600,  1699.99,5.25,  15.75 ],
  [1700,  1799.99,5.60,  16.80 ],
  [1800,  1899.99,5.90,  17.70 ],
  [1900,  1999.99,6.25,  18.75 ],
  [2000,  2099.99,6.55,  19.65 ],
  [2100,  2199.99,6.90,  20.70 ],
  [2200,  2299.99,7.20,  21.60 ],
  [2300,  2399.99,7.55,  22.65 ],
  [2400,  2499.99,7.85,  23.55 ],
  [2500,  2599.99,8.20,  24.60 ],
  [2600,  2699.99,8.50,  25.50 ],
  [2700,  2799.99,8.85,  26.55 ],
  [2800,  2899.99,9.15,  27.45 ],
  [2900,  2999.99,9.50,  28.50 ],
  [3000,  3099.99,9.80,  29.40 ],
  [3100,  3199.99,10.15, 30.45 ],
  [3200,  3299.99,10.45, 31.35 ],
  [3300,  3399.99,10.80, 32.40 ],
  [3400,  3499.99,11.10, 33.30 ],
  [3500,  3599.99,11.45, 34.35 ],
  [3600,  3699.99,11.75, 35.25 ],
  [3700,  3799.99,12.10, 36.30 ],
  [3800,  3899.99,12.40, 37.20 ],
  [3900,  3999.99,12.75, 38.25 ],
  [4000,  4099.99,13.05, 39.15 ],
  [4100,  4199.99,13.40, 40.20 ],
  [4200,  4299.99,13.70, 41.10 ],
  [4300,  4399.99,14.05, 42.15 ],
  [4400,  4499.99,14.35, 43.05 ],
  [4500,  4599.99,14.70, 44.10 ],
  [4600,  4699.99,15.00, 45.00 ],
  [4700,  4799.99,15.35, 46.05 ],
  [4800,  4899.99,15.65, 46.95 ],
  [4900,  4999.99,16.00, 48.00 ],
  [5000,  5099.99,16.30, 48.90 ],
  [5100,  5199.99,16.65, 49.95 ],
  [5200,  5299.99,17.00, 51.00 ],
  [5300,  5399.99,17.30, 51.90 ],
  [5400,  5499.99,17.65, 52.95 ],
  [5500,  5599.99,17.95, 53.85 ],
  [5600,  5699.99,18.30, 54.90 ],
  [5700,  5799.99,18.60, 55.80 ],
  [5800,  5899.99,18.95, 56.85 ],
  [5900,  5999.99,19.25, 57.75 ],
  [6000,  999999, 19.75, 59.30 ],  // capped at RM6,000 wage ceiling
];

const EIS_TABLE = [
  // same wage ceiling RM6,000 — approx 0.2% each
  [0,     29.99,  0,    0    ],
  [30,    49.99,  0.05, 0.05 ],
  [50,    99.99,  0.10, 0.10 ],
  [100,   199.99, 0.20, 0.20 ],
  [200,   299.99, 0.40, 0.40 ],
  [300,   399.99, 0.70, 0.70 ],
  [400,   499.99, 0.90, 0.90 ],
  [500,   599.99, 1.10, 1.10 ],
  [600,   699.99, 1.30, 1.30 ],
  [700,   799.99, 1.50, 1.50 ],
  [800,   899.99, 1.70, 1.70 ],
  [900,   999.99, 1.90, 1.90 ],
  [1000,  1099.99,2.10, 2.10 ],
  [1100,  1199.99,2.30, 2.30 ],
  [1200,  1299.99,2.50, 2.50 ],
  [1300,  1399.99,2.70, 2.70 ],
  [1400,  1499.99,2.90, 2.90 ],
  [1500,  1599.99,3.10, 3.10 ],
  [1600,  1699.99,3.30, 3.30 ],
  [1700,  1799.99,3.50, 3.50 ],
  [1800,  1899.99,3.70, 3.70 ],
  [1900,  1999.99,3.90, 3.90 ],
  [2000,  2099.99,4.10, 4.10 ],
  [2100,  2199.99,4.30, 4.30 ],
  [2200,  2299.99,4.50, 4.50 ],
  [2300,  2399.99,4.70, 4.70 ],
  [2400,  2499.99,4.90, 4.90 ],
  [2500,  2599.99,5.10, 5.10 ],
  [2600,  2699.99,5.30, 5.30 ],
  [2700,  2799.99,5.50, 5.50 ],
  [2800,  2899.99,5.70, 5.70 ],
  [2900,  2999.99,5.90, 5.90 ],
  [3000,  3099.99,6.10, 6.10 ],
  [3100,  3199.99,6.30, 6.30 ],
  [3200,  3299.99,6.50, 6.50 ],
  [3300,  3399.99,6.70, 6.70 ],
  [3400,  3499.99,6.90, 6.90 ],
  [3500,  3599.99,7.10, 7.10 ],
  [3600,  3699.99,7.30, 7.30 ],
  [3700,  3799.99,7.50, 7.50 ],
  [3800,  3899.99,7.70, 7.70 ],
  [3900,  3999.99,7.90, 7.90 ],
  [4000,  4099.99,8.10, 8.10 ],
  [4100,  4199.99,8.30, 8.30 ],
  [4200,  4299.99,8.50, 8.50 ],
  [4300,  4399.99,8.70, 8.70 ],
  [4400,  4499.99,8.90, 8.90 ],
  [4500,  4599.99,9.10, 9.10 ],
  [4600,  4699.99,9.30, 9.30 ],
  [4700,  4799.99,9.50, 9.50 ],
  [4800,  4899.99,9.70, 9.70 ],
  [4900,  4999.99,9.90, 9.90 ],
  [5000,  5099.99,10.10,10.10],
  [5100,  5199.99,10.30,10.30],
  [5200,  5299.99,10.50,10.50],
  [5300,  5399.99,10.70,10.70],
  [5400,  5499.99,10.90,10.90],
  [5500,  5599.99,11.10,11.10],
  [5600,  5699.99,11.30,11.30],
  [5700,  5799.99,11.50,11.50],
  [5800,  5899.99,11.70,11.70],
  [5900,  5999.99,11.90,11.90],
  [6000,  999999, 12.10,12.10],
];

// PCB 2026 — simplified progressive rates (monthly)
// Official: use LHDN MTD tables; this is a close approximation
function calcPCB(annualChargeable) {
  if (annualChargeable <= 5000)   return 0;
  if (annualChargeable <= 20000)  return (annualChargeable - 5000) * 0.01;
  if (annualChargeable <= 35000)  return 150  + (annualChargeable - 20000) * 0.03;
  if (annualChargeable <= 50000)  return 600  + (annualChargeable - 35000) * 0.08;
  if (annualChargeable <= 70000)  return 1800 + (annualChargeable - 50000) * 0.13;
  if (annualChargeable <= 100000) return 4400 + (annualChargeable - 70000) * 0.21;
  if (annualChargeable <= 400000) return 10700+ (annualChargeable -100000) * 0.24;
  return 82700 + (annualChargeable - 400000) * 0.25;
}

function getTableRow(table, wage) {
  const row = table.find(r => wage >= r[0] && wage <= r[1]);
  return row || table[table.length - 1];
}

function computePayroll(emp) {
  const gross    = parseFloat(emp.basicSalary) + parseFloat(emp.allowances || 0);
  const isForeign = emp.nationality !== "Malaysian" && emp.nationality !== "PR";
  const age      = parseInt(emp.age) || 30;
  const isOver60  = age >= 60;
  const is55to60  = age >= 55 && age < 60;

  // ── EPF ──────────────────────────────────────────────────────────────────
  let epfEE = 0, epfER = 0;
  if (!isForeign) {
    if (!isOver60) {
      const rate = is55to60 ? EPF.employeeRate55 : EPF.employeeRate;
      const erRate = is55to60
        ? EPF.employerRate55
        : gross <= 5000 ? EPF.employerRateLow : EPF.employerRateHigh;
      epfEE = Math.ceil(gross * rate);
      epfER = Math.ceil(gross * erRate);
    }
  } else {
    // Foreign worker — mandatory from Oct 2025
    epfEE = Math.ceil(gross * EPF.foreignEmployee);
    epfER = Math.ceil(gross * EPF.foreignEmployer);
  }

  // ── SOCSO ────────────────────────────────────────────────────────────────
  let socsoEE = 0, socsoER = 0;
  if (!isOver60) {
    const row = getTableRow(SOCSO_TABLE, Math.min(gross, 6000));
    socsoEE = row[2];
    socsoER = row[3];
  }

  // ── EIS ──────────────────────────────────────────────────────────────────
  let eisEE = 0, eisER = 0;
  if (!isForeign && !isOver60) {
    const row = getTableRow(EIS_TABLE, Math.min(gross, 6000));
    eisEE = row[2];
    eisER = row[3];
  }

  // ── HRDC (HRD Corp) levy ──────────────────────────────────────────────────
  // 1% of gross for employers with ≥10 Malaysian employees
  const hrdcLevy = emp.hrdcApplicable ? Math.ceil(gross * 0.01) : 0;

  // ── PCB (Monthly Tax Deduction) ───────────────────────────────────────────
  // Annual chargeable income = (gross × 12) − EPF relief (max RM4,000) − individual relief RM9,000
  const annualGross = gross * 12;
  const epfRelief   = Math.min(epfEE * 12, 4000);
  const indRelief   = 9000;
  const spouseRelief = emp.maritalStatus === "Married" ? 4000 : 0;
  const annualChargeable = Math.max(0, annualGross - epfRelief - indRelief - spouseRelief);
  const annualPCB   = calcPCB(annualChargeable);
  const pcb         = Math.round(annualPCB / 12);

  // ── TOTALS ────────────────────────────────────────────────────────────────
  const totalDeductions = epfEE + socsoEE + eisEE + pcb;
  const netPay          = gross - totalDeductions;
  const totalEmployerCost = gross + epfER + socsoER + eisER + hrdcLevy;

  return {
    gross, epfEE, epfER, socsoEE, socsoER, eisEE, eisER,
    hrdcLevy, pcb, totalDeductions, netPay, totalEmployerCost,
    annualChargeable,
  };
}

// ─── SEED EMPLOYEES ───────────────────────────────────────────────────────────
const SEED_EMPLOYEES = [
  { id:"EMP-001", name:"Ahmad Bin Razali",    ic:"820514-10-5432", nationality:"Malaysian", dept:"Engineering",   position:"Senior Developer",    basicSalary:8500,  allowances:500,  age:42, maritalStatus:"Married", bankAcc:"Maybank 1234-5678", joinDate:"2020-03-01", hrdcApplicable:true  },
  { id:"EMP-002", name:"Siti Nur Aisyah",     ic:"950221-14-6543", nationality:"Malaysian", dept:"Finance",       position:"Accounts Executive",  basicSalary:4200,  allowances:300,  age:29, maritalStatus:"Single",  bankAcc:"CIMB 2345-6789",    joinDate:"2022-06-15", hrdcApplicable:true  },
  { id:"EMP-003", name:"Rajendran Pillai",    ic:"880901-07-1234", nationality:"PR",        dept:"Operations",    position:"Operations Manager",  basicSalary:7200,  allowances:400,  age:35, maritalStatus:"Married", bankAcc:"RHB 3456-7890",      joinDate:"2019-11-01", hrdcApplicable:true  },
  { id:"EMP-004", name:"Lim Wei Jian",        ic:"910305-10-9876", nationality:"Malaysian", dept:"Sales",         position:"Sales Executive",     basicSalary:3800,  allowances:600,  age:32, maritalStatus:"Single",  bankAcc:"Maybank 4567-8901", joinDate:"2023-01-10", hrdcApplicable:true  },
  { id:"EMP-005", name:"Nurul Fadhilah",      ic:"001112-14-3456", nationality:"Malaysian", dept:"HR",            position:"HR Assistant",        basicSalary:2800,  allowances:200,  age:23, maritalStatus:"Single",  bankAcc:"BSN 5678-9012",      joinDate:"2024-04-01", hrdcApplicable:true  },
  { id:"EMP-006", name:"Wang Fang",           ic:"NA",             nationality:"Foreign",   dept:"Engineering",   position:"Software Engineer",   basicSalary:6500,  allowances:800,  age:28, maritalStatus:"Single",  bankAcc:"HSBC 6789-0123",     joinDate:"2025-10-01", hrdcApplicable:false },
  { id:"EMP-007", name:"Mohd Haziq Imran",    ic:"850630-12-7654", nationality:"Malaysian", dept:"Finance",       position:"Finance Manager",     basicSalary:9800,  allowances:700,  age:38, maritalStatus:"Married", bankAcc:"Maybank 7890-1234", joinDate:"2018-07-15", hrdcApplicable:true  },
  { id:"EMP-008", name:"Priya d/o Subramaniam",ic:"930818-07-5678",nationality:"Malaysian", dept:"Marketing",     position:"Marketing Executive", basicSalary:4500,  allowances:350,  age:30, maritalStatus:"Single",  bankAcc:"Public Bank 8901-2345",joinDate:"2021-09-01",hrdcApplicable:true },
];

const DEPTS   = ["All","Engineering","Finance","Operations","Sales","HR","Marketing"];
const PERIODS = ["April 2026","March 2026","February 2026","January 2026"];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtRM = n => "RM " + Number(n).toLocaleString("en-MY",{minimumFractionDigits:2,maximumFractionDigits:2});
const fmtN  = n => Number(n).toLocaleString("en-MY",{minimumFractionDigits:2,maximumFractionDigits:2});

// ─── CSS ─────────────────────────────────────────────────────────────────────
const css = `
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

.pr-pill{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:20px;font-size:10.5px;font-weight:700}
.pr-green{background:${T.greenLight};color:${T.green};border:1px solid ${T.greenBorder}}
.pr-red{background:${T.redLight};color:${T.red};border:1px solid ${T.redBorder}}
.pr-amber{background:${T.amberLight};color:${T.amber};border:1px solid ${T.amberBorder}}
.pr-blue{background:${T.blueLight};color:${T.blue};border:1px solid ${T.blueBorder}}
.pr-grey{background:${T.stripe};color:${T.inkMid};border:1px solid ${T.border}}

.rate-card{background:${T.stripe};border:1px solid ${T.border};border-radius:10px;padding:16px 18px}
.rate-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:${T.inkLight};margin-bottom:10px;display:flex;align-items:center;gap:6px}
.rate-row{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;border-bottom:1px solid ${T.border}22}
.rate-row:last-child{border-bottom:none}
.rate-key{color:${T.inkMid}}
.rate-val{font-family:'IBM Plex Mono',monospace;font-weight:600;color:${T.ink}}
.rate-highlight{background:${T.greenLight};border-radius:4px;padding:1px 6px;color:${T.green};font-weight:700;font-size:11px}

.breakdown-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.bk-section{background:${T.stripe};border:1px solid ${T.border};border-radius:8px;padding:13px 14px}
.bk-title{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.7px;color:${T.inkLight};margin-bottom:8px}
.bk-row{display:flex;justify-content:space-between;padding:4px 0;font-size:12.5px;border-bottom:1px solid ${T.border}22}
.bk-row:last-child{border-bottom:none}
.bk-total{display:flex;justify-content:space-between;padding:8px 0 0;margin-top:4px;border-top:1.5px solid ${T.border};font-weight:700;font-size:14px}

.payslip{background:#fff;padding:40px 44px;width:680px;font-family:'IBM Plex Sans',sans-serif;color:#18160f;font-size:12px;box-shadow:0 4px 24px #00000030;border-radius:2px}
.ps-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;padding-bottom:16px;border-bottom:2px solid #18160f}
.ps-co{font-family:'Lora',serif;font-size:16px;font-weight:700;color:#18160f;margin-bottom:3px}
.ps-co-det{font-size:9.5px;color:#6a6258;line-height:1.7}
.ps-label{font-size:20px;font-weight:700;font-family:'Lora',serif;color:#d4310a;text-align:right}
.ps-period{font-family:'IBM Plex Mono',monospace;font-size:11px;color:#4a4440;margin-top:3px;text-align:right}
.ps-emp{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px;padding:12px 14px;background:#f7f6f3;border-radius:6px}
.ps-emp-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9a9388;margin-bottom:2px}
.ps-emp-val{font-size:12.5px;font-weight:600;color:#18160f}
.ps-table{width:100%;border-collapse:collapse;margin-bottom:14px;font-size:11.5px}
.ps-table th{text-align:left;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#9a9388;padding:6px 8px;border-bottom:1.5px solid #e5e2db}
.ps-table th:last-child{text-align:right}
.ps-table td{padding:6px 8px;border-bottom:1px solid #f0ede8;color:#4a4440}
.ps-table td:last-child{text-align:right;font-family:'IBM Plex Mono',monospace}
.ps-table tr:last-child td{border-bottom:none}
.ps-summary{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px}
.ps-sum-box{border:1px solid #e5e2db;border-radius:6px;padding:10px 12px}
.ps-sum-lbl{font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#9a9388;margin-bottom:6px}
.ps-sum-row{display:flex;justify-content:space-between;font-size:11.5px;padding:3px 0;color:#4a4440}
.ps-sum-row.total{font-size:13px;font-weight:700;color:#18160f;padding-top:6px;border-top:1px solid #e5e2db;margin-top:3px}
.ps-net{background:#18160f;color:#fff;padding:12px 14px;border-radius:6px;display:flex;justify-content:space-between;align-items:center;margin-bottom:14px}
.ps-net-lbl{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px}
.ps-net-val{font-family:'IBM Plex Mono',monospace;font-size:20px;font-weight:500}
.ps-footer{padding-top:12px;border-top:1px solid #e5e2db;display:grid;grid-template-columns:1fr 1fr;gap:14px;font-size:10px;color:#9a9388}
.ps-sig-line{border-top:1px solid #c8c3ba;margin-top:24px;padding-top:5px}
`;

// ─── PAYSLIP DOCUMENT ─────────────────────────────────────────────────────────
function Payslip({ emp, period, onClose }) {
  const p = computePayroll(emp);
  const MY_CO = { name:"LedgerX Solutions Sdn Bhd", reg:"202301234567 (1234567-A)", address:"Unit 12-5, Menara LedgerX, Jalan Ampang, 50450 Kuala Lumpur" };

  return (
    <div style={{position:"fixed",inset:0,background:"#2a2520",zIndex:400,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <style>{css}</style>
      <div style={{background:"#18160f",padding:"11px 22px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
        <span style={{fontSize:13.5,fontWeight:600,color:"#c8c0b4"}}>📄 Payslip — {emp.name} ({period})</span>
        <div style={{display:"flex",gap:8}}>
          <button className="btn btn-out btn-sm" style={{color:"#c8c0b4",borderColor:"#4a4440"}} onClick={()=>window.print()}>🖨️ Print</button>
          <button className="btn btn-out btn-sm" style={{color:"#c8c0b4",borderColor:"#4a4440"}} onClick={onClose}>✕ Close</button>
        </div>
      </div>
      <div style={{flex:1,overflowY:"auto",padding:28,display:"flex",justifyContent:"center",alignItems:"flex-start"}}>
        <div className="payslip">
          <div className="ps-header">
            <div>
              <div className="ps-co">{MY_CO.name}</div>
              <div className="ps-co-det">SSM: {MY_CO.reg}<br/>{MY_CO.address}</div>
            </div>
            <div>
              <div className="ps-label">PAYSLIP</div>
              <div className="ps-period">{period}</div>
            </div>
          </div>

          <div className="ps-emp">
            {[["Employee Name",emp.name],["Employee ID",emp.id],["IC / Passport",emp.ic],["Department",emp.dept],["Position",emp.position],["Bank Account",emp.bankAcc],["Join Date",emp.joinDate],["Nationality",emp.nationality]].map(([l,v])=>(
              <div key={l}><div className="ps-emp-lbl">{l}</div><div className="ps-emp-val">{v}</div></div>
            ))}
          </div>

          <div className="ps-summary">
            {/* Earnings */}
            <div className="ps-sum-box">
              <div className="ps-sum-lbl">💰 Earnings</div>
              <div className="ps-sum-row"><span>Basic Salary</span><span>{fmtN(emp.basicSalary)}</span></div>
              {emp.allowances>0&&<div className="ps-sum-row"><span>Allowances</span><span>{fmtN(emp.allowances)}</span></div>}
              <div className="ps-sum-row total"><span>Gross Pay</span><span>{fmtN(p.gross)}</span></div>
            </div>
            {/* Deductions */}
            <div className="ps-sum-box">
              <div className="ps-sum-lbl">➖ Employee Deductions</div>
              <div className="ps-sum-row"><span>EPF (Kwsp) {emp.nationality==="Foreign"?"2%":"11%"}</span><span>({fmtN(p.epfEE)})</span></div>
              <div className="ps-sum-row"><span>SOCSO (PERKESO)</span><span>({fmtN(p.socsoEE)})</span></div>
              <div className="ps-sum-row"><span>EIS (PERKESO)</span><span>({fmtN(p.eisEE)})</span></div>
              <div className="ps-sum-row"><span>PCB / MTD (LHDN)</span><span>({fmtN(p.pcb)})</span></div>
              <div className="ps-sum-row total"><span>Total Deductions</span><span>({fmtN(p.totalDeductions)})</span></div>
            </div>
          </div>

          <div className="ps-net">
            <span className="ps-net-lbl">NET PAY (TAKE-HOME)</span>
            <span className="ps-net-val">RM {fmtN(p.netPay)}</span>
          </div>

          {/* Employer contributions info */}
          <div style={{background:"#f7f6f3",borderRadius:6,padding:"10px 14px",marginBottom:14,fontSize:11}}>
            <div style={{fontWeight:700,fontSize:9.5,textTransform:"uppercase",letterSpacing:1,color:"#9a9388",marginBottom:6}}>Employer Statutory Contributions (not deducted from employee)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8}}>
              {[
                ["EPF (Employer)", `RM ${fmtN(p.epfER)}`],
                ["SOCSO (Employer)", `RM ${fmtN(p.socsoER)}`],
                ["EIS (Employer)", `RM ${fmtN(p.eisER)}`],
                ["Total Employer Cost", `RM ${fmtN(p.totalEmployerCost)}`],
              ].map(([l,v])=>(
                <div key={l}><div style={{fontSize:9,color:"#9a9388",marginBottom:2}}>{l}</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontWeight:600,color:"#18160f"}}>{v}</div></div>
              ))}
            </div>
          </div>

          <div className="ps-footer">
            <div>
              <div>This payslip is computer-generated. EPF contributions submitted to KWSP by 15th of following month.</div>
              <div style={{marginTop:4}}>SOCSO & EIS submitted to PERKESO by 15th of following month.</div>
              <div style={{marginTop:4}}>PCB/MTD submitted to LHDN via Form CP39 by 15th of following month.</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div className="ps-sig-line">Authorised Signatory</div>
              <div style={{marginTop:20}} className="ps-sig-line">Employee Acknowledgement</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMPLOYEE MODAL (Add / Edit) ─────────────────────────────────────────────
function EmployeeModal({ emp, onClose, onSave }) {
  const blank = { id:"", name:"", ic:"", nationality:"Malaysian", dept:"Engineering", position:"", basicSalary:"", allowances:"0", age:"30", maritalStatus:"Single", bankAcc:"", joinDate:"2026-04-13", hrdcApplicable:true };
  const [f, setF] = useState(emp || blank);
  const p = f.basicSalary ? computePayroll({...f, basicSalary:parseFloat(f.basicSalary)||0, allowances:parseFloat(f.allowances)||0, age:parseInt(f.age)||30}) : null;

  return (
    <div className="ov" onClick={onClose}>
      <div className="modal" style={{width:680}} onClick={e=>e.stopPropagation()}>
        <div className="mh">
          <div className="mt">{emp?"Edit Employee":"Add Employee"}</div>
          <div className="ms">Statutory contributions calculated automatically per 2026 Malaysia rates</div>
        </div>
        <div className="mb">
          <div className="fr2">
            <div className="fg"><label className="fl">Full Name *</label><input className="fi" value={f.name} onChange={e=>setF(p=>({...p,name:e.target.value}))} placeholder="As per IC / Passport"/></div>
            <div className="fg"><label className="fl">Employee ID</label><input className="fi fi-mono" value={f.id} onChange={e=>setF(p=>({...p,id:e.target.value}))} placeholder="EMP-001"/></div>
          </div>
          <div className="fr3">
            <div className="fg"><label className="fl">IC / Passport No.</label><input className="fi fi-mono" value={f.ic} onChange={e=>setF(p=>({...p,ic:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Nationality</label>
              <select className="fi" value={f.nationality} onChange={e=>setF(p=>({...p,nationality:e.target.value}))}>
                {["Malaysian","PR","Foreign"].map(n=><option key={n}>{n}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Age</label><input className="fi" type="number" value={f.age} onChange={e=>setF(p=>({...p,age:e.target.value}))}/></div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Department</label>
              <select className="fi" value={f.dept} onChange={e=>setF(p=>({...p,dept:e.target.value}))}>
                {["Engineering","Finance","Operations","Sales","HR","Marketing","Management"].map(d=><option key={d}>{d}</option>)}
              </select>
            </div>
            <div className="fg"><label className="fl">Position / Job Title</label><input className="fi" value={f.position} onChange={e=>setF(p=>({...p,position:e.target.value}))}/></div>
          </div>
          <div className="fr3">
            <div className="fg"><label className="fl">Basic Salary (RM) *</label><input className="fi fi-mono" type="number" value={f.basicSalary} onChange={e=>setF(p=>({...p,basicSalary:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Fixed Allowances (RM)</label><input className="fi fi-mono" type="number" value={f.allowances} onChange={e=>setF(p=>({...p,allowances:e.target.value}))}/></div>
            <div className="fg"><label className="fl">Marital Status</label>
              <select className="fi" value={f.maritalStatus} onChange={e=>setF(p=>({...p,maritalStatus:e.target.value}))}>
                {["Single","Married","Divorced"].map(m=><option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div className="fr2">
            <div className="fg"><label className="fl">Bank Account</label><input className="fi fi-mono" value={f.bankAcc} onChange={e=>setF(p=>({...p,bankAcc:e.target.value}))} placeholder="Bank Name + Account No."/></div>
            <div className="fg"><label className="fl">Join Date</label><input className="fi" type="date" value={f.joinDate} onChange={e=>setF(p=>({...p,joinDate:e.target.value}))}/></div>
          </div>
          <div className="fg" style={{display:"flex",alignItems:"center",gap:10}}>
            <input type="checkbox" id="hrdc" checked={f.hrdcApplicable} onChange={e=>setF(p=>({...p,hrdcApplicable:e.target.checked}))} style={{width:16,height:16}}/>
            <label htmlFor="hrdc" style={{fontSize:13,color:T.inkMid,cursor:"pointer"}}>Subject to HRD Corp Levy (1%) — for companies with ≥10 Malaysian employees</label>
          </div>

          {/* Live preview */}
          {p && (
            <div style={{marginTop:12,background:T.greenLight,border:`1px solid ${T.greenBorder}`,borderRadius:8,padding:"12px 14px"}}>
              <div style={{fontSize:10.5,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,color:T.green,marginBottom:8}}>Live Calculation Preview (2026 Rates)</div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
                {[
                  ["Gross Pay",       fmtRM(p.gross)],
                  ["EPF (Employee)",  fmtRM(p.epfEE)],
                  ["PCB / MTD",       fmtRM(p.pcb)],
                  ["Net Pay",         fmtRM(p.netPay)],
                  ["EPF (Employer)",  fmtRM(p.epfER)],
                  ["SOCSO (ER)",      fmtRM(p.socsoER)],
                  ["EIS (ER)",        fmtRM(p.eisER)],
                  ["Total ER Cost",   fmtRM(p.totalEmployerCost)],
                ].map(([l,v])=>(
                  <div key={l}><div style={{fontSize:9.5,color:T.green,marginBottom:1}}>{l}</div><div style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:12,fontWeight:600,color:T.ink}}>{v}</div></div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mf">
          <button className="btn btn-out" onClick={onClose}>Cancel</button>
          <button className="btn btn-dark" onClick={()=>f.name&&f.basicSalary&&onSave(f)}>
            {emp?"Save Changes":"Add Employee"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAYROLL PAGE ────────────────────────────────────────────────────────
export default function PayrollPage() {
  const [employees, setEmployees] = useState(SEED_EMPLOYEES);
  const [tab,        setTab]       = useState("employees");
  const [deptFilter, setDeptFilter]= useState("All");
  const [period,     setPeriod]    = useState(PERIODS[0]);
  const [modal,      setModal]     = useState(null);

  const filtered = employees.filter(e => deptFilter === "All" || e.dept === deptFilter);

  const payrollData = useMemo(() =>
    employees.map(e => ({ ...e, ...computePayroll(e) })),
    [employees]
  );

  const summary = useMemo(() => ({
    totalGross:       payrollData.reduce((s,e) => s+e.gross, 0),
    totalNetPay:      payrollData.reduce((s,e) => s+e.netPay, 0),
    totalEPFEmployee: payrollData.reduce((s,e) => s+e.epfEE, 0),
    totalEPFEmployer: payrollData.reduce((s,e) => s+e.epfER, 0),
    totalSOCSO:       payrollData.reduce((s,e) => s+e.socsoEE+e.socsoER, 0),
    totalEIS:         payrollData.reduce((s,e) => s+e.eisEE+e.eisER, 0),
    totalPCB:         payrollData.reduce((s,e) => s+e.pcb, 0),
    totalHRDC:        payrollData.reduce((s,e) => s+e.hrdcLevy, 0),
    totalEmployerCost:payrollData.reduce((s,e) => s+e.totalEmployerCost, 0),
  }), [payrollData]);

  const saveEmployee = emp => {
    if (!emp.id) emp = { ...emp, id:`EMP-${String(employees.length+1).padStart(3,"0")}` };
    setEmployees(p => {
      const exists = p.find(e => e.id === emp.id);
      return exists ? p.map(e => e.id===emp.id ? emp : e) : [...p, emp];
    });
    setModal(null);
  };

  return (
    <div>
      <style>{css}</style>

      <div className="alert al-b">
        <span>📋</span>
        <div>
          <strong>2026 Statutory Rates Applied:</strong> EPF 13%/12% employer, 11% employee (≥60: exempt) · SOCSO & EIS wage ceiling RM6,000 (from Oct 2024) · Foreign workers EPF mandatory from Oct 2025 at 2%+2% · All due by <strong>15th of following month</strong>.
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <div className={`tab ${tab==="employees"?"active":""}`} onClick={()=>setTab("employees")}>👥 Employees ({employees.length})</div>
        <div className={`tab ${tab==="payroll"?"active":""}`}   onClick={()=>setTab("payroll")}>💰 Payroll Run</div>
        <div className={`tab ${tab==="statutory"?"active":""}`} onClick={()=>setTab("statutory")}>🏛️ Statutory Summary</div>
        <div className={`tab ${tab==="rates"?"active":""}`}     onClick={()=>setTab("rates")}>📊 Rate Reference</div>
      </div>

      {/* ── EMPLOYEES TAB ── */}
      {tab === "employees" && (
        <>
          <div className="stats-4">
            <div className="card card-pad"><div className="stat-lbl">Total Employees</div><div className="stat-val">{employees.length}</div><div className="stat-sub">Active headcount</div></div>
            <div className="card card-pad"><div className="stat-lbl">Total Gross Payroll</div><div className="stat-val" style={{fontSize:16}}>{fmtRM(summary.totalGross)}</div><div className="stat-sub">Per month</div></div>
            <div className="card card-pad"><div className="stat-lbl">Total Employer Cost</div><div className="stat-val" style={{fontSize:16,color:T.red}}>{fmtRM(summary.totalEmployerCost)}</div><div className="stat-sub">Incl. all statutory</div></div>
            <div className="card card-pad"><div className="stat-lbl">Foreign Workers</div><div className="stat-val">{employees.filter(e=>e.nationality==="Foreign").length}</div><div className="stat-sub">EPF 2%+2% applies</div></div>
          </div>

          <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",justifyContent:"space-between",flexWrap:"wrap"}}>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {DEPTS.map(d=>(
                <button key={d} className={`btn btn-sm ${deptFilter===d?"btn-dark":"btn-out"}`} onClick={()=>setDeptFilter(d)}>{d}</button>
              ))}
            </div>
            <button className="btn btn-dark btn-sm" onClick={()=>setModal("new")}>＋ Add Employee</button>
          </div>

          <div className="tc">
            <div className="tc-head"><span className="tc-title">Employees ({filtered.length})</span></div>
            <table>
              <thead>
                <tr>
                  <th>Employee</th><th>Dept</th><th>Nationality</th>
                  <th style={{textAlign:"right"}}>Basic</th>
                  <th style={{textAlign:"right"}}>Gross</th>
                  <th style={{textAlign:"right"}}>EPF (EE)</th>
                  <th style={{textAlign:"right"}}>SOCSO+EIS</th>
                  <th style={{textAlign:"right"}}>PCB</th>
                  <th style={{textAlign:"right"}}>Net Pay</th>
                  <th style={{textAlign:"right"}}>ER Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(emp => {
                  const p = computePayroll(emp);
                  return (
                    <tr key={emp.id}>
                      <td>
                        <div style={{fontWeight:600,color:T.ink}}>{emp.name}</div>
                        <div style={{fontSize:11,color:T.inkLight}}>{emp.id} · {emp.position}</div>
                      </td>
                      <td><span className="pr-pill pr-blue" style={{fontSize:10}}>{emp.dept}</span></td>
                      <td>
                        <span className={`pr-pill ${emp.nationality==="Foreign"?"pr-amber":"pr-green"}`} style={{fontSize:10}}>
                          {emp.nationality}
                        </span>
                      </td>
                      <td className="mono" style={{textAlign:"right",fontSize:12}}>{fmtN(emp.basicSalary)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,fontWeight:600}}>{fmtN(p.gross)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.blue}}>{fmtN(p.epfEE)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.amber}}>{fmtN(p.socsoEE+p.eisEE)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.red}}>{fmtN(p.pcb)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:13,fontWeight:700,color:T.green}}>{fmtN(p.netPay)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.inkMid}}>{fmtN(p.totalEmployerCost)}</td>
                      <td>
                        <div style={{display:"flex",gap:5}}>
                          <button className="btn btn-out btn-xs" onClick={()=>setModal({type:"payslip",emp})}>📄</button>
                          <button className="btn btn-out btn-xs" onClick={()=>setModal({type:"edit",emp})}>✏️</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── PAYROLL RUN TAB ── */}
      {tab === "payroll" && (
        <>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:16}}>
            <label className="fl" style={{margin:0}}>Pay Period:</label>
            <select className="fi" style={{width:200}} value={period} onChange={e=>setPeriod(e.target.value)}>
              {PERIODS.map(p=><option key={p}>{p}</option>)}
            </select>
            <button className="btn btn-dark btn-sm">▶ Run Payroll</button>
          </div>

          <div className="stats-4" style={{marginBottom:16}}>
            <div className="card card-pad"><div className="stat-lbl">Total Net Pay</div><div className="stat-val" style={{color:T.green,fontSize:17}}>{fmtRM(summary.totalNetPay)}</div><div className="stat-sub">Bank transfer required</div></div>
            <div className="card card-pad"><div className="stat-lbl">EPF to KWSP</div><div className="stat-val" style={{fontSize:16,color:T.blue}}>{fmtRM(summary.totalEPFEmployee+summary.totalEPFEmployer)}</div><div className="stat-sub">EE + ER combined</div></div>
            <div className="card card-pad"><div className="stat-lbl">SOCSO+EIS to PERKESO</div><div className="stat-val" style={{fontSize:16,color:T.amber}}>{fmtRM(summary.totalSOCSO+summary.totalEIS)}</div><div className="stat-sub">EE + ER combined</div></div>
            <div className="card card-pad"><div className="stat-lbl">PCB to LHDN</div><div className="stat-val" style={{fontSize:16,color:T.red}}>{fmtRM(summary.totalPCB)}</div><div className="stat-sub">Via Form CP39</div></div>
          </div>

          <div className="tc">
            <div className="tc-head">
              <span className="tc-title">Payroll Run — {period}</span>
              <span style={{fontSize:11,color:T.inkLight}}>All due by 15 May 2026 · Click 📄 for payslip</span>
            </div>
            <div style={{overflowX:"auto"}}>
              <table>
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th style={{textAlign:"right"}}>Gross</th>
                    <th style={{textAlign:"right"}}>EPF (EE)</th>
                    <th style={{textAlign:"right"}}>EPF (ER)</th>
                    <th style={{textAlign:"right"}}>SOCSO (EE+ER)</th>
                    <th style={{textAlign:"right"}}>EIS (EE+ER)</th>
                    <th style={{textAlign:"right"}}>PCB</th>
                    <th style={{textAlign:"right"}}>Net Pay</th>
                    <th style={{textAlign:"right"}}>ER Total Cost</th>
                    <th/>
                  </tr>
                </thead>
                <tbody>
                  {payrollData.map(e => (
                    <tr key={e.id}>
                      <td>
                        <div style={{fontWeight:600,color:T.ink,fontSize:13}}>{e.name}</div>
                        <div style={{fontSize:11,color:T.inkLight}}>{e.dept} · {e.id}</div>
                      </td>
                      <td className="mono" style={{textAlign:"right",fontSize:12}}>{fmtN(e.gross)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.blue}}>{fmtN(e.epfEE)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.blue}}>{fmtN(e.epfER)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.amber}}>{fmtN(e.socsoEE+e.socsoER)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.amber}}>{fmtN(e.eisEE+e.eisER)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.red}}>{fmtN(e.pcb)}</td>
                      <td className="mono" style={{textAlign:"right",fontWeight:700,color:T.green}}>{fmtN(e.netPay)}</td>
                      <td className="mono" style={{textAlign:"right",fontSize:12,color:T.inkMid}}>{fmtN(e.totalEmployerCost)}</td>
                      <td><button className="btn btn-out btn-xs" onClick={()=>setModal({type:"payslip",emp:e})}>📄</button></td>
                    </tr>
                  ))}
                  {/* Totals */}
                  <tr style={{background:T.stripe}}>
                    <td style={{fontWeight:700,color:T.ink}}>TOTAL</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:700}}>{fmtN(summary.totalGross)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:700,color:T.blue}}>{fmtN(summary.totalEPFEmployee)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:700,color:T.blue}}>{fmtN(summary.totalEPFEmployer)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:700,color:T.amber}}>{fmtN(summary.totalSOCSO)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:700,color:T.amber}}>{fmtN(summary.totalEIS)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:700,color:T.red}}>{fmtN(summary.totalPCB)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:700,color:T.green}}>{fmtN(summary.totalNetPay)}</td>
                    <td className="mono" style={{textAlign:"right",fontWeight:700}}>{fmtN(summary.totalEmployerCost)}</td>
                    <td/>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ── STATUTORY SUMMARY TAB ── */}
      {tab === "statutory" && (
        <>
          <div className="alert al-a"><span>📅</span><div><strong>Payment Due: 15 May 2026.</strong> EPF via i-Akaun (Employer), SOCSO+EIS via ASSIST portal (perkeso.gov.my), PCB via e-PCB or Form CP39 on ezHASiL. Penalties apply for late payment.</div></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16}}>
            {[
              { title:"EPF (KWSP)", color:T.blue, icon:"🏦", body:"KWSP", due:"15 May 2026", portal:"i-Akaun Employer",
                rows:[["Employee Contribution (11%)", summary.totalEPFEmployee],["Employer Contribution (12–13%)", summary.totalEPFEmployer],["Total to KWSP", summary.totalEPFEmployee+summary.totalEPFEmployer]] },
              { title:"SOCSO + EIS (PERKESO)", color:T.amber, icon:"🛡️", body:"PERKESO", due:"15 May 2026", portal:"ASSIST Portal",
                rows:[["SOCSO Employee", payrollData.reduce((s,e)=>s+e.socsoEE,0)],["SOCSO Employer", payrollData.reduce((s,e)=>s+e.socsoER,0)],["EIS Employee", payrollData.reduce((s,e)=>s+e.eisEE,0)],["EIS Employer", payrollData.reduce((s,e)=>s+e.eisER,0)],["Total to PERKESO", summary.totalSOCSO+summary.totalEIS]] },
              { title:"PCB / MTD (LHDN)", color:T.red, icon:"📋", body:"LHDN", due:"15 May 2026", portal:"ezHASiL / CP39",
                rows:[["PCB Withheld", summary.totalPCB],["Form", "CP39"],["Total to LHDN", summary.totalPCB]] },
            ].map(s => (
              <div key={s.title} className="rate-card">
                <div className="rate-title" style={{color:s.color}}><span>{s.icon}</span>{s.title}</div>
                {s.rows.map(([l,v])=>(
                  <div className="rate-row" key={l}>
                    <span className="rate-key">{l}</span>
                    <span className="rate-val" style={{color:l.startsWith("Total")?s.color:T.ink}}>
                      {typeof v === "number" ? fmtRM(v) : v}
                    </span>
                  </div>
                ))}
                <div style={{marginTop:10,padding:"6px 8px",background:s.color+"15",borderRadius:6,fontSize:11,color:s.color}}>
                  Due: <strong>{s.due}</strong> · Submit via: <strong>{s.portal}</strong>
                </div>
              </div>
            ))}
          </div>

          {summary.totalHRDC > 0 && (
            <div className="rate-card" style={{marginTop:14}}>
              <div className="rate-title" style={{color:T.purple}}>🎓 HRD Corp Levy (1%)</div>
              <div className="rate-row"><span className="rate-key">Total HRD Corp Levy</span><span className="rate-val">{fmtRM(summary.totalHRDC)}</span></div>
              <div style={{marginTop:8,fontSize:11,color:T.inkMid}}>Mandatory for companies with ≥10 Malaysian employees in manufacturing, services, and mining sectors. Submit monthly to HRD Corp portal.</div>
            </div>
          )}
        </>
      )}

      {/* ── RATE REFERENCE TAB ── */}
      {tab === "rates" && (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          <div className="rate-card">
            <div className="rate-title">🏦 EPF Rates 2026 (KWSP)</div>
            {[
              ["Malaysian / PR, Age < 55", "EE: 11% | ER: 13% (≤RM5k) / 12% (>RM5k)"],
              ["Malaysian / PR, Age 55–60", "EE: 5.5% | ER: 6.5%"],
              ["Malaysian / PR, Age ≥ 60",  "EE: 0% | ER: 4%"],
              ["Foreign Worker (from Oct 2025)", "EE: 2% | ER: 2%"],
              ["Wage Ceiling", "No ceiling — applies on full gross"],
              ["Payment Deadline", "15th of following month via i-Akaun"],
            ].map(([k,v])=>(
              <div className="rate-row" key={k}><span className="rate-key">{k}</span><span className="rate-val" style={{fontSize:11,textAlign:"right",maxWidth:220}}>{v}</span></div>
            ))}
          </div>

          <div className="rate-card">
            <div className="rate-title">🛡️ SOCSO + EIS Rates 2026 (PERKESO)</div>
            {[
              ["SOCSO — Employee", "~0.5% (table-based)"],
              ["SOCSO — Employer", "~1.75% (table-based)"],
              ["SOCSO Wage Ceiling", "RM6,000/month (from Oct 2024)"],
              ["SOCSO — Age ≥ 60", "Exempt"],
              ["EIS — Employee", "~0.2% (table-based)"],
              ["EIS — Employer", "~0.2% (table-based)"],
              ["EIS Wage Ceiling", "RM6,000/month"],
              ["Payment Deadline", "15th of following month via ASSIST"],
            ].map(([k,v])=>(
              <div className="rate-row" key={k}><span className="rate-key">{k}</span><span className="rate-val" style={{fontSize:11,textAlign:"right"}}>{v}</span></div>
            ))}
          </div>

          <div className="rate-card">
            <div className="rate-title">📋 PCB / MTD Income Tax 2026 (LHDN)</div>
            {[
              ["≤ RM5,000 / year", "0%"],
              ["RM5,001 – RM20,000", "1%"],
              ["RM20,001 – RM35,000", "3%"],
              ["RM35,001 – RM50,000", "8%"],
              ["RM50,001 – RM70,000", "13%"],
              ["RM70,001 – RM100,000", "21%"],
              ["RM100,001 – RM400,000", "24%"],
              ["> RM400,000", "25%"],
              ["Individual Relief", "RM9,000"],
              ["EPF Relief (max)", "RM4,000"],
              ["Form / Portal", "CP39 via ezHASiL"],
            ].map(([k,v])=>(
              <div className="rate-row" key={k}><span className="rate-key">{k}</span><span className="rate-val">{v}</span></div>
            ))}
          </div>

          <div className="rate-card">
            <div className="rate-title">📅 Payroll Compliance Checklist</div>
            {[
              ["EPF (KWSP) submission",      "By 15th monthly", T.green],
              ["SOCSO + EIS (PERKESO)",      "By 15th monthly", T.green],
              ["PCB / MTD via CP39",         "By 15th monthly", T.green],
              ["HRD Corp Levy (if ≥10 staff)","By 15th monthly", T.green],
              ["EA Form (Form EA)",          "By 28 Feb yearly", T.amber],
              ["Annual Return CP8D to LHDN", "By 31 Mar yearly", T.amber],
              ["Foreign worker EPF (Oct 25+)","2% + 2% mandatory",T.blue],
            ].map(([k,v,c])=>(
              <div className="rate-row" key={k}>
                <span className="rate-key">{k}</span>
                <span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:11,color:c,fontWeight:600}}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODALS */}
      {modal==="new"            && <EmployeeModal onClose={()=>setModal(null)} onSave={saveEmployee}/>}
      {modal?.type==="edit"     && <EmployeeModal emp={modal.emp} onClose={()=>setModal(null)} onSave={saveEmployee}/>}
      {modal?.type==="payslip"  && <Payslip emp={modal.emp} period={period} onClose={()=>setModal(null)}/>}
    </div>
  );
}
