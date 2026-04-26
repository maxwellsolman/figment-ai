import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'

const ACCENT = '#CCFF00'
const EASE = [0.22, 1, 0.36, 1]

// ─── Primitives ──────────────────────────────────────────────────────────────

function WordReveal({ text, color = '#fff', delay = 0 }) {
  return (
    <span style={{ display: 'block' }}>
      {text.split(' ').map((word, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 28, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.72, delay: delay + i * 0.09, ease: EASE }}
          style={{ display: 'inline-block', marginRight: '0.22em', color }}
        >{word}</motion.span>
      ))}
    </span>
  )
}

function SlideUp({ children, delay = 0, once = true }) {
  return (
    <div style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '105%' }}
        whileInView={{ y: '0%' }}
        viewport={{ once, margin: '-30px' }}
        transition={{ duration: 0.6, delay, ease: EASE }}
      >{children}</motion.div>
    </div>
  )
}

function Reveal({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: EASE }}
      className={className}
    >{children}</motion.div>
  )
}

function Label({ children }) {
  return (
    <SlideUp>
      <p style={{ color: ACCENT, fontSize: '0.7rem', fontFamily: 'Syne, sans-serif', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 1.2rem' }}>
        {children}
      </p>
    </SlideUp>
  )
}

function PrimaryBtn({ href, children, large = false, onClick }) {
  return (
    <motion.a href={href} onClick={onClick}
      className="btn-primary font-display"
      style={{
        display: 'inline-block', textDecoration: 'none', cursor: 'pointer',
        background: ACCENT, color: '#080808',
        padding: large ? '1.1rem 2.4rem' : '0.85rem 1.8rem',
        borderRadius: '100px', fontWeight: 700,
        fontSize: large ? '1rem' : '0.85rem',
      }}
      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.16, ease: EASE }}
    >{children}</motion.a>
  )
}

function GhostBtn({ href, children }) {
  return (
    <motion.a href={href}
      className="font-display"
      style={{
        display: 'inline-block', textDecoration: 'none', cursor: 'pointer',
        color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.15)',
        padding: '0.85rem 1.8rem', borderRadius: '100px', fontWeight: 700, fontSize: '0.85rem',
      }}
      whileHover={{ scale: 1.04, borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.16, ease: EASE }}
    >{children}</motion.a>
  )
}

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / 2000, 1)
      const e = 1 - Math.pow(1 - p, 4)
      setCount(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(tick)
      else setDone(true)
    }
    requestAnimationFrame(tick)
  }, [inView, target])
  return <motion.span ref={ref} animate={done ? { color: ACCENT } : {}} transition={{ duration: 0.3 }}>
    {count.toLocaleString()}{suffix}
  </motion.span>
}

// ─── Background ──────────────────────────────────────────────────────────────

function Background() {
  return (
    <>
      <div className="noise-overlay" />
      <div style={{ position: 'fixed', top: 0, right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(204,255,0,0.04) 0%, transparent 65%)', filter: 'blur(50px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '15%', left: '-8%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 65%)', filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0 }} />
    </>
  )
}

