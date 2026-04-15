#!/usr/bin/env python3
"""Generate investor pitch PDF with embedded screenshots."""

import base64
from pathlib import Path
from weasyprint import HTML

SCREENSHOTS_DIR = Path("/workspaces/process-_mining_capability/screenshots")
OUTPUT_PATH = Path("/workspaces/process-_mining_capability/HSBC_FinCrime_Process_Mining_Pitch.pdf")


def img_to_data_uri(path: Path) -> str:
    data = path.read_bytes()
    b64 = base64.b64encode(data).decode()
    return f"data:image/png;base64,{b64}"


overview_img = img_to_data_uri(SCREENSHOTS_DIR / "01-overview.png")
trend_img = img_to_data_uri(SCREENSHOTS_DIR / "02-trend-chart.png")
flow_img = img_to_data_uri(SCREENSHOTS_DIR / "03-process-flow.png")
cases_img = img_to_data_uri(SCREENSHOTS_DIR / "04-cases-table.png")
detail_img = img_to_data_uri(SCREENSHOTS_DIR / "05-case-detail.png")

html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @page {{
    size: A4;
    margin: 0;
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    font-family: 'Helvetica Neue', Arial, sans-serif;
    color: #333;
    line-height: 1.5;
  }}

  /* ── Cover Page ── */
  .cover {{
    width: 100%;
    height: 297mm;
    background: linear-gradient(135deg, #DB0011 0%, #8B0000 60%, #1a1a2e 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: white;
    page-break-after: always;
    position: relative;
    overflow: hidden;
  }}
  .cover::before {{
    content: '';
    position: absolute;
    top: -200px;
    right: -200px;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: rgba(255,255,255,0.03);
  }}
  .cover::after {{
    content: '';
    position: absolute;
    bottom: -300px;
    left: -200px;
    width: 800px;
    height: 800px;
    border-radius: 50%;
    background: rgba(255,255,255,0.02);
  }}
  .cover .diamond {{
    font-size: 64px;
    margin-bottom: 20px;
  }}
  .cover h1 {{
    font-size: 42px;
    font-weight: 700;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }}
  .cover .subtitle {{
    font-size: 20px;
    font-weight: 300;
    opacity: 0.85;
    margin-bottom: 50px;
    letter-spacing: 0.5px;
  }}
  .cover .tagline {{
    font-size: 16px;
    font-weight: 400;
    opacity: 0.7;
    border-top: 1px solid rgba(255,255,255,0.2);
    padding-top: 30px;
    margin-top: 30px;
    max-width: 400px;
  }}
  .cover .date {{
    position: absolute;
    bottom: 40px;
    right: 50px;
    font-size: 13px;
    opacity: 0.5;
  }}

  /* ── Content Pages ── */
  .page {{
    width: 100%;
    min-height: 297mm;
    padding: 50px 55px;
    page-break-after: always;
    position: relative;
  }}
  .page::before {{
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 5px;
    height: 100%;
    background: #DB0011;
  }}

  h2 {{
    font-size: 28px;
    font-weight: 700;
    color: #DB0011;
    margin-bottom: 8px;
    letter-spacing: -0.5px;
  }}
  h3 {{
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-top: 28px;
    margin-bottom: 10px;
  }}
  .page-subtitle {{
    font-size: 14px;
    color: #888;
    margin-bottom: 30px;
    font-weight: 400;
  }}

  p {{
    font-size: 13px;
    line-height: 1.7;
    margin-bottom: 14px;
    color: #444;
  }}

  .screenshot {{
    width: 100%;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
    margin: 18px 0;
  }}
  .screenshot-sm {{
    width: 80%;
    margin: 18px auto;
    display: block;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.12);
  }}

  /* Stats bar */
  .stats-row {{
    display: flex;
    justify-content: space-between;
    margin: 25px 0;
    gap: 14px;
  }}
  .stat-card {{
    flex: 1;
    background: #f8f8f8;
    border-radius: 8px;
    padding: 20px 16px;
    text-align: center;
    border-top: 3px solid #DB0011;
  }}
  .stat-card .num {{
    font-size: 30px;
    font-weight: 700;
    color: #DB0011;
  }}
  .stat-card .label {{
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: #888;
    margin-top: 4px;
  }}

  /* Value table */
  .value-table {{
    width: 100%;
    border-collapse: collapse;
    margin: 18px 0;
    font-size: 12.5px;
  }}
  .value-table th {{
    background: #DB0011;
    color: white;
    padding: 10px 14px;
    text-align: left;
    font-weight: 600;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }}
  .value-table td {{
    padding: 10px 14px;
    border-bottom: 1px solid #eee;
    color: #444;
    vertical-align: top;
  }}
  .value-table tr:nth-child(even) td {{
    background: #fafafa;
  }}

  /* Capability cards */
  .cap-grid {{
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin: 20px 0;
  }}
  .cap-card {{
    width: 47%;
    background: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    padding: 16px;
    border-left: 3px solid #DB0011;
  }}
  .cap-card .cap-title {{
    font-size: 13px;
    font-weight: 700;
    color: #333;
    margin-bottom: 5px;
  }}
  .cap-card .cap-desc {{
    font-size: 11.5px;
    color: #666;
    line-height: 1.6;
  }}

  /* Highlight box */
  .highlight {{
    background: linear-gradient(135deg, #fef5f5, #fff);
    border: 1px solid #f0d0d0;
    border-left: 4px solid #DB0011;
    border-radius: 6px;
    padding: 18px 22px;
    margin: 20px 0;
  }}
  .highlight p {{
    font-size: 15px;
    color: #333;
    font-style: italic;
    margin: 0;
  }}

  /* Green callout */
  .improvement-badge {{
    display: inline-block;
    background: #e8f8f0;
    color: #1a7a42;
    font-size: 15px;
    font-weight: 700;
    padding: 6px 16px;
    border-radius: 20px;
    margin: 5px 0;
  }}

  /* Footer */
  .footer {{
    position: absolute;
    bottom: 30px;
    left: 55px;
    right: 55px;
    font-size: 10px;
    color: #bbb;
    border-top: 1px solid #eee;
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
  }}

  /* Use case list */
  .use-case {{
    margin: 12px 0;
    padding-left: 14px;
    border-left: 2px solid #DB0011;
  }}
  .use-case .uc-title {{
    font-size: 13px;
    font-weight: 700;
    color: #333;
  }}
  .use-case .uc-desc {{
    font-size: 12px;
    color: #666;
  }}
</style>
</head>
<body>

<!-- ════════════════════════ COVER ════════════════════════ -->
<div class="cover">
  <div class="diamond">&#9670;</div>
  <h1>FinCrime Process Mining</h1>
  <div class="subtitle">Financial Crime Investigation Analytics Platform</div>
  <div class="tagline">
    Real-time visibility into investigation workflows.<br>
    Identify bottlenecks. Prove improvement. Drive efficiency.
  </div>
  <div class="date">Confidential &bull; April 2026</div>
</div>

<!-- ════════════════════════ THE PROBLEM ════════════════════════ -->
<div class="page">
  <h2>The Problem</h2>
  <p class="page-subtitle">Financial crime operations teams are flying blind</p>

  <p>Banks invest billions in financial crime investigations — Suspicious Activity Reports,
  Transaction Monitoring, KYC, Fraud, and Sanctions screening. But operations leaders often
  cannot answer the most basic questions about their own processes:</p>

  <table class="value-table">
    <tr>
      <th style="width: 40%;">The Question</th>
      <th>Why It Matters</th>
    </tr>
    <tr>
      <td><strong>Where are our cases right now?</strong></td>
      <td>Without real-time status visibility, managers cannot allocate resources or identify backlogs until it's too late</td>
    </tr>
    <tr>
      <td><strong>Where are the bottlenecks?</strong></td>
      <td>Cases stuck awaiting information or in review queues increase regulatory risk and cost</td>
    </tr>
    <tr>
      <td><strong>Are we getting faster?</strong></td>
      <td>Regulators and senior management expect measurable, demonstrable improvement — not anecdotal evidence</td>
    </tr>
    <tr>
      <td><strong>Can we prove our audit trail?</strong></td>
      <td>Every state change must be traceable with timestamps and user attribution for regulatory examinations</td>
    </tr>
  </table>

  <div class="highlight">
    <p>"We know we've improved, but we can't quantify it. When the regulator asks,
    we're scrambling to pull data from three different systems."</p>
  </div>

  <p>Existing solutions — manual spreadsheets, enterprise BI tools, or custom SQL reports —
  are slow to build, expensive to maintain, and always out of date by the time they reach a decision-maker.</p>

  <div class="footer">
    <span>HSBC FinCrime Process Mining</span>
    <span>2</span>
  </div>
</div>

<!-- ════════════════════════ THE SOLUTION ════════════════════════ -->
<div class="page">
  <h2>The Solution</h2>
  <p class="page-subtitle">A purpose-built analytics dashboard for financial crime investigations</p>

  <p>The <strong>FinCrime Process Mining Platform</strong> gives operations teams complete, real-time
  visibility into how investigation cases flow through the organisation — from creation to closure.</p>

  <img src="{overview_img}" class="screenshot" />

  <p>One screen. Five status categories. Every case. Filterable by case type, country,
  and line of business — so every team sees the data that matters to them.</p>

  <div class="footer">
    <span>HSBC FinCrime Process Mining</span>
    <span>3</span>
  </div>
</div>

<!-- ════════════════════════ TREND ════════════════════════ -->
<div class="page">
  <h2>Prove You're Getting Faster</h2>
  <p class="page-subtitle">Month-over-month trend analysis with automatic improvement calculation</p>

  <p>The platform tracks the average time to process a case from <em>Under Investigation</em> to
  <em>Manager Review</em> — the most critical handoff in the investigation lifecycle — and charts
  the trend over time.</p>

  <img src="{trend_img}" class="screenshot" />

  <div style="text-align: center; margin: 20px 0;">
    <span class="improvement-badge">&#8595; 87% faster</span>
    <p style="font-size: 14px; color: #666; margin-top: 8px;">
      17.1 days &rarr; 2.2 days average investigation time (March &ndash; October 2025)
    </p>
  </div>

  <p>This is the single most powerful data point in any operational improvement story.
  Present it to regulators, to senior management, or at your quarterly business review —
  the improvement speaks for itself.</p>

  <div class="highlight">
    <p>The platform also shows colour-coded duration metrics for every state transition,
    instantly identifying which handoffs are fast (green), acceptable (orange), or too slow (red).</p>
  </div>

  <div class="footer">
    <span>HSBC FinCrime Process Mining</span>
    <span>4</span>
  </div>
</div>

<!-- ════════════════════════ PROCESS FLOW ════════════════════════ -->
<div class="page">
  <h2>Visualise the Investigation Workflow</h2>
  <p class="page-subtitle">Interactive state flow diagram with throughput and dwell time views</p>

  <p>See exactly how cases move through your process — from <em>New</em> through
  <em>Under Investigation</em>, <em>Awaiting Information</em>, <em>Manager Review</em>,
  and finally <em>Closed</em>.</p>

  <img src="{flow_img}" class="screenshot" />

  <p>Toggle between two views:</p>

  <div class="cap-grid">
    <div class="cap-card">
      <div class="cap-title">&#9654; Case Throughput</div>
      <div class="cap-desc">See how many cases flow along each path, with average
      processing time on every edge. Line thickness scales with volume.</div>
    </div>
    <div class="cap-card">
      <div class="cap-title">&#9202; Time in State</div>
      <div class="cap-desc">See weighted average dwell time on each node, highlighting
      where cases spend the most time. Target that stage for improvement.</div>
    </div>
  </div>

  <p>Edge thickness scales with volume, making high-traffic paths and bottlenecks
  immediately visible to any stakeholder — no data literacy required.</p>

  <div class="footer">
    <span>HSBC FinCrime Process Mining</span>
    <span>5</span>
  </div>
</div>

<!-- ════════════════════════ CASE MANAGEMENT ════════════════════════ -->
<div class="page">
  <h2>Full Case Visibility &amp; Audit Trail</h2>
  <p class="page-subtitle">Enterprise-grade data grid with drill-down to every state change</p>

  <p>Browse all investigation cases in a sortable, filterable, searchable data grid.
  Every column supports free-text search and sorting. Export to CSV with one click.</p>

  <img src="{cases_img}" class="screenshot" />

  <p>Click any case to see its complete transition timeline — every status change,
  when it happened, and who made it. Full regulatory traceability.</p>

  <img src="{detail_img}" class="screenshot-sm" />

  <div class="footer">
    <span>HSBC FinCrime Process Mining</span>
    <span>6</span>
  </div>
</div>

<!-- ════════════════════════ KEY CAPABILITIES ════════════════════════ -->
<div class="page">
  <h2>Platform Capabilities</h2>
  <p class="page-subtitle">Everything operations leaders need — nothing they don't</p>

  <div class="cap-grid">
    <div class="cap-card">
      <div class="cap-title">&#128202; Real-Time Status Dashboard</div>
      <div class="cap-desc">Live case counts across 5 workflow stages. Colour-coded cards update
      instantly when filters change.</div>
    </div>
    <div class="cap-card">
      <div class="cap-title">&#128200; Trend Analysis</div>
      <div class="cap-desc">Month-over-month processing time trend with automatic improvement
      percentage calculation.</div>
    </div>
    <div class="cap-card">
      <div class="cap-title">&#9881; Process Flow Diagram</div>
      <div class="cap-desc">Interactive state diagram with case throughput and time-in-state
      views. Bottleneck identification at a glance.</div>
    </div>
    <div class="cap-card">
      <div class="cap-title">&#128269; Full-Text Search &amp; Filtering</div>
      <div class="cap-desc">Every column in every table is sortable, filterable, and searchable.
      Find any case in seconds.</div>
    </div>
    <div class="cap-card">
      <div class="cap-title">&#128196; One-Click CSV Export</div>
      <div class="cap-desc">Export any dataset for offline analysis, regulatory submissions,
      or inclusion in management reports.</div>
    </div>
    <div class="cap-card">
      <div class="cap-title">&#128270; Case Drill-Down</div>
      <div class="cap-desc">Click any case to see the complete audit trail — every state change
      with timestamp and user attribution.</div>
    </div>
    <div class="cap-card">
      <div class="cap-title">&#127758; Global Filters</div>
      <div class="cap-desc">Filter by case type, country, or line of business. Every chart, table,
      and metric updates simultaneously.</div>
    </div>
    <div class="cap-card">
      <div class="cap-title">&#128337; Transition Metrics</div>
      <div class="cap-desc">Colour-coded average durations for every state-to-state handoff.
      Green (&lt;2d), orange (2-7d), red (&gt;7d).</div>
    </div>
  </div>

  <div class="footer">
    <span>HSBC FinCrime Process Mining</span>
    <span>7</span>
  </div>
</div>

<!-- ════════════════════════ IMPACT ════════════════════════ -->
<div class="page">
  <h2>Business Impact</h2>
  <p class="page-subtitle">Measurable outcomes from day one</p>

  <div class="stats-row">
    <div class="stat-card">
      <div class="num">87%</div>
      <div class="label">Faster Investigation<br>Processing</div>
    </div>
    <div class="stat-card">
      <div class="num">120</div>
      <div class="label">Cases Tracked<br>in Real Time</div>
    </div>
    <div class="stat-card">
      <div class="num">5</div>
      <div class="label">Investigation Types<br>Supported</div>
    </div>
    <div class="stat-card">
      <div class="num">7</div>
      <div class="label">Countries<br>Covered</div>
    </div>
  </div>

  <h3>Who Benefits</h3>
  <table class="value-table">
    <tr>
      <th style="width: 35%;">Stakeholder</th>
      <th>Value Delivered</th>
    </tr>
    <tr>
      <td><strong>Head of FinCrime Ops</strong></td>
      <td>End-to-end process visibility, evidence of operational improvement for board and regulators</td>
    </tr>
    <tr>
      <td><strong>Team Leads / Managers</strong></td>
      <td>Workload distribution, country and LOB-specific performance views</td>
    </tr>
    <tr>
      <td><strong>Process Transformation</strong></td>
      <td>Data-driven bottleneck identification, before-and-after measurement</td>
    </tr>
    <tr>
      <td><strong>Internal Audit / Compliance</strong></td>
      <td>Full audit trail, exportable data, regulatory-ready case timelines</td>
    </tr>
    <tr>
      <td><strong>Technology / Architecture</strong></td>
      <td>Lightweight, modern stack that integrates with existing case management systems</td>
    </tr>
  </table>

  <h3>Use Cases</h3>

  <div class="use-case">
    <div class="uc-title">Quarterly Business Review</div>
    <div class="uc-desc">Show the 87% improvement trend chart. Export metrics as CSV. Present concrete evidence of transformation.</div>
  </div>
  <div class="use-case">
    <div class="uc-title">Daily Operations Stand-Up</div>
    <div class="uc-desc">Filter to your country and LOB. Check cases stuck in Awaiting Information. Click into any case to see who last touched it.</div>
  </div>
  <div class="use-case">
    <div class="uc-title">Regulatory Examination</div>
    <div class="uc-desc">Demonstrate full traceability. Show the complete timeline for any case. Export the full case list for the examiner.</div>
  </div>
  <div class="use-case">
    <div class="uc-title">Process Re-Engineering</div>
    <div class="uc-desc">Switch to Time in State view. Identify the slowest stage. Target it for improvement. Measure impact next quarter.</div>
  </div>

  <div class="footer">
    <span>HSBC FinCrime Process Mining</span>
    <span>8</span>
  </div>
</div>

<!-- ════════════════════════ CLOSING ════════════════════════ -->
<div class="page" style="display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center;">
  <div style="max-width: 500px;">
    <div style="font-size: 64px; margin-bottom: 20px;">&#9670;</div>
    <h2 style="font-size: 32px; margin-bottom: 16px;">Ready to Transform FinCrime Operations?</h2>
    <p style="font-size: 16px; color: #666; line-height: 1.8; margin-bottom: 30px;">
      Stop guessing. Start measuring.<br>
      Real-time visibility. Proven improvement. Full traceability.
    </p>
    <div style="background: #DB0011; color: white; display: inline-block; padding: 14px 40px; border-radius: 6px; font-size: 15px; font-weight: 600; letter-spacing: 0.5px;">
      Let's Talk
    </div>
    <p style="font-size: 12px; color: #aaa; margin-top: 40px;">
      HSBC FinCrime Process Mining &bull; Confidential &bull; April 2026
    </p>
  </div>
</div>

</body>
</html>"""

HTML(string=html).write_pdf(str(OUTPUT_PATH))
print(f"PDF generated: {OUTPUT_PATH}")
print(f"Size: {OUTPUT_PATH.stat().st_size / 1024:.0f} KB")
