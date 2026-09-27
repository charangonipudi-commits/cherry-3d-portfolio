import { Check } from 'lucide-react';
import {
  ORDER_MESSAGES,
  PROJECTS,
  ROADMAP,
  SERVICES,
  formatINR,
  waLink,
} from '../../lib/cherry-ai/knowledge';
import type { CardPayload } from '../../lib/cherry-ai/types';

const BRAND_GRADIENT =
  'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)';

const CHECK_GRADIENT = 'linear-gradient(135deg, #4C6FFF, #B600A8)';

/* ------------------------------------------------------------------ */
/* Pricing card — mini version of the site's service cards             */
/* ------------------------------------------------------------------ */

function PricingCard({ product }: { product: 'website' | 'app' }) {
  const service = SERVICES.find((s) => s.id === product)!;

  return (
    <div
      className="cherry-card-anim relative mt-3 overflow-hidden rounded-2xl bg-[#111114] p-4"
      style={{
        border: `1px solid ${service.accent}55`,
        boxShadow: `0 0 24px ${service.accent}22`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white"
          style={{
            background: BRAND_GRADIENT,
            boxShadow: '0px 2px 12px rgba(181, 1, 167, 0.45)',
          }}
        >
          50% OFF
        </span>
        <span
          className="text-right text-[9px] font-medium uppercase tracking-[0.2em]"
          style={{ color: service.accent }}
        >
          {service.tagline}
        </span>
      </div>

      <h4 className="mt-3 font-black uppercase leading-none tracking-tight text-white text-[1.15rem]">
        {service.name}
      </h4>

      <div className="mt-2.5 flex flex-wrap items-end gap-x-3 gap-y-1">
        <span className="font-black leading-none text-white text-[1.9rem]">
          {formatINR(service.discountedPrice)}
        </span>
        <span className="pb-0.5 font-light leading-none text-[#D7E2EA]/50 line-through text-[0.95rem]">
          {formatINR(service.originalPrice)}
        </span>
      </div>

      <ul className="mt-3 flex flex-col gap-1.5">
        {service.features.slice(0, 4).map((feature) => (
          <li key={feature} className="flex items-center gap-2">
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
              style={{ background: CHECK_GRADIENT }}
            >
              <Check className="h-2 w-2" strokeWidth={3.5} />
            </span>
            <span className="font-light text-[#D7E2EA]/85 text-[0.78rem]">
              {feature}
            </span>
          </li>
        ))}
      </ul>

      <a
        href={waLink(ORDER_MESSAGES[product])}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block w-full rounded-full px-5 py-3 text-center text-[11px] font-medium uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-90"
        style={{
          background: BRAND_GRADIENT,
          boxShadow:
            '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
          outline: '2px solid #FFFFFF',
          outlineOffset: '-3px',
        }}
      >
        {service.orderLabel}
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Projects card                                                       */
/* ------------------------------------------------------------------ */

function ProjectsCard() {
  return (
    <div className="cherry-card-anim mt-3 overflow-hidden rounded-2xl border border-[#8FA0FF]/30 bg-[#111114] p-4 shadow-[0_0_24px_rgba(143,160,255,0.15)]">
      {PROJECTS.map((project, index) => (
        <div
          key={project.number}
          className={`flex items-center gap-3 py-2.5 ${
            index > 0 ? 'border-t border-white/[0.06]' : ''
          }`}
        >
          <span className="font-black leading-none text-white/15 text-[1.4rem]">
            {project.number}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium leading-tight text-[#D7E2EA] text-[0.85rem]">
              {project.title}
            </p>
            <p className="mt-0.5 truncate font-light text-[#D7E2EA]/50 text-[0.68rem]">
              {project.description}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-medium uppercase tracking-widest ${
              project.category === 'Customized App'
                ? 'border-[#B600A8]/50 bg-[#B600A8]/15 text-[#E08DF5]'
                : 'border-[#8FA0FF]/40 bg-[#8FA0FF]/10 text-[#8FA0FF]'
            }`}
          >
            {project.category === 'Customized App' ? 'App' : 'Website'}
          </span>
        </div>
      ))}
      <a
        href={waLink("Hi Cherry! I'd like to discuss a project idea.")}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 block w-full rounded-full px-5 py-2.5 text-center text-[10px] font-medium uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-90"
        style={{
          background: BRAND_GRADIENT,
          boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25)',
          outline: '2px solid #FFFFFF',
          outlineOffset: '-3px',
        }}
      >
        Build Yours on WhatsApp
      </a>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Roadmap card                                                        */
/* ------------------------------------------------------------------ */

function RoadmapCard() {
  return (
    <div className="cherry-card-anim mt-3 overflow-hidden rounded-2xl border border-[#D7E2EA]/15 bg-[#111114] p-4">
      <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#22D3EE]">
        App Building Roadmap
      </p>
      <ol className="mt-2.5 flex flex-col gap-1.5">
        {ROADMAP.map((step) => (
          <li key={step.number} className="flex items-center gap-2.5">
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border bg-[#0C0C0C] font-black text-[8px]"
              style={{
                borderColor: step.accent,
                color: step.accent,
                boxShadow: `0 0 8px ${step.accent}44`,
              }}
            >
              {step.number}
            </span>
            <span className="font-light text-[#D7E2EA]/85 text-[0.78rem]">
              {step.title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact card                                                        */
/* ------------------------------------------------------------------ */

function ContactCard() {
  return (
    <div className="cherry-card-anim mt-3 overflow-hidden rounded-2xl border border-[#34D399]/35 bg-[#111114] p-4 shadow-[0_0_24px_rgba(52,211,153,0.12)]">
      <p className="font-light leading-relaxed text-[#D7E2EA]/75 text-[0.8rem]">
        {SITE_CONTACT_NOTE}
      </p>
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 block w-full rounded-full px-5 py-3 text-center text-[11px] font-medium uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-90"
        style={{
          background: BRAND_GRADIENT,
          boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25)',
          outline: '2px solid #FFFFFF',
          outlineOffset: '-3px',
        }}
      >
        Chat on WhatsApp
      </a>
    </div>
  );
}

const SITE_CONTACT_NOTE =
  "Tell Charan about your project and he'll get back to you on WhatsApp.";

/* ------------------------------------------------------------------ */

export default function ChatCards({ cards }: { cards?: CardPayload[] }) {
  if (!cards?.length) return null;
  return (
    <>
      {cards.map((card, index) => {
        if (card.kind === 'pricing') return <PricingCard key={`${card.kind}-${card.product}-${index}`} product={card.product} />;
        if (card.kind === 'projects') return <ProjectsCard key={index} />;
        if (card.kind === 'roadmap') return <RoadmapCard key={index} />;
        return <ContactCard key={index} />;
      })}
    </>
  );
}
