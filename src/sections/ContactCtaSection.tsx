import FadeIn from '../components/FadeIn';
import ContactButton from '../components/ContactButton';

export default function ContactCtaSection() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#0C0C0C] px-5 pb-24 pt-24 sm:px-8 sm:pb-28 sm:pt-32 md:px-10 md:pb-32 md:pt-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#7621B0]/15 blur-[120px]"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <FadeIn y={30}>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-[#8FA0FF] sm:text-xs">
            Got an idea?
          </p>
        </FadeIn>

        <FadeIn y={40} delay={0.1}>
          <h2 className="hero-heading mt-4 font-black uppercase leading-none tracking-tight text-[clamp(2.6rem,9vw,6rem)]">
            Let&rsquo;s talk
          </h2>
        </FadeIn>

        <FadeIn y={20} delay={0.2}>
          <p className="mt-5 max-w-md font-light leading-relaxed text-[#D7E2EA]/70 text-[clamp(0.9rem,1.6vw,1.1rem)]">
            Tell me about your project and I&rsquo;ll get back to you on
            WhatsApp.
          </p>
        </FadeIn>

        <FadeIn y={20} delay={0.3} className="mt-10 sm:mt-12">
          <ContactButton className="!px-12 !py-5 !text-sm sm:!px-16 sm:!py-6 sm:!text-base md:!px-20 md:!py-7 md:!text-lg" />
        </FadeIn>
      </div>
    </section>
  );
}
