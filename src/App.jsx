import { useEffect, useState } from 'react'
import './index.css'

// Live countdown to July 16, 2027
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

export default function App() {
  const daysLeft = useCountdown('2027-07-16T00:00:00')

  return (
    <div style={{ background: '#0d1117', minHeight: '100vh', color: '#e6edf3' }}>

      {/* ── Nav bar ── */}
      <nav style={{ borderBottom: '1px solid #21262d', padding: '0 24px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(13,17,23,0.95)', backdropFilter: 'blur(8px)', zIndex: 100 }}>
        <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.3px', color: '#e6edf3' }}>
          ⚓ HELM <span style={{ color: '#7d8590', fontWeight: 400 }}>/ Subpart F Guide</span>
        </span>
        <a href="https://helmport.com" target="_blank" rel="noopener noreferrer"
          style={{ fontSize: 13, color: '#7d8590', textDecoration: 'none', border: '1px solid #30363d', padding: '5px 14px', borderRadius: 6 }}>
          helmport.com →
        </a>
      </nav>

      {/* ══════════════════════════════════════════
          1. HERO
      ══════════════════════════════════════════ */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '72px 24px 64px' }}>
        <div style={{ display: 'inline-block', background: '#161b22', border: '1px solid #30363d', borderRadius: 4, padding: '4px 12px', fontSize: 12, color: '#7d8590', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 28, fontWeight: 600 }}>
          33 CFR Part 101 · Subpart F · Enforceable July 16, 2025
        </div>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 700, lineHeight: 1.2, letterSpacing: '-0.5px', color: '#e6edf3', margin: '0 0 20px' }}>
          USCG Subpart F Cybersecurity Rule:<br />
          <span style={{ color: '#7d8590' }}>What Every MTSA Facility Needs to Know</span>
        </h1>

        <p style={{ fontSize: 17, color: '#8b949e', lineHeight: 1.7, maxWidth: 680, margin: '0 0 48px' }}>
          The mandatory cybersecurity requirements under 33 CFR Part 101, Subpart F are now enforceable.
          Here's what your facility must do and when.
        </p>

        {/* Deadline callout boxes */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {/* Passed deadline */}
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderLeft: '3px solid #656d76', borderRadius: 8, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#656d76', marginBottom: 8 }}>
              ✓ Deadline Passed
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3', marginBottom: 4 }}>
              §101.650 Personnel Training
            </div>
            <div style={{ fontSize: 14, color: '#7d8590' }}>Due January 12, 2026</div>
            <div style={{ fontSize: 12, color: '#656d76', marginTop: 8, lineHeight: 1.5 }}>
              All personnel with cybersecurity responsibilities must have completed training. If you haven't, you are already out of compliance.
            </div>
          </div>

          {/* Upcoming deadline */}
          <div style={{ background: '#161b22', border: '1px solid #30363d', borderLeft: '3px solid #d29922', borderRadius: 8, padding: '20px 24px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d29922', marginBottom: 8 }}>
              ⚠ Upcoming Deadline
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3', marginBottom: 4 }}>
              Cybersecurity Plan Submission
            </div>
            <div style={{ fontSize: 14, color: '#7d8590' }}>Due July 16, 2027</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#d29922', fontVariantNumeric: 'tabular-nums', letterSpacing: '-1px' }}>{daysLeft}</span>
              <span style={{ fontSize: 13, color: '#7d8590' }}>days remaining</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. WHAT IS SUBPART F
      ══════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #21262d', padding: '64px 24px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7d8590', marginBottom: 16 }}>Background</div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#e6edf3', margin: '0 0 20px', letterSpacing: '-0.3px' }}>
            What Is 33 CFR Part 101, Subpart F?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 32, marginTop: 40 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7d8590', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>The Rule</div>
              <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.75 }}>
                On July 16, 2025, the USCG Cybersecurity Final Rule added Subpart F to 33 CFR Part 101, requiring all MTSA-regulated facilities to implement mandatory cybersecurity measures. This converted previously voluntary NVIC 01-20 guidance into enforceable federal regulation.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7d8590', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Who It Applies To</div>
              <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.75 }}>
                Approximately 3,200 MTSA-regulated facilities nationwide, including petroleum terminals, chemical plants, LNG terminals, cruise terminals, container terminals, and all other facilities regulated under 33 CFR Parts 105, 106, 126, 127, and 154.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#7d8590', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>What Changed</div>
              <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.75 }}>
                Cybersecurity went from voluntary guidance (NVIC 01-20) to mandatory, enforceable regulation with USCG inspection authority and civil penalty exposure. Non-compliance is a federal violation, not an administrative oversight.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. THE TWO DEADLINES
      ══════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #21262d', padding: '64px 24px', background: '#0d1117' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7d8590', marginBottom: 16 }}>Compliance Timeline</div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#e6edf3', margin: '0 0 40px', letterSpacing: '-0.3px' }}>
            The Two Deadlines Every FSO Must Know
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Deadline 1 — passed */}
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 8, padding: '28px 32px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start' }}>
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#656d76', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Jan 12</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#656d76', lineHeight: 1 }}>2026</div>
                <div style={{ marginTop: 8, display: 'inline-block', background: '#21262d', border: '1px solid #30363d', borderRadius: 3, padding: '2px 8px', fontSize: 10, color: '#656d76', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Passed</div>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e6edf3', margin: '0 0 8px' }}>
                  Personnel Training — §101.650
                </h3>
                <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.7, margin: 0 }}>
                  All personnel with cybersecurity responsibilities must have completed initial training. This deadline has already passed. Facilities that have not completed training are currently out of compliance and subject to USCG deficiency findings during inspection. Annual refresher training is required going forward.
                </p>
              </div>
            </div>

            {/* Deadline 2 — upcoming */}
            <div style={{ background: '#161b22', border: '1px solid #30363d', borderLeft: '3px solid #d29922', borderRadius: 8, padding: '28px 32px', display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', alignItems: 'start' }}>
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#d29922', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Jul 16</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#d29922', lineHeight: 1 }}>2027</div>
                <div style={{ marginTop: 8, display: 'inline-block', background: 'rgba(210,153,34,0.1)', border: '1px solid rgba(210,153,34,0.3)', borderRadius: 3, padding: '2px 8px', fontSize: 10, color: '#d29922', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{daysLeft}d left</div>
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: '#e6edf3', margin: '0 0 8px' }}>
                  Cybersecurity Plan Submission — §101.640
                </h3>
                <p style={{ fontSize: 14, color: '#8b949e', lineHeight: 1.7, margin: '0 0 12px' }}>
                  Every MTSA-regulated facility must submit a USCG-approved Facility Cybersecurity Plan. A realistic buildout — completing the assessment, drafting the plan, and clearing the USCG review cycle — takes 12 to 18 months.
                </p>
                <div style={{ background: 'rgba(210,153,34,0.06)', border: '1px solid rgba(210,153,34,0.2)', borderRadius: 6, padding: '10px 14px', fontSize: 13, color: '#d29922', lineHeight: 1.6 }}>
                  Facilities that haven't begun their Cybersecurity Assessment are running out of planning runway. The clock started July 2025.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. WHAT THE PLAN MUST COVER
      ══════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #21262d', padding: '64px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7d8590', marginBottom: 16 }}>Requirements</div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#e6edf3', margin: '0 0 12px', letterSpacing: '-0.3px' }}>
            What the Cybersecurity Plan Must Cover
          </h2>
          <p style={{ fontSize: 15, color: '#7d8590', margin: '0 0 40px', lineHeight: 1.6 }}>
            Seven compliance areas required under 33 CFR Part 101, Subpart F.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
            {PLAN_SECTIONS.map((s, i) => (
              <article key={i} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 8, padding: '20px 22px' }}>
                <div style={{ fontSize: 11, color: '#4493f8', fontFamily: 'ui-monospace, Consolas, monospace', fontWeight: 600, marginBottom: 8, letterSpacing: '0.04em' }}>{s.ref}</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e6edf3', margin: '0 0 8px', lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#7d8590', lineHeight: 1.7, margin: 0 }}>{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. KEY REGULATORY REFERENCES
      ══════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #21262d', padding: '64px 24px', background: '#0d1117' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#7d8590', marginBottom: 16 }}>Resources</div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 700, color: '#e6edf3', margin: '0 0 12px', letterSpacing: '-0.3px' }}>
            Key Regulatory References
          </h2>
          <p style={{ fontSize: 15, color: '#7d8590', margin: '0 0 36px', lineHeight: 1.6 }}>
            Primary sources for Subpart F compliance.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {REFERENCES.map((r, i) => (
              <div key={i} style={{ background: '#161b22', border: '1px solid #21262d', borderRadius: 6, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#30363d', marginTop: 7, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3', marginBottom: 3 }}>{r.title}</div>
                  <div style={{ fontSize: 13, color: '#7d8590', lineHeight: 1.6 }}>{r.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. WHO WE ARE
      ══════════════════════════════════════════ */}
      <section style={{ borderTop: '1px solid #21262d', padding: '64px 24px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#e6edf3', marginBottom: 12 }}>⚓ HELM</div>
          <p style={{ fontSize: 15, color: '#8b949e', lineHeight: 1.75, margin: '0 0 24px' }}>
            HELM helps Facility Security Officers at MTSA-regulated facilities manage both physical security and cybersecurity compliance in one platform — from FSP tracking to Subpart F plan development.
          </p>
          <a href="https://helmport.com" target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', background: '#21262d', border: '1px solid #30363d', color: '#e6edf3', textDecoration: 'none', padding: '10px 24px', borderRadius: 6, fontSize: 14, fontWeight: 500 }}>
            Visit helmport.com →
          </a>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. FOOTER
      ══════════════════════════════════════════ */}
      <footer style={{ borderTop: '1px solid #21262d', padding: '28px 24px', background: '#010409' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 12, color: '#656d76', margin: 0, lineHeight: 1.6 }}>
            This site is for informational purposes only and does not constitute legal advice.
          </p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:joel@helmport.com" style={{ fontSize: 12, color: '#656d76', textDecoration: 'none' }}>joel@helmport.com</a>
            <span style={{ fontSize: 12, color: '#656d76' }}>© 2026 HELM</span>
          </div>
        </div>
      </footer>

    </div>
  )
}
