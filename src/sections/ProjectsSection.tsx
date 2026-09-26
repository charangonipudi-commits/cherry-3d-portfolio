import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import FadeIn from '../components/FadeIn';
import ecommerceMockup from '../assets/ecommerce-website.png';

const WHATSAPP_NUMBER = '919951880181';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const CHECK_GRADIENT = 'linear-gradient(135deg, #4C6FFF, #B600A8)';

const CATEGORY_STYLES = {
  website: 'border-[#8FA0FF]/40 bg-[#8FA0FF]/10 text-[#8FA0FF]',
  app: 'border-[#B600A8]/50 bg-[#B600A8]/15 text-[#E08DF5]',
} as const;

type CategoryTone = keyof typeof CATEGORY_STYLES;

interface Project {
  number: string;
  category: string;
  tone: CategoryTone;
  title: string;
  description: string;
  features: string[];
}

const PROJECTS: Project[] = [
  {
    number: '01',
    category: 'Customized Website',
    tone: 'website',
    title: 'E-Commerce Website',
    description:
      'Learn how to create a complete modern e-commerce website with responsive design, product pages, customer-friendly UI, and deployment.',
    features: [
      'Responsive website',
      'Product pages',
      'Modern UI/UX',
      'Mobile friendly',
      'Deployment',
    ],
  },
  {
    number: '02',
    category: 'Customized Website',
    tone: 'website',
    title: 'Business Website',
    description:
      'Build a professional business website from scratch with modern sections, service pages, contact integration, and responsive design.',
    features: [
      'Custom landing page',
      'Services section',
      'About section',
      'Contact/WhatsApp integration',
      'Responsive design',
    ],
  },
  {
    number: '03',
    category: 'Customized App',
    tone: 'app',
    title: 'Android App',
    description:
      'Learn how to build a customized Android application with a modern interface, useful features, APK generation, and Play Store preparation.',
    features: [
      'Custom Android UI',
      'App functionality',
      'User-friendly navigation',
      'APK generation',
      'Play Store preparation',
    ],
  },
];

function BrowserFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-2xl border border-[#D7E2EA]/15 bg-[#111114]">
      <div className="flex items-center gap-1.5 border-b border-[#D7E2EA]/10 bg-white/[0.04] px-3 py-2 sm:gap-2 sm:px-4">
        <span className="h-2 w-2 rounded-full bg-[#FF5F57]/70 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#FEBC2E]/70 sm:h-2.5 sm:w-2.5" />
        <span className="h-2 w-2 rounded-full bg-[#28C840]/70 sm:h-2.5 sm:w-2.5" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-white/[0.06] sm:h-4" />
      </div>
      {children}
    </div>
  );
}

function EcommerceSiteShot() {
  return (
    <img
      src={ecommerceMockup}
      alt="E-commerce website project preview"
      draggable={false}
      loading="lazy"
      decoding="async"
      className="block w-full rounded-2xl border border-[#D7E2EA]/15 select-none"
    />
  );
}

function BusinessSiteShot() {
  return (
    <BrowserFrame>
      <img
        src="/project-business-website.jpg"
        alt="Business website project preview"
        draggable={false}
        loading="lazy"
        decoding="async"
        className="block w-full select-none"
      />
    </BrowserFrame>
  );
}

function AndroidAppShot() {
  return (
    <img
      src="/project-android-app.png"
      alt="Android app project preview"
      draggable={false}
      loading="lazy"
      decoding="async"
      className="mx-auto block w-full max-w-sm rounded-2xl border border-[#D7E2EA]/15 select-none"
    />
  );
}

