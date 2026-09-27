import { motion } from 'framer-motion';
import FadeIn from '../components/FadeIn';

const BRAND_GRADIENT =
  'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)';

const EASE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];

const CHECK_GRADIENT = 'linear-gradient(135deg, #4C6FFF, #B600A8)';

interface Service {
  number: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  originalPrice: string;
  discountedPrice: string;
  ctaLabel: string;
  accent: string;
}

const SERVICES: Service[] = [
  {
    number: '01',
    name: 'Customized Website',
    tagline: 'Website development & launch',
    description:
      'A customized responsive website designed according to your requirements.',
    features: [
      'Custom responsive design',
      'Mobile and desktop support',
      'Modern UI/UX',
      'Website deployment',
      'Basic post-launch support',
    ],
    originalPrice: '\u20B92,000',
    discountedPrice: '\u20B91,000',
    ctaLabel: 'Choose Website',
    accent: '#22D3EE',
  },
  {
    number: '02',
    name: 'Customized App',
    tagline: 'Android app development',
    description:
      'A customized Android application built according to your requirements.',
    features: [
      'Custom app UI',
      'Android app development',
      'Required functionality',
      'APK generation',
      'Basic post-launch support',
    ],
    originalPrice: '\u20B95,000',
    discountedPrice: '\u20B92,500',
    ctaLabel: 'Choose App',
    accent: '#B600A8',
  },
];

function CheckIcon() {
  return (
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
  );
}

interface ServiceCardProps {
  service: Service;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <FadeIn y={50} delay={index * 0.15} className="h-full">
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative h-full overflow-hidden rounded-[32px] p-[1.5px] sm:rounded-[40px]"
        style={{ boxShadow: `0px 0px 44px ${service.accent}26` }}
      >
        <motion.div
          aria-hidden
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
          className="absolute inset-[-120%]"
          style={{
            background: `conic-gradient(from 0deg, transparent 0deg, ${service.accent} 90deg, transparent 180deg)`,
          }}
        />

        <div className="relative flex h-full flex-col rounded-[31px] bg-[#0F0F13] p-6 sm:rounded-[39px] sm:p-8 md:p-9">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-3 -top-7 font-black leading-none text-white/5 text-[7.5rem] sm:text-[9rem]"
          >
            {service.number}
          </span>

          <div className="relative flex items-center justify-between gap-3">
            <span
              className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-widest text-white sm:px-5 sm:py-2.5 sm:text-sm"
              style={{
                background: BRAND_GRADIENT,
                boxShadow: '0px 4px 18px rgba(181, 1, 167, 0.45)',
              }}
            >
              50% OFF
            </span>
            <span
              className="text-right text-[0.6rem] font-medium uppercase tracking-[0.25em] sm:text-xs"
              style={{ color: service.accent }}
            >
              {service.tagline}
            </span>
          </div>

          <h3 className="relative mt-5 font-black uppercase leading-none tracking-tight text-white text-[clamp(1.6rem,3.2vw,2.6rem)]">
            {service.name}
          </h3>

          <div className="relative mt-6 flex flex-wrap items-end gap-x-4 gap-y-1">
            <span className="font-black leading-none text-white text-[clamp(3rem,6vw,4.5rem)]">
              {service.discountedPrice}
            </span>
            <span className="pb-1.5 font-light leading-none text-[#D7E2EA]/50 line-through text-[clamp(1.1rem,2vw,1.5rem)]">
              {service.originalPrice}
            </span>
          </div>

          <p className="relative mt-4 font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.85rem,1.4vw,1rem)]">
            {service.description}
          </p>

          <ul className="relative mb-8 mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-3">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-center gap-2.5 sm:gap-3">
                <span
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white sm:h-6 sm:w-6"
                  style={{
                    background: CHECK_GRADIENT,
                    boxShadow: '0px 2px 10px rgba(118, 33, 176, 0.35)',
                  }}
                >
                  <CheckIcon />
                </span>
                <span className="font-light text-[#D7E2EA]/90 text-[clamp(0.8rem,1.3vw,0.95rem)]">
                  {feature}
                </span>
              </li>
            ))}
          </ul>

          <motion.button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent('cherry:open-contact'))}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="relative mt-auto block w-full rounded-full px-8 py-4 text-center text-sm font-medium uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-90 sm:w-auto sm:self-center sm:px-12 sm:text-base"
            style={{
              background: BRAND_GRADIENT,
              boxShadow:
                '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
              outline: '2px solid #FFFFFF',
              outlineOffset: '-3px',
            }}
          >
            {service.ctaLabel}
          </motion.button>
        </div>
      </motion.div>
    </FadeIn>
  );
}

export default function ServicesSection() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#0C0C0C]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-48 top-0 h-96 w-96 rounded-full bg-[#22D3EE]/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-48 bottom-0 h-96 w-96 rounded-full bg-[#B600A8]/10 blur-[130px]"
      />

      <div className="relative px-5 py-20 sm:px-8 sm:py-24 md:px-10 md:py-28">
        <FadeIn y={40}>
          <h2 className="hero-heading text-center font-black uppercase leading-none tracking-tight text-[clamp(3rem,12vw,9rem)]">
            What I Build
          </h2>
        </FadeIn>

        <FadeIn y={20} delay={0.15}>
          <p className="mx-auto mt-5 max-w-2xl text-center font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.9rem,1.6vw,1.2rem)]">
            Custom websites and Android apps built for your ideas.
          </p>
        </FadeIn>

        <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 sm:mt-16 sm:gap-8 md:grid-cols-2">
          {SERVICES.map((service, index) => (
            <ServiceCard key={service.number} service={service} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
