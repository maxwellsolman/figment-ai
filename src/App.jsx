import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useInView, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion'

const ACCENT = '#CCFF00'
const EASE   = [0.22, 1, 0.36, 1]

// ─── Utilities ────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768)
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return mobile
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CREATORS = [
  {
    name: 'Patricia Simmons',
    handle: '@airportpatricia',
    url: 'https://www.instagram.com/airportpatricia/',
    role: 'Senior Airport Security Agent',
    niche: 'Travel & Airport',
    followers: '96.5K',
    posts: '11',
    color: ACCENT,
    img: '/patricia-ig.png',
    cardBg: null,
    cardGlow: null,
    desc: 'Built from zero. 96,500 followers in week 1. 11 posts. She became the face of airport insider knowledge and drove 10,000+ users to a travel platform.',
  },
  {
    name: 'Sophia Voss',
    handle: '@itssophiavoss',
    url: 'https://www.instagram.com/itssophiavoss/',
    role: 'Luxury Hotel Concierge',
    niche: 'Travel & Luxury Hotels',
    followers: '12.8K',
    posts: '24',
    color: '#F5C842',
    img: null,
    cardBg: 'linear-gradient(145deg, #1C1400 0%, #2C1C00 55%, #100A00 100%)',
    cardGlow: 'radial-gradient(ellipse at 32% 38%, rgba(245,185,50,0.26) 0%, transparent 60%)',
    desc: 'Warm, conspiratorial, polished. She reveals what happens behind the marble front desk of luxury hotels.',
  },
  {
    name: 'Ellie Whitmore',
    handle: '@ellswhitmore',
    url: 'https://www.instagram.com/ellswhitmore/',
    role: 'International Flight Attendant',
    niche: 'Travel & Aviation',
    followers: '37.7K',
    posts: '47',
    color: '#60A5FA',
    img: null,
    cardBg: 'linear-gradient(145deg, #030D1C 0%, #071828 55%, #010810 100%)',
    cardGlow: 'radial-gradient(ellipse at 68% 38%, rgba(96,165,250,0.24) 0%, transparent 60%)',
    desc: 'Five years on long-haul international routes. She exposes what airlines, airports, and hotels hide from passengers.',
  },
]

const TABS = [
  {
    id: 'custom',
    label: 'Custom Build',
    headline: 'Built from scratch.\nTotally yours.',
    body: "We design an entirely original AI persona around your brand's niche — appearance, voice, backstory, content style, and platform strategy. A character no one has ever seen, built to own your niche.",
    features: ['Original character design', 'Custom visual identity (Nano Banana + Higgsfield)', 'Unique voice, tone, and personality brief', 'Platform-native content strategy', 'ManyChat conversion funnel setup', 'Weekly video production — done for you'],
    ideal: 'Brands that want something completely original and niche-specific.',
  },
  {
    id: 'clone',
    label: 'Clone + Deploy',
    headline: 'Proven formula.\nYour niche.',
    body: "We take a proven persona blueprint — like Patricia or Ellie — and rebuild it for your brand's world. Same tested psychology, same viral content architecture, adapted entirely to your niche.",
    features: ['Proven persona psychology applied to your niche', 'Tested content hook frameworks', 'Faster launch — weeks not months', 'Same done-for-you production pipeline', 'Built-in virality mechanics from day one', 'Brand mention integration from launch'],
    ideal: "Brands that want results fast using a formula that's already proven.",
  },
  {
    id: 'brand',
    label: 'Brand Content',
    headline: 'Your creator.\nYour ads.',
    body: 'Beyond building influence, your AI creator produces direct brand content — product features, announcements, tutorials, testimonials. The same character, used as a flexible content engine.',
    features: ['Product-focused video content', 'Announcement and launch videos', 'Tutorial and how-it-works content', 'Testimonial-style creator content', 'Direct CTA campaigns', 'Flexible — any topic, any message'],
    ideal: 'Brands that want their creator to do double duty — organic growth AND direct conversion.',
  },
]

const FAQS = [
  { q: 'Is this really AI? How does it look so real?', a: "Yes — every creator is entirely AI-generated. The result is indistinguishable from a real human creator. Patricia has 96,500 followers who interact with her as a real person." },
  { q: 'Who owns the account and the character?', a: "You do. The Instagram account, the character IP, all content — it all belongs to your brand. We build and manage it, but it's yours to keep, sell, or hand off at any time." },
  { q: 'How many videos do you post per week?', a: "Typically 3-5 videos per week depending on the package. We build a publishing cadence that maximizes platform algorithm favor without burning out the audience." },
  { q: 'What niches do you work in?', a: "We've built in travel, airport security, luxury hotels, and aviation. We can build in virtually any niche — finance, health, real estate, beauty, food, fitness, parenting. If there's an insider perspective, we can build a persona around it." },
  { q: "How does the brand get mentioned without it feeling like an ad?", a: "The creator builds authority first — content is 80-90% niche-specific value. The brand mention is woven in naturally. Patricia says \"my #1 travel hack\" and links to the brand. It never feels like a commercial." },
  { q: 'How long until we see results?', a: "Patricia hit 96,500 followers in her first week with 11 posts. AI creators can scale faster than human influencers — we produce and optimize content rapidly without the limits of a real person's schedule." },
  { q: 'What platforms do you post on?', a: 'Currently optimized for Instagram Reels. We also produce for TikTok and YouTube Shorts. Same content architecture across all three — tailored captions, hooks, and aspect ratios per platform.' },
  { q: "What's the pricing?", a: "We work on a retainer based on content volume and which model (Custom Build or Clone + Deploy). Book a call and we'll put together a proposal specific to your brand and niche." },
]

