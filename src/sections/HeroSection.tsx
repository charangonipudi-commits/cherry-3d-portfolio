import FadeIn from '../components/FadeIn';
import Magnet from '../components/Magnet';
import ContactButton from '../components/ContactButton';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services', highlight: true },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const PORTRAIT_URL = '/cherry-portrait.png';

export default function HeroSection() {
  return (
    <section className="relative flex h-screen flex-col" style={{ overflowX: 'clip' }}>
      <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <img
              src={PORTRAIT_URL}
              alt="Cherry portrait"
              draggable={false}
              className="w-full select-none"
            />
          </Magnet>
        </FadeIn>
      </div>

      <FadeIn
        as="nav"
        delay={0}
        y={-20}
        className="relative z-20 flex items-center justify-between px-6 pt-6 md:px-10 md:pt-8"
      >
        {NAV_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={
              'highlight' in link && link.highlight
                ? 'rounded-full border border-[#22D3EE]/50 bg-[#22D3EE]/10 px-3 py-1.5 text-sm font-medium uppercase tracking-wider text-[#22D3EE] transition-colors duration-200 hover:bg-[#22D3EE]/25 sm:px-4 md:px-5 md:text-lg md:py-2 lg:text-[1.4rem]'
                : 'text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-opacity duration-200 hover:opacity-70 md:text-lg lg:text-[1.4rem]'
            }
          >
            {link.label}
          </a>
        ))}
      </FadeIn>

      <div className="overflow-hidden">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading mt-6 w-full whitespace-nowrap text-[11.2vw] font-black uppercase leading-none tracking-tight sm:mt-4 sm:text-[12vw] md:-mt-5 md:text-[12.8vw] lg:text-[14vw]">
            Hi, i&rsquo;m cherry
          </h1>
        </FadeIn>
      </div>

      <div className="relative z-20 mt-auto flex items-end justify-between px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.35} y={20}>
          <p
            className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
            style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
          >
            a 3d creator driven by crafting striking and unforgettable projects
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20}>
          <ContactButton />
        </FadeIn>
      </div>

      <FadeIn
        delay={0.75}
        y={10}
        className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 sm:bottom-3"
      >
        <a
          href="#services"
          className="group flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/60 transition-colors duration-200 hover:text-white sm:text-xs"
        >
          View Services
          <motion.span
            aria-hidden
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
          >
            <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </motion.span>
        </a>
      </FadeIn>
    </section>
  );
}
