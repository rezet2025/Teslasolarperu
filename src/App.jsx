import { useState, useEffect, useRef } from “react”;

const COLORS = {
sun: “#F97316”,
sunLight: “#FDBA74”,
sunDark: “#C2410C”,
navy: “#1C1917”,
navyLight: “#292524”,
sky: “#14B8A6”,
skyLight: “#5EEAD4”,
white: “#FFFFFF”,
gray100: “#FAFAF9”,
gray200: “#E7E5E4”,
gray400: “#A8A29E”,
gray600: “#57534E”,
gray800: “#292524”,
green: “#22C55E”,
};

function useInView(threshold = 0.15) {
const ref = useRef(null);
const [visible, setVisible] = useState(false);
useEffect(() => {
const el = ref.current;
if (!el) return;
const obs = new IntersectionObserver(
([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
{ threshold }
);
obs.observe(el);
return () => obs.disconnect();
}, [threshold]);
return [ref, visible];
}

function useCounter(target, duration = 2000) {
const [count, setCount] = useState(0);
const [ref, visible] = useInView();
const parsed = parseInt(target.replace(/[^0-9]/g, “”));
useEffect(() => {
if (!visible || isNaN(parsed)) return;
let start = 0;
const step = Math.ceil(parsed / (duration / 16));
const timer = setInterval(() => {
start += step;
if (start >= parsed) { setCount(parsed); clearInterval(timer); }
else setCount(start);
}, 16);
return () => clearInterval(timer);
}, [visible, parsed, duration]);
const suffix = target.replace(/[0-9]/g, “”);
return [ref, isNaN(parsed) ? target : count + suffix];
}

function AnimatedStat({ num, label, color }) {
const [ref, animated] = useCounter(num);
return (
<div ref={ref} style={{ padding: “28px 20px”, textAlign: “center”, background: “rgba(255,255,255,0.02)” }}>
<div style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: 32, color }}>{animated}</div>
<div style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.5)”, fontSize: 14, marginTop: 4 }}>{label}</div>
</div>
);
}

function FadeIn({ children, delay = 0, direction = “up”, className = “” }) {
const [ref, visible] = useInView();
const transforms = { up: “translateY(40px)”, down: “translateY(-40px)”, left: “translateX(40px)”, right: “translateX(-40px)”, none: “none” };
return (
<div
ref={ref}
className={className}
style={{
opacity: visible ? 1 : 0,
transform: visible ? “none” : transforms[direction],
transition: `opacity 0.7s cubic-bezier(.16,1,.3,1) ${delay}s, transform 0.7s cubic-bezier(.16,1,.3,1) ${delay}s`,
}}
>
{children}
</div>
);
}

/* ─── Icons as inline SVGs ─── */
const SunIcon = () => (
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.sun} strokeWidth="2" strokeLinecap="round">
<circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
<line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
<line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
<line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
</svg>
);
const BoltIcon = () => (
<svg width="32" height="32" viewBox="0 0 24 24" fill={COLORS.sun} stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);
const ShieldIcon = () => (
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.sky} strokeWidth="2" strokeLinecap="round">
<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
</svg>
);
const WrenchIcon = () => (
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth="2" strokeLinecap="round">
<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
</svg>
);
const MonitorIcon = () => (
<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.sunDark} strokeWidth="2" strokeLinecap="round">
<rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
</svg>
);
const PhoneIcon = () => (
<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
</svg>
);
const ChevronDown = () => (
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9" /></svg>
);
const CheckCircle = () => (
<svg width="22" height="22" viewBox="0 0 24 24" fill={COLORS.green} stroke="#fff" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);
const ArrowRight = () => (
<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);

