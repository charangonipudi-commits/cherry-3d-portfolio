import {
  CreditCard,
  Flame,
  Infinity as InfinityIcon,
  Instagram,
  Play,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface TrustCard {
  name: string;
  subtitle: string;
  icon: LucideIcon;
  accent: string;
}

const TRUST_CARDS: TrustCard[] = [
  {
    name: 'Google Play',
    subtitle: 'Play Store Ready',
    icon: Play,
    accent: '#38BDF8',
  },
  {
    name: 'Firebase',
    subtitle: 'Backend & Authentication',
    icon: Flame,
    accent: '#F97316',
  },
  {
    name: 'Razorpay',
    subtitle: 'Payment Integration',
    icon: CreditCard,
    accent: '#60A5FA',
  },
  {
    name: 'Meta',
    subtitle: 'Social & Marketing',
    icon: InfinityIcon,
    accent: '#22D3EE',
  },
  {
    name: 'Instagram',
    subtitle: 'Social Promotion',
    icon: Instagram,
    accent: '#E879F9',
  },
  {
    name: 'SSL Security',
    subtitle: 'Secure Website',
    icon: ShieldCheck,
    accent: '#34D399',
  },
];

const TOOL_PILLS = [
  { label: 'React', accent: '#22D3EE' },
  { label: 'TypeScript', accent: '#60A5FA' },
  { label: 'Vite', accent: '#C084FC' },
  { label: 'Tailwind CSS', accent: '#38BDF8' },
  { label: 'Android', accent: '#34D399' },
  { label: 'Firebase', accent: '#F97316' },
  { label: 'Google Play', accent: '#60A5FA' },
  { label: 'Razorpay', accent: '#22D3EE' },
  { label: 'AI Tools', accent: '#C084FC' },
];

export default function TrustSection() {
  return (
    <section
      id="trust"
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[40px] bg-[#0C0C0C] sm:-mt-12 sm:rounded-t-[50px] md:-mt-14 md:rounded-t-[60px]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(215,226,234,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(215,226,234,0.035) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-16 h-80 w-80 rounded-full bg-[#34D399]/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-80 w-80 rounded-full bg-[#60A5FA]/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-10 h-80 w-80 rounded-full bg-[#A855F7]/10 blur-[120px]"
      />

      <div className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
        <FadeIn y={30}>
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#34D399]/40 bg-[#34D399]/10 px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#34D399] sm:text-xs"
              style={{ boxShadow: '0px 0px 24px rgba(52, 211, 153, 0.2)' }}
            >
              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={2} />
              Trust &amp; Security
            </span>
          </div>
        </FadeIn>

        <FadeIn y={40} delay={0.1}>
          <h2 className="mt-6 text-center font-black uppercase leading-[1.05] tracking-tight text-white text-[clamp(1.9rem,6vw,4.2rem)] sm:mt-8">
            Built With Trusted Technology
          </h2>
        </FadeIn>

        <FadeIn y={20} delay={0.2}>
          <p className="mx-auto mt-5 max-w-2xl text-center font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.9rem,1.6vw,1.15rem)]">
            The platforms and technologies I work with to build, secure,
            launch, and promote real apps and websites.
          </p>
        </FadeIn>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-3 sm:mt-16 sm:gap-4 md:grid-cols-3 md:gap-5">
          {TRUST_CARDS.map((card, index) => {
            const CardIcon = card.icon;

            return (
              <FadeIn key={card.name} y={26} delay={index * 0.07}>
                <motion.div
                  whileHover={{ y: -6, scale: 1.02, boxShadow: `0px 0px 44px ${card.accent}2E` }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="relative h-full overflow-hidden rounded-[24px] border bg-white/[0.03] p-4 min-w-0 sm:rounded-[32px] sm:p-7"
                  style={{
                    borderColor: `${card.accent}40`,
                    boxShadow: `0px 0px 28px ${card.accent}14`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1"
                    style={{
                      background: `linear-gradient(90deg, ${card.accent}, ${card.accent}22)`,
                    }}
                  />

                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl border sm:h-14 sm:w-14"
                    style={{
                      borderColor: `${card.accent}40`,
                      background: `${card.accent}12`,
                    }}
                  >
                    <CardIcon
                      className="h-5 w-5 sm:h-6 sm:w-6"
                      style={{ color: card.accent }}
                      strokeWidth={1.75}
                    />
                  </span>

                  <h3 className="mt-4 min-w-0 font-medium leading-tight text-white text-[clamp(1rem,2.2vw,1.4rem)] sm:mt-6">
                    {card.name}
                  </h3>
                  <p className="mt-1.5 min-w-0 font-light leading-snug text-[#D7E2EA]/60 text-[clamp(0.72rem,1.5vw,0.95rem)]">
                    {card.subtitle}
                  </p>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>

        <FadeIn y={30} delay={0.1}>
          <h3 className="mt-20 text-center font-black uppercase leading-tight tracking-tight text-white text-[clamp(1.6rem,4.5vw,2.8rem)] sm:mt-24">
            Tools &amp; Technologies
          </h3>
        </FadeIn>

        <FadeIn y={20} delay={0.2}>
          <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2.5 sm:mt-10 sm:gap-3.5">
            {TOOL_PILLS.map((tool) => (
              <motion.span
                key={tool.label}
                whileHover={{
                  y: -3,
                  scale: 1.05,
                  borderColor: tool.accent,
                  color: tool.accent,
                  boxShadow: `0px 0px 22px ${tool.accent}33`,
                }}
                transition={{ duration: 0.25, ease: EASE }}
                className="cursor-default rounded-full border px-4 py-2 text-xs font-normal uppercase tracking-[0.15em] text-[#D7E2EA]/75 sm:px-5 sm:py-2.5 sm:text-sm"
                style={{
                  borderColor: 'rgba(215, 226, 234, 0.15)',
                  background: 'rgba(255, 255, 255, 0.03)',
                }}
              >
                {tool.label}
              </motion.span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
