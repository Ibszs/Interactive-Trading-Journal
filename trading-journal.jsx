import { useState, useEffect, useRef, useCallback } from "react";

// ============================================================
// STYLES
// ============================================================
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=DM+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Inter:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #070a12;
    --surface: #0c1020;
    --card: #111827;
    --card2: #141c2e;
    --border: #1a2540;
    --border2: #232f4a;
    --gold: #c9a84c;
    --gold2: #e2be7a;
    --gold-dim: rgba(201,168,76,0.15);
    --gold-glow: rgba(201,168,76,0.08);
    --text: #dde4f0;
    --text-muted: #5a6a8a;
    --text-soft: #8899bb;
    --green: #10b981;
    --green-dim: rgba(16,185,129,0.12);
    --red: #ef4444;
    --red-dim: rgba(239,68,68,0.12);
    --blue: #3b82f6;
    --blue-dim: rgba(59,130,246,0.12);
    --purple: #a855f7;
    --purple-dim: rgba(168,85,247,0.12);
    --amber: #f59e0b;
    --font-display: 'Cinzel', serif;
    --font-mono: 'DM Mono', monospace;
    --font-body: 'Inter', sans-serif;
    --r: 8px;
    --r2: 12px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); min-height: 100vh; overflow-x: hidden; }

  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: var(--surface); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 2px; }

  .app-layout { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 220px; min-width: 220px; background: var(--surface);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    padding: 0; overflow: hidden;
  }
  .sidebar-logo {
    padding: 22px 20px 18px;
    border-bottom: 1px solid var(--border);
  }
  .sidebar-logo h1 {
    font-family: var(--font-display); font-size: 13px; letter-spacing: 3px;
    color: var(--gold); text-transform: uppercase; line-height: 1.4;
  }
  .sidebar-logo p { font-size: 10px; color: var(--text-muted); font-family: var(--font-mono); margin-top: 3px; letter-spacing: 1px; }
  .sidebar-nav { flex: 1; padding: 12px 10px; overflow-y: auto; }
  .nav-section-label {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 2px;
    color: var(--text-muted); padding: 8px 10px 4px; text-transform: uppercase;
  }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 12px;
    border-radius: var(--r); cursor: pointer; margin-bottom: 2px;
    transition: all 0.15s; color: var(--text-soft); font-size: 13px; font-weight: 500;
    border: 1px solid transparent;
  }
  .nav-item:hover { background: var(--card); color: var(--text); }
  .nav-item.active {
    background: var(--gold-dim); color: var(--gold); border-color: rgba(201,168,76,0.25);
  }
  .nav-item .nav-icon { font-size: 15px; width: 20px; text-align: center; flex-shrink: 0; }
  .sidebar-footer { padding: 12px 16px; border-top: 1px solid var(--border); }
  .sidebar-footer p { font-family: var(--font-mono); font-size: 9px; color: var(--text-muted); letter-spacing: 1px; }

  /* MAIN */
  .main-content { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .page-header {
    padding: 24px 28px 20px; border-bottom: 1px solid var(--border);
    background: var(--surface); position: sticky; top: 0; z-index: 10;
    backdrop-filter: blur(10px);
  }
  .page-header h2 { font-family: var(--font-display); font-size: 16px; letter-spacing: 2px; color: var(--gold); }
  .page-header p { font-size: 12px; color: var(--text-muted); margin-top: 3px; font-family: var(--font-mono); }
  .page-body { padding: 24px 28px; flex: 1; }

  /* CARDS */
  .card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--r2);
    padding: 18px 20px;
  }
  .card-gold { border-color: rgba(201,168,76,0.3); background: linear-gradient(135deg, var(--card) 0%, rgba(201,168,76,0.04) 100%); }
  .card-title { font-family: var(--font-display); font-size: 11px; letter-spacing: 2px; color: var(--gold); margin-bottom: 12px; text-transform: uppercase; }
  .card-subtitle { font-size: 11px; color: var(--text-muted); font-family: var(--font-mono); margin-bottom: 10px; }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 14px; }
  .gap-16 { gap: 16px; }
  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-8 { gap: 8px; }
  .gap-12 { gap: 12px; }

  /* STAT CARD */
  .stat-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--r2);
    padding: 16px 18px;
  }
  .stat-label { font-family: var(--font-mono); font-size: 9px; letter-spacing: 2px; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; }
  .stat-value { font-family: var(--font-mono); font-size: 26px; font-weight: 500; line-height: 1; }
  .stat-sub { font-size: 11px; color: var(--text-muted); margin-top: 4px; font-family: var(--font-mono); }
  .text-green { color: var(--green); }
  .text-red { color: var(--red); }
  .text-gold { color: var(--gold); }
  .text-muted { color: var(--text-muted); }

  /* BADGE */
  .badge {
    display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px;
    font-size: 10px; font-family: var(--font-mono); font-weight: 500; letter-spacing: 0.5px;
  }
  .badge-green { background: var(--green-dim); color: var(--green); border: 1px solid rgba(16,185,129,0.3); }
  .badge-red { background: var(--red-dim); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  .badge-gold { background: var(--gold-dim); color: var(--gold); border: 1px solid rgba(201,168,76,0.3); }
  .badge-blue { background: var(--blue-dim); color: var(--blue); border: 1px solid rgba(59,130,246,0.3); }
  .badge-purple { background: var(--purple-dim); color: var(--purple); border: 1px solid rgba(168,85,247,0.3); }
  .badge-gray { background: rgba(90,106,138,0.15); color: var(--text-muted); border: 1px solid var(--border); }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 9px 16px;
    border-radius: var(--r); font-size: 12px; font-weight: 500; cursor: pointer;
    border: none; transition: all 0.15s; font-family: var(--font-body);
  }
  .btn-gold { background: var(--gold); color: #000; font-weight: 600; }
  .btn-gold:hover { background: var(--gold2); }
  .btn-outline { background: transparent; color: var(--text-soft); border: 1px solid var(--border2); }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
  .btn-ghost { background: transparent; color: var(--text-muted); border: 1px solid transparent; }
  .btn-ghost:hover { background: var(--card2); color: var(--text); }
  .btn-sm { padding: 6px 12px; font-size: 11px; }
  .btn-danger { background: var(--red-dim); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  .btn-danger:hover { background: rgba(239,68,68,0.25); }

  /* FORM */
  .form-group { margin-bottom: 14px; }
  .form-label { display: block; font-size: 11px; font-family: var(--font-mono); color: var(--text-soft); margin-bottom: 5px; letter-spacing: 0.5px; }
  .form-input {
    width: 100%; background: var(--surface); border: 1px solid var(--border2); border-radius: var(--r);
    padding: 9px 12px; color: var(--text); font-family: var(--font-mono); font-size: 12px;
    outline: none; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: var(--gold); }
  .form-select { appearance: none; cursor: pointer; }
  .form-textarea { resize: vertical; min-height: 80px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }

  /* CHECKBOX */
  .check-item {
    display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px;
    border-radius: var(--r); cursor: pointer; transition: background 0.1s;
    border: 1px solid transparent;
  }
  .check-item:hover { background: var(--card2); }
  .check-item.checked { background: var(--gold-glow); border-color: rgba(201,168,76,0.15); }
  .check-box {
    width: 16px; height: 16px; border: 1.5px solid var(--border2); border-radius: 4px;
    flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .check-item.checked .check-box { background: var(--gold); border-color: var(--gold); }
  .check-label { font-size: 12.5px; flex: 1; line-height: 1.5; }
  .check-pts { font-family: var(--font-mono); font-size: 10px; color: var(--gold); flex-shrink: 0; margin-top: 2px; }

  /* SCORE RING */
  .score-display {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 20px;
  }
  .score-number { font-family: var(--font-display); font-size: 48px; line-height: 1; }
  .score-grade { font-family: var(--font-mono); font-size: 13px; letter-spacing: 2px; margin-top: 6px; }
  .score-label { font-size: 11px; color: var(--text-muted); margin-top: 4px; font-family: var(--font-mono); }

  /* TRADE ROW */
  .trade-row {
    display: grid; grid-template-columns: 90px 70px 70px 80px 80px 1fr 80px;
    gap: 12px; align-items: center; padding: 12px 16px;
    border-bottom: 1px solid var(--border); font-size: 12px; font-family: var(--font-mono);
    transition: background 0.1s;
  }
  .trade-row:hover { background: var(--card2); }
  .trade-row.header { color: var(--text-muted); font-size: 10px; letter-spacing: 1px; padding: 8px 16px; background: var(--surface); }

  /* CONCEPT CARDS */
  .concept-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 14px; }
  .concept-card {
    background: var(--card); border: 1px solid var(--border); border-radius: var(--r2);
    padding: 16px 18px; cursor: pointer; transition: all 0.2s;
  }
  .concept-card:hover { border-color: var(--gold); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
  .concept-icon { font-size: 22px; margin-bottom: 8px; }
  .concept-name { font-family: var(--font-display); font-size: 12px; letter-spacing: 1px; color: var(--text); margin-bottom: 4px; }
  .concept-cat { font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); margin-bottom: 8px; }
  .concept-summary { font-size: 12px; color: var(--text-soft); line-height: 1.5; }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 100;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--card); border: 1px solid var(--border2); border-radius: 16px;
    max-width: 680px; width: 100%; max-height: 85vh; overflow-y: auto;
    padding: 28px; box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  }
  .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
  .modal-title { font-family: var(--font-display); font-size: 16px; color: var(--gold); letter-spacing: 1px; }
  .modal-close { background: none; border: none; color: var(--text-muted); cursor: pointer; font-size: 20px; padding: 2px; }
  .modal-close:hover { color: var(--text); }
  .concept-detail { font-size: 13px; line-height: 1.8; color: var(--text-soft); white-space: pre-wrap; }
  .concept-tips { margin-top: 16px; }
  .concept-tip { display: flex; gap: 8px; padding: 8px 12px; background: var(--gold-glow); border-left: 2px solid var(--gold); border-radius: 0 var(--r) var(--r) 0; margin-bottom: 6px; font-size: 12px; }

  /* CHAT */
  .chat-container { display: flex; flex-direction: column; height: calc(100vh - 200px); }
  .chat-messages { flex: 1; overflow-y: auto; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .chat-msg { max-width: 85%; }
  .chat-msg.user { align-self: flex-end; }
  .chat-msg.ai { align-self: flex-start; }
  .chat-bubble {
    padding: 12px 16px; border-radius: 12px; font-size: 13px; line-height: 1.6;
  }
  .chat-msg.user .chat-bubble { background: var(--gold-dim); border: 1px solid rgba(201,168,76,0.3); color: var(--text); border-radius: 12px 12px 2px 12px; }
  .chat-msg.ai .chat-bubble { background: var(--card2); border: 1px solid var(--border2); color: var(--text); border-radius: 12px 12px 12px 2px; font-family: var(--font-body); }
  .chat-input-area { padding: 16px; border-top: 1px solid var(--border); display: flex; gap: 10px; }
  .chat-input {
    flex: 1; background: var(--surface); border: 1px solid var(--border2); border-radius: var(--r);
    padding: 10px 14px; color: var(--text); font-size: 13px; font-family: var(--font-body); outline: none;
  }
  .chat-input:focus { border-color: var(--gold); }
  .typing-dot { display: inline-block; width: 6px; height: 6px; border-radius: 50%; background: var(--gold); animation: blink 1s infinite; margin: 0 2px; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,100%{opacity:0.2} 50%{opacity:1} }

  /* PSYCHOLOGY */
  .psych-tip {
    padding: 14px 16px; border-radius: var(--r2); border-left: 3px solid;
    margin-bottom: 10px; font-size: 13px; line-height: 1.6;
  }
  .psych-gold { border-color: var(--gold); background: var(--gold-glow); }
  .psych-blue { border-color: var(--blue); background: var(--blue-dim); }
  .psych-green { border-color: var(--green); background: var(--green-dim); }
  .psych-red { border-color: var(--red); background: var(--red-dim); }
  .psych-purple { border-color: var(--purple); background: var(--purple-dim); }

  /* PROGRESS */
  .progress-bar-bg { background: var(--border); border-radius: 4px; height: 6px; }
  .progress-bar-fill { height: 6px; border-radius: 4px; transition: width 0.5s; }

  /* RULE LINE */
  .rule { border: none; border-top: 1px solid var(--border); margin: 16px 0; }

  /* TAG */
  .tag { display: inline-flex; align-items: center; padding: 2px 7px; border-radius: 4px; font-size: 10px; font-family: var(--font-mono); background: var(--card2); color: var(--text-soft); border: 1px solid var(--border); margin: 2px; }

  /* SECTION TITLE */
  .section-title { font-family: var(--font-display); font-size: 12px; letter-spacing: 2px; color: var(--gold); text-transform: uppercase; margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }

  /* EMPTY STATE */
  .empty-state { text-align: center; padding: 40px 20px; color: var(--text-muted); }
  .empty-state .empty-icon { font-size: 36px; margin-bottom: 10px; }
  .empty-state p { font-size: 13px; }

  /* CONFLUENCE GRID */
  .confluence-section { margin-bottom: 16px; }
  .confluence-section-title { font-size: 10px; font-family: var(--font-mono); color: var(--text-muted); letter-spacing: 2px; text-transform: uppercase; margin-bottom: 8px; padding: 4px 0; border-bottom: 1px solid var(--border); }
  .confluence-pills { display: flex; flex-wrap: wrap; gap: 6px; }
  .confluence-pill {
    padding: 4px 10px; border-radius: 20px; font-size: 11px; font-family: var(--font-mono);
    cursor: pointer; transition: all 0.15s; border: 1px solid var(--border2); background: var(--surface); color: var(--text-soft);
    user-select: none;
  }
  .confluence-pill.selected { background: var(--gold-dim); color: var(--gold); border-color: rgba(201,168,76,0.4); }
  .confluence-pill:hover:not(.selected) { border-color: var(--text-muted); color: var(--text); }

  /* ANIMATIONS */
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
  .fade-in { animation: fadeIn 0.25s ease; }

  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }

  .mt-4 { margin-top: 4px; } .mt-8 { margin-top: 8px; } .mt-12 { margin-top: 12px; }
  .mt-16 { margin-top: 16px; } .mt-20 { margin-top: 20px; } .mt-24 { margin-top: 24px; }
  .mb-4 { margin-bottom: 4px; } .mb-8 { margin-bottom: 8px; } .mb-12 { margin-bottom: 12px; }
  .mb-16 { margin-bottom: 16px; }
  .text-sm { font-size: 12px; } .text-xs { font-size: 11px; }
  .font-mono { font-family: var(--font-mono); }
  .w-full { width: 100%; }
  .flex-1 { flex: 1; }
  .overflow-hidden { overflow: hidden; }
  .relative { position: relative; }
  .text-center { text-align: center; }

  .tabs { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 1px solid var(--border); }
  .tab-btn { padding: 8px 16px; font-size: 12px; font-family: var(--font-mono); color: var(--text-muted); cursor: pointer; border: none; background: none; border-bottom: 2px solid transparent; margin-bottom: -1px; transition: all 0.15s; letter-spacing: 0.5px; }
  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--gold); border-bottom-color: var(--gold); }
