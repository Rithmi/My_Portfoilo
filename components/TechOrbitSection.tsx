"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useRef, useEffect, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   TECH DATA
───────────────────────────────────────────────────────────────────────────── */
const TECH = [
  // Inner ring
  { name: "React",   icon: "⚛",  ring: 1, angle: 0,   accent: "#61dafb", glow: "rgba(97,218,251,0.55)"  },
  { name: "Next.js", icon: "N",  ring: 1, angle: 51,  accent: "#ffffff", glow: "rgba(255,255,255,0.45)" },
  { name: "TypeScript", icon: "TS", ring: 1, angle: 102, accent: "#3178c6", glow: "rgba(49,120,198,0.6)"  },
  { name: "Node.js", icon: "⬡",  ring: 1, angle: 153, accent: "#68a063", glow: "rgba(104,160,99,0.55)"  },
  { name: "Three.js",icon: "◈",  ring: 1, angle: 204, accent: "#a07bd4", glow: "rgba(160,123,212,0.6)"  },
  { name: "Figma",   icon: "◰",  ring: 1, angle: 255, accent: "#f24e1e", glow: "rgba(242,78,30,0.5)"    },
  { name: "Python",  icon: "Py", ring: 1, angle: 306, accent: "#3572a5", glow: "rgba(53,114,165,0.55)"  },

  // Middle ring
  { name: "CSS",     icon: "✦",  ring: 2, angle: 18,  accent: "#2965f1", glow: "rgba(41,101,241,0.5)"   },
  { name: "HTML",    icon: "◬",  ring: 2, angle: 66,  accent: "#e44d26", glow: "rgba(228,77,38,0.5)"    },
  { name: "Git",     icon: "⌥",  ring: 2, angle: 114, accent: "#f05032", glow: "rgba(240,80,50,0.5)"    },
  { name: "MySQL",   icon: "⊛",  ring: 2, angle: 162, accent: "#00758f", glow: "rgba(0,117,143,0.5)"    },
  { name: "PHP",     icon: "◍",  ring: 2, angle: 210, accent: "#8993be", glow: "rgba(137,147,190,0.5)"  },
  { name: "WebGL",   icon: "✧",  ring: 2, angle: 258, accent: "#c084fc", glow: "rgba(192,132,252,0.55)" },
  { name: "GSAP",    icon: "⌬",  ring: 2, angle: 306, accent: "#88ce02", glow: "rgba(136,206,2,0.5)"    },
  { name: "Docker",  icon: "⊞",  ring: 2, angle: 354, accent: "#2496ed", glow: "rgba(36,150,237,0.5)"   },

  // Outer ring
  { name: "C/C++",   icon: "©",  ring: 3, angle: 30,  accent: "#a8b9cc", glow: "rgba(168,185,204,0.45)" },
  { name: "Tailwind",icon: "≋",  ring: 3, angle: 78,  accent: "#38bdf8", glow: "rgba(56,189,248,0.5)"   },
  { name: "Framer",  icon: "◉",  ring: 3, angle: 126, accent: "#0055ff", glow: "rgba(0,85,255,0.5)"     },
  { name: "Redux",   icon: "∇",  ring: 3, angle: 174, accent: "#764abc", glow: "rgba(118,74,188,0.5)"   },
  { name: "Jest",    icon: "◎",  ring: 3, angle: 222, accent: "#c21325", glow: "rgba(194,19,37,0.5)"    },
  { name: "Vercel",  icon: "▲",  ring: 3, angle: 270, accent: "#ffffff", glow: "rgba(255,255,255,0.4)"  },
  { name: "AWS",     icon: "☁",  ring: 3, angle: 318, accent: "#ff9900", glow: "rgba(255,153,0,0.5)"    },
];

const RING_RADII = [0, 155, 240, 330]; // index 0 unused
const RING_SPEEDS = [0, 28, 42, 58];   // seconds per rotation

