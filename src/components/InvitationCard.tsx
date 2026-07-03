import React, { useState, useEffect } from 'react';
import { WeddingInvitation } from '../types';
import { motion } from 'motion/react';
import { Calendar, MapPin, Clock, Heart, Sparkles, Compass, ShieldAlert, User, Users, Phone, ExternalLink, Check, Map, Instagram, MessageCircle, Share2, Send, Facebook, Copy } from 'lucide-react';
import ParticleOverlay from './ParticleOverlay';
import TypewriterText from './TypewriterText';

interface InvitationCardProps {
  data: WeddingInvitation;
  isPreview?: boolean;
  onRsvpClick?: () => void;
}

function CountdownTimer({ targetDate, theme }: { targetDate: string; theme?: string }) {
  const [timeLeft, setTimeLeft] = useState<{ Days: number; Hours: number; Minutes: number; Seconds: number } | null>(null);

  useEffect(() => {
    if (!targetDate) return;
    
    const calculateTimeLeft = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference <= 0) {
        return null;
      }
      
      return {
        Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        Minutes: Math.floor((difference / 1000 / 60) % 60),
        Seconds: Math.floor((difference / 1000) % 60)
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  // Style customization based on current theme
  let cardBg = "bg-[#123620] border border-amber-400/20";
  let numText = "text-amber-300 font-mono";
  let unitText = "text-amber-200/50 font-sans";
  let finishedText = "text-amber-200 bg-amber-400/10 border border-amber-400/30";

  if (theme === 'royal') {
    cardBg = "bg-yellow-950/40 border border-yellow-500/20";
    numText = "text-yellow-400 font-serif";
    unitText = "text-yellow-200/50 font-sans";
    finishedText = "text-yellow-200 bg-yellow-500/10 border border-yellow-500/30";
  } else if (theme === 'floral') {
    cardBg = "bg-rose-50 border border-rose-200";
    numText = "text-rose-500 font-serif";
    unitText = "text-[#6D5A4E]/60 font-sans";
    finishedText = "text-[#6D5A4E] bg-rose-50 border border-rose-200";
  } else if (theme === 'minimal') {
    cardBg = "bg-neutral-50 border border-neutral-200";
    numText = "text-neutral-900 font-mono";
    unitText = "text-neutral-400 font-mono";
    finishedText = "text-neutral-800 bg-neutral-50 border border-neutral-200";
  } else if (theme === 'boho') {
    cardBg = "bg-[#F5EADF] border border-[#E2B39E]/40";
    numText = "text-[#BE7A5F] font-serif";
    unitText = "text-[#8B6458]/70 font-sans";
    finishedText = "text-[#704235] bg-[#FAF3EC] border border-[#E2B39E]";
  }

  if (!timeLeft) {
    return (
      <div className="flex justify-center gap-3 mt-4">
        <div className={`px-5 py-2 rounded-xl uppercase text-[10px] tracking-wider font-bold animate-pulse ${finishedText}`}>
          Happily Married! ❤️
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-2 max-w-sm mx-auto mt-4">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className={`flex flex-col items-center p-2 rounded-xl shadow transition-all hover:scale-105 duration-300 ${cardBg}`}>
          <span className={`text-xl sm:text-2xl font-black ${numText}`}>{value}</span>
          <span className={`text-[9px] tracking-wider uppercase ${unitText}`}>{unit}</span>
        </div>
      ))}
    </div>
  );
}

