# LedgerX MY 🇲🇾
**Malaysia-compliant accounting software** — built with React

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm start
# Opens at http://localhost:3000

# 3. Build for production
npm run build
```

---

## 📁 Project Structure

```
ledgerx/
├── public/
│   └── index.html
├── src/
│   ├── data/
│   │   └── seedData.js          ← All initial data (customers, invoices, DOs, bills)
│   │
│   ├── utils/
│   │   └── helpers.js           ← Shared utilities (fmtRM, calcLines, aging logic)
│   │
│   ├── hooks/
│   │   └── useAppData.js        ← 🔑 Global state — ALL modules share this
│   │
│   ├── components/
│   │   ├── tokens.js            ← Design tokens + global CSS
│   │   └── Sidebar.jsx          ← Navigation sidebar
│   │
│   ├── pages/
│   │   ├── DeliveryOrdersPage.jsx   ← DO module (create, deliver, print)
│   │   ├── InvoicesPage.jsx         ← Invoice module (create, MyInvois, print)
│   │   ├── AgingReportPage.jsx      ← AR/AP aging (live data from invoices)
│   │   └── OtherPages.jsx           ← Dashboard, SST, e-Invoice, Bills, Compliance
│   │
│   ├── App.js                   ← Root — wires all pages + shared state
│   └── index.js                 ← React entry point
│
├── package.json
└── README.md
```

---

## 🔗 How Shared Data Works

All modules use a single `useAppData()` hook from `src/hooks/useAppData.js`.

This means:
- Create an invoice → **Aging Report updates automatically**
- Mark a DO as delivered → **Invoice module shows it ready**
- Add a customer → **available in all dropdowns**

```js
// In any page component:
import { useAppData } from "../hooks/useAppData";

function MyPage({ data }) {
  const { invoices, addInvoice, customers } = data;
  // data is passed down from App.js — always in sync
}
```

---

## 🏛️ Malaysia Compliance

| Law | Coverage |
|-----|---------|
| Companies Act 2016 | SSM reg fields, 7-year retention |
| Income Tax Act 1967 | TIN fields, record retention |
| SST Act 2018 | 6 SST codes (S6, ST10, ST5, EX, ZR, OS) |
| LHDN e-Invoice (MyInvois) | UIN generation, 55-field structure |
| MPERS / MFRS | Aging buckets, bad debt provision alerts |
| Employment Act 1955 | EPF, SOCSO, EIS, PCB (payroll module) |

---

## 📦 Modules Status

| Module | Status | File |
|--------|--------|------|
| Dashboard | 🟡 Basic | `OtherPages.jsx` |
| Delivery Orders | ✅ Complete | `DeliveryOrdersPage.jsx` |
| Tax Invoices | ✅ Complete | `InvoicesPage.jsx` |
| Aging Report (AR+AP) | ✅ Complete | `AgingReportPage.jsx` |
| Bills & Expenses | 🟡 Basic | `OtherPages.jsx` |
| SST Manager | 🔜 Coming soon | `OtherPages.jsx` |
| e-Invoice (MyInvois) | 🔜 Coming soon | `OtherPages.jsx` |
| Payroll | 🔜 Coming soon | — |
| Compliance Centre | 🟡 Basic | `OtherPages.jsx` |

---

## 🌐 Deploy to Vercel (Free)

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial LedgerX MY"
git remote add origin https://github.com/YOUR_USERNAME/ledgerx.git
git push -u origin main

# 2. Go to vercel.com
# → Import GitHub repo → Deploy
# Your app is live at ledgerx.vercel.app
```

---

## ➕ Adding a New Module

1. Create `src/pages/NewModulePage.jsx`
2. Import `{ T }` from `../components/tokens` for styling
3. Accept `data` prop (passed from `App.js`)
4. Add to `PAGE_TITLES` and `renderPage()` in `App.js`
5. Add nav item in `src/components/Sidebar.jsx`

---

*Built for Malaysia — SST, e-Invoice, MPERS compliant*
