import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, onSnapshot } from '../firebase';
import {
  Heart,
  Sparkles,
  Laptop,
  Smartphone,
  PlusCircle,
  ArrowRight,
  Gift,
  Compass,
  Mail,
  Users,
  Music,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  ExternalLink,
  ChevronDown,
  BookOpen,
  Leaf,
  Layers,
  HelpCircle,
  Instagram,
  MessageCircle
} from 'lucide-react';

interface HomePageProps {
  onStartCreating: () => void;
  activeId: string | null;
  onResumeDraft: () => void;
}

export default function HomePage({ onStartCreating, activeId, onResumeDraft }: HomePageProps) {
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);
  const [selectedDemoTheme, setSelectedDemoTheme] = useState<'islamic' | 'royal' | 'floral' | 'boho' | 'minimal'>('royal');
  const [stats, setStats] = useState({ invitationsCount: 0, rsvpsCount: 0, loading: true });

  useEffect(() => {
    // Real-time listener for invitations collection
    const unsubscribeInvitations = onSnapshot(collection(db, 'invitations'), (snapshot) => {
      setStats(prev => ({
        ...prev,
        invitationsCount: snapshot.size,
        loading: false
      }));
    }, (error) => {
      console.error("Error listening to invitations:", error);
    });

    // Real-time listener for RSVPs collection
    const unsubscribeRsvps = onSnapshot(collection(db, 'rsvps'), (snapshot) => {
      setStats(prev => ({
        ...prev,
        rsvpsCount: snapshot.size,
        loading: false
      }));
    }, (error) => {
      console.error("Error listening to RSVPs:", error);
    });

    return () => {
      unsubscribeInvitations();
      unsubscribeRsvps();
    };
  }, []);

  const faqs = [
    {
      q: "Is this wedding invitation builder free to use?",
      a: "Yes! You can design, customize, and preview your wedding card free of charge. Your generated live shared link is hosted instantly, allowing you to invite guests without any cost."
    },
    {
      q: "How do guests submit their RSVP responses?",
      a: "Your guests open the invite through an interactive digital wax seal envelope. At the bottom of the invitation card, there is an interactive RSVP form where they fill in their name, attending status, guest headcount, phone number, and special dietary/prayer wishes. Their responses are synced instantly to your creator dashboard."
    },
    {
      q: "Can I update the wedding details after sending the link?",
      a: "Absolutely! Since the card is powered by a real-time cloud database (Firebase Firestore), any modifications you save inside the Card Designer are immediately updated live on the guest invitation link. No need to resend the link!"
    },
    {
      q: "What is the difference between 'Multi-Page Scroll' and 'Compact Card'?",
      a: "The Compact Card is a single classic screen displaying core invitation text. The Multi-Page Scroll (default) is a premium digital wedding website experience that splits the details into 3-4 full-height pages with parallax scroll effects: Page 1: Welcome Cover, Page 2: Families & Prayers, Page 3: Full Ceremony Schedules, Page 4: Interactive RSVP & Directions."
    },
    {
      q: "Can guests get driving directions directly from the invitation?",
      a: "Yes! Every card integrates a Google Maps redirection button. It reads your entered venue address and provides one-tap navigation directions to guide guests straight to your wedding hall."
    }
  ];

  const themesInfo = {
    royal: {
      name: "👑 Royal Gold Elegance",
      desc: "An ultra-premium dark luxury aesthetic featuring gold double borders, royal seal details, sparkles animation, and sophisticated vintage serif typography.",
      bg: "bg-gradient-to-b from-neutral-950 via-slate-900 to-neutral-950 text-yellow-100 border-yellow-500/30",
      accent: "text-yellow-400"
    },
    islamic: {
      name: "🕌 Traditional Islamic Heritage",
      desc: "Curated for Islamic weddings. Contains traditional arabic bismillah (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ), beautiful emerald backgrounds, double golden borders, and standard blessings (Barakallahu Lakuma).",
      bg: "bg-emerald-950 text-amber-100 border-amber-400/30",
      accent: "text-amber-300"
    },
    floral: {
      name: "🌸 Botanical Rose Garden",
      desc: "A soft, romantic, pastel floral theme decorated with pink borders, beautiful blossom patterns, elegant serif fonts, and falling rose petals animation.",
      bg: "bg-rose-50 text-neutral-800 border-rose-200/50",
      accent: "text-rose-500"
    },
    boho: {
      name: "🍂 Warm Terracotta Boho",
      desc: "A gorgeous modern rustic theme utilizing terracotta shades, celestial elements, warm beige overlays, elegant serif titles, and falling autumn leaves.",
      bg: "bg-[#FAF3EC] text-[#704235] border-[#BE7A5F]/20",
      accent: "text-[#BE7A5F]"
    },
    minimal: {
      name: "📜 Modern Minimalist",
      desc: "Sleek, pristine contemporary layout focusing on luxurious negative space, sharp borders, clean modern typography, and a sophisticated black & white grid.",
      bg: "bg-white text-neutral-800 border-neutral-200",
      accent: "text-neutral-900"
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 text-neutral-850 dark:text-neutral-150 select-none pb-12" id="home-page-root">
      {/* Top Hero Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200/60 dark:border-neutral-800 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <span className="p-1.5 bg-emerald-600 text-white rounded-lg shadow-sm">
            <Heart className="h-5 w-5 fill-white" />
          </span>
          <div className="flex flex-col">
            <span className="font-serif font-extrabold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
              Wedding Invite Builder
            </span>
            <span className="text-[9px] sm:text-[10px] text-neutral-400 dark:text-neutral-500 font-sans font-medium">
              by Muhammed Saead
            </span>
          </div>
        </div>
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-neutral-500 dark:text-neutral-400">
          <a href="#features" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Features</a>
          <a href="#themes" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Design Themes</a>
          <a href="#how-it-works" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">How It Works</a>
          <a href="#faq" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          {/* Fully small and icon only creator contacts upside */}
          <div className="flex items-center gap-1.5">
            <a
              href="https://wa.me/917902205315" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors border border-emerald-100 dark:border-emerald-900/20 shadow-sm cursor-pointer"
              title="Chat with Muhammed Saead on WhatsApp"
              id="creator-whatsapp-top"
            >
              <MessageCircle className="h-3.5 w-3.5" />
            </a>
            <a
              href="https://instagram.com/m._saead" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-7 h-7 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-500 dark:text-rose-400 flex items-center justify-center transition-colors border border-rose-100 dark:border-rose-900/20 shadow-sm cursor-pointer"
              title="Follow Muhammed Saead on Instagram"
              id="creator-instagram-top"
            >
              <Instagram className="h-3.5 w-3.5" />
            </a>
          </div>

          <button
            onClick={onStartCreating}
            className="px-3 sm:px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            id="btn-nav-launch-designer"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            Launch Designer
          </button>
        </div>
      </header>

      {/* Floating Draft Resume Alert Banner */}
      {activeId && (
        <div className="max-w-4xl mx-auto px-6 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
          >
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300">
              <Sparkles className="h-4 w-4 shrink-0 animate-spin text-amber-500" />
              <span className="text-xs font-bold font-sans">
                You have an active wedding invitation draft in your browser workspace!
              </span>
            </div>
            <button
              onClick={onResumeDraft}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow transition-all hover:scale-102 flex items-center gap-1 cursor-pointer"
              id="btn-resume-draft-banner"
            >
              Resume Editing Card
              <ArrowRight className="h-3 w-3" />
            </button>
          </motion.div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 px-6 max-w-7xl mx-auto w-full text-center">
        {/* Curved radial decorative mesh */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gradient-to-b from-emerald-500/10 to-transparent blur-3xl pointer-events-none -z-10" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
          className="space-y-6 max-w-3xl mx-auto"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100/70 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            The Ultimate Digital Wedding Card Solution
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-50 leading-tight">
            Create Breathtaking <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Interactive Wedding Invites
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
            Design elegant luxury wedding cards, invite guests, play background music, and track custom RSVPs instantly in real-time. Make your special day look premium, modern, and memorable.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={onStartCreating}
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-emerald-600/10 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              id="hero-btn-start"
            >
              <PlusCircle className="h-4.5 w-4.5" />
              Build Your Wedding Card Free
            </button>
            <a
              href="#features"
              className="px-6 py-3.5 bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300 font-bold text-sm transition-all hover:scale-102 flex items-center gap-1.5"
            >
              Explore Full Features
              <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>


        </motion.div>

        {/* Hero Interactive Device Mockup Frame */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
          className="mt-14 max-w-4xl mx-auto relative px-4"
        >
          {/* Mockup shadow rings */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-500/5 to-emerald-500/5 rounded-3xl blur-2xl pointer-events-none -z-10" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl text-left">
            {/* Mockup Left */}
            <div className="md:col-span-7 space-y-4 pr-0 md:pr-4">
              <span className="text-[10px] uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-bold">Simulator Mockup</span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900 dark:text-neutral-100">
                Responsive Design Simulator
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Design with full confidence. Our real-time simulator renders your customized invitation card in both <b>Desktop Card</b> or <b>Mobile Smartphone</b> viewports instantly as you type! Customize texts, falling particles, family names, and music on the fly.
              </p>
              <div className="flex flex-wrap gap-2 text-[10px] uppercase font-mono font-bold tracking-wider text-neutral-400">
                <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-950 rounded">✓ 5 Themes</span>
                <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-950 rounded">✓ Auto Music</span>
                <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-950 rounded">✓ Falling Rose/Leaves</span>
                <span className="px-2 py-1 bg-neutral-100 dark:bg-neutral-950 rounded">✓ Wax Seal Seal</span>
              </div>
            </div>

            {/* Mockup Right */}
            <div className="md:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[280px] bg-stone-100 dark:bg-neutral-950 rounded-[2.5rem] border-[8px] border-neutral-800 dark:border-neutral-900 shadow-2xl overflow-hidden aspect-[9/16] p-4 text-center flex flex-col justify-center items-center">
                <Heart className="h-8 w-8 text-rose-500 animate-pulse fill-rose-500/10 mb-2" />
                <span className="text-[8px] uppercase tracking-widest text-neutral-400 font-sans block mb-1">CUPOLA CELEBRATION</span>
                <h4 className="text-base font-serif font-extrabold text-neutral-900 dark:text-white capitalize leading-tight">
                  Alexander <br />
                  <span className="text-xs font-sans font-normal italic lowercase my-1 block">and</span>
                  Elena
                </h4>
                <div className="h-[1px] w-12 bg-neutral-300 dark:bg-neutral-700 my-2" />
                <p className="text-[8px] uppercase font-mono text-neutral-500">October 18, 2026</p>
                <div className="mt-3.5 p-2 bg-rose-600 hover:bg-rose-700 shadow-lg border-2 border-amber-300/80 rounded-full w-10 h-10 flex items-center justify-center text-white text-[9px] font-bold uppercase animate-pulse">
                  Seal
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature Bento Grid Section */}
      <section id="features" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-neutral-200/50 dark:border-neutral-800">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-12">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Rich Capabilities
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-neutral-900 dark:text-neutral-50">
            Engineered with Premium Details
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            The builder features robust customizable visual templates designed to feel premium, lightweight, and deeply interactive for your wedding guests.
          </p>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Feature 1 */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block">
                <Layers className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Multi-Page Web Layouts
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Choose the modern multi-page scrolling format to spread details over 3-4 beautiful tall cards with parallax entries, or pick the single classic card layout for absolute simplicity.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider">LAYOUT TYPE OPTION</span>
          </div>

          {/* Feature 2 */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block">
                <Users className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Live RSVP Dashboard
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Review guest responses in real-time. Head to the RSVP Tracker tab to view names, phone numbers, attending headcounts, custom food preferences, or emotional messages sent by guests.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider">DATABASE POWERED (FIREBASE)</span>
          </div>

          {/* Feature 3 */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block">
                <Mail className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Digital Wax Seal Envelope
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Elevate the guest experience. Before viewing the details, guests tap on an interactive wax heart seal that elegantly unlocks and pops open the golden wedding envelope.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider">INTUITIVE EXPERIENCE</span>
          </div>

          {/* Feature 4 */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block">
                <Music className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Background Audio Player
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Add emotion with instrumental wedding soundtracks. Provide custom MP3 audio URLs that automatically play in the background when guests slide the invitation open.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider">AMBIENT SOUNDS</span>
          </div>

          {/* Feature 5 */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block">
                <Sparkles className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Falling Particle Atmospheres
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Add high-fidelity overlays to match your theme: floating red/pink rose petals, falling autumn leaves, sparkling winter snow, glittering light stars, or custom celebration glitter.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider">CANVAS PARTICLE OVERLAY</span>
          </div>

          {/* Feature 6 */}
          <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-sm space-y-4 hover:border-emerald-500/20 transition-all flex flex-col justify-between">
            <div className="space-y-3">
              <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-xl inline-block">
                <MapPin className="h-5 w-5" />
              </span>
              <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                Google Maps Navigation
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Stop guests from getting lost. Write down your ceremony hall address and the invitation will automatically generate a custom link with exact location coordinates.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold text-neutral-400 tracking-wider">ONE-TAP NAVIGATION</span>
          </div>

        </div>
      </section>

      {/* Interactive Theme Demonstration Section */}
      <section id="themes" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-neutral-200/50 dark:border-neutral-800 bg-neutral-100/40 dark:bg-neutral-900/10 rounded-3xl p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Interactive Theme Switcher info */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 block">
              Pre-designed Presets
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-neutral-900 dark:text-neutral-50">
              5 Unique Architectural Themes
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              We have designed 5 luxurious theme presets with deliberate margins, high-contrast borders, custom layouts, and beautifully paired typography styles. Click a theme to inspect details:
            </p>

            {/* Select theme triggers */}
            <div className="space-y-2.5">
              {(Object.keys(themesInfo) as Array<keyof typeof themesInfo>).map((tId) => (
                <button
                  key={tId}
                  onClick={() => setSelectedDemoTheme(tId)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between text-xs sm:text-sm font-bold capitalize cursor-pointer ${
                    selectedDemoTheme === tId
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                      : 'bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50'
                  }`}
                  id={`theme-selector-demo-${tId}`}
                >
                  <span>{tId} Theme Preset</span>
                  <span className={selectedDemoTheme === tId ? 'text-white' : 'text-emerald-600 dark:text-emerald-400'}>✦</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Simulated Preview box for selected theme */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedDemoTheme}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className={`w-full max-w-md p-8 rounded-2xl border-4 shadow-xl relative min-h-[300px] flex flex-col justify-center text-center space-y-4 ${themesInfo[selectedDemoTheme].bg}`}
              >
                <h3 className="text-base sm:text-lg font-serif font-extrabold underline decoration-dashed decoration-1 underline-offset-4">
                  {themesInfo[selectedDemoTheme].name}
                </h3>
                <p className="text-xs sm:text-sm leading-relaxed italic opacity-90 font-serif">
                  {themesInfo[selectedDemoTheme].desc}
                </p>
                <div className="pt-2">
                  <span className={`px-3 py-1 bg-neutral-900/10 dark:bg-white/10 rounded text-[10px] font-mono tracking-widest font-black uppercase ${themesInfo[selectedDemoTheme].accent}`}>
                    VISUAL SAMPLE PREVIEW
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* Step by Step Timeline Walkthrough */}
      <section id="how-it-works" className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-neutral-200/50 dark:border-neutral-800">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-14">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Quick Tutorial
          </span>
          <h2 className="text-2xl sm:text-4xl font-serif font-extrabold text-neutral-900 dark:text-neutral-50">
            How to Build & Share
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Create a custom wedding website invitation in under 3 minutes with our step-by-step designer workflow.
          </p>
        </div>

        {/* Steps Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {/* Connector line on desktop */}
          <div className="hidden md:block absolute top-10 left-12 right-12 h-[2px] bg-neutral-200 dark:bg-neutral-800 z-0" />

          {/* Step 1 */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 relative z-10 text-center space-y-4 shadow-sm">
            <span className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-md border-4 border-stone-50 dark:border-neutral-950">
              1
            </span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Design & Input Details
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Open the <b>Card Designer</b> tab. Enter names, parents, date, venue, select background music, themes, and animations.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 relative z-10 text-center space-y-4 shadow-sm">
            <span className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-md border-4 border-stone-50 dark:border-neutral-950">
              2
            </span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Live Simulator Preview
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Use the side simulator screen. Switch between <b>Desktop</b> and <b>Mobile Layouts</b> to inspect how your page renders in real-time.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 relative z-10 text-center space-y-4 shadow-sm">
            <span className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-md border-4 border-stone-50 dark:border-neutral-950">
              3
            </span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Publish & Share
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              Click <b>Save Invitation</b>. The database will generate a unique link. Copy and send the link to guests on WhatsApp or social media.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 relative z-10 text-center space-y-4 shadow-sm">
            <span className="w-10 h-10 rounded-full bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center mx-auto shadow-md border-4 border-stone-50 dark:border-neutral-950">
              4
            </span>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              Track Guest RSVPs
            </h3>
            <p className="text-[11px] text-neutral-500 leading-relaxed">
              As guests submit responses, review them instantly on the <b>RSVP Tracker Dashboard</b>. Delete test logs as required.
            </p>
          </div>

        </div>
      </section>

      {/* Why Choose Digital Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto w-full border-t border-neutral-200/50 dark:border-neutral-800">
        <div className="bg-emerald-950 text-emerald-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">
          {/* Subtle floral background pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            <div className="md:col-span-7 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Eco-Friendly & Smart</span>
              <h2 className="text-2xl sm:text-4xl font-serif font-extrabold leading-tight text-white">
                Why Transition to Digital Wedding Invites?
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
                Traditional paper wedding cards are expensive, slow to distribute, and produce significant carbon footprint. With our builder, publish a custom digital space that makes sharing wedding details effortless.
              </p>

              {/* Bullet checks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Zero environmental printing waste</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant delivery over WhatsApp/Email</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Easily modify details post-sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Automated guest tally calculations</span>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex justify-center">
              <button
                onClick={onStartCreating}
                className="px-6 py-4 bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-amber-400/10 transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                id="btn-bento-action"
              >
                <PlusCircle className="h-5 w-5" />
                Launch Wedding Designer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="py-16 px-6 max-w-4xl mx-auto w-full border-t border-neutral-200/50 dark:border-neutral-800">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-extrabold text-neutral-900 dark:text-neutral-50">
            Have Questions? We Have Answers
          </h2>
        </div>

        {/* FAQ Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                className="w-full text-left p-5 flex items-center justify-between text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-100 focus:outline-none cursor-pointer"
                id={`faq-btn-${index}`}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4 w-4 text-neutral-500 transition-transform duration-250 ${activeFAQ === index ? 'rotate-180 text-emerald-600' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {activeFAQ === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/50 text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Live Real-Time Platform Statistics Bar */}
      <section className="py-8 px-6 max-w-5xl mx-auto w-full">
        <div className="bg-white dark:bg-neutral-900/60 backdrop-blur-md border border-emerald-500/15 dark:border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden shadow-sm">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98105_1px,transparent_1px),linear-gradient(to_bottom,#10b98105_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] uppercase font-mono font-extrabold tracking-widest text-emerald-600 dark:text-emerald-400">
                  Live Platform Metrics (Synced)
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-serif font-extrabold text-neutral-800 dark:text-neutral-100">
                Real-Time Platform Engagement
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-md">
                Directly connected to our live database. Statistics refresh dynamically as designers publish cards and guests confirm RSVPs.
              </p>
            </div>

            <div className="flex flex-row items-center gap-6 sm:gap-10 divide-x divide-neutral-100 dark:divide-neutral-800 text-center shrink-0 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-neutral-150 dark:border-neutral-800">
              <div className="space-y-1 px-4 sm:px-6">
                <div className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 dark:text-neutral-50 flex items-center justify-center">
                  {stats.loading ? (
                    <span className="inline-block h-8 w-14 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                  ) : (
                    <span className="tabular-nums">{stats.invitationsCount}</span>
                  )}
                  <Heart className="h-5 w-5 ml-2 text-rose-500 fill-rose-500" />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-neutral-400 dark:text-neutral-500">
                  Cards Designed
                </p>
              </div>

              <div className="space-y-1 pl-6 sm:pl-10">
                <div className="text-2xl sm:text-3xl font-serif font-black text-neutral-900 dark:text-neutral-50 flex items-center justify-center">
                  {stats.loading ? (
                    <span className="inline-block h-8 w-14 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded" />
                  ) : (
                    <span className="tabular-nums">{stats.rsvpsCount}</span>
                  )}
                  <Users className="h-5 w-5 ml-2 text-emerald-600" />
                </div>
                <p className="text-[10px] uppercase tracking-widest font-sans font-bold text-neutral-400 dark:text-neutral-500">
                  RSVPs Synced
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Large CTA Banner */}
      <section className="py-12 px-6 max-w-5xl mx-auto w-full text-center">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl p-10 space-y-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-10" />
          <h2 className="text-3xl sm:text-5xl font-serif font-extrabold leading-tight">
            Start Designing Your <br />
            Dream Digital Invitation
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 max-w-lg mx-auto leading-relaxed">
            Craft a gorgeous keepsake that stays live forever, updates in real-time, and provides guests with elegant layouts, maps navigation, and simple RSVP inputs.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartCreating}
              className="px-8 py-4 bg-white hover:bg-neutral-50 text-emerald-800 font-extrabold text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto cursor-pointer"
              id="btn-cta-bottom-start"
            >
              <PlusCircle className="h-4.5 w-4.5 text-emerald-600" />
              Launch Card Designer Free
            </button>
          </div>
        </div>
      </section>

      {/* Footer Creator Details */}
      <footer className="border-t border-neutral-200/50 dark:border-neutral-800/60 mt-12 pt-8 pb-4 text-center max-w-7xl mx-auto px-6 w-full flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400 font-sans">
          <span>© {new Date().getFullYear()} • Developed by</span>
          <span className="font-serif font-bold text-neutral-800 dark:text-neutral-105">Muhammed Saead</span>
        </div>
        
        {/* Fully small and icon only whatsapp & instagram */}
        <div className="flex items-center gap-2">
          <a
            href="https://wa.me/917902205315" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center transition-colors border border-emerald-100 dark:border-emerald-900/20 shadow-sm cursor-pointer"
            title="Chat on WhatsApp"
            id="creator-whatsapp"
          >
            <MessageCircle className="h-4 w-4" />
          </a>
          <a
            href="https://instagram.com/m._saead" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-500 dark:text-rose-400 flex items-center justify-center transition-colors border border-rose-100 dark:border-rose-900/20 shadow-sm cursor-pointer"
            title="Follow on Instagram"
            id="creator-instagram"
          >
            <Instagram className="h-4 w-4" />
          </a>
        </div>
      </footer>
    </div>
  );
}