/* ─── NAVBAR ─── */
function Navbar() {
const [scrolled, setScrolled] = useState(false);
const [menuOpen, setMenuOpen] = useState(false);
useEffect(() => {
const h = () => setScrolled(window.scrollY > 40);
window.addEventListener(“scroll”, h);
return () => window.removeEventListener(“scroll”, h);
}, []);
const links = [“Inicio”, “Servicios”, “Kits”, “Nosotros”, “FAQ”, “Contacto”];
return (
<nav style={{
position: “fixed”, top: 0, left: 0, right: 0, zIndex: 100,
background: scrolled ? “rgba(15,23,42,0.95)” : “transparent”,
backdropFilter: scrolled ? “blur(12px)” : “none”,
borderBottom: scrolled ? `1px solid rgba(255,255,255,0.08)` : “none”,
transition: “all 0.4s ease”,
}}>
<div style={{ maxWidth: 1200, margin: “0 auto”, padding: “0 24px”, display: “flex”, alignItems: “center”, justifyContent: “space-between”, height: 72 }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 8 }}>
<div style={{ width: 36, height: 36, borderRadius: “50%”, background: `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunDark})`, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<svg width="20" height="20" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
</div>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, fontSize: 22, color: “#fff”, letterSpacing: “-0.5px” }}>
Tesla<span style={{ color: COLORS.sun }}>Solar</span>
</span>
</div>
{/* Desktop links */}
<div style={{ display: “flex”, gap: 28, alignItems: “center” }} className=“desktop-nav”>
{links.map(l => (
<a key={l} href={`#${l.toLowerCase()}`} style={{ color: “rgba(255,255,255,0.8)”, textDecoration: “none”, fontSize: 14, fontWeight: 500, fontFamily: “‘Outfit’, sans-serif”, transition: “color 0.2s” }}
onMouseEnter={e => e.target.style.color = COLORS.sun}
onMouseLeave={e => e.target.style.color = “rgba(255,255,255,0.8)”}
>{l}</a>
))}
<a href=”#contacto” style={{
background: `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunDark})`,
color: “#fff”, padding: “10px 24px”, borderRadius: 50, textDecoration: “none”,
fontWeight: 600, fontSize: 14, fontFamily: “‘Outfit’, sans-serif”,
boxShadow: `0 4px 20px ${COLORS.sun}40`,
}}>Cotiza Gratis</a>
</div>
{/* Hamburger */}
<button onClick={() => setMenuOpen(!menuOpen)} style={{ display: “none”, background: “none”, border: “none”, color: “#fff”, cursor: “pointer”, padding: 8 }} className=“hamburger”>
<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
{menuOpen ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></> : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>}
</svg>
</button>
</div>
{/* Mobile menu */}
{menuOpen && (
<div style={{ background: “rgba(15,23,42,0.98)”, padding: “20px 24px”, display: “flex”, flexDirection: “column”, gap: 16 }} className=“mobile-menu”>
{links.map(l => (
<a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMenuOpen(false)} style={{ color: “#fff”, textDecoration: “none”, fontSize: 18, fontFamily: “‘Outfit’, sans-serif” }}>{l}</a>
))}
</div>
)}
</nav>
);
}

/* ─── HERO ─── */
function Hero() {
return (
<section id=“inicio” style={{
minHeight: “100vh”, position: “relative”, overflow: “hidden”,
background: `linear-gradient(135deg, ${COLORS.navy} 0%, ${COLORS.navyLight} 50%, #302720 100%)`,
display: “flex”, alignItems: “center”,
}}>
{/* Decorative circles */}
<div style={{ position: “absolute”, top: “-20%”, right: “-10%”, width: 600, height: 600, borderRadius: “50%”, background: `radial-gradient(circle, ${COLORS.sun}15, transparent 70%)` }} />
<div style={{ position: “absolute”, bottom: “-10%”, left: “-5%”, width: 400, height: 400, borderRadius: “50%”, background: `radial-gradient(circle, ${COLORS.sky}10, transparent 70%)` }} />
{/* Grid pattern */}
<div style={{
position: “absolute”, inset: 0, opacity: 0.04,
backgroundImage: `linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)`,
backgroundSize: “60px 60px”,
}} />

```
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: "120px 24px 80px", position: "relative", zIndex: 2, width: "100%" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "center" }} className="hero-grid">
      <div>
        <FadeIn delay={0}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(245,158,11,0.12)", borderRadius: 50, padding: "8px 18px", marginBottom: 24 }}>
            <SunIcon />
            <span style={{ color: COLORS.sun, fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: "0.5px", textTransform: "uppercase" }}>Energía Solar Profesional</span>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <h1 style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(36px, 5vw, 60px)",
            lineHeight: 1.08, color: "#fff", margin: "0 0 24px",
          }}>
            Transforma tu Hogar con{" "}
            <span style={{ background: `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunLight})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Energía Solar
            </span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.2}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 18, lineHeight: 1.7, margin: "0 0 36px", maxWidth: 500, fontFamily: "'DM Sans', sans-serif" }}>
            Vendemos e instalamos kits solares para hogares y empresas. Ahorra hasta un 95% en tu recibo de luz con tecnología de primera calidad y garantía total.
          </p>
        </FadeIn>
        <FadeIn delay={0.3}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="#contacto" style={{
              background: `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunDark})`, color: "#fff",
              padding: "16px 36px", borderRadius: 50, textDecoration: "none", fontWeight: 700,
              fontSize: 16, fontFamily: "'Outfit', sans-serif",
              boxShadow: `0 8px 30px ${COLORS.sun}50`,
              display: "inline-flex", alignItems: "center", gap: 8,
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = `0 12px 40px ${COLORS.sun}60`; }}
              onMouseLeave={e => { e.target.style.transform = "none"; e.target.style.boxShadow = `0 8px 30px ${COLORS.sun}50`; }}
            >
              Cotiza Gratis <ArrowRight />
            </a>
            <a href="#servicios" style={{
              border: "2px solid rgba(255,255,255,0.2)", color: "#fff",
              padding: "16px 36px", borderRadius: 50, textDecoration: "none", fontWeight: 600,
              fontSize: 16, fontFamily: "'Outfit', sans-serif",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.target.style.borderColor = COLORS.sun}
              onMouseLeave={e => e.target.style.borderColor = "rgba(255,255,255,0.2)"}
            >
              Ver Servicios
            </a>
          </div>
        </FadeIn>
      </div>
      {/* Hero visual — Solar Process Flow */}
      <FadeIn delay={0.2} direction="left" className="hero-visual">
        <div style={{ display: "flex", flexDirection: "column", gap: 0, alignItems: "center" }}>
          {/* Step 1: Sun */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            <div style={{
              width: 72, height: 72, borderRadius: "50%", flexShrink: 0,
              background: `radial-gradient(circle, ${COLORS.sunLight}, ${COLORS.sun})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 40px ${COLORS.sun}50`,
              animation: "pulse 3s ease-in-out infinite",
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="#fff" stroke="none">
                <circle cx="12" cy="12" r="5" />
                <g stroke="#fff" strokeWidth="2" fill="none"><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></g>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: COLORS.sunLight }}>El Sol</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>Los rayos solares impactan las celdas fotovoltaicas del panel</div>
            </div>
          </div>

          {/* Arrow with energy particles */}
          <div style={{ paddingLeft: 34, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 4, height: 36, borderRadius: 4, background: `linear-gradient(180deg, ${COLORS.sun}80, ${COLORS.sky}60)`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 4, height: 10, background: COLORS.sunLight, borderRadius: 4, animation: "flowDown 1.2s linear infinite" }} />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.sun, fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Fotones ↓</span>
          </div>

          {/* Step 2: Panel Solar → DC */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
              background: `linear-gradient(135deg, #2a3d38, #1a2b26)`,
              border: `2px solid ${COLORS.sky}40`,
              display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 2, padding: 8,
              boxShadow: `0 0 30px ${COLORS.sky}20`,
            }}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} style={{ borderRadius: 2, background: `linear-gradient(135deg, ${COLORS.sky}30, ${COLORS.skyLight}20)`, border: `1px solid rgba(20,184,166,0.3)`, animation: `panelGlow 3s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: COLORS.skyLight }}>Panel Solar</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>Genera <span style={{ color: COLORS.skyLight, fontWeight: 600 }}>corriente continua (DC)</span> a partir de la luz solar</div>
            </div>
          </div>

          {/* Arrow DC */}
          <div style={{ paddingLeft: 34, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 4, height: 36, borderRadius: 4, background: `linear-gradient(180deg, ${COLORS.sky}60, ${COLORS.green}60)`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 4, height: 10, background: COLORS.skyLight, borderRadius: 4, animation: "flowDown 1.2s linear 0.3s infinite" }} />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.skyLight, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>DC ⎓ ↓</span>
          </div>

          {/* Step 3: Inversor → AC */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
              background: `linear-gradient(135deg, ${COLORS.green}20, ${COLORS.green}10)`,
              border: `2px solid ${COLORS.green}50`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 30px ${COLORS.green}15`,
            }}>
              <svg width="36" height="36" viewBox="0 0 40 40" fill="none">
                <rect x="4" y="8" width="32" height="24" rx="4" stroke={COLORS.green} strokeWidth="2.5" />
                <path d="M14 20 Q17 13, 20 20 Q23 27, 26 20" stroke={COLORS.green} strokeWidth="2.5" fill="none" strokeLinecap="round">
                  <animate attributeName="d" values="M14 20 Q17 13, 20 20 Q23 27, 26 20;M14 20 Q17 27, 20 20 Q23 13, 26 20;M14 20 Q17 13, 20 20 Q23 27, 26 20" dur="2s" repeatCount="indefinite" />
                </path>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: COLORS.green }}>Inversor</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>Convierte la DC en <span style={{ color: COLORS.green, fontWeight: 600 }}>corriente alterna (AC)</span>, la que usan tus equipos</div>
            </div>
          </div>

          {/* Arrow AC */}
          <div style={{ paddingLeft: 34, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 4, height: 36, borderRadius: 4, background: `linear-gradient(180deg, ${COLORS.green}60, ${COLORS.sunLight}60)`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 4, height: 10, background: COLORS.green, borderRadius: 4, animation: "flowDown 1.2s linear 0.6s infinite" }} />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", color: COLORS.green, fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>AC ~ ↓</span>
          </div>

          {/* Step 4: Tablero eléctrico */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
              background: `linear-gradient(135deg, ${COLORS.sunDark}20, ${COLORS.sun}10)`,
              border: `2px solid ${COLORS.sunDark}50`,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 0 30px ${COLORS.sunDark}15`,
            }}>
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                <rect x="6" y="4" width="28" height="32" rx="3" stroke={COLORS.sunDark} strokeWidth="2.5" />
                <rect x="12" y="10" width="7" height="5" rx="1" fill={COLORS.sun} opacity="0.6" />
                <rect x="21" y="10" width="7" height="5" rx="1" fill={COLORS.sun} opacity="0.6" />
                <rect x="12" y="18" width="7" height="5" rx="1" fill={COLORS.green} opacity="0.5" />
                <rect x="21" y="18" width="7" height="5" rx="1" fill={COLORS.sky} opacity="0.4" />
                <circle cx="20" cy="30" r="2.5" fill={COLORS.green}>
                  <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: COLORS.sunDark }}>Tablero Eléctrico</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>Distribuye la energía a toda tu casa o negocio</div>
            </div>
          </div>

          {/* Arrow */}
          <div style={{ paddingLeft: 34, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 4, height: 36, borderRadius: 4, background: `linear-gradient(180deg, ${COLORS.sunDark}60, rgba(255,255,255,0.2))`, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", width: 4, height: 10, background: COLORS.sunLight, borderRadius: 4, animation: "flowDown 1.2s linear 0.9s infinite" }} />
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.4)", fontSize: 11, fontWeight: 600, letterSpacing: 1 }}>⚡ ↓</span>
          </div>

          {/* Step 5: Tu Hogar / Red eléctrica */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
            <div style={{
              width: 72, height: 72, borderRadius: 16, flexShrink: 0,
              background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`,
              border: `2px solid rgba(255,255,255,0.15)`,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <svg width="34" height="34" viewBox="0 0 40 40" fill="none">
                <path d="M8 36V18L20 6l12 12v18z" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5" strokeLinejoin="round" />
                <rect x="16" y="24" width="8" height="12" rx="1" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />
                <circle cx="22" cy="30" r="1" fill={COLORS.sunLight} />
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 17, color: "#fff" }}>Tu Hogar</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.5 }}>Usas energía limpia y el excedente puede inyectarse a la <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>red eléctrica</span></div>
            </div>
          </div>
        </div>
      </FadeIn>
    </div>

    {/* Stats bar */}
    <FadeIn delay={0.5}>
      <div style={{
        marginTop: 80, display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1,
        background: "rgba(255,255,255,0.05)", borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
      }} className="stats-grid">
        {[
          { num: "280+", label: "Instalaciones", color: COLORS.sun },
          { num: "4+", label: "Años de experiencia", color: COLORS.sky },
          { num: "95%", label: "Ahorro en luz", color: COLORS.green },
          { num: "24/7", label: "Soporte técnico", color: COLORS.sunLight },
        ].map((s, i) => (
          <AnimatedStat key={i} num={s.num} label={s.label} color={s.color} />
        ))}
      </div>
    </FadeIn>
  </div>

  {/* Scroll indicator */}
  <div style={{ position: "absolute", bottom: 30, left: "50%", transform: "translateX(-50%)", animation: "bounce 2s infinite" }}>
    <ChevronDown />
  </div>
