"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Smartphone,
  Palette,
  MonitorSmartphone,
  Lightbulb,
  Clapperboard,
} from "lucide-react";

const services = [
  {
    title: "Web Development",
    icon: Code2,
    description:
      "Modern, responsive, and scalable web applications built with clean architecture and smooth user experiences.",
  },
  {
    title: "App Development",
    icon: Smartphone,
    description:
      "Interactive mobile-first applications designed for performance, usability, and seamless product flow.",
  },
  {
    title: "UI/UX Design",
    icon: Palette,
    description:
      "Thoughtful interfaces focused on clarity, accessibility, and elegant visual systems that feel intuitive.",
  },
  {
    title: "Frontend Systems",
    icon: MonitorSmartphone,
    description:
      "Pixel-perfect frontends with animation, responsiveness, reusable components, and polished micro-interactions.",
  },
  {
    title: "Prototyping",
    icon: Lightbulb,
    description:
      "From idea to interactive concept, transforming product visions into fast, testable, and meaningful prototypes.",
  },
  {
    title: "Creative Editing",
    icon: Clapperboard,
    description:
      "Motion-driven visual edits and digital presentation assets that make products feel premium and alive.",
  },
];

function ServiceCard({
  title,
  description,
  icon: Icon,
  delay,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="group relative overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl shadow-[0_10px_50px_rgba(139,92,246,0.08)]"
    >
      {/* hover glow */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.12)_0%,transparent_50%,rgba(217,70,239,0.08)_100%)]" />
      </div>

      {/* shine */}
      <div className="absolute -left-1/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

      {/* top line */}
      <div className="absolute left-[12%] right-[12%] top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

      <div className="relative z-10 flex h-full flex-col items-center text-center">
        <div className="mb-6 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 shadow-[0_0_30px_rgba(139,92,246,0.14)]">
          <Icon className="h-10 w-10 text-violet-300" strokeWidth={1.8} />
        </div>

        <h3 className="text-lg font-extrabold uppercase tracking-[0.22em] text-white sm:text-xl">
          {title}
        </h3>

        <div className="mt-4 h-[2px] w-12 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />

        <p className="mt-5 text-sm leading-7 text-white/55">
          {description}
        </p>
      </div>
    </motion.div>
  );
}

export default function ServicesSection() {
  return (
    <section id="services" className="relative overflow-hidden px-6 py-24 md:px-10">
      {/* background */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_60%_40%_at_50%_10%,rgba(139,92,246,0.12),transparent)]" />
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_40%_30%_at_80%_80%,rgba(217,70,239,0.08),transparent)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {/* floating glow blobs */}
      <div className="absolute left-[10%] top-24 -z-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute right-[8%] bottom-16 -z-10 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        {/* heading */}
        <div className="relative text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-300/70"
          >
            What I Do
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative z-10 mt-3 text-4xl font-black text-white sm:text-5xl md:text-6xl"
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
          >
            Services
          </motion.h2>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[4.8rem] font-black uppercase leading-none text-white/[0.05] sm:text-[7rem] md:text-[9rem]"
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
          >
            Services
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="relative z-10 mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base"
          >
            I build modern digital experiences with a balance of design,
            performance, and scalability — turning ideas into refined and usable products.
          </motion.p>
        </div>

        {/* cards */}
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              title={service.title}
              description={service.description}
              icon={service.icon}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}