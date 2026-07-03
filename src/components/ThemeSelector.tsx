import { ThemeType } from '../types';
import { Sparkles, Heart, Crown, Leaf, Compass } from 'lucide-react';

interface ThemeSelectorProps {
  selectedTheme: ThemeType;
  onChange: (theme: ThemeType) => void;
}

interface ThemeOption {
  id: ThemeType;
  name: string;
  desc: string;
  bgClass: string;
  textClass: string;
  icon: any;
  colors: string[];
}

const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'islamic',
    name: 'Islamic Traditional',
    desc: 'Deep emerald green, opulent gold borders, and elegant Arabic Bismillah motifs.',
    bgClass: 'bg-emerald-950',
    textClass: 'text-amber-200',
    icon: Sparkles,
    colors: ['#064e3b', '#fcd34d']
  },
  {
    id: 'royal',
    name: 'Royal Palace',
    desc: 'Noble dark sapphire/gold gradient, majestic dual border, crown accent crest.',
    bgClass: 'bg-slate-950',
    textClass: 'text-yellow-400',
    icon: Crown,
    colors: ['#020617', '#eab308']
  },
  {
    id: 'floral',
    name: 'Romantic Floral',
    desc: 'Soft warm cream, pastel rose garden blushes, romantic cursive curves, and foliage borders.',
    bgClass: 'bg-[#FAF6F3]',
    textClass: 'text-[#4A3B32]',
    icon: Heart,
    colors: ['#FAF6F3', '#fda4af']
  },
  {
    id: 'minimal',
    name: 'Modern Minimalist',
    desc: 'Pure pristine white canvas, crisp margins, architectural spacing, and thin dark gray line framing.',
    bgClass: 'bg-white',
    textClass: 'text-neutral-900',
    icon: Leaf,
    colors: ['#ffffff', '#171717']
  },
  {
    id: 'boho',
    name: 'Warm Boho Arch',
    desc: 'Earthy rich terracotta tone, desert sand watercolor arches, celestial icons, and organic vibes.',
    bgClass: 'bg-[#FAF3EC]',
    textClass: 'text-[#704235]',
    icon: Compass,
    colors: ['#FAF3EC', '#BE7A5F']
  }
];

export default function ThemeSelector({ selectedTheme, onChange }: ThemeSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300">
        Choose Invitation Theme Style (5 Distinct Card Designs)
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-4">
        {THEME_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = opt.id === selectedTheme;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange(opt.id)}
              className={`flex flex-col text-left p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/20 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20'
                  : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
              id={`theme-opt-${opt.id}`}
            >
              <div className="flex items-center gap-3 mb-2 z-10">
                <span className={`p-2 rounded-lg ${
                  isSelected 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                }`}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                    {opt.name}
                  </h4>
                  <div className="flex gap-1 mt-1">
                    {opt.colors.map((c, i) => (
                      <span
                        key={i}
                        className="w-3.5 h-3.5 rounded-full border border-neutral-300/30 shadow-inner"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed z-10">
                {opt.desc}
              </p>
              
              {/* Subtle themed color wash inside active card */}
              {isSelected && (
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-emerald-600" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