</section>
```

);
}

/* ─── SERVICES ─── */
function Services() {
const services = [
{ icon: <SunIcon />, title: “Instalación Solar”, desc: “Diseño y montaje de sistemas fotovoltaicos On-Grid, Off-Grid e Híbridos para hogares y empresas.”, color: COLORS.sun },
{ icon: <WrenchIcon />, title: “Mantenimiento”, desc: “Planes preventivos y correctivos para asegurar el máximo rendimiento de tu sistema solar.”, color: COLORS.green },
{ icon: <MonitorIcon />, title: “Monitoreo 24/7”, desc: “Supervisión remota en tiempo real de la producción y consumo de energía de tu sistema.”, color: COLORS.sunDark },
{ icon: <ShieldIcon />, title: “Consultoría Energética”, desc: “Auditorías, estudios de factibilidad y diseño personalizado de proyectos solares.”, color: COLORS.sky },
];
return (
<section id=“servicios” style={{ padding: “100px 24px”, background: COLORS.white }}>
<div style={{ maxWidth: 1200, margin: “0 auto” }}>
<FadeIn>
<div style={{ textAlign: “center”, marginBottom: 60 }}>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, color: COLORS.sun, fontWeight: 600, fontSize: 14, textTransform: “uppercase”, letterSpacing: 2 }}>Nuestros Servicios</span>
<h2 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: “clamp(28px,4vw,42px)”, color: COLORS.navy, margin: “12px 0 0” }}>
Soluciones integrales en energía solar
</h2>
</div>
</FadeIn>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fit, minmax(260px, 1fr))”, gap: 24 }}>
{services.map((s, i) => (
<FadeIn key={i} delay={i * 0.1}>
<div style={{
padding: 32, borderRadius: 20,
background: COLORS.gray100, border: `1px solid ${COLORS.gray200}`,
transition: “transform 0.3s, box-shadow 0.3s”, cursor: “default”,
}}
onMouseEnter={e => { e.currentTarget.style.transform = “translateY(-6px)”; e.currentTarget.style.boxShadow = `0 20px 50px rgba(0,0,0,0.08)`; }}
onMouseLeave={e => { e.currentTarget.style.transform = “none”; e.currentTarget.style.boxShadow = “none”; }}
>
<div style={{ width: 56, height: 56, borderRadius: 14, background: `${s.color}15`, display: “flex”, alignItems: “center”, justifyContent: “center”, marginBottom: 20 }}>
{s.icon}
</div>
<h3 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, fontSize: 20, color: COLORS.navy, margin: “0 0 10px” }}>{s.title}</h3>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: COLORS.gray600, lineHeight: 1.6, margin: 0, fontSize: 15 }}>{s.desc}</p>
</div>
</FadeIn>
))}
</div>
</div>
</section>
);
}

/* ─── KITS ─── */
function Kits() {
const kits = [
{ name: “Kit Básico 300W”, power: “300W · 12V · Aislado”, panels: “1 Panel Solar 300W Victron”, inverter: “Inversor Victron Phoenix 375VA”, price: “S/. 7,722”, features: [“Iluminación, celulares, radio, TV”, “Batería GEL 12V 100Ah + MPPT”, “Produce 1.2 - 2.8 kWh/día”], popular: false },
{ name: “Kit Red 6kW”, power: “6kW · Conectado a Red”, panels: “10 Paneles Solares Tensite”, inverter: “Inversor de Red Tensite 6kW”, price: “S/. 9,480”, features: [“Vivienda completa, ahorro en luz”, “Sin baterías, inyecta a la red”, “Produce hasta 23 kWh/día”], popular: true },
{ name: “Kit Aislado 3000W”, power: “3000W · 24V · Aislado”, panels: “2 Paneles Solares + Baterías GEL”, inverter: “Inversor Must Solar 3000W MPPT”, price: “S/. 19,840”, features: [“Refrigerador, TV, iluminación”, “3.6 kWh almacenamiento en baterías”, “Produce 3.7 - 8.8 kWh/día”], popular: false },
];
return (
<section id=“kits” style={{ padding: “100px 24px”, background: `linear-gradient(180deg, ${COLORS.gray100}, ${COLORS.white})` }}>
<div style={{ maxWidth: 1200, margin: “0 auto” }}>
<FadeIn>
<div style={{ textAlign: “center”, marginBottom: 60 }}>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, color: COLORS.sun, fontWeight: 600, fontSize: 14, textTransform: “uppercase”, letterSpacing: 2 }}>Nuestros Kits</span>
<h2 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: “clamp(28px,4vw,42px)”, color: COLORS.navy, margin: “12px 0 0” }}>
Kits solares para cada necesidad
</h2>
</div>
</FadeIn>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fit, minmax(300px, 1fr))”, gap: 28 }}>
{kits.map((k, i) => (
<FadeIn key={i} delay={i * 0.12}>
<div style={{
borderRadius: 24, overflow: “hidden”, position: “relative”,
background: k.popular ? `linear-gradient(135deg, ${COLORS.navy}, ${COLORS.navyLight})` : “#fff”,
border: k.popular ? “none” : `1px solid ${COLORS.gray200}`,
boxShadow: k.popular ? `0 30px 60px rgba(15,23,42,0.25)` : `0 4px 20px rgba(0,0,0,0.04)`,
transition: “transform 0.3s”,
}}
onMouseEnter={e => e.currentTarget.style.transform = “translateY(-8px)”}
onMouseLeave={e => e.currentTarget.style.transform = “none”}
>
{k.popular && (
<div style={{
position: “absolute”, top: 20, right: 20, background: COLORS.sun, color: “#fff”,
padding: “6px 16px”, borderRadius: 50, fontFamily: “‘Outfit’, sans-serif”,
fontWeight: 700, fontSize: 12, textTransform: “uppercase”, letterSpacing: 1,
}}>Más Popular</div>
)}
<div style={{ padding: 36 }}>
<div style={{ fontFamily: “‘DM Sans’, sans-serif”, color: k.popular ? “rgba(255,255,255,0.5)” : COLORS.gray400, fontSize: 13, fontWeight: 600, textTransform: “uppercase”, letterSpacing: 1 }}>{k.power}</div>
<h3 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: 26, color: k.popular ? “#fff” : COLORS.navy, margin: “8px 0 4px” }}>{k.name}</h3>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: k.popular ? “rgba(255,255,255,0.6)” : COLORS.gray600, fontSize: 14, margin: “0 0 4px” }}>{k.panels}</p>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: k.popular ? “rgba(255,255,255,0.6)” : COLORS.gray600, fontSize: 14, margin: “0 0 20px” }}>{k.inverter}</p>
<div style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: 32, color: k.popular ? COLORS.sun : COLORS.navy, marginBottom: 24 }}>{k.price}</div>
<div style={{ display: “flex”, flexDirection: “column”, gap: 12, marginBottom: 28 }}>
{k.features.map((f, j) => (
<div key={j} style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<CheckCircle />
<span style={{ fontFamily: “‘DM Sans’, sans-serif”, color: k.popular ? “rgba(255,255,255,0.8)” : COLORS.gray600, fontSize: 15 }}>{f}</span>
</div>
))}
</div>
<a href=”#contacto” style={{
display: “block”, textAlign: “center”, padding: “14px 0”, borderRadius: 50,
fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, fontSize: 15,
textDecoration: “none”, transition: “transform 0.2s”,
background: k.popular ? `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunDark})` : “transparent”,
color: k.popular ? “#fff” : COLORS.navy,
border: k.popular ? “none” : `2px solid ${COLORS.navy}`,
boxShadow: k.popular ? `0 8px 24px ${COLORS.sun}40` : “none”,
}}>Solicitar Cotización</a>
</div>
</div>
</FadeIn>
))}
</div>
</div>
</section>
);
}

/* ─── WHY US ─── */
function WhyUs() {
const reasons = [
{ icon: <ShieldIcon />, title: “Garantía Total”, desc: “Hasta 25 años de garantía en paneles y soporte técnico continuo post-instalación.” },
{ icon: <BoltIcon />, title: “Componentes Premium”, desc: “Trabajamos con marcas líderes: Trinasolar, Huawei, Fronius, Victron Energy.” },
{ icon: <WrenchIcon />, title: “Instalación Profesional”, desc: “Equipo técnico certificado con cientos de instalaciones exitosas.” },
{ icon: <MonitorIcon />, title: “Monitoreo Inteligente”, desc: “App para ver la producción y ahorro de tu sistema en tiempo real.” },
];
return (
<section id=“nosotros” style={{ padding: “100px 24px”, background: `linear-gradient(135deg, ${COLORS.navy} 0%, #302720 100%)`, position: “relative”, overflow: “hidden” }}>
<div style={{ position: “absolute”, top: “50%”, left: “50%”, transform: “translate(-50%,-50%)”, width: 800, height: 800, borderRadius: “50%”, background: `radial-gradient(circle, ${COLORS.sun}08, transparent 70%)` }} />
<div style={{ maxWidth: 1200, margin: “0 auto”, position: “relative”, zIndex: 2 }}>
<FadeIn>
<div style={{ textAlign: “center”, marginBottom: 60 }}>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, color: COLORS.sun, fontWeight: 600, fontSize: 14, textTransform: “uppercase”, letterSpacing: 2 }}>¿Por qué elegirnos?</span>
<h2 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: “clamp(28px,4vw,42px)”, color: “#fff”, margin: “12px 0 0” }}>
Experiencia y calidad garantizada
</h2>
</div>
</FadeIn>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fit, minmax(260px, 1fr))”, gap: 24 }}>
{reasons.map((r, i) => (
<FadeIn key={i} delay={i * 0.1}>
<div style={{
padding: 32, borderRadius: 20, background: “rgba(255,255,255,0.04)”,
border: “1px solid rgba(255,255,255,0.08)”, backdropFilter: “blur(4px)”,
transition: “background 0.3s, border-color 0.3s”,
}}
onMouseEnter={e => { e.currentTarget.style.background = “rgba(255,255,255,0.08)”; e.currentTarget.style.borderColor = `${COLORS.sun}40`; }}
onMouseLeave={e => { e.currentTarget.style.background = “rgba(255,255,255,0.04)”; e.currentTarget.style.borderColor = “rgba(255,255,255,0.08)”; }}
>
<div style={{ marginBottom: 16 }}>{r.icon}</div>
<h3 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, fontSize: 20, color: “#fff”, margin: “0 0 10px” }}>{r.title}</h3>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.6)”, lineHeight: 1.6, margin: 0, fontSize: 15 }}>{r.desc}</p>
</div>
</FadeIn>
))}
</div>
</div>
</section>
);
}