/* ─────────────────────────────────────────────────────────────────────────────
   PARTICLE BACKGROUND
───────────────────────────────────────────────────────────────────────────── */
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0, raf = 0;

    const resize = () => {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 0.9 + 0.1,
      a: Math.random(),
      da: (Math.random() * 0.003 + 0.001) * (Math.random() < 0.5 ? 1 : -1),
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        s.a = Math.max(0.05, Math.min(1, s.a + s.da));
        if (s.a <= 0.05 || s.a >= 1) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,190,255,${s.a * 0.55})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SINGLE TECH NODE
───────────────────────────────────────────────────────────────────────────── */
function TechNode({
  tech,
  ringAngle,
  hoveredName,
  onHover,
}: {
  tech: (typeof TECH)[0];
  ringAngle: number;  // live spinning angle in degrees
  hoveredName: string | null;
  onHover: (name: string | null) => void;
}) {
  const radius = RING_RADII[tech.ring];
  const baseAngle = (tech.angle * Math.PI) / 180;
  const live = (ringAngle * Math.PI) / 180;
  const totalAngle = baseAngle + live;

  const x = Math.cos(totalAngle) * radius;
  const y = Math.sin(totalAngle) * radius * 0.38; // flatten into ellipse

  const isHovered = hoveredName === tech.name;
  const isOther = hoveredName !== null && !isHovered;

  const size = tech.ring === 1 ? 52 : tech.ring === 2 ? 44 : 38;
  const fontSize = tech.ring === 1 ? 13 : tech.ring === 2 ? 11 : 10;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(50% + ${y}px - ${size / 2}px)`,
        width: size,
        height: size,
        zIndex: tech.ring === 1 ? 30 : tech.ring === 2 ? 20 : 10,
      }}
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 + tech.ring * 0.12 + (tech.angle / 360) * 0.3, type: "spring", stiffness: 200 }}
    >
      <motion.div
        className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-full"
        animate={{
          scale: isHovered ? 1.35 : isOther ? 0.75 : 1,
          opacity: isOther ? 0.35 : 1,
        }}
        whileHover={{ scale: 1.38 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onMouseEnter={() => onHover(tech.name)}
        onMouseLeave={() => onHover(null)}
        style={{
          background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12), rgba(0,0,0,0.3))`,
          border: isHovered
            ? `1.5px solid ${tech.accent}`
            : "0.5px solid rgba(255,255,255,0.14)",
          boxShadow: isHovered
            ? `0 0 24px ${tech.glow}, 0 0 8px ${tech.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`
            : `0 0 12px ${tech.glow}55, inset 0 1px 0 rgba(255,255,255,0.08)`,
          backdropFilter: "blur(8px)",
        }}
      >
        {/* inner ring */}
        <div
          className="pointer-events-none absolute inset-[4px] rounded-full opacity-30"
          style={{ border: `0.5px solid ${tech.accent}` }}
        />

        {/* icon */}
        <span
          className="relative z-10 font-bold leading-none"
          style={{ fontSize: fontSize + 1, color: tech.accent }}
        >
          {tech.icon}
        </span>

        {/* label */}
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md"
            style={{
              background: "rgba(8,6,20,0.88)",
              border: `0.5px solid ${tech.accent}55`,
              color: tech.accent,
              letterSpacing: "0.08em",
            }}
          >
            {tech.name}
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MAIN SECTION
───────────────────────────────────────────────────────────────────────────── */
export default function TechOrbitSection() {
  const [hoveredTech, setHoveredTech] = useState<string | null>(null);

  // Spinning angles for each ring (updated via RAF)
  const [ringAngles, setRingAngles] = useState([0, 0, 0, 0]);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = (ts: number) => {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000; // seconds

      setRingAngles([
        0,
        (elapsed / RING_SPEEDS[1]) * 360,
        -(elapsed / RING_SPEEDS[2]) * 360,
        (elapsed / RING_SPEEDS[3]) * 360,
      ]);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // 3D mouse tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-16, 16]), { stiffness: 90, damping: 22 });
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), { stiffness: 90, damping: 22 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      mouseX.set(e.clientX - rect.left - rect.width / 2);
      mouseY.set(e.clientY - rect.top - rect.height / 2);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const hoveredData = TECH.find((t) => t.name === hoveredTech);

  return (
    <section
      id="tech"
      className="relative overflow-hidden py-32 px-6 md:px-10"
      style={{ background: "#07060e" }}
    >
      {/* ── Stars ─────────────────────────────────────────────────────── */}
      <div className="absolute inset-0">
        <StarField />
      </div>

      {/* ── Deep bg gradients ─────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 65% 45% at 50% 60%, rgba(80,40,160,0.22) 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 40% 30% at 50% 75%, rgba(120,40,200,0.14) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* ── Grid lines ────────────────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">

        {/* ── Section header ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-20 text-center"
        >
          {/* eyebrow */}
          <div className="mb-4 inline-flex items-center gap-3">
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg,transparent,#c9a96e)",
              }}
            />
            <span
              className="text-[11px] font-medium uppercase tracking-[0.3em]"
              style={{ color: "#c9a96e" }}
            >
              Technical Arsenal
            </span>
            <div
              className="h-px w-10"
              style={{
                background: "linear-gradient(90deg,#c9a96e,transparent)",
              }}
            />
          </div>

          <h2
            className="mb-4 font-bold leading-tight tracking-tight"
            style={{
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              color: "#f0ecff",
            }}
          >
            Technologies I Work With
          </h2>

          <p
            className="mx-auto max-w-lg text-[15px] font-light leading-relaxed"
            style={{ color: "rgba(200,190,230,0.45)" }}
          >
            I&apos;m currently looking to join a{" "}
            <span style={{ color: "rgba(180,150,255,0.85)" }}>cross-functional</span>{" "}
            team that values improving people&apos;s lives through accessible, elegant design.
          </p>
        </motion.div>

        {/* ── Orbit system ──────────────────────────────────────────────── */}
        <div className="flex justify-center">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              width: 760,
              height: 520,
            }}
            className="relative"
            // fixed size container
          >
            <div
              className="relative"
              style={{ width: 760, height: 520, transformStyle: "preserve-3d" }}
            >

              {/* ── Elliptical ring tracks ─────────────────────────────── */}
              {[1, 2, 3].map((ring) => {
                const rx = RING_RADII[ring];
                const ry = rx * 0.38;
                const cx = 380, cy = 260;
                return (
                  <svg
                    key={ring}
                    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                    viewBox="0 0 760 520"
                  >
                    <ellipse
                      cx={cx}
                      cy={cy}
                      rx={rx}
                      ry={ry}
                      fill="none"
                      stroke={`rgba(160,123,212,${ring === 1 ? 0.18 : ring === 2 ? 0.12 : 0.08})`}
                      strokeWidth={ring === 1 ? 0.8 : 0.5}
                      strokeDasharray={ring === 3 ? "4 6" : "none"}
                    />
                  </svg>
                );
              })}

              {/* ── Connection lines (SVG, from core to each node) ────── */}
              <svg
                className="pointer-events-none absolute inset-0 overflow-visible"
                style={{ width: 760, height: 520 }}
                viewBox="0 0 760 520"
              >
                {TECH.map((tech) => {
                  const radius = RING_RADII[tech.ring];
                  const base = (tech.angle * Math.PI) / 180;
                  const live = (ringAngles[tech.ring] * Math.PI) / 180;
                  const a = base + live;
                  const nx = 380 + Math.cos(a) * radius;
                  const ny = 260 + Math.sin(a) * radius * 0.38;
                  const isHov = hoveredTech === tech.name;
                  return (
                    <line
                      key={tech.name}
                      x1={380} y1={260}
                      x2={nx} y2={ny}
                      stroke={
                        isHov
                          ? tech.accent
                          : `rgba(139,92,246,${0.06 + (3 - tech.ring) * 0.04})`
                      }
                      strokeWidth={isHov ? 1 : 0.5}
                      opacity={isHov ? 0.7 : 1}
                    />
                  );
                })}
              </svg>

              {/* ── Tech nodes ────────────────────────────────────────── */}
              {TECH.map((tech) => (
                <TechNode
                  key={tech.name}
                  tech={tech}
                  ringAngle={ringAngles[tech.ring]}
                  hoveredName={hoveredTech}
                  onHover={setHoveredTech}
                />
              ))}

              {/* ── Center Core ───────────────────────────────────────── */}
              <div
                className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
                style={{ width: 110, height: 110, marginLeft: 0, marginTop: 0 }}
              >
                {/* outer pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "0.5px solid rgba(160,123,212,0.35)",
                  }}
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    border: "0.5px solid rgba(160,123,212,0.2)",
                  }}
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeInOut" }}
                />

                {/* main orb */}
                <motion.div
                  animate={{ scale: [1, 1.04, 1] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="relative h-full w-full rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 38% 30%, rgba(180,140,255,0.35), rgba(80,40,160,0.7))",
                    border: "0.5px solid rgba(255,255,255,0.15)",
                    boxShadow:
                      "0 0 60px rgba(120,80,200,0.6), 0 0 120px rgba(100,60,180,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                  }}
                >
                  {/* inner ring */}
                  <div
                    className="absolute inset-[8px] rounded-full"
                    style={{
                      border: "0.5px solid rgba(255,255,255,0.1)",
                      background:
                        "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.08), transparent)",
                    }}
                  />

                  {/* animated rotating inner ring */}
                  <motion.div
                    className="absolute inset-[14px] rounded-full"
                    style={{ border: "0.5px dashed rgba(200,170,255,0.25)" }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  />

                  {/* center symbol */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {hoveredData ? (
                      <motion.span
                        key={hoveredData.name}
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-2xl font-bold"
                        style={{ color: hoveredData.accent }}
                      >
                        {hoveredData.icon}
                      </motion.span>
                    ) : (
                      <motion.span
                        className="text-3xl font-light"
                        style={{ color: "rgba(220,200,255,0.85)" }}
                        animate={{ rotate: [0, 360] }}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                      >
                        ✦
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {/* tooltip on hover */}
                {hoveredData && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-semibold tracking-wide"
                    style={{
                      background: "rgba(8,6,20,0.9)",
                      border: `0.5px solid ${hoveredData.accent}55`,
                      color: hoveredData.accent,
                      backdropFilter: "blur(12px)",
                    }}
                  >
                    {hoveredData.name}
                  </motion.div>
                )}
              </div>

              {/* ── Central floor glow ────────────────────────────────── */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 440,
                  height: 180,
                  background:
                    "radial-gradient(ellipse, rgba(100,60,200,0.22) 0%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: 280,
                  height: 100,
                  background:
                    "radial-gradient(ellipse, rgba(160,80,240,0.16) 0%, transparent 70%)",
                  filter: "blur(16px)",
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Legend / Skill chips ──────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-16 flex flex-wrap justify-center gap-2.5"
        >
          {TECH.map((tech, i) => (
            <motion.button
              key={tech.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 220 }}
              whileHover={{ scale: 1.08, y: -2 }}
              onMouseEnter={() => setHoveredTech(tech.name)}
              onMouseLeave={() => setHoveredTech(null)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11.5px] font-medium transition-colors"
              style={{
                background:
                  hoveredTech === tech.name
                    ? `${tech.accent}18`
                    : "rgba(255,255,255,0.045)",
                border:
                  hoveredTech === tech.name
                    ? `0.5px solid ${tech.accent}88`
                    : "0.5px solid rgba(255,255,255,0.1)",
                color:
                  hoveredTech === tech.name
                    ? tech.accent
                    : "rgba(200,190,230,0.6)",
              }}
            >
              <span style={{ fontSize: 12, color: tech.accent }}>{tech.icon}</span>
              {tech.name}
            </motion.button>
          ))}
        </motion.div>

        {/* ── Bottom CTA ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-16 flex flex-col items-center gap-3 text-center"
        >
          <div
            className="h-px w-24"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(160,123,212,0.4),transparent)",
            }}
          />
          <p
            className="text-[12px] font-medium uppercase tracking-[0.28em]"
            style={{ color: "rgba(200,190,230,0.28)" }}
          >
            {TECH.length}+ technologies &amp; counting
          </p>
        </motion.div>

      </div>
    </section>
  );
}
