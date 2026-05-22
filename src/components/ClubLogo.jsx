import React, { useState } from 'react';

/**
 * Renders a club crest using api-sports logo URL.
 * Falls back to the club emoji if the image fails or is unavailable.
 */
export default function ClubLogo({ club, size = 32, style = {} }) {
  const [err, setErr] = useState(false);

  if (club?.logo && !err) {
    return (
      <img
        src={club.logo}
        alt={club.name || ''}
        width={size}
        height={size}
        onError={() => setErr(true)}
        style={{ objectFit: 'contain', display: 'block', ...style }}
      />
    );
  }
  return (
    <span style={{ fontSize: size * 0.82, lineHeight: 1, display: 'block', textAlign: 'center', ...style }}>
      {club?.emoji || '⚽'}
    </span>
  );
}