/* ─── PROCESS ─── */
function Process() {
const steps = [
{ num: “01”, title: “Consulta Gratuita”, desc: “Evaluamos tu consumo y necesidades energéticas sin costo.” },
{ num: “02”, title: “Diseño Personalizado”, desc: “Creamos un proyecto a medida con la mejor relación costo-beneficio.” },
{ num: “03”, title: “Instalación Profesional”, desc: “Nuestro equipo certificado realiza la instalación completa.” },
{ num: “04”, title: “Monitoreo y Soporte”, desc: “Seguimiento continuo del rendimiento y soporte técnico permanente.” },
];
return (
<section style={{ padding: “100px 24px”, background: COLORS.white }}>
<div style={{ maxWidth: 1200, margin: “0 auto” }}>
<FadeIn>
<div style={{ textAlign: “center”, marginBottom: 60 }}>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, color: COLORS.sun, fontWeight: 600, fontSize: 14, textTransform: “uppercase”, letterSpacing: 2 }}>Proceso</span>
<h2 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: “clamp(28px,4vw,42px)”, color: COLORS.navy, margin: “12px 0 0” }}>
¿Cómo funciona?
</h2>
</div>
</FadeIn>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fit, minmax(240px, 1fr))”, gap: 32 }}>
{steps.map((s, i) => (
<FadeIn key={i} delay={i * 0.12}>
<div style={{ textAlign: “center” }}>
<div style={{
fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: 48,
background: `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunLight})`,
WebkitBackgroundClip: “text”, WebkitTextFillColor: “transparent”,
marginBottom: 16,
}}>{s.num}</div>
<h3 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, fontSize: 20, color: COLORS.navy, margin: “0 0 8px” }}>{s.title}</h3>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: COLORS.gray600, lineHeight: 1.6, margin: 0, fontSize: 15 }}>{s.desc}</p>
</div>
</FadeIn>
))}
</div>
</div>
</section>
);
}