// ─── Motion Primitives ────────────────────────────────────────────────────────

function SlideUp({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' })
  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ y: '105%' }}
        animate={inView ? { y: '0%' } : {}}
        transition={{ duration: 0.68, delay, ease: EASE }}
      >{children}</motion.div>
    </div>
  )
}

function Reveal({ children, delay = 0, y = 30 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y, filter: 'blur(4px)' }}
      animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >{children}</motion.div>
  )
}

function WordReveal({ text, color = '#fff', delay = 0 }) {
  return (
    <span style={{ display: 'block' }}>
      {text.split(' ').map((word, i) => (
        <motion.span key={i}
          initial={{ opacity: 0, y: 38, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.82, delay: delay + i * 0.1, ease: EASE }}
          style={{ display: 'inline-block', marginRight: '0.22em', color }}
        >{word}</motion.span>
      ))}
    </span>
  )
}

function Label({ children }) {
  return (
    <SlideUp>
      <p className="font-display" style={{ color: ACCENT, fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 1.2rem' }}>
        {children}
      </p>
    </SlideUp>
  )
}

function MagneticBtn({ href, children, large = false, dark = false }) {
  const ref = useRef(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 200, damping: 18 })
  const sy = useSpring(my, { stiffness: 200, damping: 18 })

  const onMove = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left - r.width / 2) * 0.25)
    my.set((e.clientY - r.top - r.height / 2) * 0.25)
  }, [mx, my])

  const onLeave = useCallback(() => { mx.set(0); my.set(0) }, [mx, my])

  return (
    <motion.a
      ref={ref}
      href={href || '#'}
      className="btn-primary font-display"
      style={{
        x: sx, y: sy,
        display: 'inline-block', textDecoration: 'none', cursor: 'pointer', textAlign: 'center',
        background: dark ? 'rgba(255,255,255,0.09)' : ACCENT,
        color: dark ? '#fff' : '#080808',
        border: dark ? '1px solid rgba(255,255,255,0.16)' : 'none',
        padding: large ? '1.15rem 2.6rem' : '0.88rem 1.85rem',
        borderRadius: '100px', fontWeight: 700,
        fontSize: large ? '0.97rem' : '0.85rem',
        boxShadow: dark ? 'none' : `0 0 30px ${ACCENT}30`,
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileTap={{ scale: 0.96 }}
    >{children}</motion.a>
  )
}

function SpotlightCard({ children, color = ACCENT, style = {}, ...props }) {
  const mx = useMotionValue(-500)
  const my = useMotionValue(-500)
  const bg = useTransform([mx, my], ([x, y]) =>
    `radial-gradient(340px circle at ${x}px ${y}px, ${color}18, transparent 65%)`
  )
  const onMove = useCallback((e) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set(e.clientX - r.left)
    my.set(e.clientY - r.top)
  }, [mx, my])
  const onLeave = useCallback(() => { mx.set(-500); my.set(-500) }, [mx, my])

  return (
    <div onMouseMove={onMove} onMouseLeave={onLeave} style={{ position: 'relative', ...style }} {...props}>
      <motion.div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', background: bg, pointerEvents: 'none', zIndex: 1 }} />
      {children}
    </div>
  )
}

function Counter({ target, suffix = '' }) {
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px' })
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / 2200, 1)
      const e = 1 - Math.pow(1 - p, 4)
      setCount(Math.floor(e * target))
      if (p < 1) requestAnimationFrame(tick)
      else setDone(true)
    }
    requestAnimationFrame(tick)
  }, [inView, target])
  return (
    <motion.span ref={ref} animate={done ? { color: ACCENT } : {}} transition={{ duration: 0.3 }}>
      {count.toLocaleString()}{suffix}
    </motion.span>
  )
}

// ─── Background ───────────────────────────────────────────────────────────────