// ─── Nav ─────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.1rem 2.5rem',
        background: scrolled ? 'rgba(8,8,8,0.93)' : 'rgba(8,8,8,0.5)',
        backdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'background 0.3s, border-color 0.3s',
      }}>
      <span className="font-display" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.02em' }}>
        FIGMENT<span style={{ color: ACCENT }}>AI</span>
      </span>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <GhostBtn href="#creators">Work</GhostBtn>
        <GhostBtn href="#faq">FAQ</GhostBtn>
        <PrimaryBtn href="#book">Book a Call</PrimaryBtn>
      </div>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '8rem 2.5rem 4rem', position: 'relative', zIndex: 1, maxWidth: '100%' }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', width: '100%' }}>

        <div style={{ overflow: 'hidden', marginBottom: '1.5rem' }}>
          <motion.p initial={{ y: '110%' }} animate={{ y: '0%' }}
            transition={{ duration: 0.55, delay: 0.1, ease: EASE }}
            className="font-display"
            style={{ color: ACCENT, fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
            Done-for-you AI Influencers
          </motion.p>
        </div>

        <h1 className="font-display" style={{ fontSize: 'clamp(2.8rem, 7vw, 7.5rem)', fontWeight: 800, lineHeight: 0.92, letterSpacing: '-0.04em', margin: '0 0 2rem' }}>
          <WordReveal text="Bring your brand" delay={0.18} />
          <WordReveal text="to life." delay={0.38} color={ACCENT} />
          <WordReveal text="No camera required." delay={0.58} />
        </h1>

        <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.92, ease: EASE }}
          style={{ color: 'rgba(255,255,255,0.48)', fontSize: '1.15rem', maxWidth: '38rem', lineHeight: 1.65, margin: '0 0 2.5rem' }}>
          We build AI influencers that grow real audiences — owned media assets your brand controls, grows, and monetizes forever.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 1.08, ease: EASE }}
          style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '5rem' }}>
          <PrimaryBtn href="#book" large>Book a Call</PrimaryBtn>
          <GhostBtn href="#creators">See our work</GhostBtn>
        </motion.div>

        {/* Stats row */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 1.3, ease: EASE }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, max-content)', gap: '0 4rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {[
            { n: 96500, s: '+', label: 'Followers in week 1' },
            { n: 3, s: '', label: 'Active AI creators' },
            { n: 10000, s: '+', label: 'App users driven' },
          ].map(({ n, s, label }) => (
            <div key={label}>
              <div className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', fontWeight: 800, color: ACCENT, letterSpacing: '-0.04em', lineHeight: 1 }}>
                <Counter target={n} suffix={s} />
              </div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '0.35rem' }}>{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ─── Marquee ─────────────────────────────────────────────────────────────────

function Marquee() {
  const items = ['Custom Build', 'Clone + Deploy', 'Done For You', 'Real Audiences', 'AI Influencers', 'Owned Media', 'No Camera', 'Your Niche', 'Week 1 Results']
  const doubled = [...items, ...items]
  return (
    <div className="marquee-track" style={{ overflow: 'hidden', padding: '0.9rem 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#0a0a0a' }}>
      <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {doubled.map((item, i) => (
          <span key={i} className="font-display" style={{ fontWeight: 700, fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 2.5rem', color: 'rgba(255,255,255,0.18)' }}>
            {item}<span style={{ color: ACCENT, marginLeft: '2.5rem' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Creators Showcase ───────────────────────────────────────────────────────

const CREATORS = [
  {
    name: 'Patricia Simmons',
    handle: '@airportpatricia',
    url: 'https://www.instagram.com/airportpatricia/',
    role: 'Senior Airport Security Agent',
    niche: 'Travel & Airport',
    followers: '96.5K',
    posts: '11',
    stat: '10K+ app users driven',
    color: ACCENT,
    tint: 'rgba(204,255,0,0.07)',
    border: 'rgba(204,255,0,0.2)',
    img: '/patricia-ig.png',
    desc: 'Built from zero. 96,500 followers in the first week. 11 posts. She became the face of airport insider knowledge.',
  },
  {
    name: 'Sophia Voss',
    handle: '@itssophiavoss',
    url: 'https://www.instagram.com/itssophiavoss/',
    role: 'Luxury Hotel Concierge',
    niche: 'Travel & Luxury Hotels',
    followers: 'Growing',
    posts: 'Active',
    stat: 'Hotel insider content',
    color: '#F5C842',
    tint: 'rgba(245,200,66,0.07)',
    border: 'rgba(245,200,66,0.2)',
    img: null,
    desc: 'Warm, conspiratorial, polished. She reveals what happens behind the marble front desk of luxury hotels.',
  },
  {
    name: 'Ellie Whitmore',
    handle: '@ellswhitmore',
    url: 'https://www.instagram.com/ellswhitmore/',
    role: 'International Flight Attendant',
    niche: 'Travel & Aviation',
    followers: 'Growing',
    posts: 'Active',
    stat: 'Aviation insider content',
    color: '#60A5FA',
    tint: 'rgba(96,165,250,0.07)',
    border: 'rgba(96,165,250,0.2)',
    img: null,
    desc: 'Five years on long-haul international routes. She exposes what airlines, airports, and hotels hide from passengers.',
  },
]

function CreatorCard({ c, i }) {
  return (
    <Reveal delay={i * 0.1}>
      <motion.div
        style={{
          background: '#111',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: `inset 0 0 0 1px ${c.border}`,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}
        whileHover={{ y: -6, boxShadow: `inset 0 0 0 1px ${c.color}55, 0 24px 60px rgba(0,0,0,0.5)` }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {/* Image / placeholder area */}
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden', background: c.img ? '#000' : `linear-gradient(135deg, #111 0%, #1a1a1a 100%)` }}>
          {c.img
            ? <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
            : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.tint, position: 'relative' }}>
                {/* Gradient orb */}
                <div style={{ width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${c.color}22 0%, transparent 70%)`, position: 'absolute' }} />
                <div className="font-display" style={{ fontSize: '5rem', fontWeight: 800, color: c.color, opacity: 0.15, letterSpacing: '-0.05em', userSelect: 'none' }}>
                  {c.name.split(' ')[0][0]}{c.name.split(' ')[1][0]}
                </div>
              </div>
            )
          }
          {/* Niche pill */}
          <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
            <span className="font-display" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: `1px solid ${c.border}`, color: c.color, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '0.35rem 0.75rem', borderRadius: '100px' }}>
              {c.niche}
            </span>
          </div>
        </div>

        {/* Info */}
        <div style={{ padding: '1.5rem 1.6rem 1.8rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <p className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '1.05rem', margin: 0, letterSpacing: '-0.02em' }}>{c.name}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', margin: '0.2rem 0 0' }}>{c.role}</p>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.84rem', lineHeight: 1.65, margin: 0, flex: 1 }}>{c.desc}</p>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            {[
              { val: c.followers, lbl: 'Followers' },
              { val: c.posts, lbl: 'Posts' },
            ].map(({ val, lbl }) => (
              <div key={lbl} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                <div className="font-display" style={{ color: c.color, fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.03em' }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', marginTop: '0.1rem' }}>{lbl}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
            <motion.a href={c.url} target="_blank" rel="noopener noreferrer"
              className="font-display"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: c.color, color: '#080808', borderRadius: '100px', padding: '0.55rem 1.1rem', fontSize: '0.78rem', fontWeight: 700, textDecoration: 'none', flex: 1, justifyContent: 'center' }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
              {c.handle}
            </motion.a>
          </div>
        </div>
      </motion.div>
    </Reveal>
  )
}

function Creators() {
  return (
    <section id="creators" style={{ padding: '7rem 2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Label>Our creators</Label>
            <SlideUp delay={0.05}>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
                Three personas.<br />Three niches.<br /><span style={{ color: ACCENT }}>All built by us.</span>
              </h2>
            </SlideUp>
          </div>
          <Reveal delay={0.15}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', maxWidth: '26rem', lineHeight: 1.7 }}>
              Every creator is a fully designed AI persona — character, visuals, voice, content strategy. Click their handle to visit the real account.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
          {CREATORS.map((c, i) => <CreatorCard key={c.handle} c={c} i={i} />)}
        </div>
      </div>
    </section>
  )
}

// ─── Big stat callout ─────────────────────────────────────────────────────────

function StatCallout() {
  return (
    <section style={{ background: '#0a0a0a', padding: '7rem 2.5rem', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem' }}>
        {[
          { n: '96.5K', label: 'Followers', sub: 'Patricia — week 1, 11 posts' },
          { n: '8,700', label: 'Avg followers per post', sub: 'Across active accounts' },
          { n: '10K+', label: 'App users driven', sub: 'Direct conversions from content' },
          { n: '100%', label: 'Done for you', sub: 'Scripts, visuals, video, posting' },
        ].map(({ n, label, sub }, i) => (
          <Reveal key={label} delay={i * 0.07}>
            <div>
              <div className="font-display" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 800, color: ACCENT, letterSpacing: '-0.05em', lineHeight: 1 }}>{n}</div>
              <div className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginTop: '0.5rem' }}>{label}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginTop: '0.25rem' }}>{sub}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

// ─── Case Study ───────────────────────────────────────────────────────────────

function CaseStudy() {
  return (
    <section style={{ padding: '7rem 2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <Label>Case Study — Patricia Simmons</Label>
        <SlideUp delay={0.05}>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 4rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 1rem' }}>
            Zero to 96,500 followers.<br /><span style={{ color: ACCENT }}>In seven days.</span>
          </h2>
        </SlideUp>

        <Reveal delay={0.12}>
          <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '1rem', maxWidth: '36rem', lineHeight: 1.7, margin: '0 0 3.5rem' }}>
            Patricia Simmons didn't exist before we built her. Today she has one of the fastest-growing travel accounts on Instagram and has driven thousands of users to a travel platform — naturally, through content that doesn't feel like advertising.
          </p>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          {/* IG screenshot */}
          <Reveal delay={0.08}>
            <motion.div style={{ borderRadius: '20px', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)' }}
              whileHover={{ scale: 1.015 }} transition={{ duration: 0.3, ease: EASE }}>
              <img src="/patricia-ig.png" alt="@airportpatricia on Instagram" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.2rem 1.4rem', background: 'linear-gradient(to top, rgba(8,8,8,0.97) 0%, transparent 100%)' }}>
                <p className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', margin: 0 }}>@airportpatricia</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', margin: '0.15rem 0 0' }}>Patricia Simmons · Senior Security Agent</p>
              </div>
            </motion.div>
          </Reveal>

          {/* Timeline + results */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Week 1', title: 'Character launched', body: 'Full persona designed — look, voice, backstory, security checkpoint world. First 4 posts published.', stat: '42,000 followers' },
              { label: 'Week 2', title: 'Growth compounds', body: 'Hook-driven content about airport secrets, passenger behavior, TSA alternatives. Algorithm picks it up.', stat: '96,500 followers' },
              { label: 'Ongoing', title: 'Platform conversions', body: 'Patricia naturally reveals her #1 travel hack in bio. ManyChat flow captures every comment into a signup.', stat: '10,000+ users driven' },
            ].map(({ label, title, body, stat }, i) => (
              <Reveal key={label} delay={i * 0.08}>
                <motion.div style={{ background: '#111', borderRadius: '16px', padding: '1.4rem 1.6rem', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)' }}
                  whileHover={{ boxShadow: `inset 0 0 0 1px ${ACCENT}33, 0 16px 40px rgba(0,0,0,0.4)` }}
                  transition={{ duration: 0.22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <span className="font-display" style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: ACCENT }}>{label}</span>
                    <span className="font-display" style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fff' }}>{stat}</span>
                  </div>
                  <p className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', margin: '0 0 0.4rem' }}>{title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>{body}</p>
                </motion.div>
              </Reveal>
            ))}

            <Reveal delay={0.28}>
              <motion.a href="https://www.instagram.com/airportpatricia/" target="_blank" rel="noopener noreferrer"
                className="btn-primary font-display"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: ACCENT, color: '#080808', borderRadius: '12px', padding: '1rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.88rem' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
                View @airportpatricia on Instagram
              </motion.a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── What We Do — Tabs ────────────────────────────────────────────────────────

const TABS = [
  {
    id: 'custom',
    label: 'Custom Build',
    headline: 'Built from scratch.\nTotally yours.',
    body: 'We design an entirely original AI persona around your brand\'s niche — their appearance, voice, backstory, content style, and platform strategy. You get a character no one has ever seen before, built to own your niche.',
    features: ['Original character design', 'Custom visual identity created in Nano Banana + Higgsfield', 'Unique voice, tone, and personality brief', 'Platform-native content strategy', 'ManyChat conversion funnel setup', 'Weekly video production — done for you'],
    ideal: 'Brands that want something completely original and niche-specific.',
  },
  {
    id: 'clone',
    label: 'Clone + Deploy',
    headline: 'Proven formula.\nYour niche.',
    body: 'We take a proven persona blueprint — like Patricia or Ellie — and rebuild it for your brand\'s world. Same tested psychology, same viral content architecture, adapted entirely to your niche. Faster to launch, faster to grow.',
    features: ['Proven persona psychology applied to your niche', 'Tested content hook frameworks that work', 'Faster launch — weeks not months', 'Same done-for-you production pipeline', 'Built-in virality mechanics from day one', 'Brand mention integration from launch'],
    ideal: 'Brands that want results fast using a formula that\'s already proven.',
  },
  {
    id: 'brand',
    label: 'Brand Content',
    headline: 'Your creator.\nYour ads.',
    body: 'Beyond building influence, your AI creator can produce direct brand content — product features, announcements, tutorials, testimonials. The same character, used as a flexible content engine for your marketing.',
    features: ['Product-focused video content', 'Announcement and launch videos', 'Tutorial and how-it-works content', 'Testimonial-style creator content', 'Direct CTA campaigns', 'Flexible — any topic, any message'],
    ideal: 'Brands that want their AI creator to do double duty — organic growth AND direct conversion.',
  },
]

function WhatWeDo() {
  const [active, setActive] = useState('custom')
  const tab = TABS.find(t => t.id === active)

  return (
    <section style={{ padding: '7rem 2.5rem', background: '#0a0a0a', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <Label>What we do</Label>
        <SlideUp delay={0.05}>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 3rem' }}>
            Three ways to work<br /><span style={{ color: ACCENT }}>with Figment AI.</span>
          </h2>
        </SlideUp>

        {/* Tab bar */}
        <Reveal delay={0.1}>
          <div style={{ display: 'inline-flex', background: '#111', borderRadius: '14px', padding: '0.35rem', marginBottom: '2.5rem', gap: '0.25rem', position: 'relative', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)}
                className="font-display"
                style={{
                  position: 'relative', border: 'none', cursor: 'pointer', borderRadius: '10px',
                  padding: '0.6rem 1.3rem', fontSize: '0.82rem', fontWeight: 700,
                  background: active === t.id ? ACCENT : 'transparent',
                  color: active === t.id ? '#080808' : 'rgba(255,255,255,0.45)',
                  transition: 'background 0.2s, color 0.2s',
                  zIndex: 1,
                }}>
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

            {/* Left: headline + body */}
            <div style={{ background: '#111', borderRadius: '20px', padding: '2.5rem', boxShadow: `inset 0 0 0 1px ${ACCENT}30` }}>
              <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 1.2rem', whiteSpace: 'pre-line' }}>
                {tab.headline}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.95rem', lineHeight: 1.75, margin: '0 0 2rem' }}>{tab.body}</p>
              <div style={{ padding: '1rem 1.2rem', background: 'rgba(204,255,0,0.05)', borderRadius: '12px', border: `1px solid ${ACCENT}22` }}>
                <p className="font-display" style={{ color: ACCENT, fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Ideal for</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{tab.ideal}</p>
              </div>
            </div>

            {/* Right: features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
              <p className="font-display" style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>What's included</p>
              {tab.features.map((f, i) => (
                <motion.div key={f}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05, ease: EASE }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', background: '#111', borderRadius: '12px', padding: '1rem 1.2rem', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.07)' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem' }}>{f}</span>
                </motion.div>
              ))}
              <div style={{ marginTop: '0.5rem' }}>
                <PrimaryBtn href="#book" large>Book a Call to Learn More</PrimaryBtn>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    { n: '01', title: 'We design the character', body: 'Name, look, voice, backstory, niche. A complete character brief built around where your brand lives — before a single frame is shot.' },
    { n: '02', title: 'We build the content engine', body: 'Scripts written, visuals generated, videos produced. You approve the direction once. We run the rest.' },
    { n: '03', title: 'We launch and grow', body: 'Account setup, posting cadence, hook optimization, platform strategy. We manage everything and report growth weekly.' },
    { n: '04', title: 'You own the audience', body: 'The character, the account, the followers — yours. A media asset that compounds in value every week it\'s live.' },
  ]
  return (
    <section style={{ padding: '7rem 2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <Label>How it works</Label>
        <SlideUp delay={0.05}>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 3rem' }}>
            Set it once.<br /><span style={{ color: ACCENT }}>We handle the rest.</span>
          </h2>
        </SlideUp>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'rgba(255,255,255,0.06)', borderRadius: '20px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
          {steps.map(({ n, title, body }, i) => (
            <Reveal key={n} delay={i * 0.07}>
              <motion.div style={{ padding: '2.5rem', background: '#080808', height: '100%', borderRight: i % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
                whileHover={{ background: 'rgba(255,255,255,0.02)' }} transition={{ duration: 0.2 }}>
                <div className="font-display" style={{ fontSize: '5rem', fontWeight: 800, color: `${ACCENT}1a`, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '1.5rem', userSelect: 'none' }}>{n}</div>
                <h3 className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', margin: '0 0 0.6rem' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────

const FAQS = [
  { q: 'Is this really AI? How does it look so real?', a: 'Yes — every creator is entirely AI-generated. We use a combination of advanced image generation models (Higgsfield, Nano Banana) for character visuals and HeyGen for lip-sync video animation. The result is indistinguishable from a real human creator. Patricia has 96,500 followers who interact with her as a real person.' },
  { q: 'Who owns the account and the character?', a: 'You do. The Instagram account, the character IP, all content — it all belongs to your brand. We build and manage it, but it\'s yours to keep, sell, or hand off at any time.' },
  { q: 'How many videos do you post per week?', a: 'Typically 3–5 videos per week depending on the package. Consistency is critical for growth — we build a publishing cadence that maximizes platform algorithm favor without burning out the audience.' },
  { q: 'What niches do you work in?', a: 'We\'ve built in travel, airport security, luxury hotels, and aviation. We can build in virtually any niche where there\'s a character archetype — finance, health, real estate, beauty, food, fitness, parenting, and more. If there\'s an insider perspective, we can build a persona around it.' },
  { q: 'How does the brand get mentioned without it feeling like an ad?', a: 'The creator builds genuine authority and trust first — their content is 80–90% niche-specific value (secrets, warnings, hacks). The brand mention is woven in naturally, the way a real person would recommend something. Patricia says "my #1 travel hack" and links to Repriced.ai. It never feels like a commercial.' },
  { q: 'How long until we see results?', a: 'Patricia hit 96,500 followers in her first week with 11 posts. Results vary by niche and content quality, but AI creators can scale faster than human influencers because we can produce and optimize content rapidly without the limitations of a real person\'s schedule or comfort zone.' },
  { q: 'What platforms do you post on?', a: 'Currently optimized for Instagram (Reels). We can also produce for TikTok and YouTube Shorts. The same content architecture works across all three — we tailor captions, hooks, and aspect ratios per platform.' },
  { q: 'What\'s the pricing?', a: 'We work on a retainer model based on content volume — how many videos per week and which model (Custom Build or Clone + Deploy). Book a call and we\'ll put together a proposal specific to your brand and niche.' },
]

function FAQItem({ q, a, i }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={i * 0.04}>
      <motion.div
        style={{ borderRadius: '14px', overflow: 'hidden', background: open ? '#141414' : '#111', boxShadow: open ? `inset 0 0 0 1px ${ACCENT}30` : 'inset 0 0 0 1px rgba(255,255,255,0.07)', cursor: 'pointer' }}
        whileHover={!open ? { boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)' } : {}}
        transition={{ duration: 0.2 }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.3rem 1.5rem', gap: '1rem' }}>
          <p className="font-display" style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem', margin: 0, lineHeight: 1.45 }}>{q}</p>
          <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.25, ease: EASE }}
            style={{ width: 24, height: 24, borderRadius: '50%', background: open ? ACCENT : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="5" y1="0" x2="5" y2="10" stroke={open ? '#080808' : '#fff'} strokeWidth="1.8" />
              <line x1="0" y1="5" x2="10" y2="5" stroke={open ? '#080808' : '#fff'} strokeWidth="1.8" />
            </svg>
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              style={{ overflow: 'hidden' }}
            >
              <p style={{ color: 'rgba(255,255,255,0.48)', fontSize: '0.88rem', lineHeight: 1.75, margin: 0, padding: '0 1.5rem 1.4rem' }}>{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  )
}

function FAQ() {
  return (
    <section id="faq" style={{ padding: '7rem 2.5rem', background: '#0a0a0a', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem', alignItems: 'start' }}>
          <div style={{ position: 'sticky', top: '6rem' }}>
            <Label>FAQ</Label>
            <SlideUp delay={0.05}>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 1.2rem' }}>
                Questions<br /><span style={{ color: ACCENT }}>answered.</span>
              </h2>
            </SlideUp>
            <Reveal delay={0.12}>
              <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 2rem' }}>
                Still curious? Book a call and we'll answer anything specific to your brand and niche.
              </p>
              <PrimaryBtn href="#book">Book a Call</PrimaryBtn>
            </Reveal>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {FAQS.map((f, i) => <FAQItem key={i} {...f} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Book a Call ─────────────────────────────────────────────────────────────

function BookCall() {
  return (
    <section id="book" style={{ padding: '7rem 2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <motion.div
          style={{ borderRadius: '28px', padding: '5rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: '#111', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
          whileHover={{ boxShadow: `inset 0 0 0 1px ${ACCENT}25` }}
          transition={{ duration: 0.4 }}>
          <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 700, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${ACCENT}09 0%, transparent 65%)`, filter: 'blur(30px)', pointerEvents: 'none' }} />

          <Label>Ready to build yours?</Label>

          <SlideUp delay={0.05}>
            <h2 className="font-display" style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 1.2rem' }}>
              Let's build your<br /><span style={{ color: ACCENT }}>AI influencer.</span>
            </h2>
          </SlideUp>

          <Reveal delay={0.15}>
            <p style={{ color: 'rgba(255,255,255,0.42)', fontSize: '1rem', maxWidth: '34rem', margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
              Book a call and we'll walk through which model fits your brand, what the character could look like, and what growth looks like in your niche.
            </p>
          </Reveal>

          <Reveal delay={0.22}>
            <PrimaryBtn href="#" large>Book a Call</PrimaryBtn>
            <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.72rem', marginTop: '1rem' }}>Cal.com embed coming soon</p>
          </Reveal>
        </motion.div>
      </div>
    </section>
  )
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <span className="font-display" style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff', letterSpacing: '-0.02em' }}>
          FIGMENT<span style={{ color: ACCENT }}>AI</span>
        </span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {CREATORS.map(c => (
            <motion.a key={c.handle} href={c.url} target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}
              whileHover={{ color: c.color }} transition={{ duration: 0.15 }}>
              {c.handle}
            </motion.a>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.72rem' }}>© 2025 Figment AI. All rights reserved.</p>
      </div>
    </footer>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Background />
      <Nav />
      <Hero />
      <Marquee />
      <Creators />
      <StatCallout />
      <CaseStudy />
      <WhatWeDo />
      <HowItWorks />
      <FAQ />
      <BookCall />
      <Footer />
    </>
  )
}
