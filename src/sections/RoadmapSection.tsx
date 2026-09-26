import {
  BarChart3,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Database,
  Lightbulb,
  Megaphone,
  PanelsTopLeft,
  Rocket,
  Route,
  type LucideIcon,
} from 'lucide-react';
import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

interface RoadmapStep {
  number: string;
  tag: string;
  title: string;
  description: string;
  result: string;
  icon: LucideIcon;
  accent: string;
}

const STEPS: RoadmapStep[] = [
  {
    number: '01',
    tag: 'Idea',
    title: 'Pick the App Concept',
    description:
      'Choose a simple app idea, define the core user flow, and plan the screens before development.',
    result: 'Clear app blueprint',
    icon: Lightbulb,
    accent: '#34D399',
  },
  {
    number: '02',
    tag: 'Build',
    title: 'Create Android Screens',
    description:
      'Build real Android UI screen-by-screen using modern development tools and a structured workflow.',
    result: 'Working app UI',
    icon: PanelsTopLeft,
    accent: '#22D3EE',
  },
  {
    number: '03',
    tag: 'Backend',
    title: 'Connect Firebase',
    description:
      'Add authentication, database, storage, and live data to make the application functional.',
    result: 'Real app data',
    icon: Database,
    accent: '#60A5FA',
  },
  {
    number: '04',
    tag: 'Revenue',
    title: 'Add Monetization',
    description:
      'Set up appropriate monetization options and premium access paths for the app.',
    result: 'Revenue-ready flow',
    icon: CircleDollarSign,
    accent: '#A855F7',
  },
  {
    number: '05',
    tag: 'Payments',
    title: 'Enable Paid Features',
    description:
      'Create paid upgrades, subscriptions, or gated features with a practical payment setup.',
    result: 'Premium app layer',
    icon: CreditCard,
    accent: '#F97316',
  },
  {
    number: '06',
    tag: 'Launch',
    title: 'Prepare Play Store',
    description:
      'Prepare the app listing, screenshots, release information, and checklist required for publishing.',
    result: 'Store-ready release',
    icon: Rocket,
    accent: '#38BDF8',
  },
  {
    number: '07',
    tag: 'Growth',
    title: 'Promote With AI',
    description:
      'Use AI-assisted content and marketing workflows to create launch posts, promotional content, and user-acquisition ideas.',
    result: 'Launch promotion plan',
    icon: Megaphone,
    accent: '#C084FC',
  },
  {
    number: '08',
    tag: 'Scale',
    title: 'Track and Improve',
    description:
      'Use analytics and user feedback to understand app performance and continuously improve the product.',
    result: 'Growth dashboard',
    icon: BarChart3,
    accent: '#F59E0B',
  },
];

const STATS = [
  { value: '8', label: 'Checkpoints' },
  { value: '1', label: 'Real App' },
  { value: 'Live', label: 'Build Along' },
  { value: 'Launch', label: 'Play Store Ready' },
];