`;

// ============================================================
// DATA
// ============================================================

const CONCEPTS = [
  // PD ARRAYS
  {
    id: 'ob', name: 'Order Block', abbr: 'OB', category: 'PD Arrays', icon: '📦', difficulty: 'Intermediate',
    summary: 'Last opposing candle before a significant displacement move.',
    detail: `An Order Block (OB) is the last up-close candle before a bearish displacement (Bearish OB), or the last down-close candle before a bullish displacement (Bullish OB).

It represents a price level where institutional orders were placed in significant size. When price returns to an OB, those unfilled orders are still resting there, causing a reaction.

HOW TO IDENTIFY:
• Find a strong displacement move (impulsive, fast price delivery)
• Look left for the last opposing candle before that move began
• That candle = your Order Block
• The zone = the full body of that candle (open to close)

BULLISH OB: Last red (bearish close) candle before a strong move UP
BEARISH OB: Last green (bullish close) candle before a strong move DOWN

REFINEMENT — Consequent Encroachment (CE):
The 50% level of the OB candle's full range (high to low). Often acts as the most precise entry within the OB zone.

HIGH PROBABILITY FACTORS:
• OB forms at a key HTF level (weekly/daily structure)
• Displacement away from OB is clean and fast
• OB sits in discount (bullish) or premium (bearish)
• Combines with a FVG above/below (creates a BPR)
• Liquidity was swept before price entered OB

INVALIDATION:
If price trades through and closes beyond the full range of the OB candle, the block is violated. Do not trade it.`,
    tips: ['Mark OBs on Daily and 4H first — HTF OBs carry most weight', 'The stronger the displacement away, the stronger the OB', 'OB + FVG overlap = Balanced Price Range (BPR) — highest probability zone']
  },
  {
    id: 'fvg', name: 'Fair Value Gap', abbr: 'FVG', category: 'PD Arrays', icon: '⚡', difficulty: 'Beginner',
    summary: 'A 3-candle imbalance where price moved too fast, leaving inefficiency.',
    detail: `A Fair Value Gap (FVG) is a 3-candle pattern where the middle candle moves so fast that it creates a gap between candle 1's wick and candle 3's wick. This gap represents an inefficiency in price delivery — price didn't offer fair two-sided business there.

BULLISH FVG:
• Candle 1 high is BELOW candle 3 low
• Gap between C1 high and C3 low = the FVG zone
• Price is expected to return and fill this zone

BEARISH FVG:
• Candle 1 low is ABOVE candle 3 high
• Gap between C1 low and C3 high = the FVG zone
• Price seeks to fill the inefficiency from above

HOW TO USE:
1. Identify the FVG on your marking TF (1H, 4H, Daily)
2. Wait for price to pull back into the zone
3. Look for a reaction (CISD or entry candle) at the CE (50%) or lower edge
4. Enter in the direction of the higher timeframe bias

CONSEQUENT ENCROACHMENT (CE):
The midpoint (50%) of the FVG. Price often reaches to CE before reacting. Can be used for refined entry or stop placement.

MITIGATION:
When price returns to the FVG, it "mitigates" the inefficiency. Once fully filled (price trades through entire zone), the FVG is mitigated and less reliable.

STRONG vs WEAK FVG:
• Strong: larger gap, formed during clear displacement, sits at HTF level
• Weak: small gap, forms during consolidation, no clear direction`,
    tips: ['FVGs at HTF discount/premium levels are most reliable', 'Combine with OB for BPR — the strongest ICT entry zone', 'CE (50%) of FVG is a common entry refinement point']
  },
  {
    id: 'ifvg', name: 'Inverse Fair Value Gap', abbr: 'IFVG', category: 'PD Arrays', icon: '🔄', difficulty: 'Advanced',
    summary: 'A filled FVG that flips and acts as the opposite support/resistance.',
    detail: `An Inverse Fair Value Gap (IFVG) is one of the most powerful ICT concepts. It occurs when price fills (trades through) an FVG — the former bullish FVG becomes a bearish IFVG, and vice versa. This is your primary entry trigger if you're using the IFVG model.

FORMATION:
1. A Bullish FVG forms (C1 high to C3 low gap)
2. Price retraces into and fills/violates the FVG
3. The formerly bullish FVG is now a BEARISH IFVG — resistance zone
4. Price rallies back to test this level from below → reaction expected

BEARISH IFVG → BULLISH IFVG:
1. A Bearish FVG forms
2. Price pushes up through the FVG (fills it from below)
3. That filled FVG = Bullish IFVG → now acts as support

WHY IT WORKS:
When institutional orders that created the original FVG get filled, the opposing side now has their orders resting at that level. The filled zone acts as a magnet for re-entries by smart money.

USING IFVG FOR ENTRIES:
• Identify your daily bias and DOL
• Mark relevant FVGs in the direction of your bias
• When price fills a counter-trend FVG, the filled zone becomes your IFVG entry level
• On a lower TF, look for price to return to the IFVG zone
• Trigger: CISD or RB confirmation within the IFVG zone
• Stop: beyond the far edge of the IFVG
• Target: your draw on liquidity (DOL)

KEY RULE:
The IFVG must be formed at a logical location (premium for bearish, discount for bullish) and align with your HTF daily bias to be considered high probability.`,
    tips: ['IFVG is your primary entry trigger — treat the zone like an OB on return', 'Always confirm IFVG with HTF bias before entry', 'CISD within IFVG zone = highest confidence entry trigger']
  },
  {
    id: 'rb', name: 'Rejection Block', abbr: 'RB', category: 'PD Arrays', icon: '🚫', difficulty: 'Intermediate',
    summary: 'A confirmed wick that swept liquidity or tapped a key level, signaling institutional rejection.',
    detail: `A Rejection Block (RB) is a candle with a significant wick that swept liquidity or tapped a key PD array, followed by a confirmation candle closing in the opposite direction. The WICK ITSELF is the rejection block zone.

FORMATION:
1. Price delivers a candle with a notable wick that either:
   — Sweeps resting liquidity (EQH, EQL, swing high/low)
   — Taps a key PD array (OB, FVG, Fib level)
2. The NEXT candle closes in the opposite direction (CONFIRMATION)
   — Bearish RB: next candle closes BEARISH
   — Bullish RB: next candle closes BULLISH
3. Without the confirmation close — it's just a wick, not a valid RB

THE ZONE:
The wick itself is the Rejection Block. When price returns to this wick area, that's the RB zone you're trading from.

