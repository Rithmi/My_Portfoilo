"use client";

import Navbar from "@/components/Navbar";
import AboutSection from "@/components/AboutSection";
import TechOrbitSection from "@/components/TechOrbitSection";
import ServicesSection from "@/components/ServicesSection";
import ProjectsSection from "@/components/ProjectsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  MotionStyle,
} from "framer-motion";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLE CANVAS
───────────────────────────────────────────────────────────────────────────── */
function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let W = 0,
      H = 0;

    type P = {
      x: number;
      y: number;
      r: number;
      vx: number;
      vy: number;
      alpha: number;
      hue: number;
    };
    const COUNT = 80;
    const pts: P[] = [];

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    for (let i = 0; i < COUNT; i++) {
      pts.push({
        x: Math.random() * (W || 1920),
        y: Math.random() * (H || 1080),
        r: Math.random() * 1.2 + 0.2,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        alpha: Math.random() * 0.35 + 0.08,
        hue: 260 + Math.random() * 50,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        else if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        else if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue},80%,75%,${p.alpha})`;
        ctx.fill();
      }

      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `hsla(270,70%,65%,${0.07 * (1 - d / 120)})`;
            ctx.lineWidth = 0.4;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      style={{ zIndex: 0 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   3-D TILT CARD
───────────────────────────────────────────────────────────────────────────── */
function TiltCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const rRX = useMotionValue(0);
  const rRY = useMotionValue(0);
  const rGX = useMotionValue(50);
  const rGY = useMotionValue(50);

  const sRX = useSpring(rRX, { stiffness: 140, damping: 20 });
  const sRY = useSpring(rRY, { stiffness: 140, damping: 20 });
  const sGX = useSpring(rGX, { stiffness: 90, damping: 20 });
  const sGY = useSpring(rGY, { stiffness: 90, damping: 20 });

  const glowBg = useTransform(
    [sGX, sGY],
    ([gx, gy]) =>
      `radial-gradient(circle at ${gx}% ${gy}%, rgba(120,80,200,0.14) 0%, transparent 58%)`
  );

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      rRX.set(((y - cy) / cy) * -12);
      rRY.set(((x - cx) / cx) * 12);
      rGX.set((x / rect.width) * 100);
      rGY.set((y / rect.height) * 100);
    },
    [rRX, rRY, rGX, rGY]
  );

  const onLeave = useCallback(() => {
    rRX.set(0);
    rRY.set(0);
    rGX.set(50);
    rGY.set(50);
  }, [rRX, rRY, rGX, rGY]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX: sRX, rotateY: sRY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {/* mouse-follow sheen */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-10 rounded-[20px]"
        style={{ background: glowBg }}
      />
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SCRAMBLE TEXT
───────────────────────────────────────────────────────────────────────────── */
const CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&";

function ScrambleText({
  text,
  className = "",
  trigger,
}: {
  text: string;
  className?: string;
  trigger: number;
}) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let iter = 0;
    const total = text.length * 3;
    const id = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((ch, i) =>
            i < Math.floor(iter / 3)
              ? ch
              : CHARS[Math.floor(Math.random() * CHARS.length)]
          )
          .join("")
      );
      iter++;
      if (iter > total) {
        clearInterval(id);
        setDisplay(text);
      }
    }, 28);
    return () => clearInterval(id);
  }, [text, trigger]);

  return <span className={className}>{display}</span>;
}

/* ─────────────────────────────────────────────────────────────────────────────
   ORBIT RING
───────────────────────────────────────────────────────────────────────────── */
function OrbitRing({
  size,
  duration,
  direction = 1,
  borderStyle,
  dotColor,
  dotSize,
  dotPos,
}: {
  size: number;
  duration: number;
  direction?: 1 | -1;
  borderStyle: string;
  dotColor: string;
  dotSize: number;
  dotPos?: string;
}) {
  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ width: size, height: size, border: borderStyle }}
      />
      <motion.div
        animate={{ rotate: 360 * direction }}
        transition={{ repeat: Infinity, duration, ease: "linear" }}
        className="pointer-events-none absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2"
        style={{ width: size, height: size }}
      >
        <span
          className="absolute rounded-full"
          style={{
            width: dotSize,
            height: dotSize,
            background: dotColor,
            boxShadow: `0 0 ${dotSize * 3}px ${dotColor}`,
            ...(dotPos === "top-right"
              ? { top: -dotSize / 2, right: size / 7 }
              : {
                  top: -dotSize / 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                }),
          }}
        />
      </motion.div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FLOATING BADGE
───────────────────────────────────────────────────────────────────────────── */
function FloatBadge({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.82 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      className={`absolute z-20 rounded-xl border border-white/10 px-3 py-2 backdrop-blur-md ${className}`}
      style={{ background: "rgba(8,6,18,0.82)" }}
    >
      {/* top glint */}
      <div
        className="pointer-events-none absolute left-[15%] right-[15%] top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg,transparent,rgba(200,180,255,0.35),transparent)",
        }}
      />
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SKILL BAR
───────────────────────────────────────────────────────────────────────────── */
function SkillBar({
  label,
  pct,
  delay,
}: {
  label: string;
  pct: number;
  delay: number;
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="w-14 shrink-0 text-[10px] font-medium uppercase tracking-[0.16em]"
        style={{ color: "rgba(200,190,230,0.36)" }}
      >
        {label}
      </span>
      <div
        className="h-[2px] flex-1 overflow-hidden rounded-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay, duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg,#7b5ea7,#b08af0)",
          }}
        />
      </div>
      <span
        className="w-7 text-right text-[10px]"
        style={{ color: "rgba(200,190,230,0.28)" }}
      >
        {pct}%
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STAT STRIP ITEM
───────────────────────────────────────────────────────────────────────────── */
function StatItem({
  num,
  label,
  delay,
}: {
  num: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center"
    >
      <span
        className="font-serif text-2xl font-bold leading-none tracking-tight"
        style={{ color: "#f0ecff", fontFamily: "'Playfair Display',serif" }}
      >
        {num}
      </span>
      <span
        className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.22em]"
        style={{ color: "rgba(200,190,230,0.36)" }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────────────────── */
const BARS = [
  { label: "Frontend", pct: 95, delay: 1.05 },
  { label: "Backend",  pct: 82, delay: 1.2  },
  { label: "UI / UX",  pct: 88, delay: 1.35 },
];

const STATS = [
  { num: "40+", label: "Projects delivered", delay: 1.3 },
  { num: "5",   label: "Years experience",   delay: 1.4 },
  { num: "3",   label: "Core disciplines",   delay: 1.5 },
];

export default function Home() {
  const [scrambleTrig, setScrambleTrig] = useState(0);
  const [imgErr, setImgErr] = useState(false);

  /* custom cursor */
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);
  const cX = useSpring(mX, { stiffness: 520, damping: 48 });
  const cY = useSpring(mY, { stiffness: 520, damping: 48 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      mX.set(e.clientX - 12);
      mY.set(e.clientY - 12);
    },
    [mX, mY]
  );

  /* auto-scramble on mount */
  useEffect(() => {
    const t = setTimeout(() => setScrambleTrig(1), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/*
        ── ADD TO layout.tsx or _document.tsx ──────────────────────────────
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=Playfair+Display:ital,wght@0,700;1,400&display=swap" rel="stylesheet" />
        ──────────────────────────────────────────────────────────────────── */}

      {/* ── We remove default Navbar here so we control nav ourselves ────── */}
      {/* If you want to keep your existing Navbar component, re-add: <Navbar /> */}
<Navbar/>
      <main
        className="relative min-h-screen overflow-hidden text-white"
        style={{ background: "#08070f", fontFamily: "'DM Sans',sans-serif" }}
        onMouseMove={onMouseMove}
      >
        {/* ── custom cursor ─────────────────────────────────────────────── */}
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[60] hidden mix-blend-difference md:block"
          style={{ x: cX, y: cY }}
        >
          <div className="h-6 w-6 rounded-full bg-white/80" />
        </motion.div>

        {/* ── Background: deep radial gradients ─────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 -z-30">
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 15% 30%, rgba(80,40,140,0.28) 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 40% at 88% 72%, rgba(40,20,90,0.22) 0%, transparent 65%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 105%, rgba(20,10,50,0.5) 0%, transparent 60%)",
            }}
          />
        </div>

        {/* ── Grid lines ────────────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 -z-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 40%, black 0%, transparent 80%)",
          }}
        />

        {/* ── Noise texture ─────────────────────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 -z-20 opacity-[0.028]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: "200px",
          }}
        />

        {/* ── Particles ─────────────────────────────────────────────────── */}
        <div className="absolute inset-0 -z-10">
          <ParticleField />
        </div>

        {/* ── Ambient floating orbs ─────────────────────────────────────── */}
        {[
          {
            style: {
              left: "2%",
              top: "10%",
              width: 300,
              height: 300,
              background:
                "radial-gradient(circle,rgba(80,40,150,0.3),transparent 70%)",
              filter: "blur(70px)",
            } as MotionStyle,
            delay: 0,
            dur: 9,
          },
          {
            style: {
              right: "4%",
              top: "5%",
              width: 360,
              height: 360,
              background:
                "radial-gradient(circle,rgba(100,40,180,0.2),transparent 70%)",
              filter: "blur(80px)",
            } as MotionStyle,
            delay: 3,
            dur: 11,
          },
          {
            style: {
              left: "44%",
              bottom: "-2%",
              width: 280,
              height: 280,
              background:
                "radial-gradient(circle,rgba(60,30,120,0.2),transparent 70%)",
              filter: "blur(64px)",
            } as MotionStyle,
            delay: 1.5,
            dur: 8,
          },
        ].map((orb, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute rounded-full"
            style={orb.style}
            animate={{
              y: [0, -28, 0],
              scale: [1, 1.07, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{
              repeat: Infinity,
              duration: orb.dur,
              delay: orb.delay,
              ease: "easeInOut",
            }}
          />
        ))}

      

        {/* ══════════════════════════════════════════════════════════════════
            HERO SECTION
        ══════════════════════════════════════════════════════════════════ */}
        <section
          id="hero"
           className="relative mx-auto grid min-h-screen max-w-[1320px] items-center gap-12 px-8 pt-[80px] pb-28 md:px-16 lg:grid-cols-2"
        >
          {/* ──────────────────────── LEFT COLUMN ──────────────────────── */}
          <div className="relative z-10 flex flex-col">

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mb-7 flex items-center gap-3"
            >
              <div
                className="h-px w-8 shrink-0"
                style={{
                  background:
                    "linear-gradient(90deg,#c9a96e,transparent)",
                }}
              />
              <span
                className="text-[11px] font-medium uppercase tracking-[0.28em]"
                style={{ color: "#c9a96e" }}
              >
                Software Engineer & Creative Dev
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="leading-[1.05] tracking-tight"
              style={{ fontFamily: "'Playfair Display',serif" }}
            >
              {/* First name — solid */}
              <span
                className="block font-bold text-white"
                style={{ fontSize: "clamp(3.4rem,6.5vw,5.2rem)" }}
              >
                Rithmi
              </span>
              {/* Last name — outlined italic */}
              <span
                className="block font-normal italic"
                style={{
                  fontSize: "clamp(3.4rem,6.5vw,5.2rem)",
                  color: "transparent",
                  WebkitTextStroke: "1.5px rgba(200,185,255,0.4)",
                }}
              >
                Thewarapperuma
              </span>
            </motion.h1>

            {/* Subtitle / scramble */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 }}
              className="mt-5 flex items-center gap-3"
            >
              <div
                className="h-px w-10 shrink-0"
                style={{
                  background:
                    "linear-gradient(90deg,rgba(160,123,212,0.5),transparent)",
                }}
              />
              <button
                onClick={() => setScrambleTrig((t) => t + 1)}
                className="text-[15.5px] font-light tracking-wide transition-colors"
                style={{ color: "rgba(200,190,230,0.55)", fontFamily: "'DM Sans',sans-serif" }}
              >
                <ScrambleText
                  text="Crafting elegant digital experiences"
                  trigger={scrambleTrig}
                />
              </button>
            </motion.div>

            {/* Bio */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48, duration: 0.7 }}
              className="mt-6 max-w-[420px] text-[15px] font-light leading-[1.82]"
              style={{ color: "rgba(200,190,230,0.42)" }}
            >
              Where engineering precision meets design intuition. I build immersive
              interfaces and scalable frontend architecture for products people love.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.78, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap gap-3"
            >
              {/* Primary */}
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative overflow-hidden rounded px-8 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.12em] text-white"
                style={{
                  background:
                    "linear-gradient(135deg,#7b5ea7 0%,#9b6fd4 100%)",
                  boxShadow:
                    "0 4px 32px rgba(123,94,167,0.45),inset 0 1px 0 rgba(255,255,255,0.12)",
                  textDecoration: "none",
                }}
              >
                Hire me →
              </motion.a>

              {/* Ghost */}
              <motion.a
                href="/resume.pdf"
                download="Rithmi-Thewarapperuma-Resume.pdf"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="rounded px-7 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.12em] transition-colors"
                style={{
                  background: "transparent",
                  color: "rgba(200,190,230,0.62)",
                  border: "0.5px solid rgba(255,255,255,0.14)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(200,190,230,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(200,190,230,0.62)";
                }}
              >
                Download CV
              </motion.a>

              <motion.a
                href="#projects"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="rounded px-7 py-3.5 text-[12.5px] font-medium uppercase tracking-[0.12em] transition-colors"
                style={{
                  background: "transparent",
                  color: "rgba(200,190,230,0.62)",
                  border: "0.5px solid rgba(255,255,255,0.14)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background =
                    "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(200,190,230,0.9)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(200,190,230,0.62)";
                }}
              >
                View Work
              </motion.a>
            </motion.div>

            {/* Social links */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.05 }}
              className="mt-10 flex items-center gap-8"
            >
              {[
                { name: "GitHub",   link: "https://github.com/Rithmi" },
                { name: "LinkedIn", link: "https://lk.linkedin.com/in/rithmi-thewarapperuma" },
              ].map((item, i) => (
                <motion.a
                  key={item.name}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.1 + i * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.24em] transition-colors"
                  style={{ color: "rgba(200,190,230,0.32)", textDecoration: "none" }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(200,190,230,0.78)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.color =
                      "rgba(200,190,230,0.32)")
                  }
                >
                  <span
                    className="inline-block h-px w-5 shrink-0 transition-all duration-300"
                    style={{ background: "currentColor" }}
                  />
                  {item.name}
                </motion.a>
              ))}
            </motion.div>

            {/* Stats strip (below left col on mobile; bottom of hero on desktop) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.7 }}
              className="mt-12 flex items-center gap-6 lg:hidden"
            >
              {STATS.map((s) => (
                <StatItem key={s.label} {...s} />
              ))}
            </motion.div>
          </div>

          {/* ──────────────────────── RIGHT COLUMN ─────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center"
            style={{ perspective: 1200 }}
          >
            <TiltCard
              className="relative h-[600px] w-full max-w-[460px] rounded-[20px] md:cursor-none"
              style={{
                border: "0.5px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(2px)",
                boxShadow:
                  "0 0 0 0.5px rgba(255,255,255,0.05) inset, 0 48px 120px rgba(0,0,0,0.75), 0 24px 48px rgba(0,0,0,0.5)",
              } as React.CSSProperties}
            >
              {/* top edge highlight */}
              <div
                className="pointer-events-none absolute left-[18%] right-[18%] top-0 h-px"
                style={{
                  background:
                    "linear-gradient(90deg,transparent,rgba(200,180,255,0.45),transparent)",
                }}
              />

              {/* inner ambient glow */}
              <div
                className="pointer-events-none absolute inset-0 rounded-[20px]"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 35% at 50% 0%, rgba(100,60,200,0.13) 0%, transparent 70%)",
                }}
              />

              {/* ── Orbit rings ─────────────────────────────────────── */}
              <OrbitRing
                size={360}
                duration={22}
                direction={1}
                borderStyle="0.5px solid rgba(140,100,220,0.14)"
                dotColor="rgba(160,123,212,1)"
                dotSize={10}
              />
              <OrbitRing
                size={430}
                duration={32}
                direction={-1}
                borderStyle="0.5px dashed rgba(160,110,240,0.09)"
                dotColor="#c9a96e"
                dotSize={7}
                dotPos="top-right"
              />

              {/* ── Center glow ──────────────────────────────────── */}
              <div
                className="pointer-events-none absolute left-1/2 top-[40%] h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background: "rgba(80,40,150,0.18)",
                  filter: "blur(60px)",
                }}
              />

              {/* ── Profile image ────────────────────────────────── */}
              <motion.div
                animate={{ y: [0, -14, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 5.5,
                  ease: "easeInOut",
                }}
                className="absolute left-1/2 top-[46%] z-10 -translate-x-1/2 -translate-y-1/2"
                style={{
                  filter:
                    "drop-shadow(0 48px 80px rgba(0,0,0,0.78)) drop-shadow(0 0 40px rgba(100,60,200,0.25))",
                }}
              >
                {!imgErr ? (
                  <img
                    src="/images/profile.png"
                    alt="Rithmi Thewarapperuma"
                    width={340}
                    height={520}
                    className="h-auto w-[300px] object-contain md:w-[320px]"
                    onError={() => setImgErr(true)}
                  />
                ) : (
                  <div
                    className="flex h-[280px] w-[220px] items-center justify-center rounded-full text-8xl"
                    style={{
                      background:
                        "linear-gradient(160deg,rgba(100,60,200,0.3),rgba(60,20,100,0.3))",
                      border: "1.5px solid rgba(140,100,220,0.2)",
                    }}
                  >
                    👩‍💻
                  </div>
                )}
              </motion.div>

              {/* ── Floating badges ─────────────────────────────── */}
              <FloatBadge delay={0.85} className="right-4 top-4">
                <p
                  className="text-[9px] font-medium uppercase tracking-[0.22em]"
                  style={{ color: "rgba(200,190,230,0.35)" }}
                >
                  Portfolio
                </p>
                <p
                  className="mt-0.5 text-[13px] font-semibold tracking-wide"
                  style={{ color: "#c9a96e", fontFamily: "'DM Sans',sans-serif" }}
                >
                  2026 ✦
                </p>
              </FloatBadge>

              <FloatBadge delay={1.0} className="left-4 top-[28%]">
                <p
                  className="text-[9px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: "rgba(200,190,230,0.35)" }}
                >
                  Projects
                </p>
                <p
                  className="mt-0.5 text-[22px] font-bold leading-none"
                  style={{
                    color: "#c4a8ff",
                    fontFamily: "'Playfair Display',serif",
                  }}
                >
                  40+
                </p>
              </FloatBadge>

              <FloatBadge delay={1.14} className="right-4 top-[58%]">
                <p
                  className="text-[9px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: "rgba(200,190,230,0.35)" }}
                >
                  Experience
                </p>
                <p
                  className="mt-0.5 text-[22px] font-bold leading-none"
                  style={{
                    color: "#a0d4b8",
                    fontFamily: "'Playfair Display',serif",
                  }}
                >
                  3+ yrs
                </p>
              </FloatBadge>

              {/* ── Status + skill bars ──────────────────────────── */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.75, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-5 left-5 right-5 z-20 rounded-2xl p-5"
                style={{
                  background: "rgba(8,6,20,0.88)",
                  backdropFilter: "blur(20px)",
                  border: "0.5px solid rgba(255,255,255,0.09)",
                }}
              >
                {/* top glint */}
                <div
                  className="pointer-events-none absolute left-[18%] right-[18%] top-0 h-px"
                  style={{
                    background:
                      "linear-gradient(90deg,transparent,rgba(200,180,255,0.3),transparent)",
                  }}
                />

                {/* header */}
                <div className="mb-4 flex items-start justify-between gap-2">
                  <div>
                    <p
                      className="text-[9px] font-medium uppercase tracking-[0.3em]"
                      style={{ color: "rgba(100,200,140,0.62)" }}
                    >
                      Open to Opportunities
                    </p>
                    <p
                      className="mt-1 text-[14px] font-medium"
                      style={{ color: "#f0ecff" }}
                    >
                      UI/UX · Frontend · Backend
                    </p>
                  </div>
                  <div className="mt-0.5 flex gap-1.5">
                    {["🎨", "⚛️", "🛠"].map((em, i) => (
                      <motion.span
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 2.8,
                          delay: i * 0.45,
                          ease: "easeInOut",
                        }}
                        className="text-base"
                      >
                        {em}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Skill bars */}
                <div className="space-y-2.5">
                  {BARS.map((b) => (
                    <SkillBar key={b.label} {...b} />
                  ))}
                </div>
              </motion.div>
            </TiltCard>
          </motion.div>
        </section>

        {/* ── Bottom stats bar ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
          className="hidden lg:flex"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "20px 64px",
            borderTop: "0.5px solid rgba(255,255,255,0.07)",
            background: "rgba(8,7,15,0.6)",
            backdropFilter: "blur(16px)",
            alignItems: "center",
            gap: 48,
          }}
        >
          {STATS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-12">
              <StatItem {...s} />
              {i < STATS.length - 1 && (
                <div
                  className="h-9 w-px shrink-0"
                  style={{ background: "rgba(255,255,255,0.07)" }}
                />
              )}
            </div>
          ))}

          {/* Scroll hint */}
          <div
            className="ml-auto flex flex-col items-center gap-1.5"
            style={{ color: "rgba(200,190,230,0.3)" }}
          >
            <span className="text-[9px] font-medium uppercase tracking-[0.28em]">
              Scroll
            </span>
            <motion.div
              className="w-px rounded-full"
              style={{ height: 32, background: "rgba(200,180,255,0.35)" }}
              animate={{ scaleY: [0, 1, 0], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
            />
          </div>
        </motion.div>

        {/* ── Remaining sections ────────────────────────────────────────── */}
        <AboutSection />
        <TechOrbitSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
        <Footer />
      </main>
    </>
  );
}
