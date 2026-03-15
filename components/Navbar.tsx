"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Orbit", href: "#tech" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActive(visible[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.65],
        rootMargin: "-20% 0px -45% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const sectionIds = useMemo(() => NAV_LINKS.map((link) => link.href.slice(1)), []);
  const activeSection = useActiveSection(sectionIds);

  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu();
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [closeMenu]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-full border transition-all duration-300 ${
          scrolled
            ? "border-white/10 bg-black/55 shadow-[0_12px_50px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
            : "border-white/8 bg-black/30 backdrop-blur-xl"
        } px-4 py-3 md:px-5`}
      >
        {/* Logo */}
        <a
          href="#hero"
          onClick={closeMenu}
          className="group relative flex items-center gap-3"
        >
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full border border-violet-400/20 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.18)]">
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.22),transparent_70%)]" />
            <span className="relative text-sm font-black uppercase tracking-[0.18em] text-white">
              R
            </span>
          </div>

          <div className="hidden sm:block">
            <p
              className="text-sm font-black uppercase tracking-[0.38em] text-white"
              style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
            >
              RITHMI
            </p>
            <p className="text-[10px] uppercase tracking-[0.34em] text-white/35">
              Portfolio
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center md:flex">
          <div className="relative flex items-center gap-1 rounded-full border border-white/6 bg-white/[0.03] px-2 py-1">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.href.slice(1);

              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={isActive ? "page" : undefined}
                  className={`relative rounded-full px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.28em] transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-pill"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      className="absolute inset-0 -z-10 rounded-full border border-violet-300/20 bg-[linear-gradient(135deg,rgba(139,92,246,0.38),rgba(217,70,239,0.20))] shadow-[0_0_30px_rgba(139,92,246,0.18)]"
                    />
                  )}
                  {link.label}
                </a>
              );
            })}
          </div>
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex">
          <a
            href="#contact"
            className="group relative inline-flex items-center overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.3em] text-white transition-all duration-300 hover:border-violet-300/30 hover:text-violet-100"
          >
            <span className="relative z-10">Hire Me</span>
            <span className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.16),rgba(217,70,239,0.10))] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white transition hover:border-violet-300/30 md:hidden"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-3 max-w-7xl md:hidden"
          >
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black/70 p-3 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
              <div className="space-y-1">
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href.slice(1);

                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={closeMenu}
                      className={`block rounded-2xl px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em] transition ${
                        isActive
                          ? "bg-[linear-gradient(135deg,rgba(139,92,246,0.28),rgba(217,70,239,0.14))] text-white"
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.label}
                    </a>
                  );
                })}

                <a
                  href="#contact"
                  onClick={closeMenu}
                  className="mt-2 block rounded-2xl bg-[linear-gradient(135deg,#7c3aed,#a855f7,#d946ef)] px-4 py-3 text-center text-sm font-bold uppercase tracking-[0.24em] text-white shadow-[0_10px_30px_rgba(168,85,247,0.28)]"
                >
                  Hire Me
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}