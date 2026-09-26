import {
  Award,
  Check,
  Code2,
  IndianRupee,
  Rocket,
  Smartphone,
  Users,
  type LucideIcon,
} from 'lucide-react';
import FadeIn from '../components/FadeIn';

const DECOR_IMAGES = {
  moon: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
  object:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
  lego: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
  group:
    'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
};

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { icon: Smartphone, value: '5+', label: 'Apps Built' },
  { icon: Users, value: '100K+', label: 'App Users' },
  { icon: IndianRupee, value: '\u20B95L\u201310L', label: 'Annual Earnings' },
  { icon: Code2, value: 'Android', label: 'Development' },
];

const WHAT_I_DO = [
  'Android App Development',
  'Customized App Development',
  'Customized Website Development',
  'UI/UX Design',
  'App Deployment & Launch',
];

const CHECK_GRADIENT = 'linear-gradient(135deg, #4C6FFF, #B600A8)';

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-5 py-20 sm:px-8 md:px-10 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-[#4C6FFF]/10 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-[#B600A8]/10 blur-[100px]"
      />

      <FadeIn
        delay={0.1}
        x={-80}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute left-[1%] top-[4%] hidden w-[210px] xl:block"
      >
        <img src={DECOR_IMAGES.moon} alt="" className="w-full" />
      </FadeIn>

      <FadeIn
        delay={0.25}
        x={-80}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute bottom-[8%] left-[3%] hidden w-[180px] xl:block"
      >
        <img src={DECOR_IMAGES.object} alt="" className="w-full" />
      </FadeIn>

      <FadeIn
        delay={0.15}
        x={80}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute right-[1%] top-[4%] hidden w-[210px] xl:block"
      >
        <img src={DECOR_IMAGES.lego} alt="" className="w-full" />
      </FadeIn>

      <FadeIn
        delay={0.3}
        x={80}
        y={0}
        duration={0.9}
        className="pointer-events-none absolute bottom-[8%] right-[3%] hidden w-[220px] xl:block"
      >
        <img src={DECOR_IMAGES.group} alt="" className="w-full" />
      </FadeIn>

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <FadeIn y={30}>
          <p className="flex items-center gap-3 text-[0.7rem] font-medium uppercase tracking-[0.35em] text-[#8FA0FF] sm:text-xs">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#8FA0FF]/60" />
            Your Lead Creator
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#8FA0FF]/60" />
          </p>
        </FadeIn>

        <FadeIn y={40} delay={0.1}>
          <h2 className="hero-heading mt-4 text-center font-black uppercase leading-[0.95] tracking-tight text-[clamp(2.4rem,8vw,5.5rem)]">
            Gonipudi Charan
          </h2>
        </FadeIn>

        <FadeIn y={20} delay={0.2}>
          <span
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#8FA0FF]/30 bg-[#8FA0FF]/10 px-4 py-2 text-[0.65rem] font-medium uppercase tracking-widest text-[#D7E2EA] sm:text-xs"
            style={{ boxShadow: '0px 0px 24px rgba(94, 118, 255, 0.25)' }}
          >
            <Award className="h-3.5 w-3.5 text-[#8FA0FF]" strokeWidth={2} />
            2+ Years Android Experience
          </span>
        </FadeIn>

        <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:mt-14 sm:gap-4">
          {STATS.map((stat, index) => (
            <FadeIn
              key={stat.label}
              delay={0.1 + index * 0.08}
              className="rounded-[24px] border border-[#D7E2EA]/10 bg-white/[0.03] p-5 text-center transition-shadow duration-500 shadow-[0_0_30px_rgba(94,118,255,0.06)] hover:shadow-[0_0_40px_rgba(118,33,176,0.22)] sm:rounded-[28px] sm:p-7"
            >
              <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-[#8FA0FF]/20 bg-[#8FA0FF]/10 sm:h-14 sm:w-14">
                <stat.icon
                  className="h-5 w-5 text-[#8FA0FF] sm:h-7 sm:w-7"
                  strokeWidth={1.75}
                />
              </span>
              <div className="mt-3 font-black uppercase leading-none text-white text-[clamp(1.5rem,4.5vw,3rem)] sm:mt-4">
                {stat.value}
              </div>
              <div className="mt-2 text-[0.6rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/50 sm:text-xs">
                {stat.label}
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn y={40} className="mt-4 w-full sm:mt-6">
          <div className="relative overflow-hidden rounded-[28px] border border-[#D7E2EA]/10 bg-white/[0.03] p-7 shadow-[0_0_40px_rgba(94,118,255,0.06)] sm:rounded-[36px] sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#4C6FFF]/20 to-[#B600A8]/20 blur-3xl"
            />
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#8FA0FF]/20 bg-[#8FA0FF]/10 sm:h-14 sm:w-14">
              <Rocket
                className="h-5 w-5 text-[#8FA0FF] sm:h-6 sm:w-6"
                strokeWidth={1.75}
              />
            </span>
            <h3 className="mt-5 font-black uppercase leading-tight text-white text-[clamp(1.5rem,4vw,2.5rem)]">
              From Ideas to Launch
            </h3>
            <p className="mt-3 max-w-xl font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.9rem,1.6vw,1.1rem)]">
              Building modern Android apps and digital products with a focus on
              clean UI, smooth user experiences, and practical functionality.
            </p>
          </div>
        </FadeIn>

        <FadeIn y={40} className="mt-4 w-full sm:mt-6">
          <div className="rounded-[28px] border border-[#D7E2EA]/10 bg-white/[0.03] p-7 shadow-[0_0_40px_rgba(94,118,255,0.06)] sm:rounded-[36px] sm:p-10">
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[#8FA0FF] sm:text-xs">
              What I Do
            </p>
            <ul className="mt-5 flex flex-col gap-3 sm:mt-6 sm:gap-4">
              {WHAT_I_DO.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white"
                    style={{
                      background: CHECK_GRADIENT,
                      boxShadow: '0px 2px 10px rgba(118, 33, 176, 0.35)',
                    }}
                  >
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  <span className="font-light text-[#D7E2EA]/90 text-[clamp(0.9rem,1.6vw,1.1rem)]">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