/* ─── TESTIMONIALS ─── */
function Testimonials() {
const testimonials = [
{ text: “Desde que instalamos el sistema, mi recibo bajó un 90%. Excelente servicio y seguimiento constante.”, name: “Carlos R.”, role: “Propietario en Lima” },
{ text: “El proyecto se pagó en menos de 4 años. La mejor inversión para nuestra empresa.”, name: “Ing. Roberto M.”, role: “Gerente de Planta” },
{ text: “Nos acompañaron en todo el proceso. La calidad de los componentes y la instalación es impecable.”, name: “María G.”, role: “Empresaria” },
];
return (
<section style={{ padding: “100px 24px”, background: COLORS.gray100 }}>
<div style={{ maxWidth: 1200, margin: “0 auto” }}>
<FadeIn>
<div style={{ textAlign: “center”, marginBottom: 60 }}>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, color: COLORS.sun, fontWeight: 600, fontSize: 14, textTransform: “uppercase”, letterSpacing: 2 }}>Testimonios</span>
<h2 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: “clamp(28px,4vw,42px)”, color: COLORS.navy, margin: “12px 0 0” }}>
Lo que dicen nuestros clientes
</h2>
</div>
</FadeIn>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fit, minmax(300px, 1fr))”, gap: 24 }}>
{testimonials.map((t, i) => (
<FadeIn key={i} delay={i * 0.1}>
<div style={{
padding: 32, borderRadius: 20, background: “#fff”,
border: `1px solid ${COLORS.gray200}`,
boxShadow: “0 4px 20px rgba(0,0,0,0.03)”,
}}>
<div style={{ fontFamily: “‘DM Sans’, sans-serif”, color: COLORS.gray600, lineHeight: 1.7, marginBottom: 24, fontSize: 15 }}>
“{t.text}”
</div>
<div style={{ display: “flex”, alignItems: “center”, gap: 12 }}>
<div style={{ width: 44, height: 44, borderRadius: “50%”, background: `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunDark})`, display: “flex”, alignItems: “center”, justifyContent: “center”, color: “#fff”, fontWeight: 700, fontFamily: “‘Outfit’, sans-serif” }}>
{t.name[0]}
</div>
<div>
<div style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, color: COLORS.navy, fontSize: 15 }}>{t.name}</div>
<div style={{ fontFamily: “‘DM Sans’, sans-serif”, color: COLORS.gray400, fontSize: 13 }}>{t.role}</div>
</div>
</div>
</div>
</FadeIn>
))}
</div>
</div>
</section>
);
}

