import { useEffect, useRef, useState } from 'react'
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
  green:       '#3fb950',
  greenLight:  'rgba(63,185,80,0.08)',
  greenBorder: 'rgba(63,185,80,0.3)',
  red:         '#da3633',
  redLight:    'rgba(218,54,51,0.08)',
  redBorder:   'rgba(218,54,51,0.3)',
  icAmber:     '#d29922',
  icOrange:    '#e67e22',
  icYellow:    '#c9a227',
  icRed:       '#da3633',
  cardShadow:  '0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2)',
}

const sectionLabel = { fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.faint, marginBottom: 14 }
const h2Style     = { fontSize: 'clamp(26px, 3.5vw, 36px)', fontWeight: 700, color: C.heading, margin: '0 0 16px', letterSpacing: '-0.5px', lineHeight: 1.2 }
const mutedText   = { fontSize: 18, color: C.muted, lineHeight: 1.75 }

// ── Section nav ────────────────────────────────────────────
const NAV_SECTIONS = [
  { id: 'hero',      label: 'Overview'          },
  { id: 'what-is',   label: 'What Is Subpart F' },
  { id: 'cost',      label: 'Cost Comparison'   },
  { id: 'training',  label: 'Training'          },
  { id: 'incident',  label: 'Incident Reporting'},
  { id: 'readiness', label: 'Readiness Score'   },
  { id: 'faq',       label: 'FAQ'               },
  { id: 'checklist', label: 'Checklist'         },
]

// ── Countdown ──────────────────────────────────────────────
function useCountdown(target) {
  const [days, setDays] = useState(0)
  useEffect(() => {
    const calc = () => setDays(Math.max(0, Math.ceil((new Date(target) - new Date()) / 86400000)))
    calc(); const id = setInterval(calc, 60000); return () => clearInterval(id)
  }, [target])
  return days
}

