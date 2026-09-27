import { motion } from 'framer-motion';

interface FloatingButtonProps {
  lifted: boolean;
  onOpen: () => void;
}

// BASE_URL keeps the path valid when the site is served from a
// sub-path (e.g. GitHub Pages project sites).
const ROBOT_LOGO = `${import.meta.env.BASE_URL}cherry-ai-robot.png`;

/**
 * Premium floating "Ask Cherry AI" button — the Cherry AI robot logo
 * fitted in a circular core with neon glow, glass ring, online dot and
 * hover tooltip. Lifts itself above the hero's contact button while the
 * hero is on screen so nothing important gets covered.
 */
export default function FloatingButton({ lifted, onOpen }: FloatingButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label="Ask Cherry AI"
      aria-haspopup="dialog"
      className={`cherry-fab ${lifted ? 'cherry-fab-lifted' : ''}`}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      whileTap={{ scale: 0.92 }}
    >
      <span className="cherry-fab-ring" aria-hidden="true" />
      <span className="cherry-fab-core">
        <img
          src={ROBOT_LOGO}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="cherry-fab-logo"
        />
      </span>
      <span className="cherry-fab-dot cherry-online-dot" aria-hidden="true" />
      <motion.span
        className="cherry-tip"
        aria-hidden="true"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Need help? Your AI Assistant is here ✨
        <span className="cherry-tip-arrow" aria-hidden="true" />
      </motion.span>
    </motion.button>
  );
}