HIGHEST PROBABILITY RBs:
• Wick sweeps liquidity AND taps a key level simultaneously
• Forms at a significant HTF level (Daily OB, Weekly FVG, etc.)
• Clean, single-candle wick — not a messy multi-candle sweep
• Strong displacement move followed the RB formation
• Aligns with HTF daily bias

MARKING TIMEFRAMES:
• Daily, 4H, 1H — these are your marking timeframes
• Execution: 15m, 5m, 1m

ENTRY ON RETURN:
When price comes back to the RB zone:
1. Drop to LTF (15m/5m/1m)
2. Look for CISD within the wick area
3. Or look for IFVG forming inside the wick zone
4. Stop: beyond the wick tip
5. Target: your DOL

INVALIDATION:
Full candle body close through the wick area on marking TF = zone invalidated`,
    tips: ['The WICK is the RB zone — not the body', 'Confirmation candle close is mandatory — no close, no RB', 'Highest prob: wick sweeps liquidity AND taps key level simultaneously']
  },
  {
    id: 'breaker', name: 'Breaker Block', abbr: 'BB', category: 'PD Arrays', icon: '💥', difficulty: 'Advanced',
    summary: 'A failed OB that flips and acts as the opposite PD array.',
    detail: `A Breaker Block forms when an Order Block is violated — price trades through it and doesn't react. The former support becomes resistance (bearish breaker) or former resistance becomes support (bullish breaker).

FORMATION:
1. A Bullish OB forms and price initially respects it
2. Price later breaks DOWN through the OB (structure break)
3. The former bullish OB is now a BEARISH BREAKER BLOCK
4. Price rallies back to the breaker zone → sell from there

BEARISH BREAKER → BULLISH BREAKER:
Same logic in reverse — a former bearish OB gets violated to the upside, becomes a bullish breaker.

WHY IT WORKS:
Institutional traders who were long from the original OB are now trapped. When price returns to the level, they exit at breakeven (selling into the rally), creating more downward pressure.

IDENTIFYING BREAKER:
• Swing point must be taken out for the breaker to form
• The OB that caused the swing must be identifiable
• Price must close beyond the swing (not just wick through)

USE:
Same as any PD array — mark the zone, wait for return, look for CISD or IFVG entry trigger inside the zone on LTF.`,
    tips: ['Breakers form when a swing point is taken and the OB that created it gets broken', 'Combine breaker with sweep of liquidity for highest probability', 'Breakers work exceptionally well at key structure levels on Daily/4H']
  },
  {
    id: 'bpr', name: 'Balanced Price Range', abbr: 'BPR', category: 'PD Arrays', icon: '⚖️', difficulty: 'Advanced',
    summary: 'Overlapping bullish and bearish FVGs — the most respected zone in ICT.',
    detail: `A Balanced Price Range (BPR) is formed when a Bullish FVG and a Bearish FVG overlap each other. The overlapping zone represents a location where BOTH bullish and bearish institutional inefficiencies exist — making it one of the highest probability PD arrays in ICT.

FORMATION:
• Price creates a Bullish FVG during a move up
• Then creates a Bearish FVG that overlaps into the Bullish FVG
• The OVERLAP zone = the BPR

WHY IT'S POWERFUL:
Both inefficiencies (unfilled bullish and bearish orders) sit at the same zone. When price returns, it faces double the institutional interest. Reactions from BPRs are often sharp and powerful.

ENTRY:
• Use the BPR zone as your PD array
• Look for CISD or IFVG inside the zone on LTF
• CE of the BPR (midpoint of the overlap) is a refined entry
• Stop: beyond the far edge of the BPR
• Target: DOL

PRIORITY:
BPR > single FVG > OB in terms of zone significance when all other factors are equal. When you see a BPR, treat it with high respect.`,
    tips: ['BPR is often the highest probability PD array when correctly identified', 'The midpoint (CE) of the BPR overlap is the optimal entry area', 'Always check if your OB zone also contains a FVG — that creates a BPR']
  },
  {
    id: 'vi', name: 'Volume Imbalance', abbr: 'VI', category: 'PD Arrays', icon: '📊', difficulty: 'Beginner',
    summary: 'A gap between consecutive candle bodies (open to close) with no wick overlap.',
    detail: `A Volume Imbalance (VI) occurs when two consecutive candles have a gap between their bodies — the close of one candle and the open of the next don't overlap. Unlike an FVG (which is a 3-candle pattern), a VI is a 2-candle pattern.

IDENTIFICATION:
Bullish VI: Candle 1 close is BELOW candle 2 open (bullish gap up)
Bearish VI: Candle 1 close is ABOVE candle 2 open (bearish gap down)

SIGNIFICANCE:
Less significant than an FVG because wicks may have partially covered the gap. However, when VIs form at key levels or during strong displacement, they act as areas price returns to fill.

USE:
• Secondary PD array — use when no FVG or OB is present
• Combine with other confluences for higher probability
• CE (midpoint) of the VI is the target fill level
• Acts as minor support/resistance until filled

NDOG/NWOG (New Day/Week Opening Gap):
A special type of VI — the gap between the previous day's close and the new day's open. These are significant because they represent institutional positioning changes. Price frequently fills NDOGs during the trading session.`,
    tips: ['VIs are secondary to FVGs and OBs — treat them as supporting confluences', 'NDOG is the most important VI to track — mark it daily at open', 'Filled VIs lose their significance — remove from chart once price trades through']
  },
  {
    id: 'mitigation', name: 'Mitigation Block', abbr: 'MB', category: 'PD Arrays', icon: '🛡️', difficulty: 'Advanced',
    summary: 'Last opposing candle before a liquidity sweep that fails to fully deliver.',
    detail: `A Mitigation Block is similar to an Order Block but forms specifically in the context of a failed move. It's the last opposing candle before price runs into an area of liquidity but fails to deliver fully in that direction, then reverses.

FORMATION:
1. Price moves up (bullish)
2. Makes a lower high (fails to reach target liquidity)
3. The last bullish candle before the reversal lower = Mitigation Block
4. When price rallies back to this zone, mitigation occurs

WHY IT WORKS:
Institutional traders who were long from the mitigation area get a second chance to exit at breakeven or small profit when price returns. This creates sell pressure from the zone.

KEY DIFFERENCE FROM OB:
• OB: Last opposing candle before a CLEAN displacement
• Mitigation Block: Last opposing candle before a FAILED RUN that then reverses
• Both serve as PD arrays on return, but context matters

PRACTICAL USE:
Mark mitigation blocks at swing failure points. When price returns to the zone, look for your standard entry triggers (CISD, IFVG) on LTF.`,
    tips: ['Use mitigation blocks at swing failure points where price clearly rejected a level', 'Often found just below equal highs or above equal lows that price couldn\'t sweep cleanly', 'Combine with HTF daily bias for highest probability setups']
  },

  // LIQUIDITY
  {
    id: 'bsl', name: 'Buy Side Liquidity', abbr: 'BSL', category: 'Liquidity', icon: '📈', difficulty: 'Beginner',
    summary: 'Resting stop-loss orders above swing highs and equal highs.',
    detail: `Buy Side Liquidity (BSL) refers to clusters of resting orders sitting ABOVE price — specifically above equal highs, swing highs, trendline highs, and psychological levels.

WHO CREATES IT:
• Retail traders SHORT (their stop losses are above the highs)
• Retail traders waiting to buy breakouts (buy stop orders)
• Both types of orders rest at the same levels above price

WHY SMART MONEY TARGETS IT:
Institutional traders need to fill large orders. To sell short in size, they need buyers. By sweeping BSL (pushing price above the highs), they trigger buy orders/stop losses — this gives them the volume to fill their short positions at premium prices.

TYPES OF BSL:
• Equal Highs (EQH): Two or more swing highs at the same level — very clean, obvious BSL
• Swing Highs: Single clear pivot highs where stops rest
• Trendline Liquidity: Stops above an ascending trendline
• Round Numbers: Psychological levels (e.g., 4000, 1.2000) attract orders

TRADING BSL:
• If daily bias is bearish, a sweep of BSL = potential short entry (price went up to grab stops, now reverses)
• After BSL is swept, look for PD array + CISD on LTF for short entry
• BSL sweep + bearish RB confirmation = high quality setup
• The amount of BSL that gets swept matters — bigger sweeps create bigger moves`,
    tips: ['Mark all visible EQH on your chart — these are your primary BSL targets', 'BSL sweep + reversal candle + bearish bias = strong short setup', 'Price always delivers toward liquidity — knowing where it is tells you where price is going']
  },
  {
    id: 'ssl', name: 'Sell Side Liquidity', abbr: 'SSL', category: 'Liquidity', icon: '📉', difficulty: 'Beginner',
    summary: 'Resting stop-loss orders below swing lows and equal lows.',
    detail: `Sell Side Liquidity (SSL) refers to resting orders sitting BELOW price — below equal lows, swing lows, trendline lows, and psychological levels.

WHO CREATES IT:
• Retail traders LONG (their stop losses are below the lows)
• Retail traders waiting to sell breakdowns (sell stop orders)

WHY SMART MONEY TARGETS IT:
To buy in large size, institutions need sellers. By sweeping SSL (pushing price below lows), they trigger sell orders/stop losses — giving them the volume to fill large long positions at discount prices.

TYPES OF SSL:
• Equal Lows (EQL): Two or more swing lows at the same level — clear SSL
• Swing Lows: Single pivot lows where stops rest
• Trendline Liquidity: Stops below a descending trendline
• Previous Day/Week Lows: Major reference levels with stop clusters

TRADING SSL:
• If daily bias is bullish, a sweep of SSL = potential long entry
• After SSL is swept, look for PD array + CISD on LTF for long entry
• SSL sweep + bullish RB confirmation = high quality long setup

EXTERNAL vs INTERNAL SSL:
• External: Beyond the current range (previous swing lows outside dealing range)
• Internal: Within the current range (recent minor lows, relative equal lows)
Price often sweeps internal SSL first before running to external targets.`,
    tips: ['Mark EQL on all timeframes you trade — they\'re your primary SSL pools', 'SSL sweep in discount + bullish daily bias = highest probability long area', 'The more obvious the equal lows to retail, the more likely they get swept by institutions']
  },
  {
    id: 'eqh_eql', name: 'Equal Highs / Equal Lows', abbr: 'EQH/EQL', category: 'Liquidity', icon: '⟺', difficulty: 'Beginner',
    summary: 'Two or more swing points at the same level — the clearest liquidity pools.',
    detail: `Equal Highs (EQH) and Equal Lows (EQL) are the clearest and most reliable liquidity pools in ICT trading. When two or more swing highs or lows form at approximately the same price level, a significant cluster of stops accumulates above (EQH) or below (EQL).

WHY THEY'RE POWERFUL:
Every retail trader marks these. Every indicator-based system marks them. This means an enormous amount of stop orders pile up right at these levels — making them irresistible targets for institutional order flow.