// ── Static data ────────────────────────────────────────────
const PLAN_SECTIONS = [
  { ref: '§101.630', title: 'Cybersecurity Officer (CySO)', body: 'Each facility must designate a qualified CySO responsible for developing and maintaining the Cybersecurity Plan.' },
  { ref: '§101.635', title: 'Cybersecurity Assessment',     body: 'A documented risk assessment identifying vulnerabilities across all IT and OT systems relevant to facility security.' },
  { ref: '§101.640', title: 'Cybersecurity Plan',           body: 'Written policies and procedures addressing identified risks — must be submitted to USCG by July 16, 2027.' },
  { ref: '§101.650', title: 'Personnel Training',           body: 'Role-based cybersecurity training for all personnel with IT/OT access. Annual refresher required.' },
  { ref: '§101.655', title: 'Drills & Exercises',           body: 'Biannual drills testing cyber incident response, plus at least one annual tabletop or full-scale exercise.' },
  { ref: '§101.660', title: 'Incident Reporting',           body: 'Cybersecurity incidents must be reported to the NRC and cognizant COTP within established timeframes.' },
  { ref: '§101.645', title: 'Plan Review & Audit',          body: 'Annual internal review of the Cybersecurity Plan, full resubmission to USCG every five years or after a significant change.' },
]
const TRAINING_ROWS = [
  { req: '(d)(1)(i): Relevant provisions of the Cybersecurity Plan',                                       all: 'Deferred until CSP approved',      key: 'Deferred until CSP approved',      untrained: 'MUST BE ESCORTED', deadline: 'Within 60 days of CSP approval, but NLT July 16, 2027', passed: false },
  { req: '(d)(1)(ii): Recognition and detection of cybersecurity threats and all types of cyber incidents', all: 'Yes', key: 'Yes', untrained: 'MUST BE ESCORTED', deadline: 'NLT January 12, 2026', passed: true  },
  { req: '(d)(1)(iii): Techniques used to circumvent cybersecurity measures',                               all: 'Yes', key: 'Yes', untrained: 'MUST BE ESCORTED', deadline: 'NLT January 12, 2026', passed: true  },
  { req: '(d)(1)(iv): Procedures for reporting a cyber incident to the CySO',                              all: 'Deferred until CySO designated',    key: 'Deferred until CySO designated',    untrained: 'MUST BE ESCORTED', deadline: 'Within 30 days of CySO designation, but NLT July 16, 2027', passed: false },
  { req: '(d)(1)(v): OT-specific cybersecurity training for personnel whose duties include using OT',       all: 'Yes', key: 'Yes', untrained: 'MUST BE ESCORTED', deadline: 'NLT January 12, 2026', passed: true  },
  { req: '(d)(2)(i): Roles and responsibilities during a cyber incident and response procedure',            all: 'No',  key: 'Yes', untrained: 'MUST BE ESCORTED', deadline: 'NLT January 12, 2026', passed: true  },
  { req: '(d)(2)(ii): Maintaining current knowledge of changing cybersecurity threats and countermeasures', all: 'No',  key: 'Yes', untrained: 'MUST BE ESCORTED', deadline: 'NLT January 12, 2026', passed: true  },
]
const INCIDENT_CARDS = [
  { color: C.icAmber,  colorBg: 'rgba(210,153,34,0.07)',  colorBorder: 'rgba(210,153,34,0.3)',  scope: 'ALL MTS Stakeholders',          title: 'Cyber Incident',                      def: 'An occurrence that actually or imminently jeopardizes the integrity, confidentiality, or availability of information or an information system.', when: 'Incidents that lead to or could lead to: substantial loss of confidentiality/integrity/availability, disruption of business operations, unauthorized access to personal information, or potential disruption to other critical infrastructure.', note: 'Routine spam, phishing attempts that don\'t breach defenses, and accidental USB plugging are NOT reportable. But monitor for escalation.', reportTo: 'FBI, CISA, and COTP (or NRC)' },
  { color: C.icOrange, colorBg: 'rgba(230,126,34,0.07)',  colorBorder: 'rgba(230,126,34,0.3)',  scope: 'MTSA-Regulated Entities Only',  title: 'Breach of Security',                  def: 'Security measures circumvented, eluded, or violated — including computer/network security measures connected to FSP functions.', examples: 'Unauthorized access to restricted areas; intrusion into systems linked to security plan functions; successful phishing allowing access to internal IT linked to MTS; viruses/malware on mission-critical servers; denial of service on security-linked systems.', reportTo: 'NRC at 1-800-424-8802 (without delay), and local COTP' },
  { color: C.icYellow, colorBg: 'rgba(201,162,39,0.07)',  colorBorder: 'rgba(201,162,39,0.3)',  scope: 'MTSA-Regulated Entities Only',  title: 'Suspicious Activity',                 def: 'Observed behavior reasonably indicative of pre-operational planning for terrorism or criminal activity.', examples: 'Persistent targeted scanning; spear phishing campaigns; marked increase in attack volume/sophistication; unsuccessful but targeted incidents on systems that could contribute to a TSI.', reportTo: 'NRC at 1-800-424-8802' },
  { color: C.icRed,    colorBg: 'rgba(218,54,51,0.07)',   colorBorder: 'rgba(218,54,51,0.3)',   scope: 'MTSA-Regulated Entities Only',  title: 'Transportation Security Incident (TSI)', def: 'Security incident resulting in significant loss of life, environmental damage, transportation system disruption, or economic disruption.', note: 'Cyber incidents affecting business/admin systems (not just OT) can be a TSI if they cause transportation system or economic disruption.', reportTo: 'Local COTP (without delay), then follow FSP procedures' },
]
const FAQ_ITEMS = [
  { q: 'Do we have to completely rewrite our Facility Security Plan?',                                         a: 'No. If your FSA identifies cyber vulnerabilities not already covered, you only need to amend your FSP with an annex or addendum addressing those vulnerabilities. Submit it to your local COTP. A complete rewrite is not required unless you prefer that approach.' },
  { q: 'Is there a Coast Guard template for the cyber annex?',                                                 a: 'No official template exists. However, the NIST Cybersecurity Framework is widely referenced, and the Coast Guard has published a Facility Inspector Cyber Job Aid that can also be used by industry as a guide.' },
  { q: 'What if our IT systems are managed at corporate level, not at the facility?',                          a: 'The FSO should determine who within the company manages IT networks and systems. You need to engage corporate IT to jointly identify which vulnerabilities impact your specific facility. Then document how those vulnerabilities are addressed in the FSP cyber annex. This collaboration between FSO and corporate IT is explicitly encouraged by the Coast Guard.' },
  { q: 'We manage multiple MTSA facilities across different COTP zones. Can we submit one blanket annex?',     a: 'No. The Coast Guard explicitly warns against blanket submissions. Every facility has unique vulnerabilities that need to be addressed individually. Work directly with each applicable COTP. However, you can use a common framework across facilities while tailoring the specifics.' },
  { q: 'What cybersecurity standards does the Coast Guard recommend?',                                         a: 'There is no Coast Guard-approved list, but the NIST Cybersecurity Framework is the most widely referenced. The Coast Guard also encourages use of NIST SP 800-82 for industrial control systems. Other standards like ISA 62443 and ISO 27001 are also commonly mapped to maritime cyber requirements.' },
  { q: 'Do we need to include a network diagram in our FSP?',                                                  a: 'No. Current law and regulations do not require a network diagram in the FSP.' },
  { q: 'What training should FSOs get for cybersecurity?',                                                     a: 'There are no Coast Guard-approved cybersecurity trainings for FSOs specifically. FSOs are encouraged to build relationships with their company\'s IT staff and seek out qualified third-party training. The CG-5PC Policy Letter 01-25 outlines specific training topics that must be covered for all personnel with IT/OT access.' },
]
const CHECKLIST_ITEMS = [
  { ref: '§105.200/106.200',      title: 'Security Administration & Organization', body: 'Define roles and responsibilities for cyber security personnel, how physical and cyber security teams coordinate.' },
  { ref: '§105.205–215/106.205–220', title: 'Personnel Training',                  body: 'Describe how cyber security is included in training, how material stays current.' },
  { ref: '§105.220/106.225',      title: 'Drills & Exercises',                      body: 'Test cyber vulnerabilities of the FSP, consider combined cyber-physical scenarios.' },
  { ref: '§105.225/106.230',      title: 'Records & Documentation',                 body: 'Maintain records of cyber training, drills, incidents; protect electronic records from unauthorized deletion.' },
  { ref: '§105.235/106.240',      title: 'Communications',                          body: 'Describe how cyber conditions are communicated to vessels, COTP, and authorities; backup communications plan if systems compromised.' },
  { ref: '§105.240/106.245',      title: 'Vessel Interface Procedures',             body: 'Address network interaction, portable media exchange, remote access, wireless sharing with vessels.' },
  { ref: '§105.250/106.255',      title: 'Security Systems Maintenance',            body: 'Procedures for managing software updates and patch installations on FSP-supporting systems.' },
  { ref: '§105.255/106.260',      title: 'Access Control',                          body: 'Security measures for cyber systems controlling physical access and systems within secure/restricted areas.' },
  { ref: '§105.260/106.265',      title: 'Restricted Areas',                        body: 'Limit unauthorized access to systems controlled by cyber networks; address both physical and cyber access paths.' },
  { ref: '§105.265',              title: 'Cargo Handling',                          body: 'Protect cargo manifests and documentation from tampering and unauthorized access.' },
  { ref: '§105.270/106.270',      title: 'Delivery of Stores',                      body: 'Protect electronic files related to stores and bunkers delivery.' },
  { ref: '§105.275/106.275',      title: 'Monitoring',                              body: 'Security measures for continuous monitoring of facility, restricted areas, and vessels using cyber-dependent systems.' },
  { ref: '§105.400/106.400',      title: 'FSP Development',                         body: 'Ensure FSO develops and implements plan addressing each cyber vulnerability from the FSA.' },
  { ref: '§105.415/106.415',      title: 'Audits & Amendments',                     body: 'Annual audit of cyber provisions; audit report should confirm cyber measures are in place and effective.' },
]
const QUIZ_QUESTIONS = [
  { q: 'Have you designated a Cybersecurity Officer (CySO)?',                                          options: ['Yes', 'No', 'Not Sure'] },
  { q: 'Have all personnel with IT/OT access completed cybersecurity training per §101.650?',           options: ['Yes', 'No', 'Partially'] },
  { q: 'Have you completed a cybersecurity assessment of your IT and OT systems?',                      options: ['Yes', 'No', 'In Progress'] },
  { q: 'Have you drafted or started your Cybersecurity Plan for COTP submission?',                      options: ['Yes', 'No', 'In Progress'] },
  { q: 'Have you conducted a cybersecurity drill or exercise?',                                         options: ['Yes', 'No'] },
]
function quizScore(opt) {
  if (opt === 'Yes')                          return 2
  if (opt === 'In Progress' || opt === 'Partially') return 1
  return 0
}