interface ProjectCardProps {
  project: Project;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function ProjectCard({ project, index, total, progress }: ProjectCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(progress, [index / total, 1], [1, targetScale]);

  const orderUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hi Cherry! I'd like to get the ${project.title} (${project.category}).`
  )}`;

  return (
    <div className="sticky top-24 min-h-[85vh] md:top-32">
      <motion.div
        style={{ scale, top: index * 28 }}
        className="relative flex flex-col gap-4 rounded-[40px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:gap-6 sm:p-6 md:gap-8 md:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-6">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-10">
            <span className="shrink-0 font-black leading-none text-[#D7E2EA] text-[clamp(3rem,10vw,140px)]">
              {project.number}
            </span>
            <div className="flex flex-col gap-1.5 sm:gap-2">
              <span
                className={`w-fit rounded-full border px-3 py-1 text-[0.6rem] font-medium uppercase tracking-widest sm:text-xs ${CATEGORY_STYLES[project.tone]}`}
              >
                {project.category}
              </span>
              <h3 className="font-medium uppercase leading-tight text-[#D7E2EA] text-[clamp(1rem,2.2vw,2.1rem)]">
                {project.title}
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen((open) => !open)}
            aria-expanded={isOpen}
            className="whitespace-nowrap rounded-full border-2 border-[#D7E2EA] px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors duration-200 hover:bg-[#D7E2EA]/10 sm:px-8 sm:py-3 sm:text-sm md:px-10 md:py-3.5"
          >
            {isOpen ? 'Hide Details' : 'View Details'}
          </button>
        </div>

        <div className="relative">
          {project.tone === 'app' ? (
            <AndroidAppShot />
          ) : index === 1 ? (
            <BusinessSiteShot />
          ) : (
            <EcommerceSiteShot />
          )}

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                key="details"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute inset-0 overflow-y-auto rounded-2xl border border-[#D7E2EA]/10 bg-[#0C0C0C]/95 p-4 backdrop-blur-sm sm:p-6"
              >
                <div className="flex h-full flex-col gap-4 sm:gap-5">
                  <p className="font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.8rem,1.3vw,1rem)]">
                    {project.description}
                  </p>
                  <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3">
                    {project.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 sm:gap-3">
                        <span
                          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white sm:h-6 sm:w-6"
                          style={{
                            background: CHECK_GRADIENT,
                            boxShadow: '0px 2px 10px rgba(118, 33, 176, 0.35)',
                          }}
                        >
                          <svg
                            viewBox="0 0 12 10"
                            fill="none"
                            className="h-2 w-2.5 sm:h-2.5 sm:w-3"
                            aria-hidden="true"
                          >
                            <path
                              d="M1 5.2 4.4 8.6 11 1.4"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </span>
                        <span className="font-light text-[#D7E2EA]/90 text-[clamp(0.8rem,1.3vw,0.95rem)]">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href={orderUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-fit rounded-full px-6 py-2.5 text-[0.7rem] font-medium uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-90 sm:px-8 sm:py-3 sm:text-xs"
                    style={{
                      background:
                        'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                      boxShadow:
                        '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                      outline: '2px solid #FFFFFF',
                      outlineOffset: '-3px',
                    }}
                  >
                    Get This
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function ProjectsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section
      id="projects"
      className="relative z-10 -mt-10 rounded-t-[40px] sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px]"
      style={{ backgroundColor: '#0C0C0C' }}
    >
      <div className="px-5 pb-20 pt-20 sm:px-8 sm:pb-24 sm:pt-24 md:px-10 md:pb-28 md:pt-32">
        <FadeIn y={40}>
          <div className="text-center">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-[#8FA0FF] sm:text-xs">
              Example Projects
            </p>
            <h2 className="hero-heading mt-3 font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,10vw,7.5rem)] sm:mt-4">
              What You Can Build
            </h2>
            <p className="mx-auto mt-5 max-w-xl font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.85rem,1.6vw,1.1rem)]">
              Real examples of what you can get built with my Customized
              Website and Customized App services.
            </p>
          </div>
        </FadeIn>

        <div ref={containerRef} className="mt-16 sm:mt-20 md:mt-28">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={index}
              total={PROJECTS.length}
              progress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