/* ─── FAQ ─── */
function FAQ() {
const [open, setOpen] = useState(null);
const faqs = [
{ q: “¿Cuánto puedo ahorrar con un sistema solar?”, a: “Dependiendo del tamaño del sistema y tu consumo, puedes ahorrar entre un 70% y 95% en tu recibo de luz. La mayoría de nuestros clientes recuperan su inversión en 3-5 años.” },
{ q: “¿Qué incluye un kit solar?”, a: “Nuestros kits incluyen paneles solares Tier 1, inversor, estructura de montaje, cableado, protecciones eléctricas y la instalación completa. Todo con garantía.” },
{ q: “¿Cuánto tiempo toma la instalación?”, a: “Una instalación residencial típica se completa en 1-3 días. Proyectos comerciales pueden tomar de 1 a 2 semanas dependiendo del tamaño.” },
{ q: “¿Necesito permisos para instalar paneles solares?”, a: “Te ayudamos con todos los trámites necesarios. Nos encargamos de la gestión ante la empresa eléctrica y cualquier permiso requerido.” },
{ q: “¿Ofrecen financiamiento?”, a: “Sí, contamos con opciones de financiamiento flexible para que puedas empezar a ahorrar desde el día uno sin una gran inversión inicial.” },
];
return (
<section id=“faq” style={{ padding: “100px 24px”, background: COLORS.white }}>
<div style={{ maxWidth: 800, margin: “0 auto” }}>
<FadeIn>
<div style={{ textAlign: “center”, marginBottom: 60 }}>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, color: COLORS.sun, fontWeight: 600, fontSize: 14, textTransform: “uppercase”, letterSpacing: 2 }}>FAQ</span>
<h2 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: “clamp(28px,4vw,42px)”, color: COLORS.navy, margin: “12px 0 0” }}>
Preguntas frecuentes
</h2>
</div>
</FadeIn>
<div style={{ display: “flex”, flexDirection: “column”, gap: 12 }}>
{faqs.map((f, i) => (
<FadeIn key={i} delay={i * 0.05}>
<div style={{
borderRadius: 16, border: `1px solid ${open === i ? COLORS.sun + "40" : COLORS.gray200}`,
background: open === i ? `${COLORS.sun}08` : “#fff”,
overflow: “hidden”, transition: “all 0.3s”,
}}>
<button onClick={() => setOpen(open === i ? null : i)} style={{
width: “100%”, padding: “20px 24px”, display: “flex”, justifyContent: “space-between”,
alignItems: “center”, background: “none”, border: “none”, cursor: “pointer”, textAlign: “left”,
}}>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 600, fontSize: 16, color: COLORS.navy }}>{f.q}</span>
<span style={{ transform: open === i ? “rotate(180deg)” : “none”, transition: “transform 0.3s”, flexShrink: 0, marginLeft: 16 }}><ChevronDown /></span>
</button>
<div style={{
maxHeight: open === i ? 200 : 0, overflow: “hidden”, transition: “max-height 0.4s ease”,
}}>
<div style={{ padding: “0 24px 20px” }}>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: COLORS.gray600, lineHeight: 1.7, margin: 0, fontSize: 15 }}>{f.a}</p>
</div>
</div>
</div>
</FadeIn>
))}
</div>
</div>
</section>
);
}