// ── Subcomponents ──────────────────────────────────────────

function FaqItem({ q, a, open, onToggle }) {
  return (
    <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', marginBottom: 6 }}>
      <button onClick={onToggle} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
        <span style={{ fontSize: 17, fontWeight: 600, color: C.heading, lineHeight: 1.4 }}>{q}</span>
        <span style={{ fontSize: 20, color: C.muted, flexShrink: 0, transform: open ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s', display: 'inline-block' }}>+</span>
      </button>
      <div style={{ maxHeight: open ? '600px' : '0', overflow: 'hidden', transition: 'max-height 0.25s ease' }}>
        <p style={{ fontSize: 16, color: C.muted, lineHeight: 1.75, margin: 0, padding: '0 24px 20px' }}>{a}</p>
      </div>
    </div>
  )
}

function SavingsCalculator() {
  const [raw, setRaw] = useState('1')
  const count        = Math.max(1, Math.min(999, parseInt(raw, 10) || 1))
  const consultant   = count * 25000
  const helm         = count * 1188
  const savings      = consultant - helm
  const hoursBack    = count * 36 * 4

  const fmt = n => '$' + n.toLocaleString()

  return (
    <div style={{ background: C.bg, border: `1px solid ${C.borderMid}`, borderRadius: 12, padding: '28px 32px', marginTop: 32 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>Savings Calculator</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28, flexWrap: 'wrap' }}>
        <label style={{ fontSize: 16, color: C.body, fontWeight: 500 }}>How many MTSA facilities do you manage?</label>
        <input
          type="number" min="1" max="999" value={raw}
          onChange={e => setRaw(e.target.value)}
          style={{ width: 80, padding: '8px 12px', fontSize: 20, fontWeight: 700, background: C.bgCard, border: `1px solid ${C.borderMid}`, borderRadius: 6, color: C.heading, textAlign: 'center', outline: 'none' }}
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 }}>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Consultant Cost</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.body, letterSpacing: '-0.5px' }}>{fmt(consultant)}<span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/yr</span></div>
          <div style={{ fontSize: 12, color: C.faint, marginTop: 4 }}>{count} × $25,000</div>
        </div>
        <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>HELM Cost</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: C.navyAccent, letterSpacing: '-0.5px' }}>{fmt(helm)}<span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/yr</span></div>
          <div style={{ fontSize: 12, color: C.faint, marginTop: 4 }}>{count} × $1,188</div>
        </div>
        <div style={{ background: C.greenLight, border: `1px solid ${C.greenBorder}`, borderRadius: 8, padding: '16px 18px' }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: C.green, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Annual Savings</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: C.green, letterSpacing: '-1px' }}>{fmt(savings)}<span style={{ fontSize: 13, fontWeight: 400 }}>/yr</span></div>
          <div style={{ fontSize: 12, color: C.green, marginTop: 4, opacity: 0.8 }}>That's {hoursBack.toLocaleString()} hrs back</div>
        </div>
      </div>
    </div>
  )
}

