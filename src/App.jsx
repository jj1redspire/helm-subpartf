import { useEffect, useState } from 'react'
import './index.css'

// ── Design tokens ──────────────────────────────────────────
const C = {
  bg:          '#0d1117',
  bgAlt:       '#010409',
  bgCard:      '#161b22',
  border:      '#21262d',
  borderMid:   '#30363d',
  heading:     '#e6edf3',
  body:        '#c9d1d9',
  muted:       '#8b949e',
  faint:       '#656d76',
  navyAccent:  '#4493f8',
  navyBadge:   'rgba(68,147,248,0.12)',
  amber:       '#d29922',
  amberLight:  'rgba(210,153,34,0.08)',
  amberBorder: 'rgba(210,153,34,0.28)',
  amberText:   '#d29922',
  slateBg:     '#161b22',
  cardShadow:  '0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)',
}

// ── Live countdown to July 16, 2027 ────────────────────────
function useCountdown(target) {
  const [days, setDays] = useState(0)
  useEffect(() => {
    function calc() {
      const diff = new Date(target) - new Date()
      setDays(Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24))))
    }
    calc()
    const id = setInterval(calc, 60000)
    return () => clearInterval(id)
  }, [target])
  return days
}

const PLAN_SECTIONS = [
  {
    ref: '§101.630',
    title: 'Cybersecurity Officer (CySO)',
    body: 'Each facility must designate a qualified Cybersecurity Officer responsible for developing, implementing, and maintaining the Cybersecurity Plan.',
  },
  {
    ref: '§101.635',
    title: 'Cybersecurity Assessment',
    body: 'A documented assessment identifying cybersecurity risks across all IT and OT systems, networks, and processes relevant to facility security.',
  },
  {
    ref: '§101.640',
    title: 'Cybersecurity Plan',
    body: 'Written policies and procedures addressing risks identified in the assessment. Must be submitted to the USCG and approved before the July 2027 deadline.',
  },
  {
    ref: '§101.650',
    title: 'Personnel Training',
    body: 'Role-based cybersecurity training for all personnel with cybersecurity responsibilities. Annual refresher required. Training deadline was January 12, 2026.',
  },
  {
    ref: '§101.655',
    title: 'Drills & Exercises',
    body: 'Regular drills testing cyber incident response procedures. Biannual drills and at least one annual exercise involving tabletop or full-scale scenarios.',
  },
  {
    ref: '§101.660',
    title: 'Incident Reporting',
    body: 'Cybersecurity incidents must be reported to the National Response Center (NRC) and the cognizant COTP within established timeframes.',
  },
  {
    ref: '§101.645',
    title: 'Plan Review & Audit',
    body: 'Annual internal review of the Cybersecurity Plan, with a full resubmission to USCG every five years or after a significant change.',
  },
]

const REFERENCES = [
  { title: '33 CFR Part 101, Subpart F', desc: 'The final rule text — mandatory cybersecurity requirements for MTSA facilities' },
  { title: 'NVIC 01-20', desc: 'Guidelines for Addressing Cyber Risks at MTSA Regulated Vessels and Facilities' },
  { title: 'NVIC 02-24', desc: 'Updated cybersecurity guidance for MTSA plan holders' },
  { title: 'CG-5PC Policy Letter 01-25', desc: 'USCG implementation guidance for Subpart F compliance' },
  { title: 'NIST Cybersecurity Framework Maritime Profile', desc: 'Sector-specific application of the NIST CSF for maritime operations' },
  { title: 'MTS Cyber Incident Response Playbook', desc: 'Marine Transportation System Cyber Incident Response Playbook' },
]

// ── Shared style helpers ────────────────────────────────────
const sectionLabel = {
  fontSize: 12, fontWeight: 700, letterSpacing: '0.12em',
  textTransform: 'uppercase', color: C.faint, marginBottom: 14,
}
const h2Style = {
  fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700,
  color: C.heading, margin: '0 0 16px', letterSpacing: '-0.5px', lineHeight: 1.2,
}
const mutedText = { fontSize: 18, color: C.muted, lineHeight: 1.75 }