/* ─── CALCULATOR ─── */
function Calculator() {
const [bill, setBill] = useState(200);
const saving = Math.round(bill * 0.85);
const annual = saving * 12;
const payback = bill < 50 ? “—” : Math.round(9480 / (saving * 12) * 10) / 10;
return (
<section style={{ padding: “100px 24px”, background: `linear-gradient(135deg, ${COLORS.navy}, #302720)`, position: “relative”, overflow: “hidden” }}>
<div style={{ position: “absolute”, inset: 0, background: `radial-gradient(circle at 70% 30%, ${COLORS.sun}10, transparent 60%)` }} />
<div style={{ maxWidth: 700, margin: “0 auto”, position: “relative”, zIndex: 2 }}>
<FadeIn>
<div style={{ textAlign: “center”, marginBottom: 48 }}>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, color: COLORS.sun, fontWeight: 600, fontSize: 14, textTransform: “uppercase”, letterSpacing: 2 }}>Calculadora Solar</span>
<h2 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: “clamp(28px,4vw,42px)”, color: “#fff”, margin: “12px 0 0” }}>
¿Cuánto puedes ahorrar?
</h2>
</div>
</FadeIn>
<FadeIn delay={0.1}>
<div style={{
background: “rgba(255,255,255,0.05)”, borderRadius: 24, padding: “36px 28px”,
border: “1px solid rgba(255,255,255,0.08)”, backdropFilter: “blur(8px)”,
}}>
<label style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.7)”, fontSize: 15, display: “block”, marginBottom: 12 }}>
¿Cuánto pagas de luz al mes? <span style={{ color: COLORS.sun, fontWeight: 700, fontSize: 28, fontFamily: “‘Outfit’, sans-serif” }}>S/. {bill}</span>
</label>
<input
type=“range” min=“50” max=“1500” step=“10” value={bill}
onChange={e => setBill(Number(e.target.value))}
style={{ width: “100%”, height: 8, borderRadius: 8, appearance: “none”, background: `linear-gradient(90deg, ${COLORS.sun} ${((bill - 50) / 1450) * 100}%, rgba(255,255,255,0.1) ${((bill - 50) / 1450) * 100}%)`, outline: “none”, cursor: “pointer”, marginBottom: 32 }}
/>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(3, 1fr)”, gap: 16, textAlign: “center” }}>
<div style={{ background: “rgba(255,255,255,0.05)”, borderRadius: 16, padding: “20px 12px” }}>
<div style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: 28, color: COLORS.green }}>S/. {saving}</div>
<div style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.5)”, fontSize: 12, marginTop: 4 }}>Ahorro mensual</div>
</div>
<div style={{ background: “rgba(255,255,255,0.05)”, borderRadius: 16, padding: “20px 12px” }}>
<div style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: 28, color: COLORS.sunLight }}>S/. {annual.toLocaleString()}</div>
<div style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.5)”, fontSize: 12, marginTop: 4 }}>Ahorro anual</div>
</div>
<div style={{ background: “rgba(255,255,255,0.05)”, borderRadius: 16, padding: “20px 12px” }}>
<div style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: 28, color: COLORS.sky }}>{payback} <span style={{ fontSize: 14 }}>años</span></div>
<div style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.5)”, fontSize: 12, marginTop: 4 }}>Retorno inversión</div>
</div>
</div>
<a href={`https://wa.me/51936790848?text=Hola%2C%20pago%20S/.${bill}%20de%20luz%20y%20quiero%20cotizar%20un%20kit%20solar`} target=”_blank” rel=“noopener noreferrer” style={{
display: “block”, textAlign: “center”, marginTop: 28, padding: “16px 0”, borderRadius: 50,
background: `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunDark})`, color: “#fff”,
fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, fontSize: 16, textDecoration: “none”,
boxShadow: `0 8px 24px ${COLORS.sun}40`,
}}>Cotizar mi kit solar por WhatsApp</a>
</div>
</FadeIn>
</div>
</section>
);
}

/* ─── FLOATING WHATSAPP ─── */
function FloatingWhatsApp() {
const [show, setShow] = useState(false);
useEffect(() => {
const t = setTimeout(() => setShow(true), 2000);
return () => clearTimeout(t);
}, []);
if (!show) return null;
return (
<a href=“https://wa.me/51936790848?text=Hola%2C%20quiero%20información%20sobre%20kits%20solares” target=”_blank” rel=“noopener noreferrer”
style={{
position: “fixed”, bottom: 24, right: 24, zIndex: 999,
width: 60, height: 60, borderRadius: “50%”, background: “#25D366”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
boxShadow: “0 4px 20px rgba(37,211,102,0.4)”,
animation: “float 3s ease-in-out infinite”,
textDecoration: “none”,
}}>
<svg width="30" height="30" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.466A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.24 0-4.36-.61-6.18-1.735l-.44-.264-2.745.87.87-2.68-.29-.46A9.72 9.72 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" /></svg>
</a>
);
}