export default function RoadmapSection() {
  return (
    <section
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
        className="pointer-events-none absolute -left-40 top-1/3 h-80 w-80 rounded-full bg-[#22D3EE]/10 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-1/4 h-80 w-80 rounded-full bg-[#A855F7]/10 blur-[120px]"
      />

      <div className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
        <FadeIn y={30}>
          <div className="flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full border border-[#22D3EE]/40 bg-[#22D3EE]/10 px-4 py-2 text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#22D3EE] sm:text-xs"
              style={{ boxShadow: '0px 0px 24px rgba(34, 211, 238, 0.2)' }}
            >
              <Route className="h-3.5 w-3.5" strokeWidth={2} />
              App Building Roadmap
            </span>
          </div>
        </FadeIn>

        <FadeIn y={40} delay={0.1}>
          <h2 className="mt-6 text-center font-black leading-[1.05] tracking-tight text-white text-[clamp(2.2rem,6.5vw,4.5rem)] sm:mt-8">
            From App Idea to Play Store Launch.
          </h2>
        </FadeIn>

        <FadeIn y={30} delay={0.2}>
          <p className="mt-4 bg-gradient-to-r from-[#34D399] via-[#60A5FA] to-[#C084FC] bg-clip-text text-center font-black leading-tight text-transparent text-[clamp(1.5rem,4.5vw,3rem)]">
            Follow the 8-checkpoint route.
          </p>
        </FadeIn>

        <FadeIn y={20} delay={0.3}>
          <p className="mx-auto mt-6 max-w-2xl text-center font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.9rem,1.6vw,1.15rem)]">
            A practical build path for creating the UI, backend, monetization,
            launch assets, promotion plan, and analytics foundation for a real
            Android app.
          </p>
        </FadeIn>

        <FadeIn y={30} delay={0.15} className="mx-auto mt-10 max-w-3xl sm:mt-14">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] border border-[#D7E2EA]/10 bg-white/[0.03] p-5 text-center sm:p-7"
              >
                <div className="font-black leading-none text-white text-[clamp(1.6rem,4vw,2.6rem)]">
                  {stat.value}
                </div>
                <div className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/50 sm:text-xs">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <div className="mx-auto mt-14 max-w-4xl sm:mt-20">
          {STEPS.map((step, index) => {
            const isLast = index === STEPS.length - 1;
            const nextAccent = isLast ? step.accent : STEPS[index + 1].accent;
            const StepIcon = step.icon;

            return (
              <FadeIn
                key={step.number}
                x={-40}
                y={0}
                delay={index * 0.05}
                className={`relative flex gap-4 pb-10 last:pb-0 sm:gap-6 sm:pb-14`}
              >
                <div className="relative flex w-12 shrink-0 flex-col items-center sm:w-14">
                  <div
                    className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 bg-[#0C0C0C] font-black text-xs sm:h-14 sm:w-14 sm:text-sm"
                    style={{
                      borderColor: step.accent,
                      color: step.accent,
                      boxShadow: `0px 0px 18px ${step.accent}55`,
                    }}
                  >
                    {step.number}
                  </div>
                  {!isLast && (
                    <div
                      aria-hidden
                      className="absolute bottom-0 left-1/2 top-12 w-[2px] -translate-x-1/2 sm:top-14"
                      style={{
                        background: `linear-gradient(180deg, ${step.accent}, ${nextAccent})`,
                        boxShadow: `0px 0px 12px ${step.accent}66`,
                      }}
                    />
                  )}
                </div>

                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="relative flex-1 overflow-hidden rounded-[30px] border bg-white/[0.03] p-5 sm:rounded-[40px] sm:p-7 md:p-8"
                  style={{
                    borderColor: `${step.accent}40`,
                    boxShadow: `0px 0px 28px ${step.accent}14`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-1"
                    style={{
                      background: `linear-gradient(90deg, ${step.accent}, ${step.accent}22)`,
                    }}
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-3 -top-5 font-black leading-none text-white/5 text-[6.5rem] sm:text-[9rem]"
                  >
                    {step.number}
                  </span>

                  <div className="relative flex items-start justify-between gap-4">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border sm:h-14 sm:w-14"
                      style={{
                        borderColor: `${step.accent}40`,
                        background: `${step.accent}12`,
                      }}
                    >
                      <StepIcon
                        className="h-5 w-5 sm:h-6 sm:w-6"
                        style={{ color: step.accent }}
                        strokeWidth={1.75}
                      />
                    </span>
                    <span
                      className="rounded-full border px-3.5 py-1.5 text-[0.6rem] font-medium uppercase tracking-[0.2em] sm:text-xs"
                      style={{
                        borderColor: `${step.accent}55`,
                        background: `${step.accent}14`,
                        color: step.accent,
                      }}
                    >
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="relative mt-5 font-medium leading-tight text-white text-[clamp(1.25rem,2.4vw,1.9rem)]">
                    {step.title}
                  </h3>
                  <p className="relative mt-2.5 max-w-xl font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.85rem,1.4vw,1.05rem)]">
                    {step.description}
                  </p>

                  <div
                    className="relative mt-5 inline-flex w-fit items-center gap-2.5 rounded-full border px-4 py-2 sm:px-5 sm:py-2.5"
                    style={{
                      borderColor: `${step.accent}40`,
                      background: `${step.accent}10`,
                    }}
                  >
                    <CheckCircle2
                      className="h-4 w-4 shrink-0 sm:h-[1.15rem] sm:w-[1.15rem]"
                      style={{ color: step.accent }}
                      strokeWidth={2}
                    />
                    <span
                      className="font-normal text-[clamp(0.8rem,1.3vw,0.95rem)]"
                      style={{ color: step.accent }}
                    >
                      {step.result}
                    </span>
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
