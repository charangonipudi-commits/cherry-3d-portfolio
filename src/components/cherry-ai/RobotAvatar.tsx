import { useId } from 'react';

interface RobotAvatarProps {
  size?: number;
  className?: string;
}

/**
 * Friendly 3D-style AI robot rendered as pure SVG — gradient shading,
 * specular highlight, glowing visor eyes and a blinking animation.
 */
export default function RobotAvatar({ size = 40, className = '' }: RobotAvatarProps) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const headGrad = `ch-head-${uid}`;
  const bodyGrad = `ch-body-${uid}`;
  const visorGrad = `ch-visor-${uid}`;
  const eyeGrad = `ch-eye-${uid}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={headGrad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8FA0FF" />
          <stop offset="0.55" stopColor="#7621B0" />
          <stop offset="1" stopColor="#B600A8" />
        </linearGradient>
        <linearGradient id={bodyGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7B3BD6" />
          <stop offset="1" stopColor="#4C3BD8" />
        </linearGradient>
        <linearGradient id={visorGrad} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1030" />
          <stop offset="1" stopColor="#151C4A" />
        </linearGradient>
        <radialGradient id={eyeGrad} cx="0.35" cy="0.3" r="1">
          <stop offset="0" stopColor="#D9FBFF" />
          <stop offset="0.45" stopColor="#6FE7FF" />
          <stop offset="1" stopColor="#22D3EE" />
        </radialGradient>
      </defs>

      {/* antenna */}
      <circle cx="32" cy="6" r="6" fill="#22D3EE" opacity="0.22" />
      <line x1="32" y1="7" x2="32" y2="14" stroke="#8FA0FF" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="32" cy="5.5" r="3" fill="#22D3EE" />
      <circle cx="31" cy="4.6" r="1" fill="#E9FDFF" />

      {/* ears */}
      <rect x="8.5" y="25" width="7" height="13" rx="3.5" fill={`url(#${headGrad})`} opacity="0.85" />
      <rect x="48.5" y="25" width="7" height="13" rx="3.5" fill={`url(#${headGrad})`} opacity="0.85" />

      {/* head */}
      <rect x="13" y="13" width="38" height="30" rx="13" fill={`url(#${headGrad})`} />
      <ellipse cx="24.5" cy="20" rx="10" ry="5.5" fill="#FFFFFF" opacity="0.22" />
      <rect x="13" y="13" width="38" height="30" rx="13" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />

      {/* visor */}
      <rect x="19" y="22" width="26" height="14.5" rx="7.2" fill={`url(#${visorGrad})`} />
      <rect x="19" y="22" width="26" height="14.5" rx="7.2" fill="none" stroke="rgba(111,231,255,0.35)" strokeWidth="0.8" />

      {/* eyes (blink via CSS) */}
      <g className="cherry-bot-eyes">
        <circle cx="26.5" cy="29" r="3.5" fill={`url(#${eyeGrad})`} />
        <circle cx="37.5" cy="29" r="3.5" fill={`url(#${eyeGrad})`} />
        <circle cx="27.6" cy="27.9" r="1.05" fill="#FFFFFF" opacity="0.95" />
        <circle cx="38.6" cy="27.9" r="1.05" fill="#FFFFFF" opacity="0.95" />
      </g>

      {/* smile */}
      <path
        d="M28 33.6 Q32 36.2 36 33.6"
        stroke="#7DE3FF"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
        opacity="0.9"
      />

      {/* neck + body */}
      <rect x="29" y="42.5" width="6" height="6" rx="2" fill="#5B3FC4" />
      <rect x="19.5" y="47" width="25" height="13" rx="7" fill={`url(#${bodyGrad})`} />
      <rect x="19.5" y="47" width="25" height="13" rx="7" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.9" />
      <circle cx="32" cy="53.5" r="2.7" fill="#22D3EE" opacity="0.95" />
      <circle cx="31.2" cy="52.7" r="0.8" fill="#E9FDFF" />
    </svg>
  );
}
