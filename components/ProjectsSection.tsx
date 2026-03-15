"use client";

import { motion } from "framer-motion";

type Project = {
  id: number;
  title: string;
  category: string;
  image: string;
  size: "normal" | "wide";
};

const projects: Project[] = [
  {
    id: 1,
    title: "Project Management Dashboard",
    category: "Web Development",
    image: "/images/projects/project-1.png",
    size: "normal",
  },
  {
    id: 2,
    title: "Admin Dashboard",
    category: "UI / Dashboard",
    image: "/images/projects/project-2.png",
    size: "normal",
  },
  {
    id: 3,
    title: "Kanban Task Manager",
    category: "Web Application",
    image: "/images/projects/project-3.png",
    size: "normal",
  },
  {
    id: 4,
    title: "Digital Business Card",
    category: "Personal Branding",
    image: "/images/projects/project-4.png",
    size: "wide",
  },
  {
    id: 5,
    title: "Modern Business Profile",
    category: "Web Experience",
    image: "/images/projects/project-5.png",
    size: "wide",
  },
  {
    id: 6,
    title: "Trading Bot Dashboard",
    category: "Fintech / Dashboard",
    image: "/images/projects/project-6.png",
    size: "normal",
  },
  {
    id: 7,
    title: "Crypto Analytics Panel",
    category: "Web Experience",
    image: "/images/projects/project-7.png",
    size: "normal",
  },
  {
    id: 8,
    title: "Trading API Keys",
    category: "Analytics Platform",
    image: "/images/projects/project-8.png",
    size: "normal",
  },
];

function ProjectCard({
  title,
  category,
  image,
  delay,
  wide = false,
}: {
  title: string;
  category: string;
  image: string;
  delay: number;
  wide?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, delay }}
      whileHover={{ y: -8 }}
      className={`group relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_14px_50px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
        wide ? "min-h-[360px] md:min-h-[390px]" : "min-h-[320px] md:min-h-[360px]"
      }`}
    >
      <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(217,70,239,0.14),transparent_30%)]" />
      </div>

      <div className="relative h-full w-full overflow-hidden">
        <motion.img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#05030d] via-[#05030d]/35 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950/20 via-transparent to-fuchsia-900/10" />

        <div className="absolute -left-1/3 top-0 h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-all duration-700 group-hover:left-[125%] group-hover:opacity-100" />

        <div className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-7 md:p-8">
          <div className="mb-3 inline-flex items-center rounded-full border border-violet-300/20 bg-violet-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-violet-200/80 sm:text-[11px]">
            {category}
          </div>

          <h3 className="max-w-[90%] text-lg font-extrabold leading-tight text-white sm:text-l md:text-[1.25rem]">
            {title}
          </h3>
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectsSection() {
  const topProjects = projects.filter((project) => project.size === "normal");
  const bottomProjects = projects.filter((project) => project.size === "wide");

  return (
    <section
      id="projects"
      className="relative overflow-hidden px-6 py-24 md:px-10 md:py-28"
    >
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(139,92,246,0.14),transparent)]" />
      <div className="absolute inset-0 -z-30 bg-[radial-gradient(ellipse_35%_24%_at_82%_82%,rgba(217,70,239,0.10),transparent)]" />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:70px_70px]" />

      <div className="absolute left-[6%] top-24 -z-10 h-40 w-40 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="absolute right-[8%] bottom-16 -z-10 h-56 w-56 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="mx-auto max-w-7xl">
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.38em] text-violet-300/70"
          >
            My Work
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative z-10 mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl"
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
          >
            Featured Projects
          </motion.h2>

          <div
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 hidden -translate-x-1/2 -translate-y-1/2 select-none text-[6rem] font-black uppercase leading-none text-white/[0.04] md:block lg:text-[8rem]"
            style={{ fontFamily: "'Syne', 'Space Grotesk', sans-serif" }}
          >
            Projects
          </div>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="relative z-10 mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/60 sm:text-base"
          >
            Explore selected web and mobile experiences that reflect my focus on
            clean design, thoughtful interactions, and modern development.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {topProjects.map((project, index) => (
            <ProjectCard
              key={`project-${project.id}`}
              title={project.title}
              category={project.category}
              image={project.image}
              delay={index * 0.08}
            />
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {bottomProjects.map((project, index) => (
            <ProjectCard
              key={`project-${project.id}`}
              title={project.title}
              category={project.category}
              image={project.image}
              delay={0.2 + index * 0.08}
              wide
            />
          ))}
        </div>
      </div>
    </section>
  );
}