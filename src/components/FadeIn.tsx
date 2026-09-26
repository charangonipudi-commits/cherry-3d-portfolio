import { useMemo, type ReactNode } from 'react';
import { motion } from 'framer-motion';

type FadeInTag = keyof HTMLElementTagNameMap;

interface FadeInProps {
  children: ReactNode;
  as?: FadeInTag;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
}

export default function FadeIn({
  children,
  as = 'div',
  delay = 0,
  duration = 0.7,
  x = 0,
  y = 30,
  className,
}: FadeInProps) {
  const MotionComponent = useMemo(
    () => motion.create(as) as typeof motion.div,
    [as]
  );

  return (
    <MotionComponent
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: '50px', amount: 0 }}
      transition={{ delay, duration, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}
