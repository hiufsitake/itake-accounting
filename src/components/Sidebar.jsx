import React from "react";

const NAV = [
  {
    group: "Overview",
    items: [
      { id: "dashboard",  icon: "🏠", label: "Dashboard" },
    ],
  },
  {
    group: "Sales",
    items: [
      { id: "dos",        icon: "📦", label: "Delivery Orders",      badgeKey: "dosPending" },
      { id: "invoices",   icon: "🧾", label: "Tax Invoices",          badgeKey: "invOverdue" },
      { id: "cdnotes",    icon: "📝", label: "Credit / Debit Notes"  },
      { id: "soa",        icon: "📄", label: "Statement of Account"  },
    ],
  },
  {
    group: "Payments",
    items: [
      { id: "vouchers",   icon: "💸", label: "Payment Vouchers"      },
      { id: "bills",      icon: "💳", label: "Bills & Expenses"      },
    ],
  },
  {
    group: "Reports",
    items: [
      { id: "aging",      icon: "📊", label: "Aging Report"          },
    ],
  },
  {
    group: "Taxation",
    items: [
      { id: "sst",        icon: "🏛️", label: "SST Manager"           },
      { id: "einvoice",   icon: "📋", label: "e-Invoice (MyInvois)"  },
    ],
  },
  {
    group: "HR & Payroll",
    items: [
      { id: "payroll",    icon: "👥", label: "Payroll & HR"          },
    ],
  },
  {
    group: "Compliance",
    items: [
      { id: "compliance", icon: "✅", label: "Compliance Centre",     badgeKey: "complianceAlerts" },
    ],
  },
];

export default function Sidebar({ page, setPage, badges = {} }) {
  return (
    <aside className="sb">
      <div className="brand">
        <div className="brand-name">
          ITAKE <span className="my-tag">Acct</span>
        </div>
        <div className="brand-sub">Accounting System</div>
      </div>

      {NAV.map(g => (
        <div className="ns" key={g.group}>
          <div className="nsl">{g.group}</div>
          {g.items.map(item => (
            <div
              key={item.id}
              className={`ni ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <span>{item.icon}</span>
              {item.label}
              {item.badgeKey && badges[item.badgeKey] > 0 && (
                <span className="nb">{badges[item.badgeKey]}</span>
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="sb-bot">
        <div className="cbox">
          <div className="cbox-t">✓ Compliance</div>
          <div className="cbox-i">✓ Companies Act 2016</div>
          <div className="cbox-i">✓ Income Tax Act 1967</div>
          <div className="cbox-i">✓ SST Act 2018</div>
          <div className="cbox-i">✓ LHDN e-Invoice</div>
          <div className="cbox-i">✓ MPERS / MFRS</div>
          <div className="cbox-i">✓ 7-Year Retention</div>
        </div>
      </div>
    </aside>
  );
}