EQH (Equal Highs):
• Two+ swing highs at same level
• BSL rests just above
• Bearish bias: EQH sweep = potential short entry after confirmation
• Price often runs just above the equal highs (fake breakout) before reversing

EQL (Equal Lows):
• Two+ swing lows at same level  
• SSL rests just below
• Bullish bias: EQL sweep = potential long entry after confirmation
• Price often briefly trades below the equal lows before reversing

TRIPLE EQH/EQL:
Three or more equal highs/lows = even stronger liquidity pool. The sweep of these is often followed by a significant move in the opposite direction.

HOW TO MARK:
Don't need to be exact to the pip. A cluster within a tight range (few pips on forex, few ticks on indices) counts as equal. The more touches, the stronger the pool.`,
    tips: ['Triple EQH/EQL sweeps often produce the strongest reversals', 'Mark EQH/EQL on multiple timeframes — they stack as confluences', 'The fake breakout above EQH or below EQL is the "Turtle Soup" pattern']
  },
  {
    id: 'inducement', name: 'Inducement', abbr: 'IDM', category: 'Liquidity', icon: '🪤', difficulty: 'Intermediate',
    summary: 'A minor liquidity pool used to trap retail traders before the real move.',
    detail: `Inducement (IDM) is a minor liquidity pool that smart money creates or targets to lure retail traders into the wrong position before the real move begins. It's the setup before the setup.

HOW IT WORKS:
1. Price is in a downtrend
2. A small swing high forms (internal BSL)
3. Price sweeps above this small high (takes retail's short stops)
4. Retail traders see "breakout" and go long
5. Price then reverses and drops significantly (the real move)
6. Those new longs get trapped and become the fuel for the down move

IDENTIFYING IDM:
• Small, obvious internal swing high or low that stands out
• Not a major swing — just enough to attract attention
• Often forms between two larger swing points
• Price often creates inducement before running to the real draw

IDM vs REAL DOL:
• Inducement: minor, internal, used to trap
• Draw on Liquidity (DOL): major external target smart money is actually moving to
• Don't confuse the two — taking inducement as your DOL leads to being on the wrong side

PRACTICAL USE:
When you see price sweep a small internal high/low, ask: "Was that the real target or just inducement?" Check the HTF for the actual draw. If price is still in discount or premium, the inducement sweep likely precedes a bigger move.`,
    tips: ['Inducement sweeps are quick — usually 1-3 candles before reversing', 'After IDM is swept, look for the next significant PD array for entry', 'IDM is often what traps traders who don\'t have a HTF perspective']
  },
  {
    id: 'turtle_soup', name: 'Turtle Soup', abbr: 'TS', category: 'Liquidity', icon: '🐢', difficulty: 'Intermediate',
    summary: 'A false breakout above/below equal highs/lows that reverses sharply.',
    detail: `Turtle Soup is the false breakout pattern in ICT — named after the Turtle Trading strategy it exploits. Price breaks above EQH or below EQL (triggering breakout traders), then immediately reverses and moves hard in the opposite direction.

THE PATTERN:
1. Clear Equal Highs or Equal Lows form on chart
2. Price breaks above EQH (or below EQL) — seems like a breakout
3. But it closes back below EQH (or above EQL) immediately
4. Retail breakout traders are now trapped in a losing position
5. Their stops fuel the real move in the opposite direction

WHAT MAKES IT VALID:
• Must be clean EQH/EQL — not just any high/low
• The false breakout should be brief (1-3 candles max)
• Quick reversal candle after the sweep — not a slow grind back
• Aligns with HTF bias (sweeping highs while bearish, sweeping lows while bullish)

ENTRY:
• After the sweep, wait for CISD on LTF inside a PD array
• Don't chase the reversal — look for the first pullback into a clean zone
• Stop: above the sweep high (or below the sweep low)
• Target: opposite liquidity pool (if swept EQH, target EQL)

IN YOUR MODEL:
Turtle Soup sweeps are excellent precursors to IFVG entries. After the sweep, an IFVG or RB on the LTF within your bias gives you a clean entry in the real direction.`,
    tips: ['The bigger the EQH/EQL and longer it\'s been sitting, the stronger the Turtle Soup potential', 'Turtle Soup + daily bias alignment = one of the cleanest ICT setups', 'Time it with kill zones — London/NY Turtle Soups are most reliable']
  },

  // MARKET STRUCTURE
  {
    id: 'bos', name: 'Break of Structure', abbr: 'BOS', category: 'Market Structure', icon: '⬆️', difficulty: 'Beginner',
    summary: 'Price breaks a prior swing high (bullish) or swing low (bearish) confirming trend continuation.',
    detail: `A Break of Structure (BOS) occurs when price breaks beyond a previous swing high (bullish BOS) or previous swing low (bearish BOS). It confirms that the current trend is continuing.

BULLISH BOS:
Price closes above a previous swing high
→ Bullish trend continuing
→ Look for pullbacks to PD arrays to go long

BEARISH BOS:
Price closes below a previous swing low
→ Bearish trend continuing
→ Look for pullbacks to PD arrays to go short

BOS vs CHoCH:
• BOS = price breaks WITH the trend (continuation)
• CHoCH = price breaks AGAINST the trend (potential reversal)

INTERNAL vs EXTERNAL BOS:
• Internal BOS: Breaks a swing within the current range
• External BOS: Breaks the last major swing high/low (more significant)

USING BOS IN YOUR MODEL:
After a BOS, price often pulls back to the origin of the break (a PD array — the OB, FVG, or IFVG that caused the break). This pullback is where you look for entries aligned with the BOS direction.

The BOS also tells you the draw on liquidity: if bullish BOS, next target is the next major swing high above.`,
    tips: ['BOS must be confirmed by a full candle close — not just a wick', 'External BOS (breaking the last major swing) is more significant than internal', 'After BOS, mark the PD array that caused it — that\'s your pullback entry zone']
  },
  {
    id: 'choch', name: 'Change of Character', abbr: 'CHoCH', category: 'Market Structure', icon: '🔀', difficulty: 'Intermediate',
    summary: 'First structural break against the prevailing trend — signals potential reversal.',
    detail: `A Change of Character (CHoCH) is the first structural break AGAINST the prevailing trend. Unlike a BOS (which confirms continuation), a CHoCH is the first signal that the trend may be reversing.

BULLISH CHoCH:
• Market was in a downtrend (making lower highs and lower lows)
• Price breaks ABOVE a previous lower high
• This is a CHoCH — potential trend shift to bullish

BEARISH CHoCH:
• Market was in an uptrend (making higher highs and higher lows)
• Price breaks BELOW a previous higher low
• This is a CHoCH — potential trend shift to bearish

IMPORTANT:
• A CHoCH alone is not a trade signal — it's an alert
• It tells you to start looking for long setups (bullish CHoCH) or short setups (bearish CHoCH)
• Needs confluence: daily bias, PD array, liquidity sweep

INTERNAL CHoCH:
A CHoCH that happens within the swing (doesn't take the major swing point). Less significant, but signals the beginning of a shift. Often precedes the full MSS.

CHoCH → MSS:
• CHoCH is the first hint of reversal
• MSS (Market Structure Shift) is the confirmation
• After CHoCH, if price continues in new direction and breaks another swing, you have an MSS

IN YOUR TRADING:
CHoCH after a liquidity sweep at a key level = pay attention. This is often where the IFVG or RB entry aligns perfectly.`,
    tips: ['CHoCH is an alert, not an entry — wait for PD array + entry trigger', 'CHoCH after a significant liquidity sweep is most reliable', 'Lower TF CHoCH within a HTF PD array zone = ideal entry timing signal']
  },
  {
    id: 'cisd', name: 'Change in State of Delivery', abbr: 'CISD', category: 'Market Structure', icon: '🔁', difficulty: 'Advanced',
    summary: 'A candle close that shifts price delivery from one direction to the other — primary LTF entry trigger.',
    detail: `A Change in State of Delivery (CISD) is one of the most important concepts for precise entry timing in ICT. It's a candle close on the lower timeframe that signals the shift in which way price is being delivered.

WHAT IT IS:
When price is retracing into your PD array (coming down into a bullish zone), a CISD is when a candle during that retracement closes in the OPPOSITE direction of the retracement — signaling the delivery has shifted.

Bullish CISD Example:
• Price is in a bullish bias
• Price retraces down into a bullish FVG/OB/IFVG
• While in the zone, a candle closes BULLISH (against the downward retracement)
• That bullish close = CISD → entry signal

Bearish CISD Example:
• Price is in a bearish bias
• Price rallies up into a bearish PD array
• While in the zone, a candle closes BEARISH (against the upward rally)
• That bearish close = CISD → entry signal

TIMEFRAMES FOR CISD:
• 1-minute and 5-minute are most common for intraday
• The CISD must occur INSIDE your PD array zone
• Don't take a CISD that happens outside the zone

ENTRY PROTOCOL:
1. Price enters PD array zone (FVG/OB/IFVG/RB)
2. Wait for CISD candle to close
3. Enter on the CLOSE of the CISD candle (or next candle open)
4. Stop: below the CISD candle low (bullish) or above the high (bearish)
5. Or: stop beyond the PD array zone edge

CISD vs CHoCH:
• CHoCH = structural break on higher timeframes
• CISD = delivery shift signal on execution timeframe (1m, 5m)
• They're related but serve different purposes`,
    tips: ['CISD is your primary entry trigger on LTF — don\'t enter without it or an IFVG trigger', 'The candle close matters — a wick alone is not a CISD', 'CISD inside a BPR or OB+FVG overlap = highest conviction entry']
  },
  {
    id: 'smt', name: 'SMT Divergence', abbr: 'SMT', category: 'Market Structure', icon: '↔️', difficulty: 'Advanced',
    summary: 'Two correlated assets making different highs/lows at a key level — signals reversal.',
    detail: `Smart Money Technique (SMT) Divergence is one of the most powerful confluences in ICT. It occurs when two correlated assets (e.g., ES and NQ, GBPUSD and EURUSD) diverge at a significant level — one sweeps liquidity while the other does not confirm.

HOW IT WORKS:
Example (Indices):
• ES (S&P) makes a NEW swing high at a key level
• NQ (Nasdaq) FAILS to make a new swing high at the same time
• This divergence signals that the move up is weak — smart money is not fully participating in both instruments
• Result: bearish reversal often follows

CORRELATED PAIRS:
• Indices: ES/NQ, ES/YM (Dow)
• Forex: GBPUSD/EURUSD, GBPUSD/EURUSD at the same level
• Crypto: BTC/ETH divergence at key levels

BULLISH SMT:
• Asset A makes a NEW lower low
• Asset B FAILS to confirm with a new lower low (holds higher)
• Divergence = bullish reversal signal

BEARISH SMT:
• Asset A makes a NEW higher high
• Asset B FAILS to confirm with a new higher high
• Divergence = bearish reversal signal

USING SMT IN YOUR MODEL:
SMT is a confirmation tool, not a standalone entry. Use it as a confluence when:
• Your daily bias aligns
• A liquidity sweep just happened
• A PD array is present at the level
• SMT confirms = grade UP your setup quality

You already use SMT — this is one of your stated confluences. When SMT lines up with your IFVG model, treat it as a high-conviction A+ setup.`,
    tips: ['SMT at a key liquidity sweep + PD array = very high conviction signal', 'One asset failing to confirm the other\'s swing = divergence. Both need the same market conditions', 'SMT works best at significant HTF levels — not random points']
  },

  // BIAS & TIMING
  {
    id: 'daily_bias', name: 'Daily Bias', abbr: 'DB', category: 'Bias & Timing', icon: '🧭', difficulty: 'Intermediate',
    summary: 'The expected directional delivery for the trading day, established from HTF analysis.',
    detail: `Daily Bias is your most important filter. Every trade you take should align with it. If you're fighting daily bias, you're fighting smart money.

HOW TO DETERMINE DAILY BIAS:

1. CHECK WEEKLY STRUCTURE:
   • Is the weekly chart making HH/HL (bullish) or LH/LL (bearish)?
   • Where is price relative to the weekly PD arrays?
   • Is price in weekly premium (favor shorts) or weekly discount (favor longs)?

2. CHECK DAILY CHART:
   • Where did price close yesterday?
   • What PD arrays are above and below?
   • Was there a liquidity sweep on the daily yesterday?
   • Is today's open in premium or discount of the daily range?

3. REFERENCE LEVELS:
   • Previous week's high and low
   • Previous day's high and low
   • Opening ranges (Asian, London)
   • New Day Opening Gap (NDOG) direction

4. THE BIAS:
   • BULLISH: Price in discount, weekly bullish, key SSL swept, seeking BSL above
   • BEARISH: Price in premium, weekly bearish, key BSL swept, seeking SSL below
   • NO BIAS: Price at equilibrium, consolidation, conflicting signals → NO TRADE

DAILY BIAS INVALIDATION:
If price trades through a key level that invalidates your bias (e.g., takes out the day's significant low when you're bullish), flip your bias or step aside. Don't fight price.

YOUR MODEL NOTE:
You already use daily bias as your first confluence. Stick to this — it's the most important filter and the reason most retail traders lose.`,
    tips: ['No clear daily bias = no trade. Simple as that.', 'Mark PDHL (Previous Day High Low) and PWHL (Previous Week High Low) every session', 'Daily bias established → look for ONE good setup aligned with it. Not 5 trades.']
  },
  {
    id: 'power_of_3', name: 'Power of 3 (AMD)', abbr: 'AMD', category: 'Bias & Timing', icon: '3️⃣', difficulty: 'Intermediate',
    summary: 'Accumulation, Manipulation, Distribution — the three phases of institutional price delivery.',
    detail: `The Power of 3 (AMD) describes how institutional price delivery works in three phases. Understanding AMD helps you avoid getting caught in manipulation (Phase 2) and position yourself for the real move (Phase 3).

PHASE 1 — ACCUMULATION:
• Consolidation period — often the Asian session range
• Smart money building their positions silently
• Price moves sideways with no clear direction
• This range becomes the reference point for the manipulation

PHASE 2 — MANIPULATION:
• Price breaks out of the accumulation range — but in the WRONG direction
• This is the "Judas Swing" — the false move
• Retail traders see the breakout and enter — they get trapped
• A liquidity sweep often occurs (SSL or BSL gets taken)
• This is where Turtle Soup patterns form

PHASE 3 — DISTRIBUTION:
• The real move begins after manipulation
• Price delivers sharply in the actual intended direction
• Smart money distributes their positions (sells what they accumulated, or vice versa)
• This is where you want to be positioned

INTRADAY AMD:
• Asian session = Accumulation
• London open = often Manipulation (sweeps Asian range)
• New York AM = Distribution (real move)

DAILY/WEEKLY AMD:
• Monday-Tuesday = Accumulation/Manipulation
• Wednesday = often reversal or continuation
• Thursday-Friday = Distribution

PRACTICAL USE:
During London open, if you see the Asian low swept hard → wait for bullish CISD/IFVG in PD array → that's your distribution entry for NY session. This is AMD in action.`,
    tips: ['Most losing trades happen in Phase 2 (Manipulation). If you\'re chasing, you\'re in Manipulation.', 'The Judas Swing is your best friend — it tells you the real direction', 'AMD repeats on every timeframe — weekly, daily, and intraday']
  },
  {
    id: 'kill_zones', name: 'Kill Zones', abbr: 'KZ', category: 'Bias & Timing', icon: '⏰', difficulty: 'Beginner',
    summary: 'High-probability trading windows aligned with institutional activity.',
    detail: `Kill Zones are specific time windows during the trading day when institutional activity peaks and ICT setups are most reliable. Trading outside kill zones significantly reduces setup quality.

ASIAN KILL ZONE (7:00 PM – 12:00 AM NY):
• Low volatility consolidation
• Forms the accumulation range (Asia high/low)
• Not typically a trading session — use it to mark Asia range
• These highs/lows become next-day liquidity targets

LONDON KILL ZONE (2:00 AM – 5:00 AM NY):
• London banks come online
• Often sees manipulation (sweeps Asian range lows/highs)
• High volatility, sharp moves
• Excellent RB, FVG, and liquidity sweep setups
• The Judas Swing often occurs here

NEW YORK AM KILL ZONE (7:00 AM – 10:00 AM NY):
• HIGHEST PROBABILITY WINDOW (especially 8:30–10:00 AM)
• New York banks come online
• 8:30 AM: Economic data releases (NFP, CPI, FOMC)
• The real distribution move often begins here
• Your primary trading window

NEW YORK LUNCH (12:00 PM – 1:30 PM NY):
• Low volatility, choppy
• Avoid trading — setups are unreliable
• Use to manage existing positions

NEW YORK PM KILL ZONE (1:30 PM – 4:00 PM NY):
• Secondary trading window
• Sometimes catches continuation of AM move
• Lower probability than AM — be selective

YOUR SCHEDULE:
Since you're in Ontario (EST), these times work out as:
• London: 2-5 AM EST (probably sleeping — good)
• NY AM: 7-10 AM EST (best window)
• NY PM: 1:30-4 PM EST (secondary)`,
    tips: ['NY AM (7-10 AM EST) is your highest probability window. Prioritize it.', 'If a setup doesn\'t form by 10 AM, consider stepping away — don\'t force it', 'Mark Asia high/low every morning — they\'re your first liquidity reference points']
  },
  {
    id: 'ote', name: 'Optimal Trade Entry', abbr: 'OTE', category: 'Bias & Timing', icon: '🎯', difficulty: 'Intermediate',
    summary: 'The 62–79.5% Fibonacci retracement zone — where smart money re-enters.',
    detail: `Optimal Trade Entry (OTE) is the ICT Fibonacci-based entry zone, defined as the 62% to 79.5% retracement of a significant swing. This is where institutional traders re-enter after a displacement, making it a high-probability zone.

KEY FIBONACCI LEVELS:
• 62.0% — OTE begins
• 70.5% — Middle of OTE (often the most precise entry)
• 79.0% — OTE ends (79.5% is the deep OTE level)

HOW TO DRAW OTE:
1. Identify a clear impulse swing (Point A to Point B — strong, clean move)
2. Price retraces from B
3. Draw Fib from A to B (for bullish: A = low, B = high)
4. OTE zone = 62% to 79.5% retracement of that swing

USING OTE:
• OTE is the ZONE — not just a line
• Price entering OTE doesn't mean you blindly enter
• Still need a CISD or IFVG trigger inside the OTE
• OTE + PD array (OB, FVG, IFVG) = high probability confluence
• OTE + liquidity swept + CISD = A+ setup

PREMIUM vs DISCOUNT:
• Above the 50% (equilibrium) of a range = Premium
• Below 50% = Discount
• OTE for longs should ideally be in discount
• OTE for shorts should be in premium

COMBINING WITH YOUR MODEL:
OTE works as a location filter alongside your other confluences. When price pulls back to an OTE zone AND a PD array is present there, AND daily bias aligns → that's an ideal IFVG or RB entry zone.`,
    tips: ['OTE alone is not a trade — it\'s a location. Still need entry trigger.', '79.5% is the deepest OTE level — setups there often have very tight stops', 'Mark OTE on your entry timeframe after a clear impulsive swing forms']
  },
  {
    id: 'premium_discount', name: 'Premium / Discount', abbr: 'P/D', category: 'Bias & Timing', icon: '📐', difficulty: 'Beginner',
    summary: 'Above 50% of range = premium (sell), below 50% = discount (buy).',
    detail: `Premium and Discount are foundational ICT concepts for understanding WHERE in a range you should be looking to buy or sell. It's simple but critically important.

THE 50% LEVEL (EQUILIBRIUM):
• Take any dealing range (swing low to swing high)
• The midpoint (50%) is equilibrium — fair value
• Above 50% = PREMIUM (price is expensive)
• Below 50% = DISCOUNT (price is cheap)

BASIC RULE:
• In PREMIUM → look for SELLS/SHORTS
• In DISCOUNT → look for BUYS/LONGS
• At EQUILIBRIUM → no edge, avoid

WHY THIS MATTERS:
Retail traders buy breakouts (premium) and sell breakdowns (discount). Institutions do the opposite — they buy cheap (discount) and sell expensive (premium). This is why retail almost always gets on the wrong side.

APPLYING TO YOUR MODEL:
• Bullish daily bias → only look for long entries in DISCOUNT of the daily range
• Bearish daily bias → only look for short entries in PREMIUM of the daily range
• PD arrays in discount (bullish bias) = high priority
• PD arrays in premium (bearish bias) = high priority

NESTED PREMIUM/DISCOUNT:
Every range within a range has its own premium/discount. A daily range, 4H range, and 1H range all have their own equilibriums. Use the appropriate TF's P/D for your trading timeframe.`,
    tips: ['Never buy in premium when bearish, never sell in discount when bullish', 'Mark the 50% of your daily range every morning', 'The deepest discount (79.5%) and deepest premium (20.5% from top) are OTE zones']
  },
  {
    id: 'dol', name: 'Draw on Liquidity', abbr: 'DOL', category: 'Bias & Timing', icon: '🎯', difficulty: 'Intermediate',
    summary: 'The nearest significant liquidity pool that price is targeting.',
    detail: `The Draw on Liquidity (DOL) is simply the answer to: "Where is price going next?" It's the nearest significant liquidity pool that institutional price delivery is targeting.

IDENTIFYING YOUR DOL:
Look for the nearest significant liquidity pool in the direction of your daily bias:

BULLISH DOL (price going up):
• Previous day's high (PDH)
• Previous week's high (PWH)
• Equal highs on 1H/4H
• Significant BSL above
• Fair value gap above that needs to be filled
• Swing high that was never tested

BEARISH DOL (price going down):
• Previous day's low (PDL)
• Previous week's low (PWL)
• Equal lows on 1H/4H
• Significant SSL below
• Unfilled bearish FVG below

DOL HIERARCHY (close to far):
1. Same-day liquidity (intraday highs/lows, Asia range)
2. Previous day highs/lows
3. Previous week highs/lows
4. Monthly highs/lows

PRACTICAL USE:
Before any trade, you should be able to clearly answer: "What is my DOL and why?" 
• Entry: PD array + CISD/IFVG trigger
• Stop: below/above your entry zone
• Target: your DOL

IN YOUR CHECKLIST:
DOL is one of your core confluences. If you can't identify a clear DOL, you have no target — don't trade.`,
    tips: ['Always know your DOL before you take ANY trade', 'The cleaner and more obvious the DOL, the higher the probability the market moves to it', 'DOL shifts when price takes out a significant level — update it as the session progresses']
  }
];

