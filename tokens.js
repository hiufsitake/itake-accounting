// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
export const T = {
  bg:          "#f7f6f3",
  white:       "#ffffff",
  card:        "#ffffff",
  border:      "#e5e2db",
  borderHover: "#c8c3ba",
  stripe:      "#f3f1ec",
  ink:         "#18160f",
  inkMid:      "#4f4a40",
  inkLight:    "#9a9388",
  red:         "#d4310a",
  redLight:    "#fef2ee",
  redBorder:   "#f5c4b4",
  green:       "#1a6b3c",
  greenLight:  "#edf7f2",
  greenBorder: "#aad9c0",
  amber:       "#a85c00",
  amberLight:  "#fef7ec",
  amberBorder: "#f5d898",
  blue:        "#1649a0",
  blueLight:   "#edf2fd",
  blueBorder:  "#b4c8f5",
  purple:      "#6b21a8",
  purpleLight: "#f5f0ff",
  purpleBorder:"#d4b8f8",
  sidebar:     "#18160f",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
export const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Lora:wght@500;600;700&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { height: 100%; font-family: 'IBM Plex Sans', sans-serif; background: ${T.bg}; color: ${T.ink}; }
::-webkit-scrollbar { width: 5px; height: 5px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 3px; }

/* ── LAYOUT ── */
.app { display: flex; height: 100vh; overflow: hidden; }
.main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
.body { flex: 1; overflow-y: auto; padding: 20px 24px; }

/* ── TOPBAR ── */
.topbar { height: 56px; background: ${T.white}; border-bottom: 1px solid ${T.border}; display: flex; align-items: center; justify-content: space-between; padding: 0 24px; flex-shrink: 0; }
.page-h { font-family: 'Lora', serif; font-size: 19px; color: ${T.ink}; }

/* ── SIDEBAR ── */
.sb { width: 230px; min-width: 230px; background: ${T.sidebar}; display: flex; flex-direction: column; overflow-y: auto; }
.brand { padding: 20px 18px 14px; border-bottom: 1px solid #2c2920; }
.brand-name { font-family: 'Lora', serif; font-size: 18px; color: #fff; }
.brand-sub { font-size: 9.5px; color: #4a4540; text-transform: uppercase; letter-spacing: 1.8px; margin-top: 2px; }
.my-tag { background: ${T.red}; color: #fff; font-size: 8.5px; font-weight: 600; padding: 1px 5px; border-radius: 3px; margin-left: 5px; vertical-align: 2px; }
.ns { padding: 14px 12px 4px; }
.nsl { font-size: 9px; font-weight: 700; color: #333028; text-transform: uppercase; letter-spacing: 2px; padding: 0 6px 5px; }
.ni { display: flex; align-items: center; gap: 9px; padding: 8px 8px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; color: #7a706a; transition: all .12s; margin-bottom: 1px; position: relative; }
.ni:hover { background: #252118; color: #c8c0b4; }
.ni.active { background: ${T.red}15; color: #f08070; }
.ni.active::before { content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%); width: 3px; height: 18px; background: ${T.red}; border-radius: 0 2px 2px 0; }
.nb { margin-left: auto; background: ${T.red}; color: #fff; font-size: 9px; font-weight: 700; padding: 1px 6px; border-radius: 10px; }
.sb-bot { margin-top: auto; padding: 12px; border-top: 1px solid #2c2920; }
.cbox { background: #0e2018; border: 1px solid #1a4028; border-radius: 8px; padding: 9px 11px; }
.cbox-t { font-size: 9px; font-weight: 700; color: #3a9a60; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px; }
.cbox-i { font-size: 11px; color: #3a6a50; padding: 2px 0; display: flex; gap: 6px; }

/* ── BUTTONS ── */
.btn { display: inline-flex; align-items: center; gap: 6px; padding: 8px 15px; border-radius: 7px; border: none; cursor: pointer; font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; font-weight: 600; transition: all .12s; white-space: nowrap; }
.btn:active { transform: scale(.98); }
.btn-dark { background: ${T.ink}; color: #fff; } .btn-dark:hover { background: #2c2920; }
.btn-red  { background: ${T.red};  color: #fff; } .btn-red:hover  { background: #b82808; }
.btn-out  { background: transparent; color: ${T.inkMid}; border: 1.5px solid ${T.border}; } .btn-out:hover { border-color: ${T.borderHover}; color: ${T.ink}; }
.btn-grn  { background: ${T.greenLight}; color: ${T.green}; border: 1px solid ${T.greenBorder}; } .btn-grn:hover { background: #d8f0e4; }
.btn-pur  { background: ${T.purpleLight}; color: ${T.purple}; border: 1px solid ${T.purpleBorder}; } .btn-pur:hover { background: #ede0ff; }
.btn-sm   { padding: 5px 11px; font-size: 12px; } .btn-xs { padding: 3px 8px; font-size: 11px; }

/* ── CARDS ── */
.card { background: ${T.white}; border: 1px solid ${T.border}; border-radius: 10px; }
.card-pad { padding: 18px 20px; }

/* ── STATS GRID ── */
.stats-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 18px; }
.stats-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 18px; }
.stat-lbl { font-size: 10px; font-weight: 700; color: ${T.inkLight}; text-transform: uppercase; letter-spacing: .8px; margin-bottom: 5px; }
.stat-val { font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 500; color: ${T.ink}; }
.stat-sub { font-size: 11px; margin-top: 3px; color: ${T.inkLight}; }

/* ── TABLE ── */
.tc { background: ${T.white}; border: 1px solid ${T.border}; border-radius: 10px; overflow: hidden; }
.tc-head { display: flex; align-items: center; justify-content: space-between; padding: 13px 17px; border-bottom: 1px solid ${T.border}; background: ${T.stripe}; }
.tc-title { font-size: 13px; font-weight: 600; color: ${T.ink}; }
table { width: 100%; border-collapse: collapse; }
th { text-align: left; font-size: 9.5px; font-weight: 700; text-transform: uppercase; letter-spacing: .8px; color: ${T.inkLight}; padding: 9px 14px; background: ${T.stripe}; border-bottom: 1px solid ${T.border}; }
td { padding: 10px 14px; font-size: 13px; color: ${T.inkMid}; border-bottom: 1px solid ${T.border}22; vertical-align: middle; }
tr:last-child td { border-bottom: none; }
tr:hover td { background: ${T.stripe}55; cursor: pointer; }

/* ── BADGES ── */
.badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 20px; font-size: 10.5px; font-weight: 700; }
.bg { background: ${T.greenLight};  color: ${T.green};  border: 1px solid ${T.greenBorder};  }
.br { background: ${T.redLight};    color: ${T.red};    border: 1px solid ${T.redBorder};    }
.ba { background: ${T.amberLight};  color: ${T.amber};  border: 1px solid ${T.amberBorder};  }
.bb { background: ${T.blueLight};   color: ${T.blue};   border: 1px solid ${T.blueBorder};   }
.bp { background: ${T.purpleLight}; color: ${T.purple}; border: 1px solid ${T.purpleBorder}; }
.bk { background: ${T.stripe};      color: ${T.inkMid}; border: 1px solid ${T.border};       }

/* ── ALERTS ── */
.alert { border-radius: 8px; padding: 11px 14px; display: flex; gap: 10px; align-items: flex-start; margin-bottom: 14px; font-size: 12.5px; line-height: 1.55; }
.al-r { background: ${T.redLight};   border: 1px solid ${T.redBorder};   color: ${T.red};   }
.al-a { background: ${T.amberLight}; border: 1px solid ${T.amberBorder}; color: ${T.amber}; }
.al-g { background: ${T.greenLight}; border: 1px solid ${T.greenBorder}; color: ${T.green}; }
.al-b { background: ${T.blueLight};  border: 1px solid ${T.blueBorder};  color: ${T.blue};  }

/* ── FORM ── */
.fg { margin-bottom: 12px; }
.fl { font-size: 10.5px; font-weight: 700; color: ${T.inkMid}; text-transform: uppercase; letter-spacing: .7px; display: block; margin-bottom: 4px; }
.fi { width: 100%; padding: 8px 10px; background: ${T.bg}; border: 1.5px solid ${T.border}; border-radius: 7px; font-family: 'IBM Plex Sans', sans-serif; font-size: 13px; color: ${T.ink}; outline: none; transition: border-color .12s; }
.fi:focus { border-color: ${T.ink}; background: ${T.white}; }
.fi-mono { font-family: 'IBM Plex Mono', monospace; }
.fr2 { display: grid; grid-template-columns: 1fr 1fr; gap: 11px; }
.fr3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.sdiv { font-size: 10px; font-weight: 700; color: ${T.inkLight}; text-transform: uppercase; letter-spacing: 1px; padding: 8px 0 5px; border-top: 1px solid ${T.border}; margin-top: 4px; }

/* ── MODAL ── */
.ov { position: fixed; inset: 0; background: #00000055; z-index: 300; display: flex; align-items: flex-start; justify-content: center; padding: 20px 16px; overflow-y: auto; }
.modal { background: ${T.white}; border: 1px solid ${T.border}; border-radius: 14px; width: 700px; max-width: 100%; box-shadow: 0 24px 64px #00000022; }
.mh { padding: 20px 24px 14px; border-bottom: 1px solid ${T.border}; }
.mt { font-family: 'Lora', serif; font-size: 20px; color: ${T.ink}; }
.ms { font-size: 11.5px; color: ${T.inkLight}; margin-top: 3px; }
.mb { padding: 20px 24px; }
.mf { padding: 14px 24px; border-top: 1px solid ${T.border}; display: flex; justify-content: space-between; align-items: center; background: ${T.stripe}; border-radius: 0 0 14px 14px; }

/* ── TABS ── */
.tabs { display: flex; gap: 2px; background: ${T.stripe}; padding: 4px; border-radius: 9px; margin-bottom: 18px; width: fit-content; border: 1px solid ${T.border}; }
.tab { padding: 7px 18px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 600; color: ${T.inkLight}; transition: all .12s; }
.tab.active { background: ${T.white}; color: ${T.ink}; box-shadow: 0 1px 4px #00000012; }

/* ── MISC ── */
.mono { font-family: 'IBM Plex Mono', monospace; }
.chip { display: inline-flex; align-items: center; gap: 5px; padding: 4px 11px; border-radius: 20px; font-size: 11px; font-weight: 600; }
.chip-red { background: ${T.redLight}; color: ${T.red}; border: 1px solid ${T.redBorder}; }
.chip-grn { background: ${T.greenLight}; color: ${T.green}; border: 1px solid ${T.greenBorder}; }
.chip-amb { background: ${T.amberLight}; color: ${T.amber}; border: 1px solid ${T.amberBorder}; }
.einv-b { background: #e8f0ff; color: #1040b0; border: 1px solid #b0c8f8; font-size: 10px; padding: 2px 7px; border-radius: 4px; font-weight: 700; }
.divider { border: none; border-top: 1px solid ${T.border}; margin: 14px 0; }
`;
