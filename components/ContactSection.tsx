"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Linkedin } from "lucide-react";
import type { ElementType } from "react";

type ContactItem = {
  title: string;
  value: string[];
  icon: ElementType;
  href?: string;
};

const contacts: ContactItem[] = [
  {
    title: "Address",
    value: ["No.A/1/1/3", "Polhengoda, Colombo 05,", "Sri Lanka"],
    icon: MapPin,
  },
  {
    title: "Contact Number",
    value: ["+94 75 036 0535"],
    icon: Phone,
    href: "tel:+94750360535",
  },
  {
    title: "Email Address",
    value: ["rithmithewarapperuma64@gmail.com"],
    icon: Mail,
    href: "mailto:rithmithewarapperuma64@gmail.com",
  },
  {
    title: "LinkedIn",
    value: ["Rithmi", "Thewarapperuma"],
    icon: Linkedin,
    href: "https://lk.linkedin.com/in/rithmi-thewarapperuma",
  },
];

function ContactCard({
  title,
  value,
  icon: Icon,
  href,
  delay,
}: {
  title: string;
  value: string[];
  icon: ElementType;
  href?: string;
  delay: number;
}) {
  const isLink = Boolean(href);
  const isExternal = href?.startsWith("http");

  const cardClassName =
    "group relative block overflow-hidden rounded-[30px] border border-white/10 bg-white/[0.04] p-8 text-center backdrop-blur-2xl shadow-[0_10px_50px_rgba(139,92,246,0.08)] transition-transform duration-300";

  const content = (
    <>
      {/* hover gradient */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.12)_0%,transparent_50%,rgba(217,70,239,0.08)_100%)]" />
      </div>

      {/* top glow line */}
      <div className="absolute left-[12%] right-[12%] top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

      {/* shine */}
      <div className="absolute -left-1/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100" />

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-7 flex h-24 w-24 items-center justify-center rounded-full border border-violet-400/15 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]">
          <Icon className="h-10 w-10 text-violet-300" strokeWidth={2} />
        </div>

        <h3 className="text-xl font-black uppercase tracking-[0.14em] text-white">
          {title}
        </h3>

        <div className="mt-4 h-[2px] w-12 rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" />

        <div className="mt-6 space-y-2">
          {value.map((line, i) => (
            <p
              key={`${title}-${i}-${line}`}
              className="text-base leading-8 text-white/60 transition-colors duration-300 group-hover:text-white/80"
            >
              {line}
            </p>
          ))}
        </div>
      </div>
    </>
  );

  if (isLink && href) {
    return (
      <motion.a
        href={href}
        target={isExternal ? "_blank" : "_self"}
        rel={isExternal ? "noreferrer noopener" : undefined}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.6, delay }}
        whileHover={{ y: -8, scale: 1.02 }}
        className={cardClassName}
      >
        {content}
      </motion.a>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={cardClassName}
    >
      {content}
    </motion.div>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-24 md:px-10">
      {/* background */}
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.12),transparent)]" />
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_40%_30%_at_80%_80%,rgba(217,70,239,0.08),transparent)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="absolute left-[10%] top-24 -z-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute right-[8%] bottom-20 -z-10 h-52 w-52 rounded-full bg-fuchsia-500/10 blur-3xl" />

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
            Get In Touch
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative z-10 mt-3 text-4xl font-black text-white sm:text-5xl md:text-6xl"
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
          >
            Contact Me
          </motion.h2>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 text-[4.5rem] font-black uppercase leading-none text-white/[0.05] sm:text-[7rem] md:text-[9rem]"
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
          >
            Contact
          </div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="relative z-10 mx-auto mt-5 max-w-3xl text-sm leading-7 text-white/55 sm:text-base"
          >
            Ready to build something meaningful together? Reach out through the
            details below and let’s create a digital experience that feels modern,
            polished, and memorable.
          </motion.p>
        </div>

        {/* cards */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {contacts.map((item, i) => (
            <ContactCard
              key={item.title}
              title={item.title}
              value={item.value}
              icon={item.icon}
              href={item.href}
              delay={i * 0.08}
            />
          ))}
        </div>
      </div>
    </section>
  );
}