export default function App() {
  const daysLeft = useCountdown('2027-07-16T00:00:00')

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.body }}>

      {/* ── Nav ──────────────────────────────────────────── */}
      <nav style={{
        borderBottom: `1px solid ${C.border}`,
        padding: '0 32px', height: 56,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        position: 'sticky', top: 0,
        background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(8px)',
        zIndex: 100,
      }}>
        <span style={{ fontWeight: 800, fontSize: 15, letterSpacing: '-0.3px', color: C.heading }}>
          ⚓ HELM <span style={{ color: C.faint, fontWeight: 400, fontSize: 14 }}>/ Subpart F Guide</span>
        </span>
        <a href="https://helmport.com" target="_blank" rel="noopener noreferrer"
          style={{
            fontSize: 13, color: C.muted, textDecoration: 'none',
            border: `1px solid ${C.borderMid}`, padding: '6px 16px', borderRadius: 6,
            fontWeight: 500,
          }}>
          helmport.com →
        </a>
      </nav>

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '80px 32px 72px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <div style={{
            display: 'inline-block', background: C.navyBadge,
            border: `1px solid ${C.borderMid}`, borderRadius: 4,
            padding: '5px 14px', fontSize: 12, color: C.navyAccent,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32,
            fontWeight: 700,
          }}>
            33 CFR Part 101 · Subpart F · Enforceable July 16, 2025
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800,
            lineHeight: 1.15, letterSpacing: '-1px', color: C.heading, margin: '0 0 24px',
          }}>
            USCG Subpart F Cybersecurity Rule:<br />
            <span style={{ color: C.muted, fontWeight: 600 }}>What Every MTSA Facility Needs to Know</span>
          </h1>

          <p style={{ ...mutedText, maxWidth: 660, margin: '0 0 56px' }}>
            The mandatory cybersecurity requirements under 33 CFR Part 101, Subpart F are now
            enforceable. Here's what your facility must do and when.
          </p>

          {/* Deadline callout boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>

            {/* Passed */}
            <div style={{
              background: C.bgCard, border: `1px solid ${C.borderMid}`,
              borderLeft: `4px solid ${C.faint}`, borderRadius: 10, padding: '24px 28px',
              boxShadow: C.cardShadow,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>
                ✓ Deadline Passed
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.heading, marginBottom: 4 }}>
                §101.650 Personnel Training
              </div>
              <div style={{ fontSize: 15, color: C.muted, marginBottom: 12 }}>Due January 12, 2026</div>
              <p style={{ fontSize: 14, color: C.faint, lineHeight: 1.65, margin: 0 }}>
                All personnel with cybersecurity responsibilities must have completed training.
                If you haven't, you are already out of compliance.
              </p>
            </div>

            {/* Upcoming */}
            <div style={{
              background: C.bgCard, border: `1px solid ${C.borderMid}`,
              borderLeft: `4px solid ${C.amber}`, borderRadius: 10, padding: '24px 28px',
              boxShadow: C.cardShadow,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.amber, marginBottom: 10 }}>
                ⚠ Upcoming Deadline
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.heading, marginBottom: 4 }}>
                Cybersecurity Plan Submission
              </div>
              <div style={{ fontSize: 15, color: C.muted, marginBottom: 12 }}>Due July 16, 2027</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{
                  fontSize: 40, fontWeight: 800, color: C.amber,
                  fontVariantNumeric: 'tabular-nums', letterSpacing: '-1.5px', lineHeight: 1,
                }}>{daysLeft}</span>
                <span style={{ fontSize: 15, color: C.muted, fontWeight: 500 }}>days remaining</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. WHAT IS SUBPART F
      ══════════════════════════════════════════ */}
      <section style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={sectionLabel}>Background</div>
          <h2 style={h2Style}>What Is 33 CFR Part 101, Subpart F?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, marginTop: 48 }}>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>The Rule</div>
              <p style={mutedText}>
                On July 16, 2025, the USCG Cybersecurity Final Rule added Subpart F to 33 CFR
                Part 101, requiring all MTSA-regulated facilities to implement mandatory
                cybersecurity measures. This converted previously voluntary NVIC 01-20 guidance
                into enforceable federal regulation.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Who It Applies To</div>
              <p style={mutedText}>
                Approximately 3,200 MTSA-regulated facilities nationwide, including petroleum
                terminals, chemical plants, LNG terminals, cruise terminals, container terminals,
                and all other facilities regulated under 33 CFR Parts 105, 106, 126, 127, and 154.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>What Changed</div>
              <p style={mutedText}>
                Cybersecurity went from voluntary guidance (NVIC 01-20) to mandatory, enforceable
                regulation with USCG inspection authority and civil penalty exposure. Non-compliance
                is a federal violation, not an administrative oversight.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. THE TWO DEADLINES
      ══════════════════════════════════════════ */}
      <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={sectionLabel}>Compliance Timeline</div>
          <h2 style={h2Style}>The Two Deadlines Every FSO Must Know</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 48 }}>

            {/* Deadline 1 — passed */}
            <div style={{
              background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10,
              padding: '32px 36px', display: 'grid', gridTemplateColumns: 'auto 1fr',
              gap: 32, alignItems: 'start', boxShadow: C.cardShadow,
            }}>
              <div style={{ textAlign: 'center', minWidth: 88 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Jan 12</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.faint, lineHeight: 1 }}>2026</div>
                <div style={{
                  marginTop: 10, display: 'inline-block',
                  background: C.bg, border: `1px solid ${C.border}`,
                  borderRadius: 4, padding: '3px 9px',
                  fontSize: 10, color: C.faint, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>Passed</div>
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.heading, margin: '0 0 10px' }}>
                  Personnel Training — §101.650
                </h3>
                <p style={{ ...mutedText, margin: 0 }}>
                  All personnel with cybersecurity responsibilities must have completed initial
                  training. This deadline has already passed. Facilities that have not completed
                  training are currently out of compliance and subject to USCG deficiency findings
                  during inspection. Annual refresher training is required going forward.
                </p>
              </div>
            </div>

            {/* Deadline 2 — upcoming */}
            <div style={{
              background: C.bgCard, border: `1px solid ${C.borderMid}`,
              borderLeft: `4px solid ${C.amber}`, borderRadius: 10,
              padding: '32px 36px', display: 'grid', gridTemplateColumns: 'auto 1fr',
              gap: 32, alignItems: 'start', boxShadow: C.cardShadow,
            }}>
              <div style={{ textAlign: 'center', minWidth: 88 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Jul 16</div>
                <div style={{ fontSize: 32, fontWeight: 800, color: C.amber, lineHeight: 1 }}>2027</div>
                <div style={{
                  marginTop: 10, display: 'inline-block',
                  background: C.amberLight, border: `1px solid ${C.amberBorder}`,
                  borderRadius: 4, padding: '3px 9px',
                  fontSize: 10, color: C.amber, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>{daysLeft}d left</div>
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.heading, margin: '0 0 10px' }}>
                  Cybersecurity Plan Submission — §101.640
                </h3>
                <p style={{ ...mutedText, margin: '0 0 16px' }}>
                  Every MTSA-regulated facility must submit a USCG-approved Facility Cybersecurity
                  Plan. A realistic buildout — completing the assessment, drafting the plan, and
                  clearing the USCG review cycle — takes 12 to 18 months.
                </p>
                <div style={{
                  background: C.amberLight, border: `1px solid ${C.amberBorder}`,
                  borderRadius: 8, padding: '12px 16px',
                  fontSize: 15, color: C.amber, lineHeight: 1.65, fontWeight: 500,
                }}>
                  Facilities that haven't begun their Cybersecurity Assessment are running out of
                  planning runway. The clock started July 2025.
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. WHAT THE PLAN MUST COVER
      ══════════════════════════════════════════ */}
      <section style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={sectionLabel}>Requirements</div>
          <h2 style={h2Style}>What the Cybersecurity Plan Must Cover</h2>
          <p style={{ ...mutedText, margin: '0 0 48px' }}>
            Seven compliance areas required under 33 CFR Part 101, Subpart F.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 12 }}>
            {PLAN_SECTIONS.map((s, i) => (
              <article key={i} style={{
                background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: '24px 26px', boxShadow: C.cardShadow,
              }}>
                <div style={{
                  fontSize: 12, color: C.navyAccent,
                  fontFamily: 'ui-monospace, Consolas, monospace',
                  fontWeight: 700, marginBottom: 10, letterSpacing: '0.04em',
                  background: C.navyBadge, display: 'inline-block',
                  padding: '3px 8px', borderRadius: 4,
                }}>{s.ref}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: C.heading, margin: '10px 0 8px', lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. KEY REGULATORY REFERENCES
      ══════════════════════════════════════════ */}
      <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={sectionLabel}>Resources</div>
          <h2 style={h2Style}>Key Regulatory References</h2>
          <p style={{ ...mutedText, margin: '0 0 48px' }}>Primary sources for Subpart F compliance.</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {REFERENCES.map((r, i) => (
              <div key={i} style={{
                background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8,
                padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: C.borderMid, marginTop: 9, flexShrink: 0,
                }} />
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.heading, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 15, color: C.muted, lineHeight: 1.65 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. WHO WE ARE
      ══════════════════════════════════════════ */}
      <section style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.heading, marginBottom: 16 }}>⚓ HELM</div>
          <p style={{ ...mutedText, margin: '0 0 32px' }}>
            HELM helps Facility Security Officers at MTSA-regulated facilities manage both
            physical security and cybersecurity compliance in one platform — from FSP tracking
            to Subpart F plan development.
          </p>
          <a href="https://helmport.com" target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-block', background: C.bgCard,
              border: `1px solid ${C.borderMid}`, color: C.heading,
              textDecoration: 'none', padding: '12px 28px', borderRadius: 8,
              fontSize: 15, fontWeight: 600,
            }}>
            Visit helmport.com →
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: '28px 32px' }}>
        <div style={{
          maxWidth: 860, margin: '0 auto', display: 'flex', flexWrap: 'wrap',
          gap: 16, justifyContent: 'space-between', alignItems: 'center',
        }}>
          <p style={{ fontSize: 13, color: C.faint, margin: 0, lineHeight: 1.6 }}>
            This site is for informational purposes only and does not constitute legal advice.
          </p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:joel@helmport.com" style={{ fontSize: 13, color: C.faint, textDecoration: 'none' }}>joel@helmport.com</a>
            <span style={{ fontSize: 13, color: C.faint }}>© 2026 HELM</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
