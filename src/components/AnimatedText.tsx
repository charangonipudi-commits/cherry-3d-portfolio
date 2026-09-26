import { Fragment, useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  className?: string;
}

interface WordInfo {
  word: string;
  start: number;
}

interface CharacterProps {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}

function Character({ char, progress, range }: CharacterProps) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <span className="relative whitespace-pre">
      <span>{char}</span>
      <motion.span
        aria-hidden
        className="select-none"
        style={{ opacity, position: 'absolute', left: 0, top: 0, whiteSpace: 'pre' }}
      >
        {char}
      </motion.span>
    </span>
  );
}

export default function AnimatedText({ text, className }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.8', 'end 0.2'],
  });

  const words = useMemo<WordInfo[]>(() => {
    let running = 0;
    return text.split(' ').map((word) => {
      const info = { word, start: running };
      running += word.length + 1;
      return info;
    });
  }, [text]);

  return (
    <p ref={ref} className={className}>
      {words.map(({ word, start }, wordIndex) => (
        <Fragment key={wordIndex}>
          <span className="inline-block whitespace-nowrap">
            {word.split('').map((char, charIndex) => (
              <Character
                key={charIndex}
                char={char}
                progress={scrollYProgress}
                range={[
                  (start + charIndex) / text.length,
                  Math.min((start + charIndex + 1) / text.length, 1),
                ]}
              />
            ))}
          </span>
          {wordIndex < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </p>
  );
}
