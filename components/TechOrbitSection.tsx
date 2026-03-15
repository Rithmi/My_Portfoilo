"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   TECH DATA
───────────────────────────────────────────────────────────────────────────── */
const TECH = [
  { name: "React", icon: "⚛", ring: 1, angle: 0, accent: "#61dafb", glow: "rgba(97,218,251,0.55)" },
  { name: "Next.js", icon: "N", ring: 1, angle: 51, accent: "#ffffff", glow: "rgba(255,255,255,0.45)" },
  { name: "TypeScript", icon: "TS", ring: 1, angle: 102, accent: "#3178c6", glow: "rgba(49,120,198,0.6)" },
  { name: "Node.js", icon: "⬡", ring: 1, angle: 153, accent: "#68a063", glow: "rgba(104,160,99,0.55)" },
  { name: "Three.js", icon: "◈", ring: 1, angle: 204, accent: "#a07bd4", glow: "rgba(160,123,212,0.6)" },
  { name: "Figma", icon: "◰", ring: 1, angle: 255, accent: "#f24e1e", glow: "rgba(242,78,30,0.5)" },
  { name: "Python", icon: "Py", ring: 1, angle: 306, accent: "#3572a5", glow: "rgba(53,114,165,0.55)" },

  { name: "CSS", icon: "✦", ring: 2, angle: 18, accent: "#2965f1", glow: "rgba(41,101,241,0.5)" },
  { name: "HTML", icon: "◬", ring: 2, angle: 66, accent: "#e44d26", glow: "rgba(228,77,38,0.5)" },
  { name: "Git", icon: "⌥", ring: 2, angle: 114, accent: "#f05032", glow: "rgba(240,80,50,0.5)" },
  { name: "MySQL", icon: "⊛", ring: 2, angle: 162, accent: "#00758f", glow: "rgba(0,117,143,0.5)" },
  { name: "PHP", icon: "◍", ring: 2, angle: 210, accent: "#8993be", glow: "rgba(137,147,190,0.5)" },
  { name: "WebGL", icon: "✧", ring: 2, angle: 258, accent: "#c084fc", glow: "rgba(192,132,252,0.55)" },
  { name: "GSAP", icon: "⌬", ring: 2, angle: 306, accent: "#88ce02", glow: "rgba(136,206,2,0.5)" },
  { name: "Docker", icon: "⊞", ring: 2, angle: 354, accent: "#2496ed", glow: "rgba(36,150,237,0.5)" },

  { name: "C/C++", icon: "©", ring: 3, angle: 30, accent: "#a8b9cc", glow: "rgba(168,185,204,0.45)" },
  { name: "Tailwind", icon: "≋", ring: 3, angle: 78, accent: "#38bdf8", glow: "rgba(56,189,248,0.5)" },
  { name: "Framer", icon: "◉", ring: 3, angle: 126, accent: "#0055ff", glow: "rgba(0,85,255,0.5)" },
  { name: "Redux", icon: "∇", ring: 3, angle: 174, accent: "#764abc", glow: "rgba(118,74,188,0.5)" },
  { name: "Jest", icon: "◎", ring: 3, angle: 222, accent: "#c21325", glow: "rgba(194,19,37,0.5)" },
  { name: "Vercel", icon: "▲", ring: 3, angle: 270, accent: "#ffffff", glow: "rgba(255,255,255,0.4)" },
  { name: "AWS", icon: "☁", ring: 3, angle: 318, accent: "#ff9900", glow: "rgba(255,153,0,0.5)" },
] as const;

const RING_RADII = [0, 155, 240, 330];
const RING_SPEEDS = [0, 28, 42, 58];

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function round(n: number, places = 3) {
  return Number(n.toFixed(places));
}

function getNodeSize(ring: number) {
  if (ring === 1) return 52;
  if (ring === 2) return 44;
  return 38;
}

function getFontSize(ring: number) {
  if (ring === 1) return 13;
  if (ring === 2) return 11;
  return 10;
}