function ThemedPage({
  theme,
  actualAnimationType,
  children,
  className = "",
  id
}: {
  theme: string;
  actualAnimationType: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  let baseClass = "";
  let innerBorder = null;
  let corners = null;
  let bgPattern = null;

  if (theme === 'islamic') {
    baseClass = "relative w-full max-w-xl mx-auto overflow-hidden bg-emerald-950 text-amber-100 rounded-2xl shadow-2xl border-[12px] border-double border-amber-400/80 p-8 sm:p-12 font-serif text-center space-y-8 min-h-[600px] flex flex-col justify-center items-center relative";
    bgPattern = <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fcd34d_1px,transparent_1px)] [background-size:16px_16px]" />;
    corners = (
      <>
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-300/40 rounded-tl-lg pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-300/40 rounded-tr-lg pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-300/40 rounded-bl-lg pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-300/40 rounded-br-lg pointer-events-none" />
      </>
    );
  } else if (theme === 'royal') {
    baseClass = "relative w-full max-w-xl mx-auto overflow-hidden bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-950 text-yellow-100 rounded-2xl shadow-2xl border-4 border-yellow-500/80 p-8 sm:p-12 font-serif text-center min-h-[600px] flex flex-col justify-center items-center relative space-y-8";
    innerBorder = <div className="absolute inset-4 border-2 border-yellow-500/30 rounded-lg pointer-events-none" />;
    corners = (
      <>
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-400 pointer-events-none" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-yellow-400 pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-yellow-400 pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-yellow-400 pointer-events-none" />
      </>
    );
  } else if (theme === 'floral') {
    baseClass = "relative w-full max-w-xl mx-auto overflow-hidden bg-white text-[#6D5A4E] rounded-2xl shadow-2xl border-8 border-rose-100 p-8 sm:p-12 font-serif text-center min-h-[600px] flex flex-col justify-center items-center relative space-y-8";
    innerBorder = <div className="absolute inset-3 border border-rose-200/50 rounded pointer-events-none" />;
    bgPattern = (
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-[radial-gradient(circle_at_top_left,rgba(251,113,133,0.15)_0%,transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_bottom_right,rgba(251,113,133,0.15)_0%,transparent_70%)]" />
      </div>
    );
    corners = (
      <>
        <span className="absolute top-4 left-4 text-rose-300 font-sans text-xs opacity-40 select-none">❀</span>
        <span className="absolute top-4 right-4 text-rose-300 font-sans text-xs opacity-40 select-none">❀</span>
        <span className="absolute bottom-4 left-4 text-rose-300 font-sans text-xs opacity-40 select-none">❀</span>
        <span className="absolute bottom-4 right-4 text-rose-300 font-sans text-xs opacity-40 select-none">❀</span>
      </>
    );
  } else if (theme === 'minimal') {
    baseClass = "relative w-full max-w-xl mx-auto overflow-hidden bg-white text-neutral-800 rounded-2xl shadow-xl border border-neutral-200 p-8 sm:p-12 font-sans text-center min-h-[600px] flex flex-col justify-center items-center relative space-y-8";
    innerBorder = <div className="absolute inset-4 border border-neutral-100 rounded-xl pointer-events-none" />;
  } else if (theme === 'boho') {
    baseClass = "relative w-full max-w-xl mx-auto overflow-hidden bg-[#FAF3EC] text-[#704235] rounded-2xl shadow-2xl border-4 border-[#BE7A5F]/20 p-8 sm:p-12 font-serif text-center min-h-[600px] flex flex-col justify-center items-center relative space-y-8";
    bgPattern = <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(#704235_1px,transparent_1px)] [background-size:20px_20px]" />;
    corners = (
      <>
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#BE7A5F]/30 pointer-events-none" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#BE7A5F]/30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#BE7A5F]/30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#BE7A5F]/30 pointer-events-none" />
      </>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className={`${baseClass} ${className}`}
      id={id}
    >
      <ParticleOverlay type={actualAnimationType as any} />
      {bgPattern}
      {innerBorder}
      {corners}
      <div className="w-full relative z-10 flex flex-col justify-center items-center flex-1 py-4 space-y-6">
        {children}
      </div>
    </motion.div>
  );
}

const getFontFamilyStyle = (fontKey?: string) => {
  if (!fontKey) return {};
  switch (fontKey) {
    // Malayalam Fonts
    case 'anek': return { fontFamily: '"Anek Malayalam", sans-serif' };
    case 'baloo': return { fontFamily: '"Baloo Chettan 2", sans-serif' };
    case 'chilanka': return { fontFamily: '"Chilanka", cursive' };
    case 'gayathri': return { fontFamily: '"Gayathri", sans-serif' };
    case 'manjari': return { fontFamily: '"Manjari", sans-serif' };
    case 'noto-malayalam': return { fontFamily: '"Noto Serif Malayalam", serif' };
    
    // English Fonts
    case 'alex': return { fontFamily: '"Alex Brush", cursive' };
    case 'allura': return { fontFamily: '"Allura", cursive' };
    case 'cinzel': return { fontFamily: '"Cinzel", serif' };
    case 'greatvibes': return { fontFamily: '"Great Vibes", cursive' };
    case 'italianno': return { fontFamily: '"Italianno", cursive' };
    case 'parisienne': return { fontFamily: '"Parisienne", cursive' };
    case 'pinyon': return { fontFamily: '"Pinyon Script", cursive' };
    case 'playfair': return { fontFamily: '"Playfair Display", serif' };
    case 'sacramento': return { fontFamily: '"Sacramento", cursive' };
    
    default: return {};
  }
};

export default function InvitationCard({ data, isPreview = false, onRsvpClick }: InvitationCardProps) {
  const {
    groomName,
    groomFont,
    brideName,
    brideFont,
    weddingDate,
    weddingTime,
    venue,
    receptionDetails,
    theme,
    photoUrl,
    groomParents,
    brideParents,
    welcomeMessage,
    
    showNikahDetails = false,
    nikahDate,
    nikahTime,
    nikahVenue,
    nikahDetails,
    
    showCountdown = true,
    
    showPrayers = true,
    duaCouple,
    duaFamily,
    duaGuests,
    
    showFamilyDetails = true,
    groomFather,
    groomMother,
    groomBrother,
    groomSister,
    brideFather,
    brideMother,
    brideBrother,
    brideSister,
    
    venuePhotoUrl,
    mapDirectionsUrl,
    developerName = "MUHAMMED SAEAD",
    developerContact = "",
    
    animationType,
    layoutType,
    enableTypewriter = true
  } = data;

  const hasGroomFamily = !!(groomFather?.trim() || groomMother?.trim() || groomBrother?.trim() || groomSister?.trim());
  const hasBrideFamily = !!(brideFather?.trim() || brideMother?.trim() || brideBrother?.trim() || brideSister?.trim());

  // Determine actual animation type to use based on settings and theme
  const actualAnimationType = animationType || (
    theme === 'islamic' ? 'sparkles' :
    theme === 'royal' ? 'glitter' :
    theme === 'floral' ? 'petals' :
    theme === 'minimal' ? 'snow' :
    theme === 'boho' ? 'leaves' : 'none'
  );

  // Format date nicely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Saturday, October 18, 2026';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  // Generate interactive google maps embed link with address or link queries
  const getGoogleMapsEmbedUrl = (mapUrl?: string, venueName?: string) => {
    let query = venueName || "Qatar Auditorium, Karathur, Malappuram, Kerala";
    if (mapUrl) {
      try {
        const urlObj = new URL(mapUrl);
        const q = urlObj.searchParams.get('q') || urlObj.searchParams.get('query');
        if (q) {
          query = q;
        } else if (urlObj.pathname.includes('/place/')) {
          const parts = urlObj.pathname.split('/place/');
          if (parts[1]) {
            const placePart = parts[1].split('/')[0];
            query = decodeURIComponent(placePart.replace(/\+/g, ' '));
          }
        } else {
          const coordRegex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
          const match = urlObj.pathname.match(coordRegex);
          if (match && match[1] && match[2]) {
            query = `${match[1]},${match[2]}`;
          } else {
            query = venueName || mapUrl;
          }
        }
      } catch (e) {
        if (mapUrl.trim()) {
          query = mapUrl.trim();
        }
      }
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  };

  // Stagger animation container with smooth organic spring physics
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 35 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 60,
        damping: 15,
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 18 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 85, 
        damping: 13 
      } 
    }
  };

  // Check if layout is 'long-scroll' (which is the modern default requested by user)
  if (layoutType !== 'compact') {
    return (
      <div className="w-full space-y-8 select-none">
        {/* Page 1: Welcome Cover */}
        <ThemedPage theme={theme} actualAnimationType={actualAnimationType} id={`page-cover-${theme}`}>
          {/* Cover Header */}
          {theme === 'islamic' && (
            <div className="space-y-3">
              <motion.div variants={itemVariants} className="text-amber-300 text-lg font-bold tracking-widest">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </motion.div>
              <div className="text-amber-250/80 text-[9px] tracking-[0.2em] uppercase font-sans font-bold">
                In the Name of Allah, the Most Gracious, the Most Merciful
              </div>
            </div>
          )}
          {theme === 'royal' && (
            <div className="space-y-2">
              <div className="relative p-3 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-2">
                <Sparkles className="h-6 w-6 text-yellow-400" />
              </div>
              <div className="text-yellow-400 text-xs tracking-[0.3em] uppercase font-sans font-bold">
                ROYAL WEDDING INVITATION
              </div>
            </div>
          )}
          {theme === 'floral' && (
            <div className="space-y-2 flex flex-col items-center">
              <span className="text-2xl text-rose-300 animate-pulse">❀</span>
              <div className="text-rose-400 text-xs tracking-[0.25em] uppercase font-sans font-bold">
                Wedding Celebration
              </div>
            </div>
          )}
          {theme === 'minimal' && (
            <div className="space-y-1">
              <span className="text-neutral-300 tracking-widest text-[9px] uppercase font-mono font-bold">
                / THE WEDDING INVITATION
              </span>
            </div>
          )}
          {theme === 'boho' && (
            <div className="space-y-1">
              <div className="text-[#BE7A5F] text-2xl font-serif">✦</div>
              <span className="text-[#8B6458]/70 text-[10px] tracking-[0.2em] uppercase font-sans font-bold">
                CELEBRATING LOVE & UNITY
              </span>
            </div>
          )}

          {/* Welcome Message */}
          <motion.div variants={itemVariants} className={`text-xs sm:text-sm italic max-w-md leading-relaxed px-4 ${
            theme === 'islamic' ? 'text-amber-200/80' :
            theme === 'royal' ? 'text-yellow-100/70' :
            theme === 'floral' ? 'text-[#6D5A4E]' :
            theme === 'minimal' ? 'text-neutral-500 font-mono' : 'text-[#8B6458]'
          }`}>
            {welcomeMessage || (
              theme === 'islamic' ? "And among His Signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquillity with them, and He has put love and mercy between your (hearts)..." :
              theme === 'royal' ? "Under the Grace of His Majesty, and with extreme honor, we invite you to celebrate the union of love, devotion, and family." :
              theme === 'floral' ? "Love is a beautiful garden where two hearts bloom together as one. We invite you to join us as we start our forever journey." :
              theme === 'minimal' ? "WE ARE GETTING MARRIED. WE WOULD BE ABSOLUTELY DELIGHTED IF YOU COULD JOIN US FOR THE CELEBRATION." :
              "Like wild spirits guided by the stars, our paths have woven together. We invite you to sit under the sun and dance under the moon with us."
            )}
          </motion.div>

          {/* Introduce Couple */}
          <motion.div variants={itemVariants} className="space-y-4 py-2">
            <p className={`uppercase text-[10px] tracking-[0.15em] font-sans font-bold ${
              theme === 'islamic' ? 'text-amber-400/70' :
              theme === 'royal' ? 'text-yellow-200/60' :
              theme === 'floral' ? 'text-rose-400/80' :
              theme === 'minimal' ? 'text-neutral-400' : 'text-[#BE7A5F]/80'
            }`}>
              {theme === 'royal' ? 'Request the pleasure of your company at the nuptials of' : 'We invite you to celebrate the marriage of'}
            </p>
            
            <div className="space-y-3">
              <h1 style={getFontFamilyStyle(groomFont)} className={`text-3xl sm:text-5xl font-extrabold capitalize tracking-wide ${
                theme === 'islamic' ? 'text-amber-200 font-serif' :
                theme === 'royal' ? 'text-yellow-300 font-serif italic font-normal' :
                theme === 'floral' ? 'text-rose-600 font-serif' :
                theme === 'minimal' ? 'text-neutral-900 font-sans tracking-tight' : 'text-[#704235] font-serif'
              }`}>
                <TypewriterText text={groomName || "Groom Name"} enabled={enableTypewriter} delay={300} />
              </h1>
              
              <div className="flex items-center justify-center gap-2">
                <span className={`h-[1px] w-12 ${
                  theme === 'islamic' ? 'bg-amber-400/30' :
                  theme === 'royal' ? 'bg-yellow-500/30' :
                  theme === 'floral' ? 'bg-rose-300/30' :
                  theme === 'minimal' ? 'bg-neutral-200' : 'bg-[#BE7A5F]/30'
                }`}></span>
                {theme === 'minimal' ? (
                  <span className="text-xs text-neutral-400 font-mono">&</span>
                ) : (
                  <Heart className={`h-4 w-4 animate-pulse fill-current ${
                    theme === 'islamic' ? 'text-amber-400 fill-amber-400/10' :
                    theme === 'royal' ? 'text-yellow-400 fill-yellow-400/10' :
                    theme === 'floral' ? 'text-rose-400 fill-rose-400/10' : 'text-[#BE7A5F] fill-[#BE7A5F]/10'
                  }`} />
                )}
                <span className={`h-[1px] w-12 ${
                  theme === 'islamic' ? 'bg-amber-400/30' :
                  theme === 'royal' ? 'bg-yellow-500/30' :
                  theme === 'floral' ? 'bg-rose-300/30' :
                  theme === 'minimal' ? 'bg-neutral-200' : 'bg-[#BE7A5F]/30'
                }`}></span>
              </div>
              
              <h1 style={getFontFamilyStyle(brideFont)} className={`text-3xl sm:text-5xl font-extrabold capitalize tracking-wide ${
                theme === 'islamic' ? 'text-amber-200 font-serif' :
                theme === 'royal' ? 'text-yellow-300 font-serif italic font-normal' :
                theme === 'floral' ? 'text-rose-600 font-serif' :
                theme === 'minimal' ? 'text-neutral-900 font-sans tracking-tight' : 'text-[#704235] font-serif'
              }`}>
                <TypewriterText text={brideName || "Bride Name"} enabled={enableTypewriter} delay={1000} />
              </h1>
            </div>
          </motion.div>

          {/* Photo */}
          {photoUrl && (
            <motion.div variants={itemVariants} className={`my-4 max-w-sm mx-auto overflow-hidden rounded-2xl border shadow-lg ${
              theme === 'islamic' ? 'border-amber-400/30' :
              theme === 'royal' ? 'border-yellow-500/30' :
              theme === 'floral' ? 'border-rose-200' :
              theme === 'minimal' ? 'border-neutral-200' : 'border-[#BE7A5F]/20'
            }`}>
              <img referrerPolicy="no-referrer" src={photoUrl} alt="Wedding Couple" className="w-full h-44 sm:h-48 object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          )}

          {/* Scroll Down */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={`text-[10px] tracking-widest uppercase opacity-75 mt-4 flex flex-col items-center gap-1 font-semibold font-sans ${
              theme === 'islamic' ? 'text-amber-300' :
              theme === 'royal' ? 'text-yellow-400' :
              theme === 'floral' ? 'text-rose-500' :
              theme === 'minimal' ? 'text-neutral-500' : 'text-[#BE7A5F]'
            }`}
          >
            <span>Scroll Down for Details</span>
            <span className="text-sm font-bold">▽</span>
          </motion.div>
        </ThemedPage>

        {/* Page 2: Families, Parents & Loving Blessings */}
        {(groomParents || brideParents || showFamilyDetails || showPrayers) && (
          <ThemedPage theme={theme} actualAnimationType={actualAnimationType} id={`page-family-${theme}`}>
            <motion.div variants={itemVariants} className="space-y-1 text-center">
              <span className={`text-[10px] uppercase tracking-widest font-sans font-bold ${
                theme === 'islamic' ? 'text-amber-400/80' :
                theme === 'royal' ? 'text-yellow-400' :
                theme === 'floral' ? 'text-rose-400' :
                theme === 'minimal' ? 'text-neutral-400' : 'text-[#BE7A5F]'
              }`}>
                Family Blessings & Prayers
              </span>
              <h2 className={`text-xl font-bold font-serif ${
                theme === 'islamic' ? 'text-amber-200' :
                theme === 'royal' ? 'text-yellow-200' :
                theme === 'floral' ? 'text-rose-700 font-sans' :
                theme === 'minimal' ? 'text-neutral-800' : 'text-[#704235]'
              }`}>
                {theme === 'islamic' ? 'With Sincere Blessings' : 'With Joyful Hearts'}
              </h2>
            </motion.div>

            {/* Parents List */}
            {(groomParents || brideParents) && (
              <motion.div variants={itemVariants} className={`grid grid-cols-2 gap-4 text-xs font-sans tracking-wider text-center w-full max-w-md mx-auto border-b pb-6 ${
                theme === 'islamic' ? 'text-amber-300/85 border-amber-400/10' :
                theme === 'royal' ? 'text-yellow-300/80 border-yellow-500/10' :
                theme === 'floral' ? 'text-[#6D5A4E]/80 border-rose-100' :
                theme === 'minimal' ? 'text-neutral-600 border-neutral-100' : 'text-[#8B6458]/80 border-[#BE7A5F]/10'
              }`}>
                <div>
                  <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${
                    theme === 'islamic' ? 'text-amber-400/50' :
                    theme === 'royal' ? 'text-yellow-500/50' :
                    theme === 'floral' ? 'text-rose-400/60' :
                    theme === 'minimal' ? 'text-neutral-400' : 'text-[#BE7A5F]/60'
                  }`}>
                    Groom's Parents
                  </p>
                  <p className="font-semibold text-xs sm:text-sm leading-relaxed">{groomParents || "The Groom's Family"}</p>
                </div>
                <div>
                  <p className={`text-[10px] uppercase font-bold tracking-widest mb-1 ${
                    theme === 'islamic' ? 'text-amber-400/50' :
                    theme === 'royal' ? 'text-yellow-500/50' :
                    theme === 'floral' ? 'text-rose-400/60' :
                    theme === 'minimal' ? 'text-neutral-400' : 'text-[#BE7A5F]/60'
                  }`}>
                    Bride's Parents
                  </p>
                  <p className="font-semibold text-xs sm:text-sm leading-relaxed">{brideParents || "The Bride's Family"}</p>
                </div>
              </motion.div>
            )}

            {/* Family Members Detail List */}
            {showFamilyDetails && (hasGroomFamily || hasBrideFamily) && (
              <motion.div variants={itemVariants} className="w-full max-w-md mx-auto space-y-4">
                <div className={`grid gap-4 text-center font-sans ${
                  hasGroomFamily && hasBrideFamily ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto'
                }`}>
                  {/* Groom Family Details */}
                  {hasGroomFamily && (
                    <div className={`p-4 rounded-xl border text-center ${
                      theme === 'islamic' ? 'bg-[#123620]/40 border-amber-400/15 text-amber-100/90' :
                      theme === 'royal' ? 'bg-yellow-950/20 border-yellow-500/15 text-yellow-100/90' :
                      theme === 'floral' ? 'bg-rose-50/50 border-rose-100 text-[#6D5A4E]/90' :
                      theme === 'minimal' ? 'bg-neutral-50 border-neutral-150 text-neutral-600' : 'bg-[#FAF3EC]/60 border-[#BE7A5F]/15 text-[#704235]'
                    }`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 mb-2 text-center ${
                        theme === 'islamic' ? 'text-amber-300 border-amber-400/10' :
                        theme === 'royal' ? 'text-yellow-400 border-yellow-500/10' :
                        theme === 'floral' ? 'text-rose-600 border-rose-100' :
                        theme === 'minimal' ? 'text-neutral-800 border-neutral-200' : 'text-[#BE7A5F] border-[#BE7A5F]/10'
                      }`}>
                        Groom's Family
                      </p>
                      <div className="space-y-1.5 text-xs text-center">
                        {groomFather && <p><span className="opacity-70 font-semibold">Father:</span> {groomFather}</p>}
                        {groomMother && <p><span className="opacity-70 font-semibold">Mother:</span> {groomMother}</p>}
                        {groomBrother && <p><span className="opacity-70 font-semibold">Brother:</span> {groomBrother}</p>}
                        {groomSister && <p><span className="opacity-70 font-semibold">Sister:</span> {groomSister}</p>}
                      </div>
                    </div>
                  )}

                  {/* Bride Family Details */}
                  {hasBrideFamily && (
                    <div className={`p-4 rounded-xl border text-center ${
                      theme === 'islamic' ? 'bg-[#123620]/40 border-amber-400/15 text-amber-100/90' :
                      theme === 'royal' ? 'bg-yellow-950/20 border-yellow-500/15 text-yellow-100/90' :
                      theme === 'floral' ? 'bg-rose-50/50 border-rose-100 text-[#6D5A4E]/90' :
                      theme === 'minimal' ? 'bg-neutral-50 border-neutral-150 text-neutral-600' : 'bg-[#FAF3EC]/60 border-[#BE7A5F]/15 text-[#704235]'
                    }`}>
                      <p className={`text-[10px] font-bold uppercase tracking-wider border-b pb-1.5 mb-2 text-center ${
                        theme === 'islamic' ? 'text-amber-300 border-amber-400/10' :
                        theme === 'royal' ? 'text-yellow-400 border-yellow-500/10' :
                        theme === 'floral' ? 'text-rose-600 border-rose-100' :
                        theme === 'minimal' ? 'text-neutral-800 border-neutral-200' : 'text-[#BE7A5F] border-[#BE7A5F]/10'
                      }`}>
                        Bride's Family
                      </p>
                      <div className="space-y-1.5 text-xs text-center">
                        {brideFather && <p><span className="opacity-70 font-semibold">Father:</span> {brideFather}</p>}
                        {brideMother && <p><span className="opacity-70 font-semibold">Mother:</span> {brideMother}</p>}
                        {brideBrother && <p><span className="opacity-70 font-semibold">Brother:</span> {brideBrother}</p>}
                        {brideSister && <p><span className="opacity-70 font-semibold">Sister:</span> {brideSister}</p>}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Prayers Section */}
            {showPrayers && (
              <motion.div variants={itemVariants} className="w-full max-w-md mx-auto space-y-3 font-sans text-left mt-2">
                <div className={`p-3 rounded-xl border text-center ${
                  theme === 'islamic' ? 'bg-[#123620]/30 border-amber-400/10' :
                  theme === 'royal' ? 'bg-yellow-500/5 border-yellow-500/10' :
                  theme === 'floral' ? 'bg-rose-50/20 border-rose-100' :
                  theme === 'minimal' ? 'bg-neutral-50/50 border-neutral-100' : 'bg-[#FAF3EC]/30 border-[#BE7A5F]/10'
                }`}>
                  <p className={`text-[9px] uppercase font-black tracking-wider ${
                    theme === 'islamic' ? 'text-amber-400' :
                    theme === 'royal' ? 'text-yellow-400' :
                    theme === 'floral' ? 'text-rose-500' :
                    theme === 'minimal' ? 'text-neutral-500' : 'text-[#BE7A5F]'
                  }`}>
                    {theme === 'islamic' ? 'Dua for the Newlyweds' : 'Wishes for the Couple'}
                  </p>
                  <p className={`text-xs italic mt-1 leading-relaxed ${
                    theme === 'islamic' ? 'text-amber-100/90' :
                    theme === 'royal' ? 'text-yellow-100/90' :
                    theme === 'floral' ? 'text-[#6D5A4E]' :
                    theme === 'minimal' ? 'text-neutral-600' : 'text-[#704235]'
                  }`}>
                    {duaCouple || (theme === 'islamic' ? "May Allah bless you both and unite you in goodness. (Barakallahu Lakuma)" : "May your marriage be blessed with eternal laughter, loving companionship, and joy.")}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Scroll Down */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className={`text-[10px] tracking-widest uppercase opacity-75 mt-4 flex flex-col items-center gap-1 font-semibold font-sans ${
                theme === 'islamic' ? 'text-amber-300' :
                theme === 'royal' ? 'text-yellow-400' :
                theme === 'floral' ? 'text-rose-500' :
                theme === 'minimal' ? 'text-neutral-500' : 'text-[#BE7A5F]'
              }`}
            >
              <span>Scroll Down for Ceremony Schedule</span>
              <span className="text-sm font-bold">▽</span>
            </motion.div>
          </ThemedPage>
        )}

        {/* Page 3: Ceremony Schedule, Timers & Countdown */}
        <ThemedPage theme={theme} actualAnimationType={actualAnimationType} id={`page-ceremony-${theme}`}>
          <motion.div variants={itemVariants} className="space-y-1 text-center">
            <span className={`text-[10px] uppercase tracking-widest font-sans font-bold ${
              theme === 'islamic' ? 'text-amber-400/80' :
              theme === 'royal' ? 'text-yellow-400' :
              theme === 'floral' ? 'text-rose-400' :
              theme === 'minimal' ? 'text-neutral-400' : 'text-[#BE7A5F]'
              }`}>
              Schedule & Celebration
            </span>
            <h2 className={`text-xl font-bold font-serif ${
              theme === 'islamic' ? 'text-amber-200' :
              theme === 'royal' ? 'text-yellow-200' :
              theme === 'floral' ? 'text-rose-700 font-sans' :
              theme === 'minimal' ? 'text-neutral-800' : 'text-[#704235]'
            }`}>
              Wedding Schedule
            </h2>
          </motion.div>

          <div className="w-full max-w-md mx-auto space-y-4">
            {/* Reception Card */}
            <motion.div variants={itemVariants} className={`p-5 rounded-2xl border text-left space-y-3 font-sans ${
              theme === 'islamic' ? 'bg-[#123620]/60 border-amber-400/25' :
              theme === 'royal' ? 'bg-neutral-900/50 border-yellow-500/20' :
              theme === 'floral' ? 'bg-rose-50/50 border-rose-200/50' :
              theme === 'minimal' ? 'bg-neutral-50 border-neutral-150' : 'bg-[#FAF3EC]/80 border-[#BE7A5F]/20'
            }`}>
              <div className="text-center pb-2 border-b border-dashed border-current opacity-60">
                <span className={`text-xs uppercase tracking-widest font-bold ${
                  theme === 'islamic' ? 'text-amber-300' :
                  theme === 'royal' ? 'text-yellow-400' :
                  theme === 'floral' ? 'text-rose-600' :
                  theme === 'minimal' ? 'text-neutral-800' : 'text-[#704235]'
                }`}>
                  {theme === 'islamic' ? 'Wedding Feast & Reception' : 'Wedding Ceremony'}
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Calendar className={`h-4 w-4 shrink-0 mt-0.5 ${
                  theme === 'islamic' ? 'text-amber-400' :
                  theme === 'royal' ? 'text-yellow-400' :
                  theme === 'floral' ? 'text-rose-500' :
                  theme === 'minimal' ? 'text-neutral-800' : 'text-[#BE7A5F]'
                }`} />
                <span className="font-semibold">{formatDate(weddingDate)}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <Clock className={`h-4 w-4 shrink-0 mt-0.5 ${
                  theme === 'islamic' ? 'text-amber-400' :
                  theme === 'royal' ? 'text-yellow-400' :
                  theme === 'floral' ? 'text-rose-500' :
                  theme === 'minimal' ? 'text-neutral-800' : 'text-[#BE7A5F]'
                }`} />
                <span>{weddingTime || "11:00 AM - 4:00 PM"}</span>
              </div>
              <div className="flex items-start gap-3 text-sm">
                <MapPin className={`h-4 w-4 shrink-0 mt-0.5 ${
                  theme === 'islamic' ? 'text-amber-400' :
                  theme === 'royal' ? 'text-yellow-400' :
                  theme === 'floral' ? 'text-rose-500' :
                  theme === 'minimal' ? 'text-neutral-800' : 'text-[#BE7A5F]'
                }`} />
                <span className="leading-relaxed text-xs sm:text-sm">{venue || "Qatar Auditorium, Karathur, Malappuram, Kerala"}</span>
              </div>
              {receptionDetails && (
                <div className="pt-2 text-xs italic border-t border-current opacity-70 leading-relaxed font-serif">
                  {receptionDetails}
                </div>
              )}
            </motion.div>

            {/* Nikah Ceremony (Optional) */}
            {showNikahDetails && (
              <motion.div variants={itemVariants} className={`p-5 rounded-2xl border text-left space-y-3 font-sans ${
                theme === 'islamic' ? 'bg-[#123620]/60 border-amber-400/25' :
                theme === 'royal' ? 'bg-neutral-900/50 border-yellow-500/20' :
                theme === 'floral' ? 'bg-rose-50/50 border-rose-200/50' :
                theme === 'minimal' ? 'bg-neutral-50 border-neutral-150' : 'bg-[#FAF3EC]/80 border-[#BE7A5F]/20'
              }`}>
                <div className="text-center pb-2 border-b border-dashed border-current opacity-60">
                  <span className={`text-xs uppercase tracking-widest font-bold ${
                    theme === 'islamic' ? 'text-amber-300' :
                    theme === 'royal' ? 'text-yellow-400' :
                    theme === 'floral' ? 'text-rose-600' :
                    theme === 'minimal' ? 'text-neutral-800' : 'text-[#704235]'
                  }`}>
                    The Holy Nikah Ceremony
                  </span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className={`h-4 w-4 shrink-0 mt-0.5 ${
                    theme === 'islamic' ? 'text-amber-400' :
                    theme === 'royal' ? 'text-yellow-400' :
                    theme === 'floral' ? 'text-rose-500' :
                    theme === 'minimal' ? 'text-neutral-800' : 'text-[#BE7A5F]'
                  }`} />
                  <span className="font-semibold">{formatDate(nikahDate || weddingDate)}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock className={`h-4 w-4 shrink-0 mt-0.5 ${
                    theme === 'islamic' ? 'text-amber-400' :
                    theme === 'royal' ? 'text-yellow-400' :
                    theme === 'floral' ? 'text-rose-500' :
                    theme === 'minimal' ? 'text-neutral-800' : 'text-[#BE7A5F]'
                  }`} />
                  <span>{nikahTime || "09:00 AM"}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className={`h-4 w-4 shrink-0 mt-0.5 ${
                    theme === 'islamic' ? 'text-amber-400' :
                    theme === 'royal' ? 'text-yellow-400' :
                    theme === 'floral' ? 'text-rose-500' :
                    theme === 'minimal' ? 'text-neutral-800' : 'text-[#BE7A5F]'
                  }`} />
                  <span className="leading-relaxed text-xs sm:text-sm">{nikahVenue || "Thavakkal Auditorium, Pooyikuth, Tirur"}</span>
                </div>
                <div className="pt-2 text-xs italic border-t border-current opacity-70 leading-relaxed font-serif">
                  {nikahDetails || "The Nikah marriage registration & union ceremony under Almighty's eternal grace."}
                </div>
              </motion.div>
            )}
          </div>

          {/* Countdown Section */}
          {showCountdown && weddingDate && (
            <motion.div variants={itemVariants} className="space-y-2 py-2 w-full text-center">
              <span className={`text-[10px] uppercase tracking-widest font-sans font-bold block ${
                theme === 'islamic' ? 'text-amber-300' :
                theme === 'royal' ? 'text-yellow-400' :
                theme === 'floral' ? 'text-rose-500' :
                theme === 'minimal' ? 'text-neutral-500' : 'text-[#BE7A5F]'
              }`}>
                Counting Down to the Big Day
              </span>
              <CountdownTimer targetDate={weddingDate} theme={theme} />
            </motion.div>
          )}

          {/* Scroll Down */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className={`text-[10px] tracking-widest uppercase opacity-75 mt-4 flex flex-col items-center gap-1 font-semibold font-sans ${
              theme === 'islamic' ? 'text-amber-300' :
              theme === 'royal' ? 'text-yellow-400' :
              theme === 'floral' ? 'text-rose-500' :
              theme === 'minimal' ? 'text-neutral-500' : 'text-[#BE7A5F]'
            }`}
          >
            <span>Scroll Down to RSVP & Directions</span>
            <span className="text-sm font-bold">▽</span>
          </motion.div>
        </ThemedPage>

        {/* Page 4: Interactive Maps & RSVP Trigger */}
        <ThemedPage theme={theme} actualAnimationType={actualAnimationType} id={`page-rsvp-${theme}`}>
          <motion.div variants={itemVariants} className="space-y-1 text-center">
            <span className={`text-[10px] uppercase tracking-widest font-sans font-bold ${
              theme === 'islamic' ? 'text-amber-400/80' :
              theme === 'royal' ? 'text-yellow-400' :
              theme === 'floral' ? 'text-rose-400' :
              theme === 'minimal' ? 'text-neutral-400' : 'text-[#BE7A5F]'
              }`}>
              Interactive Guide
            </span>
            <h2 className={`text-xl font-bold font-serif ${
              theme === 'islamic' ? 'text-amber-200' :
              theme === 'royal' ? 'text-yellow-200' :
              theme === 'floral' ? 'text-rose-700 font-sans' :
              theme === 'minimal' ? 'text-neutral-800' : 'text-[#704235]'
            }`}>
              Location & Attendance
            </h2>
          </motion.div>

          {/* Venue Map */}
          <motion.div variants={itemVariants} className="w-full max-w-sm space-y-3 font-sans">
            {/* Interactive Map Preview iframe */}
            <div className={`relative h-44 w-full rounded-xl overflow-hidden border ${
              theme === 'islamic' ? 'border-amber-400/20 bg-emerald-900/50' :
              theme === 'royal' ? 'border-yellow-500/20 bg-neutral-900/50' :
              theme === 'floral' ? 'border-rose-200 bg-rose-50/50' :
              theme === 'minimal' ? 'border-neutral-200 bg-neutral-50' : 'border-[#BE7A5F]/20 bg-[#FAF3EC]/80'
            }`}>
              <iframe
                title="Venue Location Map"
                src={getGoogleMapsEmbedUrl(mapDirectionsUrl, venue)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-95"
              ></iframe>
            </div>

            <a
              href={mapDirectionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue || "Qatar Auditorium, Karathur, Malappuram, Kerala")}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-5 py-2 font-bold tracking-wider text-xs rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 uppercase ${
                theme === 'islamic' ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950' :
                theme === 'royal' ? 'bg-yellow-400 hover:bg-yellow-300 text-neutral-950' :
                theme === 'floral' ? 'bg-rose-500 hover:bg-rose-600 text-white' :
                theme === 'minimal' ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-[#BE7A5F] hover:bg-[#A9664E] text-white'
              }`}
            >
              <ExternalLink className="h-3 w-3" />
              Get Directions on Map
            </a>
          </motion.div>

          {/* RSVP Trigger Button */}
          {onRsvpClick && (
            <motion.div variants={itemVariants} className="w-full max-w-sm pt-2">
              <button
                onClick={onRsvpClick}
                className={`w-full py-3.5 text-sm font-bold tracking-widest rounded-xl transition-all shadow-lg hover:scale-102 active:scale-98 uppercase font-sans cursor-pointer ${
                  theme === 'islamic' ? 'bg-amber-400 hover:bg-amber-300 text-emerald-950 hover:shadow-amber-400/10' :
                  theme === 'royal' ? 'bg-yellow-400 hover:bg-yellow-300 text-neutral-950 hover:shadow-yellow-400/10' :
                  theme === 'floral' ? 'bg-rose-500 hover:bg-rose-600 text-white hover:shadow-rose-500/10' :
                  theme === 'minimal' ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-[#BE7A5F] hover:bg-[#A9664E] text-white hover:shadow-[#BE7A5F]/10'
                }`}
              >
                Honor Us with Your RSVP
              </button>
              <p className="text-[10px] opacity-60 text-center mt-2">
                Please click the button to submit your attendance response below.
              </p>
            </motion.div>
          )}

          {/* Close & Footer */}
          <motion.div variants={itemVariants} className="space-y-2 border-t pt-4 w-full text-center border-current opacity-60 font-serif">
            {theme === 'islamic' ? (
              <>
                <p className="text-amber-300 text-xs italic tracking-widest">
                  مَا شَاءَ اللَّهُ كَانَ وَمَا لَمْ يَشَأْ لَمْ يَكُنْ
                </p>
                <p className="text-[10px] uppercase font-sans font-bold">
                  With lots of love, we look forward to celebrating with you!
                </p>
              </>
            ) : (
              <p className="text-xs italic leading-relaxed">
                "Sharing this journey with you is the sweetest celebration." <br />
                With warmest love, {groomName || "Nabeel"} & {brideName || "Nasla"}
              </p>
            )}

            <div className="pt-2 text-[8px] tracking-widest uppercase flex flex-col items-center justify-center font-sans gap-1.5">
              <span className="opacity-50">© {new Date().getFullYear()} • WEDDING INVITATION CREATED BY {developerName.toUpperCase()}</span>
              <div className="flex items-center gap-3 mt-0.5">
                <a
                  href="https://wa.me/917902205315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1.5 rounded-full transition-all hover:scale-115 ${
                    theme === 'islamic' ? 'bg-amber-400/15 hover:bg-amber-400/25 text-amber-300' :
                    theme === 'royal' ? 'bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-400' :
                    theme === 'floral' ? 'bg-rose-100 hover:bg-rose-200 text-rose-500' :
                    theme === 'minimal' ? 'bg-neutral-150 hover:bg-neutral-200 text-neutral-800' : 'bg-[#E2B39E]/20 hover:bg-[#E2B39E]/30 text-[#BE7A5F]'
                  }`}
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://instagram.com/m._saead"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-1.5 rounded-full transition-all hover:scale-115 ${
                    theme === 'islamic' ? 'bg-amber-400/15 hover:bg-amber-400/25 text-amber-300' :
                    theme === 'royal' ? 'bg-yellow-500/15 hover:bg-yellow-500/25 text-yellow-400' :
                    theme === 'floral' ? 'bg-rose-100 hover:bg-rose-200 text-rose-500' :
                    theme === 'minimal' ? 'bg-neutral-150 hover:bg-neutral-200 text-neutral-800' : 'bg-[#E2B39E]/20 hover:bg-[#E2B39E]/30 text-[#BE7A5F]'
                  }`}
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        </ThemedPage>
      </div>
    );
  }

  // Render themes
  switch (theme) {
    case 'islamic':
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative w-full max-w-xl mx-auto overflow-hidden bg-emerald-950 text-amber-100 rounded-2xl shadow-2xl border-[12px] border-double border-amber-400/80 p-6 sm:p-10 font-serif text-center space-y-8"
          style={{ minHeight: isPreview ? 'auto' : '650px' }}
          id="invitation-card-islamic"
        >
          <ParticleOverlay type={actualAnimationType} />
          
          {/* Ornate Background Patterns */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#fcd34d_1px,transparent_1px)] [background-size:16px_16px]" />
          
          {/* Islamic Corner Flourishes */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-300/40 rounded-tl-lg pointer-events-none" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-300/40 rounded-tr-lg pointer-events-none" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-300/40 rounded-bl-lg pointer-events-none" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-300/40 rounded-br-lg pointer-events-none" />

          {/* Section 1: Header */}
          <div className="space-y-3">
            <motion.div variants={itemVariants} className="flex justify-center">
              <div className="text-amber-300 text-lg font-bold tracking-widest">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="text-amber-200/90 text-[10px] sm:text-xs tracking-[0.2em] uppercase font-sans">
              In the Name of Allah, the Most Gracious, the Most Merciful
            </motion.div>
          </div>

          {/* Section 2: Welcome / Quranic Verse */}
          <motion.div variants={itemVariants} className="text-xs sm:text-sm italic text-amber-200/80 max-w-md mx-auto leading-relaxed border-b border-amber-400/10 pb-6">
            {welcomeMessage || "And among His Signs is this, that He created for you mates from among yourselves, that ye may dwell in tranquillity with them, and He has put love and mercy between your (hearts)..."}
          </motion.div>

          {/* Families Names Summary */}
          {(groomParents || brideParents) && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 text-xs font-sans tracking-wider text-amber-300/80 border-b border-amber-400/10 pb-6">
              <div>
                <p className="text-[10px] uppercase text-amber-400/50 font-sans tracking-wider">Groom's Parents</p>
                <p className="font-semibold">{groomParents || "The Groom's Family"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-amber-400/50 font-sans tracking-wider">Bride's Parents</p>
                <p className="font-semibold">{brideParents || "The Bride's Family"}</p>
              </div>
            </motion.div>
          )}

          {/* Section 3: Couple Names */}
          <motion.div variants={itemVariants} className="space-y-4 py-4">
            <p className="text-amber-400/70 uppercase text-[10px] sm:text-xs tracking-[0.15em] font-sans">
              We cordially invite you to celebrate the wedding ceremony of
            </p>
            <div className="space-y-2">
              <h1 style={getFontFamilyStyle(groomFont)} className="text-3xl sm:text-5xl font-extrabold tracking-wide text-amber-200 capitalize">
                <TypewriterText text={groomName || "Nabeel"} enabled={enableTypewriter} delay={300} />
              </h1>
              <div className="flex items-center justify-center gap-2">
                <span className="h-[1px] w-12 bg-amber-400/30"></span>
                <Heart className="h-4 w-4 text-amber-400 animate-pulse fill-amber-400/10" />
                <span className="h-[1px] w-12 bg-amber-400/30"></span>
              </div>
              <h1 style={getFontFamilyStyle(brideFont)} className="text-3xl sm:text-5xl font-extrabold tracking-wide text-amber-200 capitalize">
                <TypewriterText text={brideName || "Nasla"} enabled={enableTypewriter} delay={1000} />
              </h1>
            </div>
          </motion.div>

          {/* Featured Couple Photo */}
          {photoUrl && (
            <motion.div variants={itemVariants} className="my-4 max-w-sm mx-auto overflow-hidden rounded-xl border-2 border-amber-400/40 shadow-lg">
              <img referrerPolicy="no-referrer" src={photoUrl} alt="Wedding Couple" className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500" />
            </motion.div>
          )}

          {/* Section 4: Main Ceremony Details */}
          <motion.div variants={itemVariants} className="bg-[#123620]/60 border border-amber-400/25 rounded-2xl p-5 text-left space-y-3 font-sans">
            <div className="text-center pb-2 border-b border-amber-400/10">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-300">Wedding Feast & Reception</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-amber-100">
              <Calendar className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{formatDate(weddingDate)}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-amber-100">
              <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{weddingTime || "11:00 AM - 4:00 PM"}</span>
            </div>
            <div className="flex items-start gap-3 text-sm text-amber-100">
              <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{venue || "Qatar Auditorium, Karathur, Malappuram, Kerala"}</span>
            </div>
            {receptionDetails && (
              <div className="pt-2 text-xs italic text-amber-200/80 border-t border-amber-400/10 leading-relaxed font-serif">
                {receptionDetails}
              </div>
            )}
          </motion.div>

          {/* Section 5: Nikah Ceremony Section (Separate Details) */}
          {showNikahDetails && (
            <motion.div variants={itemVariants} className="bg-[#123620]/60 border border-amber-400/25 rounded-2xl p-5 text-left space-y-3 font-sans">
              <div className="text-center pb-2 border-b border-amber-400/10">
                <span className="text-xs uppercase tracking-widest font-bold text-amber-300">The Holy Nikah Ceremony</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-amber-100">
                <Calendar className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{formatDate(nikahDate || weddingDate)}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-amber-100">
                <Clock className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{nikahTime || "09:00 AM"}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-amber-100">
                <MapPin className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <span>{nikahVenue || "Thavakkal Auditorium, Pooyikuth, Tirur"}</span>
              </div>
              <div className="pt-2 text-xs italic text-amber-200/80 border-t border-amber-400/10 leading-relaxed font-serif">
                {nikahDetails || "The Nikah shaking of hands and official marriage registration under Almighty's blessings."}
              </div>
            </motion.div>
          )}

          {/* Section 6: Countdown Timer */}
          {showCountdown && weddingDate && (
            <motion.div variants={itemVariants} className="space-y-2 border-y border-amber-400/10 py-6">
              <span className="text-[10px] uppercase tracking-widest text-amber-300/80 font-sans block font-semibold">
                Counting Down To Our Big Day
              </span>
              <CountdownTimer targetDate={weddingDate} theme="islamic" />
            </motion.div>
          )}

          {/* Section 7: Prayers (Duas) Section */}
          {showPrayers && (
            <motion.div variants={itemVariants} className="space-y-4 text-left">
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest font-sans font-bold text-amber-300">Our Beloved Prayers</span>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <div className="p-3 bg-[#123620]/40 border border-amber-400/10 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-amber-400 font-sans tracking-wide">Dua for the Couple</p>
                  <p className="text-xs italic text-amber-100/90 mt-1">
                    {duaCouple || "May Allah bless you both and unite you in goodness. (Barakallahu Lakuma)"}
                  </p>
                </div>
                <div className="p-3 bg-[#123620]/40 border border-amber-400/10 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-amber-400 font-sans tracking-wide">Dua for Families</p>
                  <p className="text-xs italic text-amber-100/90 mt-1">
                    {duaFamily || "May Allah unite our families and bless our homes with eternal peace and love."}
                  </p>
                </div>
                <div className="p-3 bg-[#123620]/40 border border-amber-400/10 rounded-xl">
                  <p className="text-[10px] uppercase font-bold text-amber-400 font-sans tracking-wide">Dua for Guests</p>
                  <p className="text-xs italic text-amber-100/90 mt-1">
                    {duaGuests || "May Allah reward you with goodness (Jazakum Allah Khair) for sharing in our joy and keeping us in your prayers."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Section 8: Ways to Bless */}
          <motion.div variants={itemVariants} className="space-y-4 text-left border-t border-amber-400/10 pt-6">
            <div className="text-center">
              <span className="text-xs uppercase tracking-widest font-sans font-bold text-amber-300 block">Ways To Bless the Newly Married Couple</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-200 border-b border-amber-400/10 pb-1 capitalize">For {groomName || "Nabeel"}</p>
                <ul className="text-[11px] space-y-1 text-amber-100/85 font-sans">
                  <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400 shrink-0" /> Pray: Keep him in your Duas</li>
                  <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400 shrink-0" /> Blessings: May Allah bless his journey</li>
                  <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400 shrink-0" /> Support: Encourage him always</li>
                  <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400 shrink-0" /> Love: Shower him with love</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-200 border-b border-amber-400/10 pb-1 capitalize">For {brideName || "Nasla"}</p>
                <ul className="text-[11px] space-y-1 text-amber-100/85 font-sans">
                  <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400 shrink-0" /> Pray: Keep her in your Duas</li>
                  <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400 shrink-0" /> Blessings: May Allah bless her journey</li>
                  <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400 shrink-0" /> Support: Encourage her always</li>
                  <li className="flex items-center gap-1"><Check className="h-3 w-3 text-amber-400 shrink-0" /> Love: Shower her with love</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Section 9: Family details */}
          {showFamilyDetails && (hasGroomFamily || hasBrideFamily) && (
            <motion.div variants={itemVariants} className="space-y-4 text-center border-t border-amber-400/10 pt-6">
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest font-sans font-bold text-amber-300 block">Family Members</span>
              </div>
              <div className={`grid gap-4 text-center ${
                hasGroomFamily && hasBrideFamily ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 max-w-xs mx-auto'
              }`}>
                {/* Groom Family */}
                {hasGroomFamily && (
                  <div className="p-3 bg-[#123620]/40 border border-amber-400/15 rounded-xl space-y-2 text-center">
                    <p className="text-xs font-black uppercase text-amber-300 font-sans tracking-wider border-b border-amber-400/10 pb-1 text-center">Groom's Family</p>
                    <div className="space-y-1 text-xs text-amber-100/90 font-sans text-center">
                      {groomFather && <p><span className="text-amber-400/60 font-semibold">Father:</span> {groomFather}</p>}
                      {groomMother && <p><span className="text-amber-400/60 font-semibold">Mother:</span> {groomMother}</p>}
                      {groomBrother && <p><span className="text-amber-400/60 font-semibold">Brother:</span> {groomBrother}</p>}
                      {groomSister && <p><span className="text-amber-400/60 font-semibold">Sister:</span> {groomSister}</p>}
                    </div>
                  </div>
                )}
                {/* Bride Family */}
                {hasBrideFamily && (
                  <div className="p-3 bg-[#123620]/40 border border-amber-400/15 rounded-xl space-y-2 text-center">
                    <p className="text-xs font-black uppercase text-amber-300 font-sans tracking-wider border-b border-amber-400/10 pb-1 text-center">Bride's Family</p>
                    <div className="space-y-1 text-xs text-amber-100/90 font-sans text-center">
                      {brideFather && <p><span className="text-amber-400/60 font-semibold">Father:</span> {brideFather}</p>}
                      {brideMother && <p><span className="text-amber-400/60 font-semibold">Mother:</span> {brideMother}</p>}
                      {brideBrother && <p><span className="text-amber-400/60 font-semibold">Brother:</span> {brideBrother}</p>}
                      {brideSister && <p><span className="text-amber-400/60 font-semibold">Sister:</span> {brideSister}</p>}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Section 10: Venue Map & Directions */}
          <motion.div variants={itemVariants} className="space-y-3 border-t border-amber-400/10 pt-6">
            <span className="text-xs uppercase tracking-widest font-sans font-bold text-amber-300 block">The Venue Map Location</span>
            
            {/* Interactive Map Preview iframe */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-amber-400/20 bg-emerald-900/50">
              <iframe
                title="Islamic Venue Location Map"
                src={getGoogleMapsEmbedUrl(mapDirectionsUrl, venue)}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-95"
              ></iframe>
            </div>

            <a
              href={mapDirectionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue || "Qatar Auditorium, Karathur, Malappuram, Kerala")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold tracking-wider font-sans text-xs rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 uppercase mx-auto"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Get Directions
            </a>
          </motion.div>

          {/* Active RSVP Button inside preview card */}
          {onRsvpClick && (
            <motion.div variants={itemVariants} className="pt-6 border-t border-amber-400/10">
              <button
                onClick={onRsvpClick}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-emerald-950 text-sm font-bold tracking-widest rounded-xl transition-all shadow-lg hover:shadow-amber-400/20 hover:scale-102 active:scale-98 uppercase font-sans"
              >
                Honor Us with Your RSVP
              </button>
            </motion.div>
          )}

          {/* Section 11: Calligraphy Close & Credits Footer */}
          <motion.div variants={itemVariants} className="space-y-4 pt-6 border-t border-amber-400/10 text-center">
            <p className="text-amber-300 text-sm italic tracking-widest">
              مَا شَاءَ اللَّهُ كَانَ وَمَا لَمْ يَشَأْ لَمْ يَكُنْ
            </p>
            <p className="text-[10px] sm:text-xs text-amber-200/70 font-sans tracking-wide uppercase leading-relaxed max-w-xs mx-auto font-semibold">
              May Allah bless you both and unite you in goodness
            </p>
            
            <p className="text-[11px] italic font-sans text-amber-200/80 font-bold block pt-2">
              With lots of love {groomName || "Nabeel"} & {brideName || "Nasla"}, <br />
              We look forward to celebrating with you!
            </p>
            
            <div className="pt-4 text-[9px] text-amber-300/40 uppercase tracking-widest flex flex-col items-center justify-center gap-1 font-sans">
              <div className="flex items-center gap-1.5 opacity-60">
                <span>© {new Date().getFullYear()}</span>
                <span>•</span>
                <span>Save The Date</span>
              </div>
              <div className="text-[8px] mt-2 normal-case font-light text-amber-300/60 leading-relaxed flex flex-col items-center gap-1.5">
                <span className="uppercase text-[8px] tracking-widest font-semibold text-amber-400/70">Created by MUHAMMED SAEAD</span>
                <div className="flex items-center gap-3 mt-1">
                  <a
                    href="https://wa.me/917902205315"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 transition-all hover:scale-110"
                    title="WhatsApp"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="https://instagram.com/m._saead"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-full bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 transition-all hover:scale-110"
                    title="Instagram"
                  >
                    <Instagram className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      );

    case 'royal':
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative w-full max-w-xl mx-auto overflow-hidden bg-gradient-to-b from-neutral-950 via-slate-950 to-neutral-950 text-yellow-100 rounded-2xl shadow-2xl border-4 border-yellow-500/80 p-8 sm:p-12 font-serif text-center"
          style={{ minHeight: isPreview ? 'auto' : '650px' }}
          id="invitation-card-royal"
        >
          <ParticleOverlay type={actualAnimationType} />
          
          {/* Inner Ornate Border */}
          <div className="absolute inset-4 border-2 border-yellow-500/30 rounded-lg pointer-events-none" />
          
          {/* Royal Corner Accents */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-yellow-400 pointer-events-none" />
          <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-yellow-400 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-yellow-400 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-yellow-400 pointer-events-none" />

          {/* Royal Crest */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="relative p-3 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-yellow-400 text-xs sm:text-sm tracking-[0.3em] uppercase font-sans mb-4">
            ROYAL WEDDING INVITATION
          </motion.div>

          <motion.div variants={itemVariants} className="text-xs italic text-yellow-100/60 mb-8 max-w-md mx-auto leading-relaxed">
            {welcomeMessage || "Under the Grace of His Majesty, and with extreme honor, we invite you to celebrate the union of love, devotion, and family."}
          </motion.div>

          {/* Parents */}
          {(groomParents || brideParents) && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 text-xs font-sans tracking-wider text-yellow-300/80 mb-6">
              <div>
                <p className="text-[10px] uppercase text-yellow-500/50">The Family of the Groom</p>
                <p className="font-semibold">{groomParents || "Lord & Lady of the House"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-yellow-500/50">The Family of the Bride</p>
                <p className="font-semibold">{brideParents || "Lord & Lady of the House"}</p>
              </div>
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="text-yellow-200/60 uppercase text-[10px] sm:text-xs tracking-widest mb-4">
            Request the pleasure of your company at the nuptials of their children
          </motion.div>

          {/* Couple Names */}
          <motion.div variants={itemVariants} className="my-6">
            <h1 style={getFontFamilyStyle(groomFont)} className="text-4xl sm:text-6xl font-normal tracking-wide text-yellow-300 font-serif italic">
              <TypewriterText text={groomName || "Groom Name"} enabled={enableTypewriter} delay={300} />
            </h1>
            <p className="text-yellow-400/50 my-2 text-sm uppercase tracking-widest">and</p>
            <h1 style={getFontFamilyStyle(brideFont)} className="text-4xl sm:text-6xl font-normal tracking-wide text-yellow-300 font-serif italic">
              <TypewriterText text={brideName || "Bride Name"} enabled={enableTypewriter} delay={1000} />
            </h1>
          </motion.div>

          {photoUrl && (
            <motion.div variants={itemVariants} className="my-6 max-w-xs mx-auto overflow-hidden rounded-xl border border-yellow-500/30 shadow-lg">
              <img referrerPolicy="no-referrer" src={photoUrl} alt="Wedding Couple" className="w-full h-48 object-cover grayscale hover:grayscale-0 transition-all duration-500" />
            </motion.div>
          )}

          {/* Countdown Timer */}
          {showCountdown && weddingDate && (
            <motion.div variants={itemVariants} className="space-y-2 border-y border-yellow-500/10 py-6 my-6">
              <span className="text-[10px] uppercase tracking-widest text-yellow-400/85 font-sans block font-semibold">
                Counting Down To Our Royal Wedding
              </span>
              <CountdownTimer targetDate={weddingDate} theme="royal" />
            </motion.div>
          )}

          {/* Details */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-yellow-500/20 max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3 text-sm text-yellow-100">
              <Calendar className="h-4 w-4 text-yellow-400 shrink-0" />
              <span className="tracking-widest uppercase text-xs">{formatDate(weddingDate)}</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-sm text-yellow-100">
              <Clock className="h-4 w-4 text-yellow-400 shrink-0" />
              <span className="tracking-widest uppercase text-xs">{weddingTime || "FIVE IN THE EVENING"}</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-yellow-100">
              <MapPin className="h-4 w-4 text-yellow-400 shrink-0" />
              <span className="tracking-wider text-xs uppercase">{venue || "THE ROYAL GRAND BALLROOM, NEW YORK"}</span>
            </div>

            {receptionDetails && (
              <div className="mt-4 p-4 rounded bg-yellow-950/20 border border-yellow-500/10 text-xs sm:text-sm text-yellow-200/80 leading-relaxed italic">
                <span className="font-semibold block uppercase text-[10px] tracking-widest mb-1 text-yellow-400">Reception Banquet To Follow</span>
                {receptionDetails}
              </div>
            )}
          </motion.div>

          {/* Venue Map & Directions */}
          <motion.div variants={itemVariants} className="space-y-3 border-t border-yellow-500/10 pt-6 mt-6">
            <span className="text-xs uppercase tracking-widest font-sans font-bold text-yellow-400 block">The Venue Map Location</span>
            
            {/* Interactive Map Preview iframe */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-yellow-500/20 bg-neutral-900/50">
              <iframe
                title="Royal Venue Location Map"
                src={getGoogleMapsEmbedUrl(mapDirectionsUrl, venue || "THE ROYAL GRAND BALLROOM, NEW YORK")}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-95"
              ></iframe>
            </div>

            <a
              href={mapDirectionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue || "THE ROYAL GRAND BALLROOM, NEW YORK")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 font-bold tracking-wider font-sans text-xs rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 uppercase mx-auto"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Get Directions
            </a>
          </motion.div>

          {onRsvpClick && (
            <motion.div variants={itemVariants} className="mt-8">
              <button
                onClick={onRsvpClick}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 text-xs font-bold tracking-[0.2em] rounded transition-all shadow-xl hover:scale-105 active:scale-95 uppercase"
              >
                RESERVE YOUR ATTENDANCE
              </button>
            </motion.div>
          )}

          {/* Subtle Royal Creator Branding Footer */}
          <div className="pt-6 border-t border-yellow-500/10 text-[9px] tracking-widest flex flex-col items-center justify-center gap-1 font-serif text-yellow-100/40 uppercase mt-8">
            <div className="flex items-center gap-1.5 opacity-60">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>Royal Celebrations</span>
            </div>
            <div className="text-[8px] mt-2 normal-case font-sans text-yellow-300/40 leading-relaxed flex flex-col items-center gap-1.5">
              <span className="uppercase text-[8px] tracking-widest font-semibold text-yellow-400/50">Created by MUHAMMED SAEAD</span>
              <div className="flex items-center gap-3 mt-1">
                <a
                  href="https://wa.me/917902205315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-all hover:scale-110"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://instagram.com/m._saead"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 transition-all hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'floral':
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative w-full max-w-xl mx-auto overflow-hidden bg-[#FAF6F3] text-[#4A3B32] rounded-2xl shadow-2xl border border-rose-200 p-8 sm:p-12 font-serif text-center"
          style={{ minHeight: isPreview ? 'auto' : '650px' }}
          id="invitation-card-floral"
        >
          <ParticleOverlay type={actualAnimationType} />
          
          {/* Subtle Watercolor Blooms in Corners */}
          <div className="absolute top-0 left-0 w-32 h-32 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_top_left,#fecdd3_0%,transparent_70%)]" />
          <div className="absolute top-0 right-0 w-32 h-32 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_top_right,#fde047_0%,transparent_70%)]" />
          <div className="absolute bottom-0 left-0 w-32 h-32 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_bottom_left,#fecdd3_0%,transparent_70%)]" />
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-25 pointer-events-none bg-[radial-gradient(circle_at_bottom_right,#fbcfe8_0%,transparent_70%)]" />

          {/* Delicate Green Leaf Motifs */}
          <div className="absolute inset-6 border border-[#E4D5C9] rounded-xl pointer-events-none" />

          <motion.div variants={itemVariants} className="flex justify-center mb-4">
            <Heart className="h-6 w-6 text-rose-300 fill-rose-100" />
          </motion.div>

          <motion.div variants={itemVariants} className="text-rose-400 text-xs sm:text-sm tracking-widest uppercase font-sans mb-3">
            With Joy in Our Hearts
          </motion.div>

          <motion.div variants={itemVariants} className="text-[#6D5A4E] text-xs italic mb-6 max-w-md mx-auto leading-relaxed">
            {welcomeMessage || "Two lives, two hearts, joined together in friendship, united forever in love. We invite you to join us on this special day."}
          </motion.div>

          {/* Parents */}
          {(groomParents || brideParents) && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 text-xs font-sans tracking-wider text-[#6D5A4E]/80 mb-6">
              <div>
                <p className="text-[10px] uppercase text-rose-300 font-medium">Parents of the Groom</p>
                <p className="font-serif italic text-sm">{groomParents || "Parents of Groom"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-rose-300 font-medium">Parents of the Bride</p>
                <p className="font-serif italic text-sm">{brideParents || "Parents of Bride"}</p>
              </div>
            </motion.div>
          )}

          <p className="text-xs uppercase tracking-widest text-[#8C7464] mb-3">
            We invite you to share our bliss at the wedding of
          </p>

          {/* Couple Names */}
          <motion.div variants={itemVariants} className="my-6">
            <h1 style={getFontFamilyStyle(groomFont)} className="text-4xl sm:text-5xl font-extrabold text-[#4A3B32] font-serif capitalize tracking-wide">
              <TypewriterText text={groomName || "Groom"} enabled={enableTypewriter} delay={300} />
            </h1>
            <p className="text-[#8C7464] italic my-2 font-serif text-lg">&</p>
            <h1 style={getFontFamilyStyle(brideFont)} className="text-4xl sm:text-5xl font-extrabold text-[#4A3B32] font-serif capitalize tracking-wide">
              <TypewriterText text={brideName || "Bride"} enabled={enableTypewriter} delay={1000} />
            </h1>
          </motion.div>

          {photoUrl && (
            <motion.div variants={itemVariants} className="my-6 max-w-xs mx-auto overflow-hidden rounded-full border-4 border-[#FAF6F3] shadow-xl aspect-square">
              <img referrerPolicy="no-referrer" src={photoUrl} alt="Wedding Couple" className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Countdown Timer */}
          {showCountdown && weddingDate && (
            <motion.div variants={itemVariants} className="space-y-2 border-y border-rose-200/60 py-6 my-6">
              <span className="text-[10px] uppercase tracking-widest text-rose-400 font-sans block font-semibold">
                Counting Down To Our Blessed Day
              </span>
              <CountdownTimer targetDate={weddingDate} theme="floral" />
            </motion.div>
          )}

          {/* Details */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-[#E4D5C9] max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3 text-sm text-[#5E4D42]">
              <Calendar className="h-4 w-4 text-rose-300 shrink-0" />
              <span>{formatDate(weddingDate)}</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-sm text-[#5E4D42]">
              <Clock className="h-4 w-4 text-rose-300 shrink-0" />
              <span>{weddingTime || "4:30 PM"}</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-[#5E4D42]">
              <MapPin className="h-4 w-4 text-rose-300 shrink-0" />
              <span className="italic">{venue || "The Rose Garden Greenhouse, Sunnyvale"}</span>
            </div>

            {receptionDetails && (
              <div className="mt-4 p-3 rounded-lg bg-rose-50/50 border border-rose-100 text-xs sm:text-sm text-[#6D5A4E] leading-relaxed italic">
                <span className="font-semibold block uppercase text-[10px] tracking-widest text-rose-400 mb-1">Reception Following</span>
                {receptionDetails}
              </div>
            )}
          </motion.div>

          {/* Venue Map & Directions */}
          <motion.div variants={itemVariants} className="space-y-3 border-t border-[#E4D5C9] pt-6 mt-6">
            <span className="text-xs uppercase tracking-widest font-sans font-bold text-[#704235] block">The Venue Map Location</span>
            
            {/* Interactive Map Preview iframe */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-rose-200 bg-rose-50/30">
              <iframe
                title="Floral Venue Location Map"
                src={getGoogleMapsEmbedUrl(mapDirectionsUrl, venue || "The Rose Garden Greenhouse, Sunnyvale")}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-95"
              ></iframe>
            </div>

            <a
              href={mapDirectionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue || "The Rose Garden Greenhouse, Sunnyvale")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-rose-300 hover:bg-rose-400 text-white font-bold tracking-wider font-sans text-xs rounded-full shadow-md transition-all hover:scale-105 active:scale-95 uppercase mx-auto"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Get Directions
            </a>
          </motion.div>

          {onRsvpClick && (
            <motion.div variants={itemVariants} className="mt-8">
              <button
                onClick={onRsvpClick}
                className="px-6 py-2.5 bg-rose-300 hover:bg-rose-400 text-white text-sm font-semibold tracking-wider rounded-full transition-all shadow-md hover:scale-105 active:scale-95"
              >
                Kindly RSVP
              </button>
            </motion.div>
          )}

          {/* Subtle Floral Creator Branding Footer */}
          <div className="pt-6 border-t border-rose-200/50 text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 font-sans text-[#6D5A4E]/50 uppercase mt-8">
            <div className="flex items-center gap-1.5 opacity-60">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>Love & Bloom</span>
            </div>
            <div className="text-[8px] mt-2 normal-case font-sans text-[#6D5A4E]/60 leading-relaxed flex flex-col items-center gap-1.5">
              <span className="uppercase text-[8px] tracking-wider font-semibold text-rose-400">Created by MUHAMMED SAEAD</span>
              <div className="flex items-center gap-3 mt-1">
                <a
                  href="https://wa.me/917902205315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-rose-200 hover:bg-rose-300 text-rose-500 transition-all hover:scale-110"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://instagram.com/m._saead"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-rose-200 hover:bg-rose-300 text-rose-500 transition-all hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'minimal':
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative w-full max-w-xl mx-auto overflow-hidden bg-white text-neutral-900 rounded-2xl shadow-xl border border-neutral-200 p-8 sm:p-12 font-sans text-center"
          style={{ minHeight: isPreview ? 'auto' : '650px' }}
          id="invitation-card-minimal"
        >
          <ParticleOverlay type={actualAnimationType} />
          
          {/* Strict and Clean Border */}
          <div className="absolute inset-6 border border-neutral-900/5 pointer-events-none" />

          <motion.div variants={itemVariants} className="text-neutral-400 text-xs tracking-[0.25em] uppercase mb-10">
            THE WEDDING CELEBRATION
          </motion.div>

          {/* Families Names */}
          {(groomParents || brideParents) && (
            <motion.div variants={itemVariants} className="text-[10px] uppercase tracking-widest text-neutral-400 max-w-md mx-auto space-y-1 mb-8">
              {groomParents && <p>Groom's Parents: {groomParents}</p>}
              {brideParents && <p>Bride's Parents: {brideParents}</p>}
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="text-xs tracking-widest uppercase text-neutral-500 mb-4">
            {welcomeMessage || "TOGETHER WITH THEIR FAMILIES, WE INVITE YOU TO JOIN US"}
          </motion.div>

          {/* Couple Names */}
          <motion.div variants={itemVariants} className="my-10 space-y-2">
            <h1 style={getFontFamilyStyle(groomFont)} className="text-4xl sm:text-5xl font-light tracking-widest text-neutral-950 uppercase font-serif">
              <TypewriterText text={groomName || "GROOM"} enabled={enableTypewriter} delay={300} />
            </h1>
            <p className="text-neutral-300 text-xs font-mono">/</p>
            <h1 style={getFontFamilyStyle(brideFont)} className="text-4xl sm:text-5xl font-light tracking-widest text-neutral-950 uppercase font-serif">
              <TypewriterText text={brideName || "BRIDE"} enabled={enableTypewriter} delay={1000} />
            </h1>
          </motion.div>

          {photoUrl && (
            <motion.div variants={itemVariants} className="my-8 max-w-xs mx-auto overflow-hidden rounded shadow-sm">
              <img referrerPolicy="no-referrer" src={photoUrl} alt="Wedding Couple" className="w-full h-48 object-cover filter grayscale" />
            </motion.div>
          )}

          {/* Countdown Timer */}
          {showCountdown && weddingDate && (
            <motion.div variants={itemVariants} className="space-y-2 border-y border-neutral-100 py-6 my-6">
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-mono block font-semibold">
                COUNTDOWN TO THE BIG DAY
              </span>
              <CountdownTimer targetDate={weddingDate} theme="minimal" />
            </motion.div>
          )}

          {/* Details */}
          <motion.div variants={itemVariants} className="mt-10 pt-8 border-t border-neutral-100 max-w-xs mx-auto space-y-4 text-xs tracking-widest uppercase text-neutral-600 font-mono">
            <div>
              <p className="font-bold text-neutral-950">{formatDate(weddingDate)}</p>
              <p className="text-neutral-400 mt-1">{weddingTime || "AT THREE IN THE AFTERNOON"}</p>
            </div>
            
            <div className="pt-2">
              <p className="font-bold text-neutral-950">{venue || "THE MODERN GALLERY, CHICAGO"}</p>
              {receptionDetails && <p className="text-neutral-400 mt-1 normal-case font-sans italic">{receptionDetails}</p>}
            </div>
          </motion.div>

          {/* Venue Map & Directions */}
          <motion.div variants={itemVariants} className="space-y-3 border-t border-neutral-100 pt-6 mt-6">
            <span className="text-xs uppercase tracking-widest font-mono font-bold text-neutral-800 block">VENUE MAP LOCATION</span>
            
            {/* Interactive Map Preview iframe */}
            <div className="relative h-44 w-full rounded border border-neutral-200 bg-neutral-50">
              <iframe
                title="Minimal Venue Location Map"
                src={getGoogleMapsEmbedUrl(mapDirectionsUrl, venue || "THE MODERN GALLERY, CHICAGO")}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-95"
              ></iframe>
            </div>

            <a
              href={mapDirectionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue || "THE MODERN GALLERY, CHICAGO")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white font-bold tracking-widest font-mono text-xs rounded shadow transition-all hover:scale-105 active:scale-95 uppercase mx-auto"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              GET DIRECTIONS
            </a>
          </motion.div>

          {onRsvpClick && (
            <motion.div variants={itemVariants} className="mt-10">
              <button
                onClick={onRsvpClick}
                className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold tracking-[0.2em] rounded uppercase transition-all"
              >
                RSVP ONLINE
              </button>
            </motion.div>
          )}

          {/* Subtle Minimal Creator Branding Footer */}
          <div className="pt-8 border-t border-neutral-100 text-[9px] tracking-widest flex flex-col items-center justify-center gap-1 font-mono text-neutral-400 uppercase mt-10">
            <div className="flex items-center gap-1.5 opacity-60">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>THE WEDDING</span>
            </div>
            <div className="text-[8px] mt-2 normal-case font-mono text-neutral-500 leading-relaxed flex flex-col items-center gap-1.5">
              <span className="uppercase text-[8px] tracking-widest font-bold text-neutral-800">CREATED BY MUHAMMED SAEAD</span>
              <div className="flex items-center gap-3 mt-1">
                <a
                  href="https://wa.me/917902205315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all hover:scale-110"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://instagram.com/m._saead"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition-all hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      );

    case 'boho':
    default:
      return (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="relative w-full max-w-xl mx-auto overflow-hidden bg-[#FAF3EC] text-[#704235] rounded-2xl shadow-2xl border-4 border-[#E2B39E] p-8 sm:p-12 font-serif text-center"
          style={{ minHeight: isPreview ? 'auto' : '650px' }}
          id="invitation-card-boho"
        >
          <ParticleOverlay type={actualAnimationType} />
          
          {/* Boho Arch Design Element */}
          <div className="absolute inset-x-12 top-6 bottom-6 border border-[#E2B39E]/40 rounded-t-full pointer-events-none" />

          {/* Boho Sun Logo */}
          <motion.div variants={itemVariants} className="flex justify-center mb-6">
            <div className="p-2.5 bg-[#F3DCD1]/60 rounded-full text-[#BE7A5F]">
              <Compass className="h-6 w-6 rotate-45" />
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="text-[#BE7A5F] text-xs sm:text-sm tracking-widest uppercase font-sans mb-4">
            JOIN US UNDER THE SUN & STARS
          </motion.div>

          <motion.div variants={itemVariants} className="text-xs italic text-[#8B6458] mb-8 max-w-md mx-auto leading-relaxed font-sans">
            {welcomeMessage || "In all the world, there is no heart for me like yours. We are excited to begin our lifetime journey together, and we want you by our side."}
          </motion.div>

          {/* Parents */}
          {(groomParents || brideParents) && (
            <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4 text-xs font-sans tracking-wider text-[#8B6458] mb-6">
              <div>
                <p className="text-[10px] uppercase text-[#BE7A5F] font-bold">The Parents of Groom</p>
                <p className="font-semibold text-sm">{groomParents || "Mr. & Mrs. Groom parents"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase text-[#BE7A5F] font-bold">The Parents of Bride</p>
                <p className="font-semibold text-sm">{brideParents || "Mr. & Mrs. Bride parents"}</p>
              </div>
            </motion.div>
          )}

          <p className="text-xs uppercase tracking-widest text-[#BE7A5F] mb-4">
            Kindly attend the wedding celebration of
          </p>

          {/* Couple Names */}
          <motion.div variants={itemVariants} className="my-6">
            <h1 style={getFontFamilyStyle(groomFont)} className="text-4xl sm:text-5xl font-extrabold text-[#704235] font-serif capitalize">
              <TypewriterText text={groomName || "Groom Name"} enabled={enableTypewriter} delay={300} />
            </h1>
            <p className="text-[#BE7A5F] italic my-2 font-serif text-xl">&</p>
            <h1 style={getFontFamilyStyle(brideFont)} className="text-4xl sm:text-5xl font-extrabold text-[#704235] font-serif capitalize">
              <TypewriterText text={brideName || "Bride Name"} enabled={enableTypewriter} delay={1000} />
            </h1>
          </motion.div>

          {photoUrl && (
            <motion.div variants={itemVariants} className="my-6 max-w-xs mx-auto overflow-hidden rounded-xl border-2 border-[#E2B39E] shadow-lg">
              <img referrerPolicy="no-referrer" src={photoUrl} alt="Wedding Couple" className="w-full h-48 object-cover sepia-[20%] hover:sepia-0 transition-all duration-500" />
            </motion.div>
          )}

          {/* Countdown Timer */}
          {showCountdown && weddingDate && (
            <motion.div variants={itemVariants} className="space-y-2 border-y border-[#E2B39E]/30 py-6 my-6">
              <span className="text-[10px] uppercase tracking-widest text-[#BE7A5F] font-sans block font-semibold">
                COUNTING DOWN THE DAYS
              </span>
              <CountdownTimer targetDate={weddingDate} theme="boho" />
            </motion.div>
          )}

          {/* Details */}
          <motion.div variants={itemVariants} className="mt-8 pt-6 border-t border-[#E2B39E]/30 max-w-md mx-auto space-y-4">
            <div className="flex items-center justify-center gap-3 text-sm text-[#704235]">
              <Calendar className="h-4 w-4 text-[#BE7A5F] shrink-0" />
              <span>{formatDate(weddingDate)}</span>
            </div>
            
            <div className="flex items-center justify-center gap-3 text-sm text-[#704235]">
              <Clock className="h-4 w-4 text-[#BE7A5F] shrink-0" />
              <span>{weddingTime || "2:00 PM"}</span>
            </div>

            <div className="flex items-center justify-center gap-3 text-sm text-[#704235]">
              <MapPin className="h-4 w-4 text-[#BE7A5F] shrink-0" />
              <span>{venue || "The Boho Desert Sands Oasis, Joshua Tree"}</span>
            </div>

            {receptionDetails && (
              <div className="mt-4 p-3 rounded-lg bg-[#F5EADF] border border-[#E2B39E]/20 text-xs sm:text-sm text-[#704235] leading-relaxed italic">
                <span className="font-semibold block uppercase text-[10px] tracking-widest text-[#BE7A5F] mb-1">Festivities Following</span>
                {receptionDetails}
              </div>
            )}
          </motion.div>

          {/* Venue Map & Directions */}
          <motion.div variants={itemVariants} className="space-y-3 border-t border-[#E2B39E]/30 pt-6 mt-6">
            <span className="text-xs uppercase tracking-widest font-sans font-bold text-[#704235] block">THE VENUE MAP LOCATION</span>
            
            {/* Interactive Map Preview iframe */}
            <div className="relative h-44 w-full rounded-xl overflow-hidden border border-[#E2B39E]/30 bg-[#F5EADF]">
              <iframe
                title="Boho Venue Location Map"
                src={getGoogleMapsEmbedUrl(mapDirectionsUrl, venue || "The Boho Desert Sands Oasis, Joshua Tree")}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="opacity-95"
              ></iframe>
            </div>

            <a
              href={mapDirectionsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue || "The Boho Desert Sands Oasis, Joshua Tree")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#BE7A5F] hover:bg-[#A35D43] text-white font-bold tracking-wider font-sans text-xs rounded-full shadow-md transition-all hover:scale-105 active:scale-95 uppercase mx-auto"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Get Directions
            </a>
          </motion.div>

          {onRsvpClick && (
            <motion.div variants={itemVariants} className="mt-8">
              <button
                onClick={onRsvpClick}
                className="px-6 py-2.5 bg-[#BE7A5F] hover:bg-[#A35D43] text-white text-sm font-semibold tracking-wider rounded-full transition-all shadow-md hover:scale-105 active:scale-95"
              >
                RSVP Attendance
              </button>
            </motion.div>
          )}

          {/* Subtle Boho Creator Branding Footer */}
          <div className="pt-6 border-t border-[#E2B39E]/20 text-[9px] tracking-wider flex flex-col items-center justify-center gap-1 font-serif text-[#704235]/50 uppercase mt-8">
            <div className="flex items-center gap-1.5 opacity-60">
              <span>© {new Date().getFullYear()}</span>
              <span>•</span>
              <span>Bohemian Union</span>
            </div>
            <div className="text-[8px] mt-2 normal-case font-sans text-[#704235]/60 leading-relaxed flex flex-col items-center gap-1.5">
              <span className="uppercase text-[8px] tracking-wider font-semibold text-[#BE7A5F]">Created by MUHAMMED SAEAD</span>
              <div className="flex items-center gap-3 mt-1">
                <a
                  href="https://wa.me/917902205315"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-[#E2B39E]/10 hover:bg-[#E2B39E]/20 text-[#BE7A5F] transition-all hover:scale-110"
                  title="WhatsApp"
                >
                  <MessageCircle className="h-3.5 w-3.5" />
                </a>
                <a
                  href="https://instagram.com/m._saead"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-full bg-[#E2B39E]/10 hover:bg-[#E2B39E]/20 text-[#BE7A5F] transition-all hover:scale-110"
                  title="Instagram"
                >
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      );
  }
}