function ReadinessQuiz() {
  const [answers, setAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)

  const allAnswered = QUIZ_QUESTIONS.every((_, i) => answers[i] !== undefined)
  const totalScore  = Object.values(answers).reduce((s, v) => s + v, 0)

  useEffect(() => { if (allAnswered) setShowResult(true) }, [allAnswered])

  function reset() { setAnswers({}); setShowResult(false) }

  function getResult(score) {
    if (score <= 3)  return { color: C.red,        bg: C.redLight,   border: C.redBorder,   label: 'Critical',        text: 'Your facility has significant gaps. With 15 months until the July 2027 deadline and a 12-18 month buildout timeline, you need to start immediately.',        cta: 'Get your facility\'s compliance profile', href: 'https://helmport.com' }
    if (score <= 6)  return { color: C.amber,       bg: C.amberLight, border: C.amberBorder, label: 'Behind Schedule',  text: 'You\'ve started but major requirements remain. Most facilities at this stage need 8-12 months to reach full compliance.',                                  cta: 'See what\'s missing — Start HELM Free Trial', href: 'https://helmport.com/signup' }
    if (score <= 9)  return { color: C.green,        bg: C.greenLight, border: C.greenBorder, label: 'On Track',        text: 'You\'re making progress. Use HELM to track the remaining items and generate your inspection package.',                                                      cta: 'Track your progress', href: 'https://helmport.com/signup' }
    return             { color: C.navyAccent,     bg: C.navyBadge,  border: 'rgba(68,147,248,0.4)', label: 'Compliant', text: 'You\'re ahead of most facilities. HELM can maintain your compliance posture and alert you to regulatory changes.',                                       cta: 'Stay compliant', href: 'https://helmport.com/signup' }
  }

  const result = showResult ? getResult(totalScore) : null

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {QUIZ_QUESTIONS.map((item, qi) => (
          <div key={qi} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '22px 26px' }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
              <span style={{ background: answers[qi] !== undefined ? C.navyBadge : C.bg, border: `1px solid ${answers[qi] !== undefined ? C.navyAccent : C.borderMid}`, color: answers[qi] !== undefined ? C.navyAccent : C.faint, fontSize: 12, fontWeight: 700, width: 24, height: 24, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                {answers[qi] !== undefined ? '✓' : qi + 1}
              </span>
              <span style={{ fontSize: 17, fontWeight: 600, color: C.heading, lineHeight: 1.45 }}>{item.q}</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', paddingLeft: 36 }}>
              {item.options.map(opt => {
                const selected = answers[qi]?.label === opt
                const score    = quizScore(opt)
                const selColor = score === 2 ? C.green : score === 1 ? C.amber : C.faint
                return (
                  <button key={opt}
                    onClick={() => setAnswers(prev => ({ ...prev, [qi]: { label: opt, score } }))}
                    style={{ padding: '8px 20px', fontSize: 14, fontWeight: 600, borderRadius: 6, cursor: 'pointer', background: selected ? (score === 2 ? C.greenLight : score === 1 ? C.amberLight : C.redLight) : C.bg, border: `1px solid ${selected ? selColor : C.borderMid}`, color: selected ? selColor : C.muted, transition: 'all 0.15s' }}
                  >{opt}</button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
      {showResult && result && (
        <div style={{ background: result.bg, border: `1px solid ${result.border}`, borderRadius: 12, padding: '28px 32px', marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div>
              <span style={{ display: 'inline-block', background: result.color, color: '#fff', fontSize: 12, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 4, marginBottom: 10 }}>{result.label}</span>
              <div style={{ fontSize: 28, fontWeight: 800, color: result.color, letterSpacing: '-0.5px', lineHeight: 1 }}>
                {totalScore} <span style={{ fontSize: 16, color: C.muted, fontWeight: 400 }}>/ 10</span>
              </div>
            </div>
            <button onClick={reset} style={{ background: 'none', border: `1px solid ${C.borderMid}`, color: C.muted, fontSize: 13, padding: '6px 16px', borderRadius: 6, cursor: 'pointer', fontWeight: 500 }}>Retake</button>
          </div>
          <p style={{ fontSize: 16, color: C.body, lineHeight: 1.7, margin: '0 0 8px' }}>{result.text}</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 20px', fontStyle: 'italic' }}>Your facility scored {totalScore}/10. The average MTSA facility we assess scores 2–3/10.</p>
          <a href={result.href} target="_blank" rel="noopener noreferrer"
            style={{ display: 'inline-block', background: result.color, color: '#fff', textDecoration: 'none', padding: '11px 24px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
            {result.cta} →
          </a>
        </div>
      )}
    </div>
  )
}

function BackToTop() {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 600)
    window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top"
      style={{ position: 'fixed', bottom: 28, right: 24, zIndex: 200, background: C.bgCard, border: `1px solid ${C.borderMid}`, color: C.muted, width: 40, height: 40, borderRadius: 8, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: visible ? 1 : 0, pointerEvents: visible ? 'auto' : 'none', transition: 'opacity 0.2s', boxShadow: C.cardShadow }}>
      ↑
    </button>
  )
}

// ── Training table row ─────────────────────────────────────
function TrainingRow({ row, i }) {
  return (
    <tr style={{ background: row.passed ? 'rgba(210,153,34,0.04)' : (i % 2 === 0 ? C.bgCard : C.bg), borderBottom: `1px solid ${C.border}` }}>
      <td style={{ padding: '14px 16px', color: C.body, lineHeight: 1.5, fontWeight: 500, maxWidth: 280 }}>{row.req}</td>
      <td style={{ padding: '14px 16px', color: row.all === 'Yes' ? C.green : C.muted, fontWeight: row.all === 'Yes' ? 600 : 400 }}>{row.all}</td>
      <td style={{ padding: '14px 16px', color: row.key === 'Yes' ? C.green : C.muted, fontWeight: row.key === 'Yes' ? 600 : 400 }}>{row.key}</td>
      <td style={{ padding: '14px 16px' }}><span style={{ background: C.redLight, border: `1px solid ${C.redBorder}`, color: '#f85149', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', padding: '3px 8px', borderRadius: 4, whiteSpace: 'nowrap' }}>{row.untrained}</span></td>
      <td style={{ padding: '14px 16px', whiteSpace: 'nowrap' }}>
        {row.passed
          ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: C.amber, fontSize: 13, fontWeight: 600 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: C.amber, display: 'inline-block' }} />{row.deadline} — PASSED</span>
          : <span style={{ color: C.muted, fontSize: 13 }}>{row.deadline}</span>
        }
      </td>
    </tr>
  )
}

const TABLE_HEADERS = ['Training Requirement', 'All Personnel', 'Key Personnel', 'Untrained Personnel', 'Compliance Date']

// ── Shared gate CTA block ──────────────────────────────────
function GateCta({ icon, text, cta, href }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '32px 24px', textAlign: 'center' }}>
      {icon && <div style={{ fontSize: 22 }}>{icon}</div>}
      <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.65, maxWidth: 520 }}>{text}</p>
      <a href={href} target="_blank" rel="noopener noreferrer"
        style={{ display: 'inline-block', background: C.amber, color: '#fff', textDecoration: 'none', padding: '11px 26px', borderRadius: 8, fontSize: 14, fontWeight: 700 }}>
        {cta} →
      </a>
    </div>
  )
}

// ══════════════════════════════════════════════════════════
// App
// ══════════════════════════════════════════════════════════
export default function App() {
  const daysLeft = useCountdown('2027-07-16T00:00:00')
  const [openFaq, setOpenFaq] = useState(null)
  const [trainingEmail, setTrainingEmail] = useState('')
  const [trainingRevealed, setTrainingRevealed] = useState(false)

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.body }}>

      {/* ── Primary nav ───────────────────────────── */}
      <nav style={{ borderBottom: `1px solid ${C.border}`, padding: '0 32px', height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: 'rgba(13,17,23,0.97)', backdropFilter: 'blur(8px)', zIndex: 110 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 4, height: 39, backgroundColor: '#3B82F6', borderRadius: 2, flexShrink: 0 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 20, fontWeight: 500, letterSpacing: 8, color: '#F1F5F9', lineHeight: 1 }}>HELM</span>
              <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: 4, color: '#64748B', lineHeight: 1 }}>MARITIME COMPLIANCE</span>
            </div>
          </div>
          <span style={{ color: C.faint, fontWeight: 400, fontSize: 13, marginLeft: 4 }}>/ Subpart F Guide</span>
        </div>
        <a href="https://helmport.com" target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: C.muted, textDecoration: 'none', border: `1px solid ${C.borderMid}`, padding: '5px 14px', borderRadius: 6, fontWeight: 500 }}>helmport.com →</a>
      </nav>

      {/* ── Section nav ───────────────────────────── */}
      <nav aria-label="Jump to section" style={{ borderBottom: `1px solid ${C.border}`, background: 'rgba(1,4,9,0.97)', backdropFilter: 'blur(8px)', position: 'sticky', top: 52, zIndex: 100, overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none' }}>
        <div style={{ display: 'inline-flex', padding: '0 24px', minWidth: 'max-content' }}>
          {NAV_SECTIONS.map(s => (
            <a key={s.id} href={`#${s.id}`} style={{ display: 'inline-block', padding: '10px 14px', fontSize: 13, color: C.muted, textDecoration: 'none', fontWeight: 500, borderBottom: '2px solid transparent', transition: 'color 0.15s, border-color 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.color = C.heading; e.currentTarget.style.borderBottomColor = C.borderMid }}
              onMouseLeave={e => { e.currentTarget.style.color = C.muted;   e.currentTarget.style.borderBottomColor = 'transparent' }}>
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          1. HERO — full visibility
      ══════════════════════════════════════════ */}
      <section id="hero" style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '80px 32px 72px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ display: 'inline-block', background: C.navyBadge, border: `1px solid ${C.borderMid}`, borderRadius: 4, padding: '5px 14px', fontSize: 12, color: C.navyAccent, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 32, fontWeight: 700 }}>33 CFR Part 101 · Subpart F · Enforceable July 16, 2025</div>
          <h1 style={{ fontSize: 'clamp(32px, 4.5vw, 52px)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-1px', color: C.heading, margin: '0 0 24px' }}>
            USCG Subpart F Cybersecurity Rule:<br /><span style={{ color: C.muted, fontWeight: 600 }}>What Every MTSA Facility Needs to Know</span>
          </h1>
          <p style={{ ...mutedText, maxWidth: 660, margin: '0 0 56px' }}>The mandatory cybersecurity requirements under 33 CFR Part 101, Subpart F are now enforceable. Here's what your facility must do and when.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 16 }}>
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderMid}`, borderLeft: `4px solid ${C.faint}`, borderRadius: 10, padding: '24px 28px', boxShadow: C.cardShadow }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.faint, marginBottom: 10 }}>✓ Deadline Passed</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.heading, marginBottom: 4 }}>§101.650 Personnel Training</div>
              <div style={{ fontSize: 15, color: C.muted, marginBottom: 12 }}>Due January 12, 2026</div>
              <p style={{ fontSize: 14, color: C.faint, lineHeight: 1.65, margin: 0 }}>All personnel with cybersecurity responsibilities must have completed training. If you haven't, you are already out of compliance.</p>
            </div>
            <div style={{ background: C.bgCard, border: `1px solid ${C.borderMid}`, borderLeft: `4px solid ${C.amber}`, borderRadius: 10, padding: '24px 28px', boxShadow: C.cardShadow }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: C.amber, marginBottom: 10 }}>⚠ Upcoming Deadline</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: C.heading, marginBottom: 4 }}>Cybersecurity Plan Submission</div>
              <div style={{ fontSize: 15, color: C.muted, marginBottom: 12 }}>Due July 16, 2027</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontSize: 40, fontWeight: 800, color: C.amber, fontVariantNumeric: 'tabular-nums', letterSpacing: '-1.5px', lineHeight: 1 }}>{daysLeft}</span>
                <span style={{ fontSize: 15, color: C.muted, fontWeight: 500 }}>days remaining</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. WHAT IS SUBPART F — show rule summary + 7 compact cards
      ══════════════════════════════════════════ */}
      <section id="what-is" style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={sectionLabel}>Background</div>
          <h2 style={h2Style}>What Is 33 CFR Part 101, Subpart F?</h2>

          {/* Three-column intro */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 40, marginTop: 48, marginBottom: 64 }}>
            {[
              { l: 'The Rule',          b: 'On July 16, 2025, the USCG Cybersecurity Final Rule added Subpart F to 33 CFR Part 101, converting previously voluntary NVIC 01-20 guidance into enforceable federal regulation with USCG inspection authority and civil penalty exposure.' },
              { l: 'Who It Applies To', b: 'Approximately 3,200 MTSA-regulated facilities nationwide — petroleum terminals, chemical plants, LNG terminals, cruise terminals, container terminals, and all facilities regulated under 33 CFR Parts 105, 106, 126, 127, and 154.' },
              { l: 'What Changed',      b: 'Non-compliance is now a federal violation, not an administrative oversight. USCG inspectors can issue deficiency findings, and facilities that ignore the rule face civil penalties and potential loss of operating authorization.' },
            ].map((c, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>{c.l}</div>
                <p style={mutedText}>{c.b}</p>
              </div>
            ))}
          </div>

          {/* 7 compliance area cards — compact preview */}
          <div style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 20 }}>7 Requirements Your Cybersecurity Plan Must Address</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
            {PLAN_SECTIONS.map((s, i) => (
              <article key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '20px 22px', boxShadow: C.cardShadow }}>
                <div style={{ fontSize: 11, color: C.navyAccent, fontFamily: 'ui-monospace,Consolas,monospace', fontWeight: 700, marginBottom: 8, background: C.navyBadge, display: 'inline-block', padding: '3px 8px', borderRadius: 4 }}>{s.ref}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: C.heading, margin: '8px 0 6px', lineHeight: 1.3 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: 0 }}>{s.body}</p>
              </article>
            ))}
          </div>

          {/* Nudge CTA */}
          <div style={{ marginTop: 40, padding: '24px 28px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <p style={{ fontSize: 15, color: C.muted, margin: 0, lineHeight: 1.6 }}>
              See exactly what each requirement means for your facility — and where you currently stand.
            </p>
            <a href="#readiness" style={{ display: 'inline-block', background: C.navyBadge, border: `1px solid ${C.navyAccent}`, color: C.navyAccent, textDecoration: 'none', padding: '10px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
              Take the Readiness Assessment ↓
            </a>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. COST COMPARISON — full visibility
      ══════════════════════════════════════════ */}
      <section id="cost" style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={sectionLabel}>ROI Analysis</div>
          <h2 style={h2Style}>What Subpart F Compliance Actually Costs</h2>
          <p style={{ ...mutedText, margin: '0 0 48px' }}>Three ways to reach compliance. One costs 95% less.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, alignItems: 'stretch', marginBottom: 32 }}>

            {/* DIY */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: C.cardShadow }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Option 1</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.heading, margin: '0 0 4px' }}>DIY / Excel</h3>
                <div style={{ fontSize: 14, color: C.muted }}>$0 software, but 160+ hours/year of your time</div>
              </div>
              <div style={{ background: C.bg, borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>True Annual Cost</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.body }}>$13,600<span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/yr in labor</span></div>
                <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>160 hrs × $85/hr FSO salary</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>What You Get</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>Spreadsheets, manual cross-referencing, no audit trail, hope you don't miss anything.</p>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Risk</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>COTP finds gaps you missed → fines, remediation, reputation damage.</p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <span style={{ display: 'inline-block', background: C.bg, border: `1px solid ${C.borderMid}`, color: C.muted, fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Free but expensive</span>
              </div>
            </div>

            {/* Consultant */}
            <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 12, padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: C.cardShadow }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Option 2</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.heading, margin: '0 0 4px' }}>Hire a Consultant</h3>
                <div style={{ fontSize: 14, color: C.muted }}>$25,000 – $75,000 per facility per year</div>
              </div>
              <div style={{ background: C.bg, borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Annual Cost</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.body }}>$25k–$75k<span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/facility/yr</span></div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>What You Get</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>Expert walks your facility, writes your FSA/FSP cyber annex, manages COTP submission.</p>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Limitation</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>You're renting expertise. When the engagement ends, you're back to spreadsheets.</p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 8 }}>
                <span style={{ display: 'inline-block', background: C.bg, border: `1px solid ${C.borderMid}`, color: C.muted, fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Expert but expensive</span>
              </div>
            </div>

            {/* HELM */}
            <div style={{ background: C.bgCard, border: `2px solid ${C.amber}`, borderRadius: 12, padding: '28px 26px', display: 'flex', flexDirection: 'column', gap: 16, boxShadow: `0 0 0 1px ${C.amberBorder}, ${C.cardShadow}`, position: 'relative' }}>
              <div style={{ position: 'absolute', top: -12, left: 24, background: C.amber, color: '#fff', fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: 4 }}>Recommended</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Option 3</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: C.heading, margin: '0 0 4px' }}>HELM</h3>
                <div style={{ fontSize: 14, color: C.muted }}>$99/month · built for MTSA facilities</div>
              </div>
              <div style={{ background: C.amberLight, border: `1px solid ${C.amberBorder}`, borderRadius: 8, padding: '14px 16px' }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.amber, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Annual Cost</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: C.amber }}>$1,188<span style={{ fontSize: 13, color: C.muted, fontWeight: 400 }}>/facility/yr</span></div>
                <div style={{ fontSize: 12, color: C.faint, marginTop: 2 }}>vs. $25,000+ consultant — 95% less</div>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>What You Get</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>Gap analysis, training tracker, drill logging, incident reporting, inspection package PDF — built specifically for MTSA facilities.</p>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Best For</div>
                <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>FSOs who want to own their compliance posture without paying consultant rates.</p>
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <span style={{ display: 'inline-block', background: C.amberLight, border: `1px solid ${C.amberBorder}`, color: C.amber, fontSize: 12, fontWeight: 700, padding: '5px 12px', borderRadius: 4, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Complete platform, 95% less</span>
                <a href="https://helmport.com/signup" target="_blank" rel="noopener noreferrer"
                  style={{ display: 'block', textAlign: 'center', background: C.amber, color: '#fff', textDecoration: 'none', padding: '12px 20px', borderRadius: 8, fontSize: 15, fontWeight: 700 }}>
                  Start Free Trial →
                </a>
              </div>
            </div>

          </div>

          <SavingsCalculator />

          <p style={{ fontSize: 14, color: C.faint, marginTop: 28, lineHeight: 1.75, fontStyle: 'italic', maxWidth: 780 }}>
            HELM doesn't replace on-site expertise. If your facility needs a consultant for physical walkthroughs or complex OT assessments, HELM makes that engagement faster and cheaper by handling the documentation, tracking, and reporting.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. TRAINING — first 3 rows visible, rows 4-7 gated
      ══════════════════════════════════════════ */}
      <section id="training" style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <div style={sectionLabel}>§101.650 — CG-5PC Policy Letter 01-25</div>
          <h2 style={h2Style}>Cybersecurity Training Requirements Under §101.650</h2>
          <p style={{ ...mutedText, margin: '0 0 48px' }}>Who needs training, what topics, and by when. Showing 3 of 7 requirements.</p>

          {/* Always-visible: header + first 3 rows */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: trainingRevealed ? '10px 10px 0 0' : 10, border: `1px solid ${C.border}`, borderBottom: trainingRevealed ? 'none' : `1px solid ${C.border}`, boxShadow: C.cardShadow }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 760 }}>
              <thead>
                <tr style={{ background: C.bg, borderBottom: `2px solid ${C.borderMid}` }}>
                  {TABLE_HEADERS.map((h, i) => (
                    <th key={i} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TRAINING_ROWS.slice(0, 3).map((row, i) => <TrainingRow key={i} row={row} i={i} />)}
              </tbody>
            </table>
          </div>

          {/* Remaining rows: faded gate or revealed */}
          {trainingRevealed ? (
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', borderRadius: '0 0 10px 10px', border: `1px solid ${C.border}`, borderTop: 'none', boxShadow: C.cardShadow, marginBottom: 32 }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 760 }}>
                <tbody>
                  {TRAINING_ROWS.slice(3).map((row, i) => <TrainingRow key={i} row={row} i={i + 3} />)}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '0 0 10px 10px', border: `1px solid ${C.border}`, borderTop: 'none' }}>
              {/* Blurred rows */}
              <div style={{ filter: 'blur(3px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.55 }}>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 760 }}>
                    <tbody>
                      {TRAINING_ROWS.slice(3).map((row, i) => <TrainingRow key={i} row={row} i={i + 3} />)}
                    </tbody>
                  </table>
                </div>
              </div>
              {/* Gradient overlay */}
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(to bottom, transparent 0%, ${C.bgAlt} 75%)`, pointerEvents: 'none' }} />
            </div>
          )}

          {/* Email gate */}
          {!trainingRevealed && (
            <div style={{ marginTop: 0, background: C.bgCard, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '28px 32px', textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 600, color: C.heading, marginBottom: 8 }}>See all 7 training requirements and compliance dates</div>
              <p style={{ fontSize: 14, color: C.muted, margin: '0 0 20px', lineHeight: 1.65 }}>Enter your email to unlock the complete Subpart F Training Requirements guide.</p>
              <form onSubmit={e => { e.preventDefault(); if (trainingEmail.includes('@')) setTrainingRevealed(true) }}
                style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', maxWidth: 480, margin: '0 auto' }}>
                <input
                  type="email" placeholder="your@email.com" required value={trainingEmail}
                  onChange={e => setTrainingEmail(e.target.value)}
                  style={{ flex: '1 1 220px', padding: '10px 16px', fontSize: 15, background: C.bg, border: `1px solid ${C.borderMid}`, borderRadius: 8, color: C.heading, outline: 'none', minWidth: 0 }}
                />
                <button type="submit"
                  style={{ padding: '10px 22px', background: C.navyAccent, color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                  Unlock Full Table
                </button>
              </form>
              <p style={{ fontSize: 12, color: C.faint, marginTop: 12 }}>No spam. Unsubscribe any time.</p>
            </div>
          )}

          {/* Notes — only show when revealed */}
          {trainingRevealed && (
            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                '"Key Personnel" are determined by the owner/operator but generally include: company leadership, CSO, FSO, personnel with elevated system access or admin privileges, designated CySO, and OT engineers/operators/technicians with elevated access.',
                'New personnel must complete training within 5 days of gaining system access, but NLT 30 days of hiring, then annually thereafter.',
                'New IT/OT Systems: Training must be completed within 5 days of gaining system access, then annually thereafter.',
                'Untrained personnel may access IT/OT only if physically accompanied or monitored by trained personnel.',
                'Contractor training: Owner/operator must either train the contractor using their own program, or evaluate and accept the third-party\'s existing cybersecurity training program with documented justification.',
              ].map((note, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <span style={{ color: C.navyAccent, fontSize: 14, marginTop: 3, flexShrink: 0 }}>›</span>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{note}</p>
                </div>
              ))}
              <p style={{ fontSize: 12, color: C.faint, marginTop: 8, fontStyle: 'italic' }}>Source: CG-5PC Policy Letter 01-25, October 9, 2025</p>
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          5. INCIDENT REPORTING — 2 of 4 cards visible
      ══════════════════════════════════════════ */}
      <section id="incident" style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={sectionLabel}>NVIC 02-24 — February 21, 2024</div>
          <h2 style={h2Style}>Cyber Incident Reporting Requirements</h2>
          <p style={{ ...mutedText, margin: '0 0 48px' }}>Know what to report, to whom, and when. Showing 2 of 4 incident types.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: 16, marginBottom: 16 }}>
            {/* First 2 cards — fully visible */}
            {INCIDENT_CARDS.slice(0, 2).map((card, i) => (
              <article key={i} style={{ background: card.colorBg, border: `1px solid ${card.colorBorder}`, borderTop: `3px solid ${card.color}`, borderRadius: 10, padding: '24px 26px', boxShadow: C.cardShadow }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: card.color, marginBottom: 6 }}>{card.scope}</div>
                <h3 style={{ fontSize: 19, fontWeight: 700, color: C.heading, margin: '0 0 14px' }}>{card.title}</h3>
                <div style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Definition</div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{card.def}</p>
                </div>
                {card.examples && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Examples</div><p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{card.examples}</p></div>}
                {card.when    && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>When to Report</div><p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{card.when}</p></div>}
                {card.note    && <div style={{ marginBottom: 12 }}><div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Note</div><p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{card.note}</p></div>}
                <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '10px 14px', marginTop: 4 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: card.color, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Report To</div>
                  <p style={{ fontSize: 14, color: C.body, fontWeight: 500, margin: 0, lineHeight: 1.5 }}>{card.reportTo}</p>
                </div>
              </article>
            ))}

            {/* Last 2 cards — blurred + lock overlay */}
            {INCIDENT_CARDS.slice(2).map((card, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden' }}>
                {/* Blurred card content */}
                <article style={{ background: card.colorBg, border: `1px solid ${card.colorBorder}`, borderTop: `3px solid ${card.color}`, borderRadius: 10, padding: '24px 26px', boxShadow: C.cardShadow, filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.5 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: card.color, marginBottom: 6 }}>{card.scope}</div>
                  <h3 style={{ fontSize: 19, fontWeight: 700, color: C.heading, margin: '0 0 14px' }}>{card.title}</h3>
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: C.faint, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Definition</div>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{card.def}</p>
                  </div>
                  {card.examples && <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 12px' }}>{card.examples}</p>}
                  {card.note    && <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: '0 0 12px' }}>{card.note}</p>}
                  <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 6, padding: '10px 14px', marginTop: 4 }}>
                    <p style={{ fontSize: 14, color: C.body, fontWeight: 500, margin: 0 }}>{card.reportTo}</p>
                  </div>
                </article>
                {/* Lock overlay */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, background: 'rgba(13,17,23,0.4)' }}>
                  <div style={{ fontSize: 28, opacity: 0.7 }}>🔒</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.heading, opacity: 0.85, textAlign: 'center', padding: '0 16px' }}>{card.title}</div>
                  <div style={{ fontSize: 12, color: C.muted, opacity: 0.75, textAlign: 'center', padding: '0 16px' }}>Included in HELM trial</div>
                </div>
              </div>
            ))}
          </div>

          {/* Gate CTA */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, padding: '24px 28px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.heading, marginBottom: 6 }}>Get the complete incident classification guide and reporting contacts</div>
              <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Suspicious Activity and TSI reporting procedures — free with HELM trial.</p>
            </div>
            <a href="https://helmport.com/signup" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: C.amber, color: '#fff', textDecoration: 'none', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
              Start Free Trial →
            </a>
          </div>

          {/* Reporting contacts — always visible */}
          <div style={{ background: C.bgCard, border: `1px solid ${C.borderMid}`, borderRadius: 10, padding: '24px 28px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { l: 'CGCYBER 24/7 Watch', n: '(202) 372-2904',  s: 'CyberWatch@uscg.mil' },
              { l: 'CISA Central',        n: '(888) 282-0870',  s: 'report@cisa.gov' },
              { l: 'NRC (24/7)',           n: '1-800-424-8802', s: 'Required for BOS and Suspicious Activity' },
            ].map((c, i) => (
              <div key={i}>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.navyAccent, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{c.l}</div>
                <p style={{ fontSize: 16, color: C.heading, fontWeight: 600, margin: '0 0 4px' }}>{c.n}</p>
                <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{c.s}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: C.faint, marginTop: 16, fontStyle: 'italic' }}>Source: NVIC 02-24, February 21, 2024</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          6. READINESS SCORE — full visibility
      ══════════════════════════════════════════ */}
      <section id="readiness" style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={sectionLabel}>Self-Assessment Tool</div>
          <h2 style={h2Style}>How Ready Is Your Facility?</h2>
          <p style={{ ...mutedText, margin: '0 0 48px' }}>Five questions. Two minutes. See where you stand on Subpart F.</p>
          <ReadinessQuiz />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          7. FAQ — first 3 open, 4-7 locked
      ══════════════════════════════════════════ */}
      <section id="faq" style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={sectionLabel}>NVIC 01-20 FAQs — Rewritten for Clarity</div>
          <h2 style={h2Style}>Frequently Asked Questions</h2>
          <p style={{ ...mutedText, margin: '0 0 48px' }}>Answers from USCG guidance — rewritten in plain English. Showing 3 of 7.</p>

          {/* First 3: fully interactive */}
          {FAQ_ITEMS.slice(0, 3).map((item, i) => (
            <FaqItem key={i} q={item.q} a={item.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
          ))}

          {/* Questions 4-7: locked */}
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {FAQ_ITEMS.slice(3).map((item, i) => (
              <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, overflow: 'hidden', opacity: 0.6 }}>
                <div style={{ width: '100%', textAlign: 'left', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 16, fontWeight: 600, color: C.muted, lineHeight: 1.4 }}>{item.q}</span>
                  <span style={{ fontSize: 16, flexShrink: 0, opacity: 0.5 }}>🔒</span>
                </div>
              </div>
            ))}
          </div>

          {/* Gate CTA */}
          <div style={{ marginTop: 24, padding: '22px 28px', background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 10, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <p style={{ fontSize: 14, color: C.muted, margin: 0, lineHeight: 1.65 }}>
              See all 7 FAQs and access the complete compliance resource library at helmport.com.
            </p>
            <a href="https://helmport.com" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: C.navyBadge, border: `1px solid ${C.navyAccent}`, color: C.navyAccent, textDecoration: 'none', padding: '10px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
              Visit helmport.com →
            </a>
          </div>
          <p style={{ fontSize: 12, color: C.faint, marginTop: 20, lineHeight: 1.7, fontStyle: 'italic' }}>Based on NVIC 01-20 FAQs, updated April 29, 2022. Answers have been simplified for clarity — refer to official USCG guidance for authoritative text.</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          8. CHECKLIST — first 5 visible, 9 faded
      ══════════════════════════════════════════ */}
      <section id="checklist" style={{ background: C.bgAlt, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={sectionLabel}>NVIC 01-20 — Enclosure 1 — February 26, 2020</div>
          <h2 style={h2Style}>NVIC 01-20 Cyber Compliance Checklist</h2>
          <p style={{ ...mutedText, margin: '0 0 48px' }}>What your FSP cyber annex should address — mapped to 33 CFR 105/106. Showing 5 of 14 items.</p>

          {/* First 5 items — fully visible */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 0 }}>
            {CHECKLIST_ITEMS.slice(0, 5).map((item, i) => (
              <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, marginTop: 2, border: `2px solid ${C.borderMid}`, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: C.borderMid }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: C.heading }}>{item.title}</span>
                    <span style={{ fontSize: 11, color: C.navyAccent, fontFamily: 'ui-monospace,Consolas,monospace', fontWeight: 700, background: C.navyBadge, padding: '2px 7px', borderRadius: 3 }}>{item.ref}</span>
                  </div>
                  <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Remaining 9 items — gradient faded */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ filter: 'blur(2px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.5, display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {CHECKLIST_ITEMS.slice(5).map((item, i) => (
                <div key={i} style={{ background: C.bgCard, border: `1px solid ${C.border}`, borderRadius: 8, padding: '18px 22px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: 5, flexShrink: 0, marginTop: 2, border: `2px solid ${C.borderMid}`, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: C.borderMid }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: C.heading }}>{item.title}</span>
                      <span style={{ fontSize: 11, color: C.navyAccent, fontFamily: 'ui-monospace,Consolas,monospace', fontWeight: 700, background: C.navyBadge, padding: '2px 7px', borderRadius: 3 }}>{item.ref}</span>
                    </div>
                    <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.65, margin: 0 }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Gradient overlay */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `linear-gradient(to bottom, transparent 0%, ${C.bgAlt} 65%)`, pointerEvents: 'none' }} />
          </div>

          {/* Gate CTA */}
          <div style={{ marginTop: 0, background: C.bgCard, border: `1px solid ${C.border}`, borderTop: 'none', borderRadius: '0 0 10px 10px', padding: '28px 32px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.heading, marginBottom: 6 }}>Get the complete 14-point NVIC 01-20 compliance checklist</div>
              <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>All 14 checklist items with CFR cross-references — free with HELM trial.</p>
            </div>
            <a href="https://helmport.com/signup" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: C.amber, color: '#fff', textDecoration: 'none', padding: '11px 22px', borderRadius: 8, fontSize: 14, fontWeight: 700, whiteSpace: 'nowrap' }}>
              Start Free Trial →
            </a>
          </div>

          <p style={{ fontSize: 12, color: C.faint, marginTop: 24, fontStyle: 'italic' }}>Source: NVIC 01-20, Enclosure 1, February 26, 2020</p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          9. FINAL CTA + WHO WE ARE
      ══════════════════════════════════════════ */}
      <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '80px 32px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 4, height: 44, backgroundColor: '#3B82F6', borderRadius: 2, flexShrink: 0 }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 24, fontWeight: 500, letterSpacing: 8, color: '#F1F5F9', lineHeight: 1 }}>HELM</span>
                <span style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", fontSize: 12, fontWeight: 400, letterSpacing: 4, color: '#64748B', lineHeight: 1 }}>MARITIME COMPLIANCE</span>
              </div>
            </div>
          </div>
          <h2 style={{ fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 800, color: C.heading, margin: '0 0 16px', lineHeight: 1.25, letterSpacing: '-0.5px' }}>
            Consultants charge $25,000. Spreadsheets take 160 hours.<br />
            <span style={{ color: C.amber }}>HELM costs $99/month.</span>
          </h2>
          <p style={{ ...mutedText, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            The only compliance platform built exclusively for MTSA facilities. Track Subpart F requirements, generate inspection packages, and stay ahead of your COTP.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://helmport.com/signup" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: C.amber, color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: 8, fontSize: 16, fontWeight: 700 }}>
              Start Free Trial →
            </a>
            <a href="https://helmport.com" target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-block', background: C.bgCard, border: `1px solid ${C.borderMid}`, color: C.heading, textDecoration: 'none', padding: '14px 32px', borderRadius: 8, fontSize: 16, fontWeight: 600 }}>
              See Your Facility's Profile →
            </a>
          </div>
          <p style={{ fontSize: 13, color: C.faint, marginTop: 20 }}>14-day free trial · No credit card required · Cancel anytime</p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer style={{ background: C.bgAlt, borderTop: `1px solid ${C.border}`, padding: '28px 32px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'space-between', alignItems: 'center' }}>
          <p style={{ fontSize: 13, color: C.faint, margin: 0, lineHeight: 1.6 }}>This site is for informational purposes only and does not constitute legal advice.</p>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
            <a href="mailto:joel@helmport.com" style={{ fontSize: 13, color: C.faint, textDecoration: 'none' }}>joel@helmport.com</a>
            <span style={{ fontSize: 13, color: C.faint }}>© 2026 HELM</span>
          </div>
        </div>
      </footer>

      <BackToTop />
    </div>
  )
}
