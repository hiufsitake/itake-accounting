// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
export const T = {
  bg:          "#ffffff",
  white:       "#ffffff",
  card:        "#ffffff",
  border:      "#f1f5f9",
  borderHover: "#10b981",
  stripe:      "#f8fafc",
  ink:         "#0f172a",
  inkMid:      "#475569",
  inkLight:    "#94a3b8",
  red:         "#ef4444",
  redLight:    "#fef2f2",
  redBorder:   "#fecaca",
  green:       "#10b981",
  greenLight:  "#ecfdf5",
  greenBorder: "#6ee7b7",
  amber:       "#f59e0b",
  amberLight:  "#fffbeb",
  amberBorder: "#fde68a",
  blue:        "#3b82f6",
  blueLight:   "#eff6ff",
  blueBorder:  "#bfdbfe",
  purple:      "#8b5cf6",
  purpleLight: "#f5f3ff",
  purpleBorder:"#ddd6fe",
  sidebar:     "#0f172a",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; font-family: 'Inter', sans-serif; background: ${T.bg}; color: ${T.ink}; -webkit-tap-highlight-color: transparent; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }

/* ── LAYOUT ── */
.app { display: flex; height: 100vh; overflow: hidden; }
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.body { flex: 1; overflow-y: auto; padding: 20px 24px; }

/* ── TOPBAR ── */
.topbar { height: 56px; background: ${T.white}; border-bottom: 2px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; flex-shrink: 0; }
.page-h { font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 900; color: ${T.ink}; text-transform: uppercase; letter-spacing: 0.08em; }