const CHECKLIST_SECTIONS = [
  {
    title: 'MACRO BIAS', color: 'var(--gold)',
    items: [
      { id: 'htf_bias', label: 'HTF (Weekly/Daily) directional bias is clearly defined', pts: 10 },
      { id: 'dol_id', label: 'Draw on Liquidity (DOL) is clearly identified and logical', pts: 10 },
      { id: 'pd_location', label: 'Price is in premium (shorts) or discount (longs) — not at equilibrium', pts: 5 },
      { id: 'no_conflicting_bias', label: 'No major conflicting signals on HTF', pts: 5 },
    ]
  },
  {
    title: 'TIMING', color: 'var(--blue)',
    items: [
      { id: 'kill_zone', label: 'Trading within a kill zone (London or NY AM preferred)', pts: 10 },
      { id: 'no_news', label: 'No major high-impact news event within 15 minutes', pts: 5 },
      { id: 'not_lunch', label: 'NOT the NY lunch session (12:00–1:30 PM NY)', pts: 5 },
    ]
  },
  {
    title: 'SETUP QUALITY', color: 'var(--purple)',
    items: [
      { id: 'pd_array', label: 'Clear PD Array at entry zone (OB / FVG / IFVG / RB / BPR)', pts: 10 },
      { id: 'liq_swept', label: 'Liquidity was swept before setup (BSL/SSL taken)', pts: 10 },
      { id: 'entry_trigger', label: 'CISD or IFVG trigger confirmed on LTF (1m/5m)', pts: 10 },
      { id: 'smt', label: 'SMT divergence present on correlated pair', pts: 5 },
    ]
  },
  {
    title: 'RISK MANAGEMENT', color: 'var(--green)',
    items: [
      { id: 'sl_defined', label: 'Stop loss placement is clearly defined and logical', pts: 10 },
      { id: 'risk_size', label: 'Risk is ≤ 1% of account per trade', pts: 5 },
      { id: 'rr_ratio', label: 'Minimum 2:1 risk-to-reward ratio achievable to DOL', pts: 5 },
    ]
  },
  {
    title: 'PSYCHOLOGY CHECK', color: 'var(--amber)',
    items: [
      { id: 'no_revenge', label: 'NOT trading to recover a previous loss (no revenge trading)', pts: 5 },
      { id: 'no_fomo', label: 'NOT entering because price is moving and you\'re feeling FOMO', pts: 5 },
      { id: 'process_driven', label: 'Entry is process-driven — all criteria independently verified', pts: 5 },
    ]
  }
];

