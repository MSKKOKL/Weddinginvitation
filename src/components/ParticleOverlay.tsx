import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number; // percentage
  delay: number; // seconds
  duration: number; // seconds
  size: number; // px or rem
  rotation: number; // degrees
  swayDelay: number; // seconds
  opacity: number;
}

interface ParticleOverlayProps {
  type: 'none' | 'snow' | 'sparkles' | 'petals' | 'leaves' | 'glitter';
}

export default function ParticleOverlay({ type }: ParticleOverlayProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (type === 'none') {
      setParticles([]);
      return;
    }

    // Generate 35 beautiful particles
    const generated: Particle[] = Array.from({ length: 35 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * -15, // Negative delay so they are already scattered initially
      duration: 10 + Math.random() * 12, // 10s to 22s
      size: type === 'snow' 
        ? 3 + Math.random() * 5 
        : type === 'glitter'
        ? 2 + Math.random() * 3
        : type === 'sparkles'
        ? 8 + Math.random() * 12
        : 12 + Math.random() * 16, // larger for petals/leaves
      rotation: Math.random() * 360,
      swayDelay: Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.6
    }));

    setParticles(generated);
  }, [type]);

  if (type === 'none' || particles.length === 0) return null;

  // Let's get the visual element for each particle type
  const renderParticleElement = (p: Particle) => {
    switch (type) {
      case 'snow':
        return (
          <div
            className="rounded-full bg-white/80 filter blur-[0.5px]"
            style={{ width: p.size, height: p.size }}
          />
        );
      case 'sparkles':
        return (
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-amber-300 drop-shadow-[0_0_3px_rgba(252,211,77,0.5)]"
            style={{ width: p.size, height: p.size }}
          >
            <path d="M12 0l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
          </svg>
        );
      case 'glitter':
        return (
          <div
            className="rounded-full bg-gradient-to-tr from-yellow-200 via-amber-400 to-yellow-100 animate-pulse shadow-[0_0_6px_rgba(251,191,36,0.8)]"
            style={{ width: p.size, height: p.size }}
          />
        );
      case 'petals':
        // Soft romantic pink petals with unique curved shape
        return (
          <div
            className="bg-gradient-to-br from-rose-200 to-rose-400 rounded-tr-[10px] rounded-bl-[10px] shadow-sm"
            style={{ 
              width: p.size, 
              height: p.size * 0.8,
              transform: `rotate(${p.rotation}deg)` 
            }}
          />
        );
      case 'leaves':
        // Beautiful boho autumn leaves styled as terracotta leaf shape
        return (
          <div
            className="bg-gradient-to-br from-amber-600 via-amber-700 to-[#BE7A5F] rounded-tl-[8px] rounded-br-[8px] shadow-sm"
            style={{ 
              width: p.size, 
              height: p.size * 1.2,
              transform: `rotate(${p.rotation}deg)` 
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 rounded-2xl">
      {/* Dynamic Keyframes injected into the document */}
      <style>{`
        @keyframes floatDown {
          0% {
            transform: translateY(-30px) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--particle-opacity);
          }
          90% {
            opacity: var(--particle-opacity);
          }
          100% {
            transform: translateY(750px) rotate(360deg);
            opacity: 0;
          }
        }
        @keyframes drift {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(25px);
          }
        }
        .particle-container {
          animation: floatDown linear infinite;
        }
        .particle-sway {
          animation: drift ease-in-out infinite alternate;
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute particle-container"
          style={{
            left: `${p.left}%`,
            top: `-30px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            // @ts-ignore
            '--particle-opacity': p.opacity,
          }}
        >
          <div 
            className="particle-sway"
            style={{
              animationDuration: `${4 + Math.random() * 4}s`,
              animationDelay: `${p.swayDelay}s`
            }}
          >
            {renderParticleElement(p)}
          </div>
        </div>
      ))}
    </div>
  );
}