/* ── SIDEBAR ── */
.sb { width: 230px; min-width: 230px; background: ${T.sidebar}; display: flex; flex-direction: column; overflow-y: auto; }
.brand { padding: 20px 18px 16px; border-bottom: 1px solid #1e293b; }
.brand-name { font-family: 'Inter', sans-serif; font-size: 20px; font-weight: 900; color: #fff; text-transform: uppercase; font-style: italic; letter-spacing: 0.03em; }
.brand-sub { font-size: 9px; color: #475569; text-transform: uppercase; letter-spacing: 0.3em; margin-top: 4px; font-weight: 700; }
.my-tag { background: ${T.green}; color: #fff; font-size: 8px; font-weight: 700; padding: 1px 6px; border-radius: 4px; margin-left: 6px; vertical-align: 2px; letter-spacing: 0.08em; }
.ns { padding: 14px 12px 4px; }
.nsl { font-size: 9px; font-weight: 700; color: #334155; text-transform: uppercase; letter-spacing: 0.15em; padding: 0 6px 5px; }
.ni { display: flex; align-items: center; gap: 9px; padding: 9px 10px; border-radius: 12px; cursor: pointer; font-size: 12px; font-weight: 600; color: #64748b; transition: all .15s; margin-bottom: 1px; position: relative; }
.ni:hover { background: #1e293b; color: #cbd5e1; }
.ni.active { background: rgba(16,185,129,0.1); color: #10b981; }
.ni.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 18px; background: ${T.green}; border-radius: 0 2px 2px 0; }
.nb { margin-left: auto; background: ${T.green}; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
.sb-bot { margin-top: auto; padding: 12px; border-top: 1px solid #1e293b; }
.cbox { background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.15); border-radius: 12px; padding: 10px 12px; }
.cbox-t { font-size: 9px; font-weight: 700; color: ${T.green}; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 6px; }
.cbox-i { font-size: 11px; color: #334155; padding: 2px 0; display: flex; gap: 6px; }

/* ── BUTTONS ── */
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 9px 18px; border-radius: 9999px; border: none; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; transition: all .15s; white-space: nowrap; }
.btn:active { transform: scale(.97); }
.btn-dark { background: ${T.ink}; color: #fff; } .btn-dark:hover { background: #1e293b; }
.btn-red  { background: ${T.red};  color: #fff; } .btn-red:hover  { background: #dc2626; }
.btn-out  { background: transparent; color: ${T.inkMid}; border: 2px solid ${T.border}; } .btn-out:hover { border-color: ${T.green}; color: ${T.green}; }
.btn-grn  { background: ${T.green}; color: #fff; } .btn-grn:hover { background: #059669; }
.btn-pur  { background: ${T.purpleLight}; color: ${T.purple}; border: 1px solid ${T.purpleBorder}; } .btn-pur:hover { background: #ede9fe; }
.btn-sm   { padding: 6px 14px; font-size: 11px; } .btn-xs { padding: 4px 10px; font-size: 10px; }

/* ── CARDS ── */
.card { background: ${T.white}; border: 2px solid ${T.border}; border-radius: 1.5rem; transition: all .2s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04); }
.card:hover { border-color: ${T.green}; transform: translateY(-2px); box-shadow: 0 20px 25px -5px rgba(0,0,0,0.08); }
.card-pad { padding: 18px 20px; }

/* ── STATS GRID ── */
.stats-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 18px; }
.stats-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 18px; }
.stat-lbl { font-size: 10px; font-weight: 700; color: ${T.inkLight}; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 5px; }
.stat-val { font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 900; color: ${T.ink}; }
.stat-sub { font-size: 11px; margin-top: 3px; color: ${T.inkLight}; font-weight: 600; }

/* ── TABLE ── */
.tc { background: ${T.white}; border: 2px solid ${T.border}; border-radius: 1.5rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04); }
.tc-head { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 2px solid ${T.border}; background: ${T.stripe}; }
.tc-title { font-size: 11px; font-weight: 700; color: ${T.ink}; text-transform: uppercase; letter-spacing: 0.08em; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; color: ${T.inkLight}; padding: 9px 14px; background: ${T.stripe}; border-bottom: 2px solid ${T.border}; }
td { padding: 10px 14px; font-size: 13px; color: ${T.inkMid}; border-bottom: 1px solid ${T.border}; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: ${T.stripe}; cursor: pointer; }

/* ── BADGES ── */
.badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 10px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.bg { background: ${T.greenLight};  color: ${T.green};  border: 1px solid ${T.greenBorder};  }
.br { background: ${T.redLight};    color: ${T.red};    border: 1px solid ${T.redBorder};    }
.ba { background: ${T.amberLight};  color: ${T.amber};  border: 1px solid ${T.amberBorder};  }
.bb { background: ${T.blueLight};   color: ${T.blue};   border: 1px solid ${T.blueBorder};   }
.bp { background: ${T.purpleLight}; color: ${T.purple}; border: 1px solid ${T.purpleBorder}; }
.bk { background: ${T.stripe};      color: ${T.inkMid}; border: 1px solid ${T.border};       }

/* ── ALERTS ── */
.alert { border-radius: 1rem; padding: 12px 16px; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 14px; font-size: 12.5px; line-height: 1.55; font-weight: 600; }
.al-r { background: ${T.redLight};   border: 2px solid ${T.redBorder};   color: ${T.red};   }
.al-a { background: ${T.amberLight}; border: 2px solid ${T.amberBorder}; color: ${T.amber}; }
.al-g { background: ${T.greenLight}; border: 2px solid ${T.greenBorder}; color: ${T.green}; }
.al-b { background: ${T.blueLight};  border: 2px solid ${T.blueBorder};  color: ${T.blue};  }

/* ── FORM ── */
.fg { margin-bottom: 12px; }
.fl { font-size: 10px; font-weight: 700; color: ${T.inkMid}; text-transform: uppercase; letter-spacing: .08em; display: block; margin-bottom: 5px; }
.fi { width: 100%; padding: 10px 14px; background: ${T.stripe}; border: 2px solid ${T.border}; border-radius: 1rem; font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500; color: ${T.ink}; outline: none; transition: all .15s; }
.fi:focus { border-color: ${T.green}; background: ${T.white}; }
.fi-mono { font-family: 'Inter', monospace; }
.fr2 { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
.fr3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.sdiv { font-size: 10px; font-weight: 700; color: ${T.inkLight}; text-transform: uppercase; letter-spacing: 0.08em; padding: 8px 0 5px; border-top: 2px solid ${T.border}; margin-top: 4px; }

/* ── MODAL ── */
.ov { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 300; display: flex; align-items: flex-start; justify-content: center; padding: 20px 16px; overflow-y: auto; backdrop-filter: blur(2px); }
.modal { background: ${T.white}; border: 2px solid ${T.border}; border-radius: 2rem; width: 700px; max-width: 100%; box-shadow: 0 24px 64px rgba(0,0,0,0.12); }
.mh { padding: 20px 24px 14px; border-bottom: 2px solid ${T.border}; }
.mt { font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 900; color: ${T.ink}; text-transform: uppercase; letter-spacing: 0.06em; }
.ms { font-size: 11.5px; color: ${T.inkLight}; margin-top: 3px; font-weight: 600; }
.mb { padding: 20px 24px; }
.mf { padding: 14px 24px; border-top: 2px solid ${T.border}; display: flex; justify-content: space-between; align-items: center; background: ${T.stripe}; border-radius: 0 0 2rem 2rem; }

/* ── TABS ── */
.tabs { display: flex; gap: 2px; background: ${T.stripe}; padding: 4px; border-radius: 9999px; margin-bottom: 18px; width: fit-content; border: 2px solid ${T.border}; }
.tab { padding: 7px 20px; border-radius: 9999px; cursor: pointer; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: ${T.inkLight}; transition: all .15s; }
.tab.active { background: ${T.white}; color: ${T.ink}; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }

/* ── MISC ── */
.mono { font-family: 'Inter', monospace; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.chip-red { background: ${T.redLight}; color: ${T.red}; border: 1px solid ${T.redBorder}; }
.chip-grn { background: ${T.greenLight}; color: ${T.green}; border: 1px solid ${T.greenBorder}; }
.chip-amb { background: ${T.amberLight}; color: ${T.amber}; border: 1px solid ${T.amberBorder}; }
.einv-b { background: ${T.blueLight}; color: ${T.blue}; border: 1px solid ${T.blueBorder}; font-size: 10px; padding: 2px 8px; border-radius: 6px; font-weight: 700; }
.divider { border: none; border-top: 2px solid ${T.border}; margin: 14px 0; }
`;