function Background() {
  return (
    <>
      <div className="noise-overlay" />
      <div className="dot-grid" />
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />
    </>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────

function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const isMobile = useIsMobile()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.nav
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0.95rem 1.2rem' : '1rem 2.5rem',
        background: scrolled ? 'rgba(9,8,26,0.96)' : 'rgba(9,8,26,0.3)',
        backdropFilter: 'blur(24px)',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.07)' : '1px solid transparent',
        transition: 'background 0.35s, border-color 0.35s',
      }}
    >
      <span className="font-display" style={{ fontWeight: 800, fontSize: '1.1rem', color: '#fff', letterSpacing: '-0.03em' }}>
        FIGMENT<span style={{ color: ACCENT }}>AI</span>
      </span>

      <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
        {!isMobile && (
          <>
            {['Work', 'FAQ'].map((label) => (
              <a key={label}
                href={label === 'Work' ? '#creators' : '#faq'}
                className="font-display"
                style={{ color: 'rgba(255,255,255,0.44)', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none', padding: '0.5rem 0.9rem', transition: 'color 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.88)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.44)'}
              >{label}</a>
            ))}
          </>
        )}
        <MagneticBtn href="#book">Book a Call</MagneticBtn>
      </div>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroVisual({ small = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: small ? 0 : 30, y: small ? 24 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 1, delay: 0.45, ease: EASE }}
      style={{
        position: 'relative',
        paddingRight: small ? '1rem' : '2rem',
        paddingBottom: small ? '2rem' : '3rem',
        paddingLeft: small ? '1rem' : '0',
        maxWidth: small ? 280 : undefined,
        margin: small ? '0 auto' : undefined,
      }}
    >
      <motion.div
        animate={{ y: [0, -14, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          borderRadius: small ? '18px' : '22px',
          overflow: 'hidden',
          boxShadow: small
            ? '0 24px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 44px 100px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.09)',
        }}
      >
        <img src="/patricia-ig.png" alt="@airportpatricia" style={{ width: '100%', display: 'block', objectFit: 'cover' }} />
      </motion.div>

      {/* Bottom-left badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.1, ease: EASE }}
        style={{
          position: 'absolute',
          bottom: small ? '0.5rem' : '1rem',
          left: small ? '0' : '-1.5rem',
          background: 'rgba(9,8,26,0.92)',
          backdropFilter: 'blur(18px)',
          border: `1px solid ${ACCENT}30`,
          borderRadius: '16px',
          padding: small ? '0.7rem 1rem' : '0.9rem 1.2rem',
          boxShadow: `0 20px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.07), 0 0 20px ${ACCENT}15`,
        }}
      >
        <div className="font-display" style={{ color: ACCENT, fontWeight: 800, fontSize: small ? '1.5rem' : '1.9rem', letterSpacing: '-0.05em', lineHeight: 1 }}>96.5K</div>
        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', marginTop: '0.25rem' }}>followers — week 1</div>
      </motion.div>

      {/* Top-right badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4, ease: EASE }}
        style={{
          position: 'absolute',
          top: small ? '0.5rem' : '1.5rem',
          right: small ? '0' : '0',
          background: ACCENT,
          borderRadius: '100px',
          padding: small ? '0.4rem 0.85rem' : '0.5rem 1rem',
          boxShadow: `0 12px 30px rgba(0,0,0,0.5), 0 0 20px ${ACCENT}40`,
        }}
      >
        <div className="font-display" style={{ color: '#080808', fontWeight: 800, fontSize: small ? '0.68rem' : '0.76rem' }}>11 posts</div>
      </motion.div>
    </motion.div>
  )
}

function Hero() {
  const isMobile = useIsMobile()
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const textY   = useTransform(scrollY, [0, 600], [0, -70])
  const visualY = useTransform(scrollY, [0, 600], [0, -110])

  return (
    <section ref={ref} style={{
      minHeight: '100dvh',
      display: 'flex', alignItems: 'center',
      padding: isMobile ? '6rem 1.2rem 3rem' : '7rem 2.5rem 3.5rem',
      position: 'relative', zIndex: 1,
    }}>
      <div style={{
        maxWidth: '90rem', margin: '0 auto', width: '100%',
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '55fr 45fr',
        gap: isMobile ? '0' : '4rem',
        alignItems: 'center',
      }}>

        {/* Text column */}
        <motion.div style={{ y: textY }}>
          <div style={{ overflow: 'hidden', marginBottom: '1.6rem' }}>
            <motion.p
              initial={{ y: '110%' }} animate={{ y: '0%' }}
              transition={{ duration: 0.58, delay: 0.1, ease: EASE }}
              className="font-display"
              style={{ color: ACCENT, fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', margin: 0 }}
            >
              Done-for-you AI Influencers
            </motion.p>
          </div>

          <h1 className="font-display" style={{
            fontSize: 'clamp(2.6rem, 4.6vw, 5.6rem)',
            fontWeight: 800, lineHeight: 0.92,
            letterSpacing: '-0.04em', margin: '0 0 1.6rem',
          }}>
            <WordReveal text="Bring your brand" delay={0.18} />
            <WordReveal text="to life." delay={0.38} color={ACCENT} />
            <WordReveal text="No camera required." delay={0.58} />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, delay: 0.96, ease: EASE }}
            style={{ color: 'rgba(255,255,255,0.46)', fontSize: isMobile ? '1rem' : '1.1rem', maxWidth: '36rem', lineHeight: 1.75, margin: '0 0 2.5rem' }}
          >
            We build AI influencers that grow real audiences — owned media assets your brand controls, grows, and monetizes forever.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, delay: 1.1, ease: EASE }}
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: isMobile ? '2.5rem' : '2.8rem' }}
          >
            <MagneticBtn href="#book" large>Book a Call</MagneticBtn>
            <MagneticBtn href="#creators" dark>See our work</MagneticBtn>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 1.32, ease: EASE }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, auto)',
              gap: isMobile ? '0 1.6rem' : '0 3.5rem',
              width: 'fit-content',
              paddingTop: '2rem',
              borderTop: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {[
              { n: 96500, s: '+', label: 'Followers in week 1' },
              { n: 3,     s: '',  label: 'Active AI creators'  },
              { n: 10000, s: '+', label: 'App users driven'    },
            ].map(({ n, s, label }) => (
              <div key={label}>
                <div className="font-display" style={{ fontSize: 'clamp(1.7rem, 4.5vw, 3.2rem)', fontWeight: 800, color: ACCENT, letterSpacing: '-0.04em', lineHeight: 1 }}>
                  <Counter target={n} suffix={s} />
                </div>
                <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: isMobile ? '0.64rem' : '0.72rem', marginTop: '0.35rem' }}>{label}</div>
              </div>
            ))}
          </motion.div>

          {/* Mobile hero image — shown below stats */}
          {isMobile && (
            <div style={{ marginTop: '3.5rem' }}>
              <HeroVisual small />
            </div>
          )}
        </motion.div>

        {/* Desktop visual column */}
        {!isMobile && (
          <motion.div style={{ y: visualY }}>
            <HeroVisual />
          </motion.div>
        )}
      </div>
    </section>
  )
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