function getOrbitPosition(angleDeg: number, ringAngleDeg: number, radius: number) {
  const base = (angleDeg * Math.PI) / 180;
  const live = (ringAngleDeg * Math.PI) / 180;
  const total = base + live;

  const x = round(Math.cos(total) * radius);
  const y = round(Math.sin(total) * radius * 0.38);

  return { x, y };
}

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

    let W = 0;
    let H = 0;
    let raf = 0;

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
  mounted,
}: {
  tech: (typeof TECH)[number];
  ringAngle: number;
  hoveredName: string | null;
  onHover: (name: string | null) => void;
  mounted: boolean;
}) {
  const radius = RING_RADII[tech.ring];
  const { x, y } = getOrbitPosition(tech.angle, ringAngle, radius);

  const isHovered = hoveredName === tech.name;
  const isOther = hoveredName !== null && !isHovered;

  const size = getNodeSize(tech.ring);
  const fontSize = getFontSize(tech.ring);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `calc(50% + ${x}px - ${size / 2}px)`,
        top: `calc(50% + ${y}px - ${size / 2}px)`,
        width: `${size}px`,
        height: `${size}px`,
        zIndex: tech.ring === 1 ? 30 : tech.ring === 2 ? 20 : 10,
      }}
      initial={mounted ? { opacity: 0, scale: 0 } : false}
      whileInView={mounted ? { opacity: 1, scale: 1 } : undefined}
      viewport={{ once: true }}
      transition={{
        delay: 0.1 + tech.ring * 0.12 + (tech.angle / 360) * 0.3,
        type: "spring",
        stiffness: 200,
      }}
    >
      <motion.div
        className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-full"
        animate={
          mounted
            ? {
                scale: isHovered ? 1.35 : isOther ? 0.75 : 1,
                opacity: isOther ? 0.35 : 1,
              }
            : false
        }
        whileHover={mounted ? { scale: 1.38 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onMouseEnter={() => onHover(tech.name)}
        onMouseLeave={() => onHover(null)}
        style={{
          background:
            "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12), rgba(0,0,0,0.3))",
          border: isHovered
            ? `1.5px solid ${tech.accent}`
            : "0.5px solid rgba(255,255,255,0.14)",
          boxShadow: isHovered
            ? `0 0 24px ${tech.glow}, 0 0 8px ${tech.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`
            : `0 0 12px ${tech.glow}55, inset 0 1px 0 rgba(255,255,255,0.08)`,
          backdropFilter: "blur(8px)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-[4px] rounded-full opacity-30"
          style={{ border: `0.5px solid ${tech.accent}` }}
        />

        <span
          className="relative z-10 font-bold leading-none"
          style={{ fontSize: fontSize + 1, color: tech.accent }}
        >
          {tech.icon}
        </span>

        {isHovered && (
          <motion.div
            initial={mounted ? { opacity: 0, y: 6, scale: 0.9 } : false}
            animate={mounted ? { opacity: 1, y: 0, scale: 1 } : undefined}
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
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [ringAngles, setRingAngles] = useState<[number, number, number, number]>([0, 0, 0, 0]);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const tick = (ts: number) => {
      if (startRef.current === null) startRef.current = ts;
      const elapsed = (ts - startRef.current) / 1000;

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
  }, [mounted]);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-16, 16]), {
    stiffness: 90,
    damping: 22,
  });

  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [10, -10]), {
    stiffness: 90,
    damping: 22,
  });

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

  const orbitWidth = isMobile ? 340 : 760;
  const orbitHeight = isMobile ? 340 : 520;
  const viewBox = isMobile ? "0 0 340 340" : "0 0 760 520";
  const cx = isMobile ? 170 : 380;
  const cy = isMobile ? 170 : 260;
  const ellipseScaleY = isMobile ? 0.72 : 0.38;

  const mobileRadii = useMemo(() => [0, 70, 110, 145], []);
  const activeRadii = isMobile ? mobileRadii : RING_RADII;

  return (
    <section
      id="tech"
      className="relative overflow-hidden px-5 py-24 sm:px-6 md:px-10 md:py-32"
      style={{ background: "#07060e" }}
    >
      <div className="absolute inset-0">
        <StarField />
      </div>

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

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.018]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,1) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 text-center sm:mb-16 md:mb-20"
        >
          <div className="mb-4 inline-flex items-center gap-3">
            <div
              className="h-px w-8 sm:w-10"
              style={{ background: "linear-gradient(90deg,transparent,#c9a96e)" }}
            />
            <span
              className="text-[10px] font-medium uppercase tracking-[0.26em] sm:text-[11px] sm:tracking-[0.3em]"
              style={{ color: "#c9a96e" }}
            >
              Technical Arsenal
            </span>
            <div
              className="h-px w-8 sm:w-10"
              style={{ background: "linear-gradient(90deg,#c9a96e,transparent)" }}
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
            className="mx-auto max-w-lg text-[14px] font-light leading-relaxed sm:text-[15px]"
            style={{ color: "rgba(200,190,230,0.45)" }}
          >
            I&apos;m currently looking to join a{" "}
            <span style={{ color: "rgba(180,150,255,0.85)" }}>cross-functional</span>{" "}
            team that values improving people&apos;s lives through accessible, elegant design.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
              rotateX: mounted ? rotateX : 0,
              rotateY: mounted ? rotateY : 0,
              transformStyle: "preserve-3d",
              width: orbitWidth,
              height: orbitHeight,
              maxWidth: "100%",
            }}
            className="relative"
          >
            <div
              className="relative mx-auto"
              style={{
                width: orbitWidth,
                height: orbitHeight,
                maxWidth: "100%",
                transformStyle: "preserve-3d",
              }}
            >
              {[1, 2, 3].map((ring) => {
                const rx = activeRadii[ring];
                const ry = round(rx * ellipseScaleY);
                return (
                  <svg
                    key={ring}
                    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                    viewBox={viewBox}
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

              <svg
                className="pointer-events-none absolute inset-0 overflow-visible"
                style={{ width: orbitWidth, height: orbitHeight }}
                viewBox={viewBox}
              >
                {TECH.map((tech) => {
                  const radius = activeRadii[tech.ring];
                  const base = (tech.angle * Math.PI) / 180;
                  const live = (ringAngles[tech.ring] * Math.PI) / 180;
                  const a = base + live;
                  const nx = round(cx + Math.cos(a) * radius);
                  const ny = round(cy + Math.sin(a) * radius * ellipseScaleY);
                  const isHov = hoveredTech === tech.name;

                  return (
                    <line
                      key={tech.name}
                      x1={cx}
                      y1={cy}
                      x2={nx}
                      y2={ny}
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

              {TECH.map((tech) => {
                const radius = activeRadii[tech.ring];
                const ringAngle = ringAngles[tech.ring];

                const adjustedTech = { ...tech };
                const originalRadius = RING_RADII[tech.ring];
                const pos = getOrbitPosition(tech.angle, ringAngle, radius);

                return (
                  <motion.div
                    key={tech.name}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${pos.x}px - ${getNodeSize(tech.ring) / 2}px)`,
                      top: `calc(50% + ${round((pos.y / 0.38) * ellipseScaleY)}px - ${getNodeSize(tech.ring) / 2}px)`,
                      width: `${getNodeSize(tech.ring)}px`,
                      height: `${getNodeSize(tech.ring)}px`,
                      zIndex: tech.ring === 1 ? 30 : tech.ring === 2 ? 20 : 10,
                    }}
                    initial={mounted ? { opacity: 0, scale: 0 } : false}
                    whileInView={mounted ? { opacity: 1, scale: 1 } : undefined}
                    viewport={{ once: true }}
                    transition={{
                      delay: 0.1 + tech.ring * 0.12 + (tech.angle / 360) * 0.3,
                      type: "spring",
                      stiffness: 200,
                    }}
                  >
                    <motion.div
                      className="relative flex h-full w-full cursor-pointer flex-col items-center justify-center rounded-full"
                      animate={
                        mounted
                          ? {
                              scale:
                                hoveredTech === tech.name
                                  ? 1.35
                                  : hoveredTech !== null
                                  ? 0.75
                                  : 1,
                              opacity:
                                hoveredTech !== null && hoveredTech !== tech.name ? 0.35 : 1,
                            }
                          : false
                      }
                      whileHover={mounted ? { scale: 1.38 } : undefined}
                      transition={{ type: "spring", stiffness: 300, damping: 22 }}
                      onMouseEnter={() => setHoveredTech(tech.name)}
                      onMouseLeave={() => setHoveredTech(null)}
                      style={{
                        background:
                          "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.12), rgba(0,0,0,0.3))",
                        border:
                          hoveredTech === tech.name
                            ? `1.5px solid ${tech.accent}`
                            : "0.5px solid rgba(255,255,255,0.14)",
                        boxShadow:
                          hoveredTech === tech.name
                            ? `0 0 24px ${tech.glow}, 0 0 8px ${tech.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`
                            : `0 0 12px ${tech.glow}55, inset 0 1px 0 rgba(255,255,255,0.08)`,
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <div
                        className="pointer-events-none absolute inset-[4px] rounded-full opacity-30"
                        style={{ border: `0.5px solid ${tech.accent}` }}
                      />

                      <span
                        className="relative z-10 font-bold leading-none"
                        style={{ fontSize: getFontSize(tech.ring) + 1, color: tech.accent }}
                      >
                        {tech.icon}
                      </span>

                      {hoveredTech === tech.name && (
                        <motion.div
                          initial={mounted ? { opacity: 0, y: 6, scale: 0.9 } : false}
                          animate={mounted ? { opacity: 1, y: 0, scale: 1 } : undefined}
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
              })}

              <div
                className="absolute left-1/2 top-1/2 z-40 -translate-x-1/2 -translate-y-1/2"
                style={{
                  width: isMobile ? 86 : 110,
                  height: isMobile ? 86 : 110,
                }}
              >
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: "0.5px solid rgba(160,123,212,0.35)" }}
                  animate={mounted ? { scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] } : false}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                />

                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ border: "0.5px solid rgba(160,123,212,0.2)" }}
                  animate={mounted ? { scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] } : false}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeInOut" }}
                />

                <motion.div
                  animate={mounted ? { scale: [1, 1.04, 1] } : false}
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
                  <div
                    className="absolute inset-[8px] rounded-full"
                    style={{
                      border: "0.5px solid rgba(255,255,255,0.1)",
                      background:
                        "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.08), transparent)",
                    }}
                  />

                  <motion.div
                    className="absolute inset-[14px] rounded-full"
                    style={{ border: "0.5px dashed rgba(200,170,255,0.25)" }}
                    animate={mounted ? { rotate: 360 } : false}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    {hoveredData ? (
                      <motion.span
                        key={hoveredData.name}
                        initial={mounted ? { scale: 0.6, opacity: 0 } : false}
                        animate={mounted ? { scale: 1, opacity: 1 } : undefined}
                        className="text-xl font-bold sm:text-2xl"
                        style={{ color: hoveredData.accent }}
                      >
                        {hoveredData.icon}
                      </motion.span>
                    ) : (
                      <motion.span
                        className="text-2xl font-light sm:text-3xl"
                        style={{ color: "rgba(220,200,255,0.85)" }}
                        animate={mounted ? { rotate: [0, 360] } : false}
                        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                      >
                        ✦
                      </motion.span>
                    )}
                  </div>
                </motion.div>

                {hoveredData && (
                  <motion.div
                    initial={mounted ? { opacity: 0, y: 8 } : false}
                    animate={mounted ? { opacity: 1, y: 0 } : undefined}
                    className="absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-semibold tracking-wide"
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

              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: isMobile ? 220 : 440,
                  height: isMobile ? 110 : 180,
                  background:
                    "radial-gradient(ellipse, rgba(100,60,200,0.22) 0%, transparent 70%)",
                  filter: "blur(24px)",
                }}
              />
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: isMobile ? 160 : 280,
                  height: isMobile ? 70 : 100,
                  background:
                    "radial-gradient(ellipse, rgba(160,80,240,0.16) 0%, transparent 70%)",
                  filter: "blur(16px)",
                }}
              />
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="mt-12 flex flex-wrap justify-center gap-2.5 sm:mt-16"
        >
          {TECH.map((tech, i) => (
            <motion.button
              key={tech.name}
              initial={mounted ? { opacity: 0, scale: 0.8 } : false}
              whileInView={mounted ? { opacity: 1, scale: 1 } : undefined}
              viewport={{ once: true }}
              transition={{ delay: 0.05 * i, type: "spring", stiffness: 220 }}
              whileHover={mounted ? { scale: 1.08, y: -2 } : undefined}
              onMouseEnter={() => setHoveredTech(tech.name)}
              onMouseLeave={() => setHoveredTech(null)}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium sm:text-[11.5px]"
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="mt-14 flex flex-col items-center gap-3 text-center sm:mt-16"
        >
          <div
            className="h-px w-24"
            style={{
              background:
                "linear-gradient(90deg,transparent,rgba(160,123,212,0.4),transparent)",
            }}
          />
          <p
            className="text-[11px] font-medium uppercase tracking-[0.24em] sm:text-[12px] sm:tracking-[0.28em]"
            style={{ color: "rgba(200,190,230,0.28)" }}
          >
            {TECH.length}+ technologies &amp; counting
          </p>
        </motion.div>
      </div>
    </section>
  );
}