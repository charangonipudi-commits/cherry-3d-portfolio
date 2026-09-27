import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Site WhatsApp number for click-to-chat — international format,
 * no "+", spaces or dashes. The number itself is never shown on the page;
 * it is only embedded in the wa.me deep link.
 */
const WHATSAPP_NUMBER = '919951880181';

const OPEN_EVENT = 'cherry:open-contact';

interface FormValues {
  name: string;
  email: string;
  phone: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = 'Please enter your full name.';
  }

  if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  const digits = values.phone.replace(/\D/g, '');
  if (!/^\+?[0-9()\s.\-]{6,20}$/.test(values.phone.trim()) || digits.length < 7 || digits.length > 15) {
    errors.phone = 'Please enter a valid phone number.';
  }

  return errors;
}

function buildWhatsAppMessage(values: FormValues): string {
  return [
    "Hello Charan, I'm interested in your services.",
    '',
    `Name: ${values.name.trim()}`,
    `Email: ${values.email.trim()}`,
    `Phone: ${values.phone.trim()}`,
    '',
    'Please contact me regarding my requirement.',
  ].join('\n');
}

const fieldClasses = (hasError: boolean) =>
  `w-full rounded-xl border bg-white/[0.04] px-4 py-3 text-sm text-[#EAF1F6] placeholder:text-[#D7E2EA]/30 outline-none transition-colors duration-200 focus:bg-white/[0.06] ${
    hasError
      ? 'border-red-400/70 focus:border-red-400'
      : 'border-white/10 focus:border-[#8FA0FF]/80'
  }`;

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [values, setValues] = useState<FormValues>({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const open = () => {
      setValues({ name: '', email: '', phone: '' });
      setErrors({});
      setSubmitted(false);
      setIsOpen(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, close]);

  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  const setField = (field: keyof FormValues, value: string) => {
    const next = { ...values, [field]: value };
    setValues(next);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildWhatsAppMessage(values),
    )}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    close();
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="contact-modal-backdrop"
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/70 px-4 py-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={close}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="relative w-full max-w-md rounded-[28px] p-[1.5px] sm:max-w-lg"
            style={{
              background:
                'linear-gradient(135deg, rgba(143,160,255,0.7) 0%, rgba(118,33,176,0.75) 50%, rgba(34,211,238,0.45) 100%)',
              boxShadow:
                '0 0 80px rgba(118, 33, 176, 0.35), 0 24px 60px rgba(0, 0, 0, 0.6)',
            }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative max-h-[calc(100vh-4rem)] overflow-y-auto rounded-[26.5px] bg-[#0B0B10] px-6 pb-8 pt-7 sm:px-9 sm:pb-10 sm:pt-9">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 left-1/2 h-48 w-72 -translate-x-1/2 rounded-full bg-[#7621B0]/25 blur-[70px]"
              />

              <button
                type="button"
                onClick={close}
                aria-label="Close contact form"
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#D7E2EA]/70 transition-colors duration-200 hover:border-[#8FA0FF]/60 hover:text-white sm:right-5 sm:top-5"
              >
                <X className="h-4 w-4" />
              </button>

              <p className="text-[0.65rem] font-medium uppercase tracking-[0.35em] text-[#8FA0FF] sm:text-xs">
                Let&rsquo;s talk
              </p>
              <h3
                id="contact-modal-title"
                className="mt-2 font-black uppercase tracking-tight text-[#EAF1F6] text-[clamp(1.4rem,4vw,2rem)]"
              >
                Contact Me
              </h3>
              <p className="mt-2 font-light leading-relaxed text-[#D7E2EA]/70 text-sm sm:text-[0.95rem]">
                Fill in your details and WhatsApp opens with your message ready
                to send.
              </p>

              <form noValidate onSubmit={handleSubmit} className="mt-6 space-y-4 sm:mt-7 sm:space-y-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-1.5 block text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/60 sm:text-[0.7rem]"
                  >
                    Full Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your name"
                    value={values.name}
                    onChange={(event) => setField('name', event.target.value)}
                    autoFocus
                    className={fieldClasses(Boolean(errors.name))}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs text-red-300/90">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-1.5 block text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/60 sm:text-[0.7rem]"
                  >
                    Email Address
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={values.email}
                    onChange={(event) => setField('email', event.target.value)}
                    className={fieldClasses(Boolean(errors.email))}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs text-red-300/90">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="contact-phone"
                    className="mb-1.5 block text-[0.65rem] font-medium uppercase tracking-[0.25em] text-[#D7E2EA]/60 sm:text-[0.7rem]"
                  >
                    Phone Number
                  </label>
                  <input
                    id="contact-phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    value={values.phone}
                    onChange={(event) => setField('phone', event.target.value)}
                    className={fieldClasses(Boolean(errors.phone))}
                  />
                  {errors.phone && (
                    <p className="mt-1.5 text-xs text-red-300/90">{errors.phone}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className={`mt-2 w-full rounded-full px-8 py-3.5 text-xs font-medium uppercase tracking-widest text-white transition-opacity duration-200 hover:opacity-90 sm:py-4 sm:text-sm ${
                    submitted && Object.keys(errors).length > 0 ? 'opacity-90' : ''
                  }`}
                  style={{
                    background:
                      'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
                    boxShadow:
                      '0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset',
                    outline: '2px solid #FFFFFF',
                    outlineOffset: '-3px',
                  }}
                >
                  Continue to WhatsApp
                </button>
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
