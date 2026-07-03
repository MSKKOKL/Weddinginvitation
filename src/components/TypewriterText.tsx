import { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number; // MS before starting
  speed?: number; // MS per letter
  enabled?: boolean;
  className?: string;
}

export default function TypewriterText({
  text,
  delay = 300,
  speed = 45,
  enabled = true,
  className = ""
}: TypewriterTextProps) {
  const [displayText, setDisplayText] = useState(enabled ? "" : text);

  useEffect(() => {
    if (!enabled) {
      setDisplayText(text);
      return;
    }

    setDisplayText("");
    const startTimeout = setTimeout(() => {
      let currentIdx = 0;
      const interval = setInterval(() => {
        if (currentIdx < text.length) {
          // Keep typing next char
          setDisplayText(text.slice(0, currentIdx + 1));
          currentIdx++;
        } else {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(startTimeout);
  }, [text, enabled, delay, speed]);

  return (
    <span className={className}>
      {displayText}
      {enabled && displayText.length < text.length && (
        <span className="inline-block w-[3px] h-[1em] bg-current ml-1 animate-pulse rounded-full align-middle" />
      )}
    </span>
  );
}