const PSYCH_CONTENT = [
  {
    type: 'gold', icon: '⚖️', title: 'Process Over Outcome',
    body: 'A losing trade taken with full confluence and correct execution is a GOOD trade. A winning trade taken impulsively is a BAD trade. Judge your trades by the process, not the P&L. Over enough trades, a good process always wins. This is the foundation of consistency.'
  },
  {
    type: 'red', icon: '🔴', title: 'Recognizing Revenge Trading',
    body: 'Signs you\'re revenge trading: You\'re entering within 5 minutes of a stop-out. The position size is bigger than normal. You\'re not running your checklist. You feel angry or "owed" by the market. The market owes you nothing. Step away for at least 30 minutes after two consecutive losses. The market will always be there tomorrow.'
  },
  {
    type: 'blue', icon: '🧊', title: 'Analysis Paralysis — Your Current Battle',
    body: 'You\'ve overcorrected from revenge trading into not trading at all. Three weeks of no trades isn\'t discipline — it\'s fear wearing the mask of discipline. The antidote: decide your A+ criteria in advance (use this checklist). When the checklist says "take it," you take it — no further deliberation. The decision was already made. Trust your pre-decided criteria.'
  },
  {
    type: 'green', icon: '📓', title: 'The Journal Habit',
    body: 'Log every setup you SAW, not just trades you TOOK. Screenshots of setups you skipped and what happened afterward is more valuable than your live trade log right now. After 3 weeks of no trades, you should have 3 weeks of setup logs. Go back and see what you left on the table. That\'s your real education right now.'
  },
  {
    type: 'purple', icon: '🧠', title: 'Identity-Based Trading',
    body: 'Stop saying "I\'m trying to be a consistent trader." Start saying "I am a consistent trader." Then act accordingly. Every decision in front of the screen is either consistent with that identity or it isn\'t. Revenge trade? That\'s not who you are. Skip a valid setup out of fear? That\'s not who you are either. The journal holds you accountable to your identity.'
  },
  {
    type: 'gold', icon: '📉', title: 'Drawdown Reality',
    body: 'Even the best ICT traders have losing streaks of 5–10 trades. A 30-50% prop challenge drawdown in a bad week is survivable with proper risk management. Losses are the cost of doing business. The goal is not to eliminate losses — it\'s to ensure your wins are bigger than your losses and your process remains sound throughout.'
  },
  {
    type: 'blue', icon: '📅', title: 'One Setup Per Day',
    body: 'Your model (IFVG/RB with full confluences) should only produce 1–3 A+ setups per week. If you\'re finding 10 setups a day, your standards are too low. If you\'re finding zero for weeks, your standards are too high. Recalibrate by going back to your concept definitions and checking your checklist honestly — not to rationalize avoiding the trade.'
  },
  {
    type: 'red', icon: '⚠️', title: 'The "Market Is Different Now" Trap',
    body: 'Trump tariffs, Iran/Israel, FOMC — every era has its "but the market is different now" excuse. ICT concepts work because they\'re based on how liquidity flows and how institutions have to move price to fill orders. That doesn\'t change with the news cycle. Volatility changes the magnitude of moves, not the logic. Your model still works. You\'re the variable.'
  },
  {
    type: 'green', icon: '🏆', title: 'The Funded Trader Mindset',
    body: 'You\'ve been funded multiple times and have two payouts. That means your model works. You are not starting from zero. You are a funded trader going through a normal developmental rough patch. The question isn\'t "can I trade?" — you\'ve already answered that. The question is "can I execute consistently?" That\'s what the checklist and journal are for.'
  }
];

const CONFLUENCE_OPTIONS = {
  'Bias': ['Bullish Daily Bias', 'Bearish Daily Bias', 'Weekly Bullish', 'Weekly Bearish', 'Price in Discount', 'Price in Premium', 'DOL Identified'],
  'Liquidity': ['BSL Swept', 'SSL Swept', 'Equal Highs Swept', 'Equal Lows Swept', 'Turtle Soup', 'Inducement Swept', 'PDH Swept', 'PDL Swept', 'PWH Swept', 'PWL Swept'],
  'PD Arrays': ['Bullish OB', 'Bearish OB', 'Bullish FVG', 'Bearish FVG', 'IFVG', 'Rejection Block', 'Breaker Block', 'BPR', 'Mitigation Block', 'Volume Imbalance', 'NDOG/NWOG'],
  'Entry Trigger': ['CISD (1m)', 'CISD (5m)', 'CISD (15m)', 'IFVG Entry', 'RB Return', 'OTE Zone'],
  'Confirmation': ['SMT Divergence', 'CHoCH on LTF', 'BOS Confirmed', 'MSS Present', 'Multi-TF Alignment'],
  'Timing': ['NY AM Kill Zone', 'London Kill Zone', 'NY PM Kill Zone', 'Pre-News', 'Post-News (15min)'],
  'Risk': ['1:2 R:R', '1:3 R:R', '1:5+ R:R', 'Risk ≤ 0.5%', 'Risk ≤ 1%'],
};

// ============================================================
// STORAGE HELPERS
// ============================================================
async function storageSave(key, data) {
  try { await window.storage.set(key, JSON.stringify(data)); } catch (e) {}
}
async function storageLoad(key, fallback) {
  try {
    const r = await window.storage.get(key);
    return r ? JSON.parse(r.value) : fallback;
  } catch { return fallback; }
}

// ============================================================
// GRADE SYSTEM
// ============================================================
function gradeFromScore(score) {
  if (score >= 85) return { grade: 'A+', label: 'Elite Setup — Take It', color: 'var(--green)' };
  if (score >= 70) return { grade: 'A', label: 'High Quality — Take It', color: 'var(--green)' };
  if (score >= 55) return { grade: 'B', label: 'Moderate — Reduce Size', color: 'var(--amber)' };
  if (score >= 40) return { grade: 'C', label: 'Low Quality — Skip It', color: 'var(--gold)' };
  return { grade: 'F', label: 'No Trade — Walk Away', color: 'var(--red)' };
}

// ============================================================
// COMPONENTS
// ============================================================