/* ─── CTA ─── */
function CTA() {
return (
<section id=“contacto” style={{
padding: “100px 24px”, position: “relative”, overflow: “hidden”,
background: `linear-gradient(135deg, ${COLORS.navy}, #302720)`,
}}>
<div style={{ position: “absolute”, inset: 0, background: `radial-gradient(circle at 30% 50%, ${COLORS.sun}12, transparent 60%)` }} />
<div style={{ maxWidth: 700, margin: “0 auto”, textAlign: “center”, position: “relative”, zIndex: 2 }}>
<FadeIn>
<h2 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 800, fontSize: “clamp(28px,4vw,42px)”, color: “#fff”, margin: “0 0 16px” }}>
Empieza a ahorrar hoy
</h2>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.7)”, fontSize: 18, lineHeight: 1.7, margin: “0 0 40px” }}>
Solicita una cotización gratuita y descubre cuánto puedes ahorrar con energía solar. Sin compromiso.
</p>
<div style={{ display: “flex”, gap: 16, justifyContent: “center”, flexWrap: “wrap” }}>
<a href=“https://wa.me/51936790848?text=Hola%2C%20quiero%20información%20sobre%20kits%20solares” target=”_blank” rel=“noopener noreferrer” style={{
background: “#25D366”, color: “#fff”, padding: “16px 36px”, borderRadius: 50,
textDecoration: “none”, fontWeight: 700, fontSize: 16, fontFamily: “‘Outfit’, sans-serif”,
display: “inline-flex”, alignItems: “center”, gap: 10,
boxShadow: “0 8px 30px rgba(37,211,102,0.3)”,
}}>
<svg width="22" height="22" viewBox="0 0 24 24" fill="#fff"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.625-1.466A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.24 0-4.36-.61-6.18-1.735l-.44-.264-2.745.87.87-2.68-.29-.46A9.72 9.72 0 0 1 2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" /></svg>
Cotizar por WhatsApp
</a>
<a href=“tel:+51936790848” style={{
border: “2px solid rgba(255,255,255,0.25)”, color: “#fff”,
padding: “16px 36px”, borderRadius: 50, textDecoration: “none”,
fontWeight: 600, fontSize: 16, fontFamily: “‘Outfit’, sans-serif”,
display: “inline-flex”, alignItems: “center”, gap: 10,
}}>
<PhoneIcon /> Llamar ahora
</a>
</div>
</FadeIn>
</div>
</section>
);
}

/* ─── FOOTER ─── */
function Footer() {
return (
<footer style={{ background: COLORS.navy, padding: “60px 24px 30px”, borderTop: “1px solid rgba(255,255,255,0.05)” }}>
<div style={{ maxWidth: 1200, margin: “0 auto” }}>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(auto-fit, minmax(200px, 1fr))”, gap: 40, marginBottom: 40 }}>
<div>
<div style={{ display: “flex”, alignItems: “center”, gap: 8, marginBottom: 16 }}>
<div style={{ width: 32, height: 32, borderRadius: “50%”, background: `linear-gradient(135deg, ${COLORS.sun}, ${COLORS.sunDark})`, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" stroke="none"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
</div>
<span style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, fontSize: 20, color: “#fff” }}>Tesla<span style={{ color: COLORS.sun }}>Solar</span></span>
</div>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.5)”, fontSize: 14, lineHeight: 1.7, maxWidth: 280 }}>
Impulsando la transición energética del Perú con soluciones solares rentables y sostenibles.
</p>
</div>
<div>
<h4 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, color: “#fff”, fontSize: 15, marginBottom: 16 }}>Soluciones</h4>
{[“Solar Residencial”, “Solar Empresas”, “Kits Solares”, “Cotizador Online”].map(l => (
<a key={l} href=”#” style={{ display: “block”, color: “rgba(255,255,255,0.5)”, textDecoration: “none”, fontFamily: “‘DM Sans’, sans-serif”, fontSize: 14, marginBottom: 10, transition: “color 0.2s” }}
onMouseEnter={e => e.target.style.color = COLORS.sun}
onMouseLeave={e => e.target.style.color = “rgba(255,255,255,0.5)”}
>{l}</a>
))}
</div>
<div>
<h4 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, color: “#fff”, fontSize: 15, marginBottom: 16 }}>Empresa</h4>
{[“Nosotros”, “Proyectos”, “Servicios”, “Contacto”].map(l => (
<a key={l} href=”#” style={{ display: “block”, color: “rgba(255,255,255,0.5)”, textDecoration: “none”, fontFamily: “‘DM Sans’, sans-serif”, fontSize: 14, marginBottom: 10, transition: “color 0.2s” }}
onMouseEnter={e => e.target.style.color = COLORS.sun}
onMouseLeave={e => e.target.style.color = “rgba(255,255,255,0.5)”}
>{l}</a>
))}
</div>
<div>
<h4 style={{ fontFamily: “‘Outfit’, sans-serif”, fontWeight: 700, color: “#fff”, fontSize: 15, marginBottom: 16 }}>Contacto</h4>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.5)”, fontSize: 14, lineHeight: 2 }}>
Lima, Perú<br />
Lun-Sab 9am-7pm<br />
+51 936 790 848<br />
contacto@teslasolarperu.com
</p>
</div>
</div>
<div style={{ borderTop: “1px solid rgba(255,255,255,0.08)”, paddingTop: 24, textAlign: “center” }}>
<p style={{ fontFamily: “‘DM Sans’, sans-serif”, color: “rgba(255,255,255,0.3)”, fontSize: 13 }}>
© 2026 Tesla Solar Perú. Todos los derechos reservados.
</p>
</div>
</div>
</footer>
);
}

/* ─── MAIN APP ─── */
export default function SolarLanding() {
return (
<div style={{ overflowX: “hidden” }}>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
<style>{`*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; } html { scroll-behavior: smooth; } body { -webkit-font-smoothing: antialiased; } input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #F97316, #C2410C); cursor: pointer; box-shadow: 0 2px 10px rgba(249,115,22,0.5); } @keyframes flowDown { 0% { top: -10px; opacity: 0; } 30% { opacity: 1; } 100% { top: 36px; opacity: 0; } } @keyframes panelGlow { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; box-shadow: inset 0 0 12px rgba(20,184,166,0.3); } } @keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.8; } 50% { transform: scale(1.15); opacity: 1; } } @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } } @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0); opacity: 0.5; } 50% { transform: translateX(-50%) translateY(8px); opacity: 1; } } @media (max-width: 768px) { .hero-grid { grid-template-columns: 1fr !important; } .hero-visual { margin-top: 40px; } .stats-grid { grid-template-columns: repeat(2, 1fr) !important; } .desktop-nav { display: none !important; } .hamburger { display: block !important; } } @media (min-width: 769px) { .mobile-menu { display: none !important; } }`}</style>
<Navbar />
<Hero />
<Kits />
<Calculator />
<Services />
<WhyUs />
<Process />
<Testimonials />
<FAQ />
<CTA />
<Footer />
<FloatingWhatsApp />
</div>
);
}
