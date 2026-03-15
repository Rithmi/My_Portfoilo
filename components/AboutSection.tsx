"use client";

import { motion } from "framer-motion";

function InfoCard({
  title,
  value,
  delay = 0,
}: {
  title: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55, delay }}
      whileHover={{ y: -4, scale: 1.02 }}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl shadow-[0_10px_40px_rgba(139,92,246,0.12)]"
    >
      <p className="text-[11px] uppercase tracking-[0.28em] text-white/40">{title}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </motion.div>
  );
}

function TimelineItem({
  role,
  company,
  period,
  description,
  delay = 0,
}: {
  role: string;
  company: string;
  period: string;
  description: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay }}
      className="relative pl-8"
    >
      <div className="absolute left-0 top-1 h-3 w-3 rounded-full bg-violet-400 shadow-[0_0_14px_rgba(167,139,250,0.9)]" />
      <div className="absolute left-[5px] top-5 bottom-[-28px] w-px bg-gradient-to-b from-violet-400/50 to-transparent" />

      <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl">
        <p className="text-[11px] uppercase tracking-[0.22em] text-violet-300/70">
          {period}
        </p>
        <h3 className="mt-2 text-xl font-black text-white">{role}</h3>
        <p className="mt-1 text-sm font-medium text-fuchsia-300">{company}</p>
        <p className="mt-3 text-sm leading-7 text-white/60">{description}</p>
      </div>
    </motion.div>
  );
}

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden px-6 py-24 md:px-10"
    >
      {/* background glow */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_40%_at_20%_20%,rgba(139,92,246,0.16),transparent)]" />
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_50%_35%_at_80%_70%,rgba(217,70,239,0.10),transparent)]" />

      {/* grid */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.018)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.018)_1px,transparent_1px)] bg-[size:72px_72px]" />

      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT SIDE */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.035] p-5 backdrop-blur-2xl shadow-[0_0_120px_rgba(139,92,246,0.12)]">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(139,92,246,0.08)_0%,transparent_50%,rgba(217,70,239,0.05)_100%)]" />

            <div className="relative z-10">
              <div className="overflow-hidden rounded-[28px] border border-white/10">
                <img
                  src="/images/new.png"
                  alt="About profile"
                  className="h-[520px] w-full object-cover"
                />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <InfoCard title="Experience" value="3+ Years" delay={0.1} />
                <InfoCard title="Projects" value="40+" delay={0.2} />
                <InfoCard title="Availability" value="Freelance" delay={1.4} />
                <InfoCard title="Role" value="Software Engineer" delay={1.5} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <div className="relative">


          <motion.h2
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 max-w-2xl text-4xl font-black leading-tight text-white sm:text-5xl"
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
          >
            <span className="bg-clip-text text-transparent bg-[linear-gradient(135deg,#e0c3fc_0%,#c084fc_30%,#f0abfc_60%,#818cf8_100%)]">
              {" "}
              About Me
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="mt-6 max-w-2xl text-base leading-8 text-white/60"
          >
            I’m Rithmi Thewarapperuma, a passionate Software Engineering undergraduate at The Open University of Sri Lanka, with a strong interest in building modern digital solutions. I enjoy transforming ideas into practical applications through full-stack development, mobile applications, and backend integration.

            I’m a dedicated and innovative Software Engineer with a passion for
            creating robust, scalable, and visually engaging software solutions.
            I enjoy blending backend reliability with polished frontend
            experiences to build products that feel modern and alive.
          </motion.p>



          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            {["Frontend Systems", "Backend Architecture", "UI/UX Thinking", "Scalable Apps"].map(
              (item, i) => (
                <div
                  key={item}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-white/75 backdrop-blur-md"
                  style={{
                    boxShadow:
                      i % 2 === 0
                        ? "0 0 30px rgba(139,92,246,0.08)"
                        : "0 0 30px rgba(217,70,239,0.08)",
                  }}
                >
                  {item}
                </div>
              )
            )}
          </motion.div>

          <div className="mt-12 space-y-8">
            <TimelineItem
              role="QA Intern"
              company="Neo Solutions."
              period="2025 — 2025"
              description="Performed manual testing on web applications, created test cases, reported defects, and worked closely with developers to ensure product quality and reliability."
              delay={0.15}
            />

            <TimelineItem
              role="Associate Software Engineer"
              company="Digitize Solutions."
              period="2025 — 2026"
              description="Developed and enhanced web-based applications using modern technologies, contributed to feature development, and ensured code quality through collaboration and testing."
              delay={0.25}
            />
          </div>
        </div>
      </div>
    </section>
  );
}