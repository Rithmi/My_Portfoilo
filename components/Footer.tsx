"use client";

import { motion } from "framer-motion";

const footerLinks = [
  { label: "About", href: "#about" },
  { label: "Stack", href: "#stack" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

const socials = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Dribbble", href: "#" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 pb-8 pt-20 md:px-10">
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_50%_30%_at_50%_0%,rgba(139,92,246,0.12),transparent)]" />
      <div className="absolute left-[12%] top-10 -z-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute right-[10%] bottom-8 -z-10 h-48 w-48 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="overflow-hidden rounded-[34px] border border-white/10 bg-white/[0.04] p-8 shadow-[0_10px_50px_rgba(139,92,246,0.08)] backdrop-blur-2xl md:p-10"
        >
          <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-violet-300/70">
                Let&apos;s Build
              </p>
              <h3
                className="mt-4 max-w-xl text-3xl font-black leading-tight text-white sm:text-4xl"
                style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
              >
                Designing modern experiences with motion, clarity, and clean code.
              </h3>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
                I create polished digital products that balance design,
                performance, and usability across web and mobile.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="rounded-full bg-[linear-gradient(135deg,#7c3aed,#a855f7,#d946ef)] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_30px_rgba(168,85,247,0.28)] transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Start a Project
                </a>
                <a
                  href="#projects"
                  className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-sm font-bold text-white/75 transition-colors hover:border-violet-400/30 hover:text-white"
                >
                  View Work
                </a>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-white">
                  Navigation
                </p>
                <div className="mt-5 space-y-3">
                  {footerLinks.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="block text-sm text-white/55 transition-colors hover:text-violet-300"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-white">
                  Socials
                </p>
                <div className="mt-5 space-y-3">
                  {socials.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-sm text-white/55 transition-colors hover:text-violet-300"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="mt-6 flex flex-col gap-3 text-sm text-white/40 md:flex-row md:items-center md:justify-between">
            <p>© 2025 Rithmi. All rights reserved.</p>
            <p>Crafted with Next.js, Tailwind CSS, and Framer Motion.</p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}