function ConceptModal({ concept, onClose }) {
  if (!concept) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div style={{ fontSize: 28, marginBottom: 6 }}>{concept.icon}</div>
            <div className="modal-title">{concept.name}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <span className="badge badge-gold">{concept.abbr}</span>
              <span className="badge badge-gray">{concept.category}</span>
              <span className={`badge ${concept.difficulty === 'Beginner' ? 'badge-green' : concept.difficulty === 'Intermediate' ? 'badge-blue' : 'badge-purple'}`}>{concept.difficulty}</span>
            </div>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="concept-detail">{concept.detail}</div>
        {concept.tips?.length > 0 && (
          <div className="concept-tips">
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: 2, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Pro Tips</div>
            {concept.tips.map((t, i) => (
              <div key={i} className="concept-tip">
                <span style={{ color: 'var(--gold)' }}>→</span>
                <span style={{ color: 'var(--text-soft)' }}>{t}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Dashboard({ trades }) {
  const wins = trades.filter(t => t.outcome === 'win');
  const losses = trades.filter(t => t.outcome === 'loss');
  const be = trades.filter(t => t.outcome === 'breakeven');
  const winRate = trades.length > 0 ? Math.round((wins.length / trades.length) * 100) : 0;
  const grades = { 'A+': 0, A: 0, B: 0, C: 0, F: 0 };
  trades.forEach(t => { if (t.grade && grades[t.grade] !== undefined) grades[t.grade]++; });

  return (
    <div className="fade-in">
      <div className="grid-4 mb-16">
        <div className="stat-card">
          <div className="stat-label">Total Trades</div>
          <div className="stat-value text-gold">{trades.length}</div>
          <div className="stat-sub">Logged sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Win Rate</div>
          <div className={`stat-value ${winRate >= 50 ? 'text-green' : 'text-red'}`}>{winRate}%</div>
          <div className="stat-sub">{wins.length}W / {losses.length}L / {be.length}BE</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">A+ Setups</div>
          <div className="stat-value text-gold">{grades['A+'] + grades['A']}</div>
          <div className="stat-sub">High grade trades taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Low Grade Taken</div>
          <div className="stat-value text-red">{grades['C'] + grades['F']}</div>
          <div className="stat-sub">C/F grade trades — avoid</div>
        </div>
      </div>

      <div className="grid-2">
        <div className="card card-gold">
          <div className="card-title">Setup Grade Distribution</div>
          {Object.entries(grades).map(([g, count]) => {
            const pct = trades.length > 0 ? (count / trades.length) * 100 : 0;
            const colors = { 'A+': 'var(--green)', A: 'var(--green)', B: 'var(--amber)', C: 'var(--gold)', F: 'var(--red)' };
            return (
              <div key={g} style={{ marginBottom: 10 }}>
                <div className="flex justify-between mb-4">
                  <span className="font-mono text-sm" style={{ color: colors[g] }}>Grade {g}</span>
                  <span className="font-mono text-xs text-muted">{count} trades</span>
                </div>
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${pct}%`, background: colors[g] }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="card">
          <div className="card-title">Quick Psychology Check</div>
          {[
            { q: 'Am I trading to recover a loss?', risk: true },
            { q: 'Did I sleep and eat today?', risk: false },
            { q: 'Is my bias clearly defined?', risk: false },
            { q: 'Did I check kill zone timing?', risk: false },
            { q: 'Do I know my DOL?', risk: false },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-8 mb-8" style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: item.risk ? 'var(--red)' : 'var(--green)', flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>{item.q}</span>
            </div>
          ))}
          <div className="mt-12" style={{ padding: '10px 12px', background: 'var(--gold-glow)', borderRadius: 8, fontSize: 12, color: 'var(--text-soft)', borderLeft: '2px solid var(--gold)' }}>
            If you answered YES to the first question — close the charts.
          </div>
        </div>
      </div>

      <div className="card mt-16">
        <div className="card-title">Recent Trades</div>
        {trades.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">📋</div><p>No trades logged yet. Head to the Journal to log your first trade.</p></div>
        ) : (
          <>
            <div className="trade-row header">
              <span>DATE</span><span>PAIR</span><span>DIR</span><span>GRADE</span><span>OUTCOME</span><span>CONFLUENCES</span><span>R:R</span>
            </div>
            {trades.slice().reverse().slice(0, 10).map(t => (
              <div key={t.id} className="trade-row">
                <span className="text-muted">{t.date}</span>
                <span className="text-gold">{t.pair || '—'}</span>
                <span className={t.direction === 'Long' ? 'text-green' : 'text-red'}>{t.direction || '—'}</span>
                <span className={`badge ${t.grade === 'A+' || t.grade === 'A' ? 'badge-green' : t.grade === 'B' ? 'badge-blue' : 'badge-red'}`}>{t.grade || '—'}</span>
                <span className={t.outcome === 'win' ? 'text-green' : t.outcome === 'loss' ? 'text-red' : 'text-muted'}>{t.outcome || '—'}</span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(t.confluences || []).slice(0, 3).join(', ')}{(t.confluences || []).length > 3 ? '…' : ''}</span>
                <span className="text-muted">{t.rr ? `1:${t.rr}` : '—'}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function Journal({ trades, setTrades }) {
  const [tab, setTab] = useState('log');
  const [form, setForm] = useState({ date: new Date().toISOString().split('T')[0], pair: '', direction: 'Long', grade: 'A', outcome: 'win', rr: '', confluences: [], notes: '', session: 'NY AM', model: 'IFVG' });
  const [saved, setSaved] = useState(false);

  const toggleConf = (c) => {
    setForm(f => ({ ...f, confluences: f.confluences.includes(c) ? f.confluences.filter(x => x !== c) : [...f.confluences, c] }));
  };

  const saveTrade = () => {
    const newTrade = { ...form, id: Date.now() };
    const updated = [...trades, newTrade];
    setTrades(updated);
    storageSave('abe_trades', updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setForm(f => ({ ...f, pair: '', confluences: [], notes: '', rr: '' }));
  };

  const deleteTrade = (id) => {
    const updated = trades.filter(t => t.id !== id);
    setTrades(updated);
    storageSave('abe_trades', updated);
  };

  return (
    <div className="fade-in">
      <div className="tabs">
        {['log', 'history'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t === 'log' ? '+ Log Trade' : '📋 Trade History'}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="grid-2" style={{ alignItems: 'start' }}>
          <div>
            <div className="card mb-16">
              <div className="card-title">Trade Details</div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-input" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pair / Instrument</label>
                  <input type="text" className="form-input" placeholder="NQ, ES, EURUSD..." value={form.pair} onChange={e => setForm(f => ({ ...f, pair: e.target.value }))} />
                </div>
              </div>
              <div className="form-row-3">
                <div className="form-group">
                  <label className="form-label">Direction</label>
                  <select className="form-input form-select" value={form.direction} onChange={e => setForm(f => ({ ...f, direction: e.target.value }))}>
                    <option>Long</option><option>Short</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Model Used</label>
                  <select className="form-input form-select" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))}>
                    <option>IFVG</option><option>RB + IFVG</option><option>OB + CISD</option><option>FVG + CISD</option><option>BPR</option><option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Session</label>
                  <select className="form-input form-select" value={form.session} onChange={e => setForm(f => ({ ...f, session: e.target.value }))}>
                    <option>NY AM</option><option>London</option><option>NY PM</option><option>Asian</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Setup Grade</label>
                  <select className="form-input form-select" value={form.grade} onChange={e => setForm(f => ({ ...f, grade: e.target.value }))}>
                    <option>A+</option><option>A</option><option>B</option><option>C</option><option>F</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Outcome</label>
                  <select className="form-input form-select" value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))}>
                    <option value="win">Win</option><option value="loss">Loss</option><option value="breakeven">Breakeven</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">R:R Achieved (e.g. 2 for 1:2)</label>
                <input type="number" className="form-input" placeholder="2" value={form.rr} onChange={e => setForm(f => ({ ...f, rr: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input form-textarea" placeholder="What did you see? What did you do well? What would you change?" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>

            <button className="btn btn-gold w-full" onClick={saveTrade} style={{ justifyContent: 'center', padding: '12px' }}>
              {saved ? '✓ Trade Saved' : 'Save Trade'}
            </button>
          </div>

          <div className="card">
            <div className="card-title">Confluences Present</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 14 }}>Select all that applied to this trade</div>
            {Object.entries(CONFLUENCE_OPTIONS).map(([section, items]) => (
              <div key={section} className="confluence-section">
                <div className="confluence-section-title">{section}</div>
                <div className="confluence-pills">
                  {items.map(item => (
                    <div key={item} className={`confluence-pill ${form.confluences.includes(item) ? 'selected' : ''}`} onClick={() => toggleConf(item)}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="mt-12" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
              {form.confluences.length} confluences selected
            </div>
          </div>
        </div>
      )}

      {tab === 'history' && (
        <div>
          {trades.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📋</div><p>No trades logged yet.</p></div>
          ) : (
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div className="trade-row header">
                <span>DATE</span><span>PAIR</span><span>DIR</span><span>GRADE</span><span>OUTCOME</span><span>CONFLUENCES</span><span>R:R</span>
              </div>
              {trades.slice().reverse().map(t => (
                <div key={t.id}>
                  <div className="trade-row" style={{ cursor: 'default' }}>
                    <span className="text-muted">{t.date}</span>
                    <span className="text-gold">{t.pair || '—'}</span>
                    <span className={t.direction === 'Long' ? 'text-green' : 'text-red'}>{t.direction}</span>
                    <span className={`badge ${t.grade === 'A+' || t.grade === 'A' ? 'badge-green' : t.grade === 'B' ? 'badge-blue' : 'badge-red'}`}>{t.grade}</span>
                    <span className={t.outcome === 'win' ? 'text-green' : t.outcome === 'loss' ? 'text-red' : 'text-muted'}>{t.outcome}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{(t.confluences || []).join(', ') || '—'}</span>
                    <span className="flex items-center gap-8">
                      <span className="text-muted">{t.rr ? `1:${t.rr}` : '—'}</span>
                      <button className="btn btn-ghost btn-sm" style={{ padding: '2px 6px', fontSize: 10 }} onClick={() => deleteTrade(t.id)}>✕</button>
                    </span>
                  </div>
                  {t.notes && (
                    <div style={{ padding: '6px 16px 10px', fontSize: 11, color: 'var(--text-muted)', fontStyle: 'italic', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                      {t.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Checklist() {
  const maxPts = CHECKLIST_SECTIONS.flatMap(s => s.items).reduce((a, i) => a + i.pts, 0);
  const [checked, setChecked] = useState({});
  const [saved, setSaved] = useState(false);

  const toggle = (id) => setChecked(c => ({ ...c, [id]: !c[id] }));
  const score = Object.entries(checked).filter(([_, v]) => v).reduce((acc, [id]) => {
    const item = CHECKLIST_SECTIONS.flatMap(s => s.items).find(i => i.id === id);
    return acc + (item?.pts || 0);
  }, 0);
  const pct = Math.round((score / maxPts) * 100);
  const { grade, label, color } = gradeFromScore(pct);

  const reset = () => setChecked({});

  return (
    <div className="fade-in">
      <div className="grid-2" style={{ alignItems: 'start' }}>
        <div>
          {CHECKLIST_SECTIONS.map(section => (
            <div key={section.title} className="card mb-16">
              <div className="card-title" style={{ color: section.color }}>{section.title}</div>
              {section.items.map(item => (
                <div key={item.id} className={`check-item ${checked[item.id] ? 'checked' : ''}`} onClick={() => toggle(item.id)}>
                  <div className="check-box">
                    {checked[item.id] && <span style={{ color: '#000', fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </div>
                  <div className="check-label" style={{ color: checked[item.id] ? 'var(--text)' : 'var(--text-soft)' }}>{item.label}</div>
                  <div className="check-pts">+{item.pts}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div style={{ position: 'sticky', top: 80 }}>
          <div className="card card-gold mb-16">
            <div className="card-title">Setup Score</div>
            <div className="score-display">
              <div className="score-number" style={{ color }}>{pct}</div>
              <div className="score-grade" style={{ color }}>Grade {grade}</div>
              <div className="score-label">{label}</div>
            </div>
            <div className="progress-bar-bg mb-12">
              <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
              <span>{score} / {maxPts} pts</span>
              <span>{Object.values(checked).filter(Boolean).length} / {CHECKLIST_SECTIONS.flatMap(s => s.items).length} criteria</span>
            </div>
          </div>

          <div className="card mb-16">
            <div className="card-title">Grade Reference</div>
            {[
              { g: 'A+', r: '85-100', l: 'Elite — Take It', c: 'var(--green)' },
              { g: 'A', r: '70-84', l: 'High Quality — Take It', c: 'var(--green)' },
              { g: 'B', r: '55-69', l: 'Moderate — Reduce Size', c: 'var(--amber)' },
              { g: 'C', r: '40-54', l: 'Low Quality — Skip It', c: 'var(--gold)' },
              { g: 'F', r: '0-39', l: 'No Trade', c: 'var(--red)' },
            ].map(row => (
              <div key={row.g} className="flex items-center justify-between mb-8" style={{ padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', color: row.c, fontSize: 13, fontWeight: 600, width: 32 }}>{row.g}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', width: 60 }}>{row.r}%</span>
                <span style={{ fontSize: 12, color: 'var(--text-soft)', flex: 1, textAlign: 'right' }}>{row.l}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-outline w-full" onClick={reset} style={{ justifyContent: 'center' }}>Reset Checklist</button>
        </div>
      </div>
    </div>
  );
}

function Library() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('All');
  const categories = ['All', 'PD Arrays', 'Liquidity', 'Market Structure', 'Bias & Timing'];
  const filtered = filter === 'All' ? CONCEPTS : CONCEPTS.filter(c => c.category === filter);

  return (
    <div className="fade-in">
      <div className="tabs">
        {categories.map(c => (
          <button key={c} className={`tab-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="concept-grid">
        {filtered.map(c => (
          <div key={c.id} className="concept-card" onClick={() => setSelected(c)}>
            <div className="concept-icon">{c.icon}</div>
            <div className="concept-name">{c.name}</div>
            <div className="concept-cat">{c.category} · {c.difficulty}</div>
            <div style={{ marginBottom: 10 }}>
              <span className="badge badge-gold">{c.abbr}</span>
            </div>
            <div className="concept-summary">{c.summary}</div>
          </div>
        ))}
      </div>
      {selected && <ConceptModal concept={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function Education() {
  const [messages, setMessages] = useState([
    {
      role: 'ai',
      content: "Yo, what's up. I'm your ICT trading coach. I know your model inside out — IFVG entries, daily bias, DOL, SMTs, IFVGs, Rejection Blocks, the full ICT framework.\n\nAsk me anything: concept explanations, setup reviews, why a trade worked or didn't, execution questions — whatever you need. What do you want to work on?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const QUICK = ['Explain IFVGs in depth', 'How do I trade Rejection Blocks?', 'What makes an A+ setup?', 'Explain SMT Divergence', 'How do I determine daily bias?', 'What is inducement?'];

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async (text) => {
    if (!text.trim() || loading) return;
    const userMsg = { role: 'user', content: text };
    setMessages(m => [...m, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const history = [...messages, userMsg].slice(-14).map(m => ({
        role: m.role === 'ai' ? 'assistant' : 'user',
        content: m.content
      }));

      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a professional ICT (Inner Circle Trader) trading coach and educator. You are teaching a daytrader named Abe who has been trading for about 1 year using ICT concepts.

Abe's model: IFVG (Inverse Fair Value Gap) model. His confluences: Daily Bias, Draw on Liquidity (DOL), FVGs, SMTs (Smart Money Technique divergence), IFVGs, Rejection Blocks, discretion. He is now adding Rejection Blocks to his PD array toolkit.

He has been funded on multiple prop firms and has two payouts. He recently overcorrected from revenge trading into analysis paralysis (no trades in 3 weeks).

Your role: Teach ICT concepts accurately and in depth. Be direct, knowledgeable, and conversational — not corporate or overly formal. Don't pad responses. Be accurate about ICT concepts. Cover: Order Blocks, FVGs, IFVGs, Rejection Blocks, Breaker Blocks, BPR, Liquidity (BSL/SSL, EQH/EQL, inducement, turtle soup), Market Structure (BOS, CHoCH, MSS, CISD), Bias/Timing (daily bias, AMD/Power of 3, kill zones, OTE, premium/discount), SMT divergence.

Keep responses clear, educational, and appropriately detailed. Use plain text formatting. Don't use markdown headers. Don't be sycophantic.`,
          messages: history
        })
      });

      const data = await res.json();
      const reply = data.content?.find(b => b.type === 'text')?.text || 'Something went wrong. Try again.';
      setMessages(m => [...m, { role: 'ai', content: reply }]);
    } catch (e) {
      setMessages(m => [...m, { role: 'ai', content: 'Connection error. Check your internet and try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 140px)' }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, letterSpacing: 2, textTransform: 'uppercase' }}>Quick Questions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {QUICK.map(q => (
            <button key={q} className="btn btn-outline btn-sm" onClick={() => send(q)}>{q}</button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflow: 'hidden', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)', display: 'flex', flexDirection: 'column' }}>
        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.role === 'ai' && <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', marginBottom: 4, letterSpacing: 1 }}>COACH</div>}
              <div className="chat-bubble" style={{ whiteSpace: 'pre-wrap' }}>{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="chat-msg ai">
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--gold)', marginBottom: 4, letterSpacing: 1 }}>COACH</div>
              <div className="chat-bubble">
                <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-area">
          <input
            className="chat-input"
            placeholder="Ask about any ICT concept, setup, or strategy..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
          />
          <button className="btn btn-gold" onClick={() => send(input)} disabled={loading}>Send</button>
        </div>
      </div>
    </div>
  );
}

function Psychology() {
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storageLoad('abe_psych_notes', '').then(n => { setNotes(n); setLoaded(true); });
  }, []);

  const save = () => {
    storageSave('abe_psych_notes', notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="fade-in">
      <div className="grid-2" style={{ alignItems: 'start', gap: 20 }}>
        <div>
          <div className="section-title">Mental Framework</div>
          {PSYCH_CONTENT.map((p, i) => (
            <div key={i} className={`psych-tip psych-${p.type}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 18 }}>{p.icon}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 12, letterSpacing: 1, color: 'var(--text)' }}>{p.title}</span>
              </div>
              <p style={{ fontSize: 12.5, lineHeight: 1.7, color: 'var(--text-soft)' }}>{p.body}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="section-title">Trader's Journal</div>
          <div className="card mb-16">
            <div className="card-title">Pre-Session Mental Check</div>
            {[
              { q: 'How am I feeling entering today\'s session?', p: 'Calm / Anxious / Confident / Foggy' },
              { q: 'What happened in my last session?', p: 'Good execution / Took losses / Missed setups' },
              { q: 'What is my intention for today?', p: 'Find 1 A+ setup / Watch only / Review concepts' },
              { q: 'What rule am I focusing on today?', p: 'No trades outside kill zone / Wait for CISD...' },
            ].map((item, i) => (
              <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontSize: 12, color: 'var(--text-soft)', marginBottom: 4 }}>{item.q}</div>
                <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{item.p}</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-title">Personal Notes</div>
            <textarea
              className="form-input form-textarea"
              style={{ minHeight: 180, marginBottom: 12 }}
              placeholder="Write anything here — thoughts, realizations, patterns you're noticing in your trading or psychology. This saves automatically."
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
            <button className="btn btn-gold btn-sm" onClick={save}>{saved ? '✓ Saved' : 'Save Notes'}</button>
          </div>

          <div className="card mt-16" style={{ borderColor: 'rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.03)' }}>
            <div className="card-title" style={{ color: 'var(--red)' }}>Stop Trading Immediately If...</div>
            {[
              'You\'ve hit 2 losses in a row today',
              'You\'re entering a trade to "get back" what you lost',
              'You skipped your checklist',
              'You\'re increasing size after a loss',
              'You feel angry, anxious, or desperate',
              'It\'s outside your kill zone and you have no real reason',
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-8 mb-8">
                <span style={{ color: 'var(--red)', fontSize: 12 }}>✕</span>
                <span style={{ fontSize: 12, color: 'var(--text-soft)' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [trades, setTrades] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    storageLoad('abe_trades', []).then(t => { setTrades(t); setLoaded(true); });
  }, []);

  const NAV = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'journal', icon: '📝', label: 'Trade Journal' },
    { id: 'checklist', icon: '✅', label: 'Pre-Trade Check' },
    { id: 'library', icon: '📚', label: 'Concept Library' },
    { id: 'education', icon: '🎓', label: 'AI Coach' },
    { id: 'psychology', icon: '🧠', label: 'Psychology' },
  ];

  const PAGE_HEADERS = {
    dashboard: { title: 'Dashboard', sub: 'Overview of your trading performance and psychology' },
    journal: { title: 'Trade Journal', sub: 'Log every trade with full ICT confluence tracking' },
    checklist: { title: 'Pre-Trade Checklist', sub: 'Grade your setup before pulling the trigger' },
    library: { title: 'Concept Library', sub: 'Complete ICT reference — PD Arrays, Liquidity, Structure, Bias' },
    education: { title: 'AI Coach', sub: 'Ask anything about ICT concepts and your model' },
    psychology: { title: 'Psychology', sub: 'Mental framework for consistent, process-driven trading' },
  };

  const h = PAGE_HEADERS[tab];

  const renderPage = () => {
    if (!loaded) return <div style={{ padding: 40, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 12 }}>Loading...</div>;
    if (tab === 'dashboard') return <Dashboard trades={trades} />;
    if (tab === 'journal') return <Journal trades={trades} setTrades={setTrades} />;
    if (tab === 'checklist') return <Checklist />;
    if (tab === 'library') return <Library />;
    if (tab === 'education') return <Education />;
    if (tab === 'psychology') return <Psychology />;
  };

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-layout">
        <div className="sidebar">
          <div className="sidebar-logo">
            <h1>ICT TRADER</h1>
            <p>JOURNAL & COACH</p>
          </div>
          <div className="sidebar-nav">
            <div className="nav-section-label">Navigation</div>
            {NAV.map(n => (
              <div key={n.id} className={`nav-item ${tab === n.id ? 'active' : ''}`} onClick={() => setTab(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </div>
          <div className="sidebar-footer">
            <p>IFVG MODEL · ICT</p>
            <p style={{ marginTop: 3 }}>v1.0 · {new Date().getFullYear()}</p>
          </div>
        </div>

        <div className="main-content">
          <div className="page-header">
            <h2>{h.title}</h2>
            <p>{h.sub}</p>
          </div>
          <div className="page-body">
            {renderPage()}
          </div>
        </div>
      </div>
    </>
  );
}