function Marquee() {
  const items = ['Custom Build', 'Clone + Deploy', 'Done For You', 'Real Audiences', 'AI Influencers', 'Owned Media', 'No Camera', 'Your Niche', 'Week 1 Results']
  const doubled = [...items, ...items]
  return (
    <div className="marquee-track" style={{ overflow: 'hidden', padding: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.018)' }}>
      <div className="animate-marquee" style={{ display: 'flex', whiteSpace: 'nowrap' }}>
        {doubled.map((item, i) => (
          <span key={i} className="font-display" style={{ fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 2.5rem', color: 'rgba(255,255,255,0.22)' }}>
            {item}<span style={{ color: ACCENT, marginLeft: '2.5rem' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Creator Cards ────────────────────────────────────────────────────────────

function IGIcon({ size = 13, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <path d="m16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

function CreatorCardPatricia({ c }) {
  return (
    <SpotlightCard color={c.color} style={{ background: '#0d0d0d', borderRadius: '22px', overflow: 'hidden', height: '100%', boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.09)` }}>
      <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative', flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <img src={c.img} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(13,13,13,0.98) 0%, rgba(13,13,13,0.18) 45%, transparent 75%)' }} />
          <span className="font-display" style={{
            position: 'absolute', top: '1.2rem', left: '1.2rem',
            background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)',
            border: `1px solid ${c.color}32`, color: c.color,
            fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '0.28rem 0.75rem', borderRadius: '100px',
          }}>{c.niche}</span>
        </div>
        <div style={{ padding: '1.8rem 2rem 2rem', position: 'relative', zIndex: 2 }}>
          <p className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem', margin: '0 0 0.3rem', letterSpacing: '-0.03em' }}>{c.name}</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.76rem', margin: '0 0 0.9rem' }}>{c.role}</p>
          <p style={{ color: 'rgba(255,255,255,0.46)', fontSize: '0.88rem', lineHeight: 1.65, margin: '0 0 1.5rem' }}>{c.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.4rem' }}>
            {[{ val: c.followers, lbl: 'Followers' }, { val: c.posts, lbl: 'Posts' }].map(({ val, lbl }) => (
              <div key={lbl} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '0.65rem 0.9rem', border: `1px solid ${c.color}18` }}>
                <div className="font-display" style={{ color: c.color, fontWeight: 800, fontSize: '1.2rem', letterSpacing: '-0.04em' }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.64rem', marginTop: '0.1rem' }}>{lbl}</div>
              </div>
            ))}
          </div>
          <motion.a href={c.url} target="_blank" rel="noopener noreferrer"
            className="font-display"
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: c.color, color: '#080808', borderRadius: '100px', padding: '0.68rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', width: 'fit-content' }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
            <IGIcon size={13} color="#080808" />
            {c.handle}
          </motion.a>
        </div>
      </div>
    </SpotlightCard>
  )
}

function CreatorCardGradient({ c }) {
  return (
    <SpotlightCard color={c.color} style={{ background: c.cardBg, borderRadius: '22px', overflow: 'hidden', height: '100%', position: 'relative', boxShadow: `inset 0 0 0 1px ${c.color}22` }}>
      {/* Glow layer */}
      <div style={{ position: 'absolute', inset: 0, background: c.cardGlow, pointerEvents: 'none' }} />

      {/* Giant decorative initials */}
      <div className="font-display" aria-hidden style={{
        position: 'absolute', bottom: '-8%', right: '-4%',
        fontSize: 'clamp(8rem, 18vw, 14rem)',
        fontWeight: 900, letterSpacing: '-0.1em', lineHeight: 1,
        color: `${c.color}09`, userSelect: 'none', pointerEvents: 'none',
      }}>
        {c.name.split(' ').map(n => n[0]).join('')}
      </div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', padding: '1.8rem 2rem 2rem' }}>
        {/* Top: niche badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'auto' }}>
          <span className="font-display" style={{
            background: `${c.color}18`, border: `1px solid ${c.color}32`,
            color: c.color, fontSize: '0.6rem', fontWeight: 700,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            padding: '0.28rem 0.75rem', borderRadius: '100px',
          }}>{c.niche}</span>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '2rem', margin: '2rem 0 1.5rem' }}>
          {[{ val: c.followers, lbl: 'Followers' }, { val: c.posts, lbl: 'Posts' }].map(({ val, lbl }) => (
            <div key={lbl}>
              <div className="font-display" style={{ color: c.color, fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.04em', lineHeight: 1 }}>{val}</div>
              <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.64rem', marginTop: '0.2rem' }}>{lbl}</div>
            </div>
          ))}
        </div>

        {/* Name + role + desc */}
        <p className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '1.3rem', margin: '0 0 0.3rem', letterSpacing: '-0.03em' }}>{c.name}</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.76rem', margin: '0 0 0.9rem' }}>{c.role}</p>
        <p style={{ color: 'rgba(255,255,255,0.46)', fontSize: '0.86rem', lineHeight: 1.65, margin: '0 0 1.4rem' }}>{c.desc}</p>

        <motion.a href={c.url} target="_blank" rel="noopener noreferrer"
          className="font-display"
          style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: c.color, color: '#080808', borderRadius: '100px', padding: '0.68rem 1.25rem', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', width: 'fit-content' }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
          <IGIcon size={13} color="#080808" />
          {c.handle}
        </motion.a>
      </div>
    </SpotlightCard>
  )
}

function Creators() {
  const isMobile = useIsMobile()
  return (
    <section id="creators" style={{ padding: isMobile ? '4.5rem 1.2rem' : '6rem 2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: isMobile ? '2.5rem' : '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <Label>Our creators</Label>
            <SlideUp delay={0.05}>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, margin: 0 }}>
                Three personas.<br />Three niches.<br /><span style={{ color: ACCENT }}>All built by us.</span>
              </h2>
            </SlideUp>
          </div>
          <Reveal delay={0.1}>
            <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.9rem', maxWidth: '26rem', lineHeight: 1.75 }}>
              Every creator is a fully designed AI persona — character, visuals, voice, content strategy. Click their handle to visit the real account.
            </p>
          </Reveal>
        </div>

        {isMobile ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {CREATORS.map((c, i) => (
              <Reveal key={c.handle} delay={i * 0.09}>
                {c.img ? <CreatorCardPatricia c={c} /> : <CreatorCardGradient c={c} />}
              </Reveal>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1rem', alignItems: 'stretch', height: '680px' }}>
            <Reveal delay={0}>
              <div style={{ height: '100%' }}>
                <CreatorCardPatricia c={CREATORS[0]} />
              </div>
            </Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Reveal delay={0.08} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}><CreatorCardGradient c={CREATORS[1]} /></div>
              </Reveal>
              <Reveal delay={0.16} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1 }}><CreatorCardGradient c={CREATORS[2]} /></div>
              </Reveal>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Stats Callout ────────────────────────────────────────────────────────────

function StatCallout() {
  const isMobile = useIsMobile()
  const stats = [
    { n: '96.5K', label: 'Followers',             sub: 'Patricia · week 1 · 11 posts'      },
    { n: '8,700', label: 'Avg followers per post', sub: 'Across active accounts'             },
    { n: '10K+',  label: 'App users driven',       sub: 'Direct conversions from content'   },
    { n: '100%',  label: 'Done for you',           sub: 'Scripts, visuals, video, posting'  },
  ]
  return (
    <section style={{ padding: isMobile ? '4rem 1.2rem' : '5.5rem 2.5rem', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)', overflow: 'hidden' }}>
      <div className="font-display" aria-hidden style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: 'clamp(7rem, 22vw, 22rem)', fontWeight: 900,
        color: `${ACCENT}08`, letterSpacing: '-0.07em',
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
      }}>
        96.5K
      </div>

      <div style={{ maxWidth: '90rem', margin: '0 auto', position: 'relative' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}>
          {stats.map(({ n, label, sub }, i) => (
            <Reveal key={label} delay={i * 0.08}>
              <div style={{
                padding: isMobile ? '2rem 1.2rem' : '2.5rem 2.5rem',
                borderRight: '1px solid rgba(255,255,255,0.08)',
                borderBottom: isMobile && i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div className="font-display" style={{ fontSize: 'clamp(2.4rem, 5vw, 4.2rem)', fontWeight: 800, color: ACCENT, letterSpacing: '-0.05em', lineHeight: 1 }}>{n}</div>
                <div className="font-display" style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginTop: '0.55rem' }}>{label}</div>
                <div style={{ color: 'rgba(255,255,255,0.32)', fontSize: '0.7rem', marginTop: '0.28rem', lineHeight: 1.5 }}>{sub}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Case Study ───────────────────────────────────────────────────────────────

function CaseStudy() {
  const isMobile = useIsMobile()
  return (
    <section style={{ padding: isMobile ? '4.5rem 1.2rem' : '6rem 2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <Label>Case Study — Patricia Simmons</Label>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '2rem', alignItems: 'end', marginBottom: '2.5rem' }}>
          <SlideUp delay={0.05}>
            <h2 className="font-display" style={{ fontSize: 'clamp(2.2rem, 5.5vw, 5rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 0.93, margin: 0 }}>
              Zero to 96,500<br /><span style={{ color: ACCENT }}>In seven days.</span>
            </h2>
          </SlideUp>
          <Reveal delay={0.1}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.95rem', lineHeight: 1.78, margin: 0 }}>
              Patricia Simmons didn't exist before we built her. Today she has one of the fastest-growing travel accounts on Instagram and has driven thousands of users to a travel platform — through content that doesn't feel like advertising.
            </p>
          </Reveal>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          <Reveal delay={0.06}>
            <SpotlightCard color={ACCENT} style={{ borderRadius: '20px', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.09)' }}>
              <motion.div whileHover={{ scale: 1.015 }} transition={{ duration: 0.38, ease: EASE }}>
                <img src="/patricia-ig.png" alt="@airportpatricia" style={{ width: '100%', display: 'block' }} />
              </motion.div>
              <div style={{ padding: '1.1rem 1.5rem', background: 'rgba(13,13,13,0.96)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '0.88rem', margin: '0 0 0.15rem' }}>@airportpatricia</p>
                <p style={{ color: 'rgba(255,255,255,0.36)', fontSize: '0.68rem', margin: 0 }}>Patricia Simmons · Senior Airport Security Agent</p>
              </div>
            </SpotlightCard>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Week 1',  title: 'Character launched',   body: 'Full persona designed — look, voice, backstory, security checkpoint world. First 4 posts published.',                         stat: '42,000 followers'  },
              { label: 'Week 2',  title: 'Growth compounds',     body: 'Hook-driven content about airport secrets, passenger behavior, security insights. Algorithm picks it up.',                   stat: '96,500 followers'  },
              { label: 'Ongoing', title: 'Platform conversions', body: "Patricia reveals her #1 travel hack in bio. ManyChat captures every comment into a signup automatically.",                  stat: '10,000+ users driven' },
            ].map(({ label, title, body, stat }, i) => (
              <Reveal key={label} delay={i * 0.09}>
                <SpotlightCard color={ACCENT} style={{ background: '#0d0d0d', borderRadius: '16px', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}>
                  <motion.div
                    style={{ padding: '1.5rem 1.7rem' }}
                    whileHover={{ background: 'rgba(255,255,255,0.015)' }}
                    transition={{ duration: 0.2 }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                      <span className="font-display" style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: ACCENT }}>{label}</span>
                      <span className="font-display" style={{ fontSize: '0.76rem', fontWeight: 700, color: '#fff' }}>{stat}</span>
                    </div>
                    <p className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '0.94rem', margin: '0 0 0.4rem' }}>{title}</p>
                    <p style={{ color: 'rgba(255,255,255,0.36)', fontSize: '0.82rem', lineHeight: 1.65, margin: 0 }}>{body}</p>
                  </motion.div>
                </SpotlightCard>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <motion.a
                href="https://www.instagram.com/airportpatricia/" target="_blank" rel="noopener noreferrer"
                className="btn-primary font-display"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: ACCENT, color: '#080808', borderRadius: '12px', padding: '1.05rem', fontWeight: 700, textDecoration: 'none', fontSize: '0.86rem' }}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={{ duration: 0.15 }}>
                <IGIcon size={14} color="#080808" />
                View @airportpatricia on Instagram
              </motion.a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── What We Do ───────────────────────────────────────────────────────────────

function WhatWeDo() {
  const [active, setActive] = useState('custom')
  const isMobile = useIsMobile()
  const tab = TABS.find(t => t.id === active)

  return (
    <section style={{ padding: isMobile ? '4.5rem 1.2rem' : '6rem 2.5rem', background: 'rgba(255,255,255,0.016)', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <Label>What we do</Label>
        <SlideUp delay={0.05}>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 2.5rem' }}>
            Three ways to work<br /><span style={{ color: ACCENT }}>with Figment AI.</span>
          </h2>
        </SlideUp>

        {/* Tab switcher */}
        <Reveal delay={0.1}>
          <div style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: '14px', padding: '0.32rem',
            marginBottom: '2.5rem', gap: '0.22rem',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)',
            width: isMobile ? '100%' : 'fit-content',
          }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActive(t.id)}
                className="font-display"
                style={{
                  flex: isMobile ? 1 : undefined,
                  border: 'none', cursor: 'pointer',
                  borderRadius: '10px',
                  padding: isMobile ? '0.65rem 0.5rem' : '0.65rem 1.4rem',
                  fontSize: isMobile ? '0.7rem' : '0.82rem',
                  fontWeight: 700,
                  background: active === t.id ? ACCENT : 'transparent',
                  color: active === t.id ? '#080808' : 'rgba(255,255,255,0.42)',
                  transition: 'background 0.22s, color 0.22s',
                  whiteSpace: 'nowrap',
                  boxShadow: active === t.id ? `0 0 18px ${ACCENT}30` : 'none',
                }}
              >{t.label}</button>
            ))}
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: EASE }}
            style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}
          >
            <SpotlightCard color={ACCENT} style={{ background: '#0d0d0d', borderRadius: '22px', padding: isMobile ? '1.9rem' : '2.6rem', boxShadow: `inset 0 0 0 1px ${ACCENT}24` }}>
              <h3 className="font-display" style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 1.2rem', whiteSpace: 'pre-line' }}>
                {tab.headline}
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.46)', fontSize: '0.95rem', lineHeight: 1.78, margin: '0 0 2rem' }}>{tab.body}</p>
              <div style={{ padding: '1rem 1.3rem', background: `${ACCENT}08`, borderRadius: '12px', border: `1px solid ${ACCENT}1A` }}>
                <p className="font-display" style={{ color: ACCENT, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', margin: '0 0 0.4rem' }}>Ideal for</p>
                <p style={{ color: 'rgba(255,255,255,0.46)', fontSize: '0.86rem', margin: 0, lineHeight: 1.65 }}>{tab.ideal}</p>
              </div>
            </SpotlightCard>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <p className="font-display" style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 0.5rem' }}>What's included</p>
              {tab.features.map((f, i) => (
                <motion.div key={f}
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.28, delay: i * 0.055, ease: EASE }}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#0d0d0d', borderRadius: '12px', padding: '1rem 1.3rem', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)' }}
                >
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: ACCENT, flexShrink: 0, boxShadow: `0 0 8px ${ACCENT}80` }} />
                  <span style={{ color: 'rgba(255,255,255,0.62)', fontSize: '0.86rem' }}>{f}</span>
                </motion.div>
              ))}
              <div style={{ marginTop: '0.6rem' }}>
                <MagneticBtn href="#book" large>Book a Call to Learn More</MagneticBtn>
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
  const isMobile = useIsMobile()
  const steps = [
    { n: '01', title: 'We design the character',    body: 'Name, look, voice, backstory, niche. A complete character brief built around where your brand lives — before a single frame is produced.' },
    { n: '02', title: 'We build the content engine', body: 'Scripts written, visuals generated, videos produced. You approve the direction once. We run the rest.' },
    { n: '03', title: 'We launch and grow',           body: 'Account setup, posting cadence, hook optimization, platform strategy. We manage everything and report growth weekly.' },
    { n: '04', title: 'You own the audience',         body: "The character, the account, the followers — yours. A media asset that compounds in value every week it's live." },
  ]
  return (
    <section style={{ padding: isMobile ? '4.5rem 1.2rem' : '6rem 2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <Label>How it works</Label>
        <SlideUp delay={0.05}>
          <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1, margin: '0 0 2.5rem' }}>
            Set it once.<br /><span style={{ color: ACCENT }}>We handle the rest.</span>
          </h2>
        </SlideUp>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: '1px',
          background: 'rgba(255,255,255,0.07)',
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.08)',
        }}>
          {steps.map(({ n, title, body }, i) => (
            <Reveal key={n} delay={i * 0.08}>
              <motion.div
                style={{
                  padding: isMobile ? '2.5rem 1.8rem' : '3rem',
                  background: '#09081A',
                  height: '100%',
                  borderRight: !isMobile && i % 2 === 0 ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  borderBottom: isMobile
                    ? (i < steps.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none')
                    : (i < 2 ? '1px solid rgba(255,255,255,0.07)' : 'none'),
                  position: 'relative', overflow: 'hidden',
                }}
                whileHover={{ background: 'rgba(255,255,255,0.022)' }}
                transition={{ duration: 0.22 }}
              >
                {/* Step number — decorative */}
                <div className="font-display" style={{
                  fontSize: '6rem', fontWeight: 800,
                  color: `${ACCENT}1C`, letterSpacing: '-0.05em',
                  lineHeight: 1, marginBottom: '1.5rem', userSelect: 'none',
                }}>{n}</div>

                {/* Accent dot */}
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, marginBottom: '1rem', boxShadow: `0 0 12px ${ACCENT}90` }} />

                <h3 className="font-display" style={{ color: '#fff', fontWeight: 700, fontSize: '1.08rem', margin: '0 0 0.65rem', letterSpacing: '-0.02em' }}>{title}</h3>
                <p style={{ color: 'rgba(255,255,255,0.36)', fontSize: '0.86rem', lineHeight: 1.75, margin: 0 }}>{body}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────

function FAQItem({ q, a, i }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={i * 0.045} y={28}>
      <motion.div
        style={{
          borderRadius: '14px', overflow: 'hidden',
          background: open ? '#141414' : '#0d0d0d',
          boxShadow: open ? `inset 0 0 0 1px ${ACCENT}30` : 'inset 0 0 0 1px rgba(255,255,255,0.08)',
          cursor: 'pointer',
        }}
        whileHover={!open ? { boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.16)' } : {}}
        transition={{ duration: 0.18 }}
        onClick={() => setOpen(!open)}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.35rem 1.6rem', gap: '1rem' }}>
          <p className="font-display" style={{ color: '#fff', fontWeight: 600, fontSize: '0.93rem', margin: 0, lineHeight: 1.48 }}>{q}</p>
          <motion.div
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            style={{
              width: 26, height: 26, borderRadius: '50%',
              background: open ? ACCENT : 'rgba(255,255,255,0.09)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              boxShadow: open ? `0 0 12px ${ACCENT}50` : 'none',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <line x1="5" y1="0" x2="5" y2="10" stroke={open ? '#080808' : '#fff'} strokeWidth="1.8" />
              <line x1="0" y1="5" x2="10" y2="5" stroke={open ? '#080808' : '#fff'} strokeWidth="1.8" />
            </svg>
          </motion.div>
        </div>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.32, ease: EASE }} style={{ overflow: 'hidden' }}
            >
              <p style={{ color: 'rgba(255,255,255,0.46)', fontSize: '0.88rem', lineHeight: 1.8, margin: 0, padding: '0 1.6rem 1.5rem' }}>{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Reveal>
  )
}

function FAQ() {
  const isMobile = useIsMobile()
  return (
    <section id="faq" style={{ padding: isMobile ? '4.5rem 1.2rem' : '6rem 2.5rem', background: 'rgba(255,255,255,0.016)', position: 'relative', zIndex: 1, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr', gap: isMobile ? '3rem' : '6rem', alignItems: 'start' }}>
          <div style={{ position: isMobile ? 'static' : 'sticky', top: '6rem' }}>
            <Label>FAQ</Label>
            <SlideUp delay={0.05}>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem, 3.8vw, 3.2rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.05, margin: '0 0 1.2rem' }}>
                Questions<br /><span style={{ color: ACCENT }}>answered.</span>
              </h2>
            </SlideUp>
            <Reveal delay={0.12}>
              <p style={{ color: 'rgba(255,255,255,0.36)', fontSize: '0.88rem', lineHeight: 1.75, margin: '0 0 2rem' }}>
                Still curious? Book a call and we'll answer anything specific to your brand and niche.
              </p>
              <MagneticBtn href="#book">Book a Call</MagneticBtn>
            </Reveal>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {FAQS.map((f, i) => <FAQItem key={i} {...f} i={i} />)}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Book a Call ──────────────────────────────────────────────────────────────

function BookCall() {
  const isMobile = useIsMobile()
  return (
    <section id="book" style={{ padding: isMobile ? '4.5rem 1.2rem' : '6rem 2.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
        <SpotlightCard color={ACCENT} style={{
          borderRadius: '28px',
          padding: isMobile ? '3.5rem 1.8rem' : '6rem 3rem',
          textAlign: 'center',
          position: 'relative', overflow: 'hidden',
          background: '#0d0d0d',
          boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.09), 0 0 80px rgba(109,40,217,0.12)`,
        }}>
          {/* Top glow bloom */}
          <div className="cta-glow" style={{
            position: 'absolute', top: '-35%', left: '50%', transform: 'translateX(-50%)',
            width: '75%', maxWidth: 700, height: 420,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${ACCENT}0C 0%, transparent 65%)`,
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }} />
          {/* Bottom purple glow */}
          <div style={{
            position: 'absolute', bottom: '-25%', left: '50%', transform: 'translateX(-50%)',
            width: '60%', maxWidth: 600, height: 350,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(109,40,217,0.14) 0%, transparent 65%)',
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }} />

          <div style={{ position: 'relative' }}>
            <Label>Ready to build yours?</Label>
            <SlideUp delay={0.05}>
              <h2 className="font-display" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 5.2rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', lineHeight: 0.93, margin: '0 0 1.3rem' }}>
                Let's build your<br /><span style={{ color: ACCENT }}>AI influencer.</span>
              </h2>
            </SlideUp>
            <Reveal delay={0.14}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: isMobile ? '0.95rem' : '1.05rem', maxWidth: '34rem', margin: '0 auto 2.8rem', lineHeight: 1.78 }}>
                Book a call and we'll walk through which model fits your brand, what the character could look like, and what growth looks like in your niche.
              </p>
            </Reveal>
            <Reveal delay={0.22}>
              <MagneticBtn href="#" large>Book a Call</MagneticBtn>
            </Reveal>
          </div>
        </SpotlightCard>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '2.6rem 1.5rem', position: 'relative', zIndex: 1 }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <span className="font-display" style={{ fontWeight: 800, fontSize: '1rem', color: '#fff', letterSpacing: '-0.02em' }}>
          FIGMENT<span style={{ color: ACCENT }}>AI</span>
        </span>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {CREATORS.map(c => (
            <motion.a key={c.handle} href={c.url} target="_blank" rel="noopener noreferrer"
              style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.75rem', textDecoration: 'none' }}
              whileHover={{ color: c.color }} transition={{ duration: 0.15 }}>
              {c.handle}
            </motion.a>
          ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.7rem', margin: 0 }}>© 2026 Figment AI. All rights reserved.</p>
      </div>
    </footer>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────

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
