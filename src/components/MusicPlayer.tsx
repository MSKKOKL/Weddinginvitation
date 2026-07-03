import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'motion/react';

interface MusicPlayerProps {
  url: string;
  autoPlay?: boolean;
}

export default function MusicPlayer({ url, autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!url) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(url);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;

    if (autoPlay) {
      const playAudio = async () => {
        try {
          await audioRef.current?.play();
          setIsPlaying(true);
        } catch (err) {
          console.log('Autoplay blocked, user interaction required.');
        }
      };
      
      // Delay play slightly to give screen render precedence
      const timeout = setTimeout(playAudio, 1000);
      return () => clearTimeout(timeout);
    }

    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, [url]);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error("Playback failed", err));
    }
  };

  if (!url) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={togglePlay}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-800 dark:text-neutral-100 rounded-full shadow-lg border border-neutral-200/50 dark:border-neutral-800/50 transition-all hover:scale-105 active:scale-95"
        title={isPlaying ? "Mute Background Music" : "Play Background Music"}
        id="bg-music-toggle"
      >
        <span className="relative flex h-5 w-5 items-center justify-center">
          {isPlaying ? (
            <>
              <Volume2 className="h-4 w-4" />
              <div className="absolute inset-0 flex items-end justify-center gap-[2px] pointer-events-none">
                <motion.span
                  animate={{ height: [4, 12, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-[2px] bg-emerald-500 origin-bottom"
                />
                <motion.span
                  animate={{ height: [6, 16, 6] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-[2px] bg-emerald-500 origin-bottom"
                />
                <motion.span
                  animate={{ height: [4, 10, 4] }}
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-[2px] bg-emerald-500 origin-bottom"
                />
              </div>
            </>
          ) : (
            <VolumeX className="h-4 w-4 text-neutral-400" />
          )}
        </span>
        <span className="text-xs font-medium pr-1">
          {isPlaying ? "Music On" : "Music Off"}
        </span>
      </button>
    </div>
  );
}
