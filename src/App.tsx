import { useState, useEffect, useCallback } from 'react';
import { db, doc, getDoc, collection, addDoc, getDocs, query, where, orderBy, setDoc, handleFirestoreError, OperationType, deleteDoc } from './firebase';
import { WeddingInvitation, GuestRSVP, ThemeType, PRESET_PHOTOS } from './types';
import InvitationCard from './components/InvitationCard';
import EditorPanel from './components/EditorPanel';
import GuestRSVPForm from './components/GuestRSVP';
import DashboardRSVP from './components/DashboardRSVP';
import MusicPlayer from './components/MusicPlayer';
import HomePage from './components/HomePage';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  PlusCircle,
  Eye,
  Users,
  Mail,
  Laptop,
  Smartphone,
  Sparkles,
  Compass,
  ArrowRight,
  RefreshCw,
  Gift,
  HelpCircle,
  Clock,
  MapPin,
  Calendar
} from 'lucide-react';

const DEFAULT_INVITATION: WeddingInvitation = {
  groomName: 'Alexander Sterling',
  brideName: 'Elena Rostova',
  weddingDate: '2026-10-18',
  weddingTime: '5:00 PM EST',
  venue: 'The Conservatory of Botanical Gardens, San Francisco, CA',
  receptionDetails: 'Dinner, wedding feast, and sparkling cocktail toast to follow immediately inside the glass rotunda.',
  theme: 'floral',
  photoUrl: PRESET_PHOTOS[0].url, // rings photo
  musicUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // Instrumental
  groomParents: 'Dr. & Mrs. Edward Sterling',
  brideParents: 'General & Mrs. Dmitry Rostov',
  welcomeMessage: 'We invite you to share our bliss as we commit our hearts and start our lifelong journey together under the canopy of autumn blooms.',
  animationType: 'petals',
  layoutType: 'long-scroll',
  enableTypewriter: true
};

export default function App() {
  const [activeView, setActiveView] = useState<'home' | 'editor' | 'dashboard' | 'preview'>('home');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  
  // Data State
  const [invitation, setInvitation] = useState<WeddingInvitation>(DEFAULT_INVITATION);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [rsvps, setRsvps] = useState<GuestRSVP[]>([]);
  const [rsvpsLoading, setRsvpsLoading] = useState(false);
  
  // App Modes
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestInvitationId, setGuestInvitationId] = useState<string | null>(null);
  const [isEnvelopeOpened, setIsEnvelopeOpened] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Parse URL to detect if Guest View
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let id = urlParams.get('id') || urlParams.get('invite');
    
    // Hash routing fallback
    if (!id && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));
      id = hashParams.get('id') || hashParams.get('invite');
    }

    if (id) {
      setIsGuestMode(true);
      setGuestInvitationId(id);
      loadGuestInvitation(id);
    } else {
      setIsGuestMode(false);
      loadCreatorInvitation();
    }
  }, []);

  // Dynamic Open Graph and SEO Meta tags update for social sharing previews
  useEffect(() => {
    // Helper to dynamically set or update meta tags in document head
    const setMetaTag = (nameOrProperty: string, content: string, isProperty: boolean) => {
      const attributeName = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attributeName}="${nameOrProperty}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, nameOrProperty);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    const isSharedLink = isGuestMode && invitation && invitation.brideName && invitation.groomName;
    
    if (isSharedLink) {
      // 1. Dynamic Title: 💍 {Bride Name} ❤️ {Groom Name} | Wedding Invitation
      const dynamicTitle = `💍 ${invitation.brideName} ❤️ ${invitation.groomName} | Wedding Invitation`;
      document.title = dynamicTitle;

      // 2. Dynamic SEO Description
      const seoDesc = "You're warmly invited to celebrate our special day. Tap to view the invitation, venue, RSVP, and event details.";
      const ogDesc = "You're warmly invited to celebrate our special day.";
      const imageUrl = invitation.photoUrl || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=80';
      const currentUrl = window.location.href;

      setMetaTag('description', seoDesc, false);

      // 3. Dynamic Open Graph tags (Facebook, WhatsApp, Telegram, etc.)
      setMetaTag('og:title', `${invitation.brideName} ❤️ ${invitation.groomName} | Wedding Invitation`, true);
      setMetaTag('og:description', ogDesc, true);
      setMetaTag('og:image', imageUrl, true);
      setMetaTag('og:url', currentUrl, true);

      // 4. Twitter Card tags (summary_large_image)
      setMetaTag('twitter:card', 'summary_large_image', false);
      setMetaTag('twitter:title', `${invitation.brideName} ❤️ ${invitation.groomName} | Wedding Invitation`, false);
      setMetaTag('twitter:description', ogDesc, false);
      setMetaTag('twitter:image', imageUrl, false);
      setMetaTag('twitter:url', currentUrl, false);
    } else {
      // Reset to original Homepage/Creator Metadata
      document.title = "Wedding Invite Builder – Create Stunning Digital Wedding Invitations for FREE";
      
      const defaultDesc = "Create beautiful digital wedding invitations with premium themes, RSVP, background music, Google Maps integration, live preview, and instant sharing. 100% Free.";
      const defaultImageUrl = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=80';
      const defaultUrl = window.location.origin + window.location.pathname;

      setMetaTag('description', defaultDesc, false);
      setMetaTag('og:title', "Wedding Invite Builder – Create Stunning Digital Wedding Invitations for FREE", true);
      setMetaTag('og:description', defaultDesc, true);
      setMetaTag('og:image', defaultImageUrl, true);
      setMetaTag('og:url', defaultUrl, true);

      setMetaTag('twitter:card', 'summary_large_image', false);
      setMetaTag('twitter:title', "Wedding Invite Builder – Create Stunning Digital Wedding Invitations for FREE", false);
      setMetaTag('twitter:description', defaultDesc, false);
      setMetaTag('twitter:image', defaultImageUrl, false);
      setMetaTag('twitter:url', defaultUrl, false);
    }
  }, [isGuestMode, invitation]);

  // Load a guest invitation from Firestore
  const loadGuestInvitation = async (id: string) => {
    setPageLoading(true);
    try {
      const docRef = doc(db, 'invitations', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setInvitation({ id: docSnap.id, ...docSnap.data() } as WeddingInvitation);
      } else {
        setInvitation({} as WeddingInvitation); // Not found indicator
      }
    } catch (err) {
      console.error("Error loading shared invitation:", err);
      handleFirestoreError(err, OperationType.GET, `invitations/${id}`);
    } finally {
      setPageLoading(false);
    }
  };

  // Load previous creation from local storage or set default
  const loadCreatorInvitation = async () => {
    setPageLoading(true);
    const savedId = localStorage.getItem('wedding_invitation_id');
    if (savedId) {
      try {
        const docRef = doc(db, 'invitations', savedId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const loadedData = { id: docSnap.id, ...docSnap.data() } as WeddingInvitation;
          setInvitation(loadedData);
          setActiveId(savedId);
          setShareUrl(`${window.location.origin}${window.location.pathname}?id=${savedId}`);
          fetchRsvps(savedId);
        } else {
          // If deleted on server, clear local storage
          localStorage.removeItem('wedding_invitation_id');
        }
      } catch (err) {
        console.error("Error loading creator invitation:", err);
        handleFirestoreError(err, OperationType.GET, `invitations/${savedId}`);
      }
    }
    setPageLoading(false);
  };

  // Save/Create Invitation to Firestore
  const saveInvitation = async () => {
    setIsSaving(true);
    let finalId = activeId;
    try {
      const collectionRef = collection(db, 'invitations');

      if (finalId) {
        // Update existing
        await setDoc(doc(db, 'invitations', finalId), {
          ...invitation,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } else {
        // Create new
        const docRef = await addDoc(collectionRef, {
          ...invitation,
          createdAt: new Date().toISOString()
        });
        finalId = docRef.id;
        setActiveId(finalId);
        localStorage.setItem('wedding_invitation_id', finalId);
      }

      const generatedUrl = `${window.location.origin}${window.location.pathname}?id=${finalId}`;
      setShareUrl(generatedUrl);
      fetchRsvps(finalId);
    } catch (err) {
      console.error("Error saving invitation:", err);
      alert("Encountered an error saving the card. Please check your network connection.");
      handleFirestoreError(err, finalId ? OperationType.UPDATE : OperationType.CREATE, finalId ? `invitations/${finalId}` : 'invitations');
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch RSVPs linked to active card
  const fetchRsvps = useCallback(async (id: string) => {
    if (!id) return;
    setRsvpsLoading(true);
    try {
      const q = query(
        collection(db, 'rsvps'),
        where('invitationId', '==', id)
      );
      const querySnapshot = await getDocs(q);
      const loadedRsvps: GuestRSVP[] = [];
      querySnapshot.forEach((docSnap) => {
        loadedRsvps.push({ id: docSnap.id, ...docSnap.data() } as GuestRSVP);
      });
      // Sort client-side by date to preserve quick order
      loadedRsvps.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
      setRsvps(loadedRsvps);
    } catch (err) {
      console.error("Error fetching RSVPs:", err);
      handleFirestoreError(err, OperationType.LIST, 'rsvps');
    } finally {
      setRsvpsLoading(false);
    }
  }, []);

  const deleteRsvp = async (rsvpId: string) => {
    if (confirm("Are you sure you want to delete this guest's RSVP response?")) {
      try {
        await deleteDoc(doc(db, 'rsvps', rsvpId));
        if (activeId) {
          fetchRsvps(activeId);
        }
      } catch (err) {
        console.error("Error deleting RSVP:", err);
        alert("Encountered an error deleting the RSVP. Please check your network connection.");
      }
    }
  };

  const createNewCard = () => {
    if (confirm("Are you sure you want to create a new invitation card? This will reset the workspace (your previous card remains live on its generated link!).")) {
      setInvitation(DEFAULT_INVITATION);
      setActiveId(null);
      setShareUrl(null);
      setRsvps([]);
      localStorage.removeItem('wedding_invitation_id');
      setActiveView('editor');
    }
  };

  // Helper to scroll guest to RSVP form
  const scrollToRsvpForm = () => {
    const rsvpElement = document.getElementById('rsvp-guest-card');
    if (rsvpElement) {
      rsvpElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Loading Indicator View
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-neutral-950 flex flex-col items-center justify-center space-y-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <Heart className="h-10 w-10 text-emerald-600 animate-pulse fill-emerald-600/10" />
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20 animate-ping" />
        </div>
        <p className="text-sm font-serif italic text-stone-600 dark:text-neutral-400">
          Unfolding Invitation Details...
        </p>
      </div>
    );
  }

  // --- GUEST VIEW ROUTE ---
  if (isGuestMode) {
    // If invitation does not exist
    if (!invitation.groomName) {
      return (
        <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl space-y-4 border border-stone-200">
            <Gift className="h-12 w-12 text-rose-400 mx-auto" />
            <h2 className="text-2xl font-serif text-stone-850">Invitation Not Found</h2>
            <p className="text-sm text-stone-500 leading-relaxed">
              This wedding invitation card link appears to be invalid or might have been removed by the couple.
            </p>
            <button
              onClick={() => {
                window.location.href = window.location.pathname;
              }}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl shadow transition-all"
            >
              Create Your Own Wedding Invitation
            </button>
          </div>
        </div>
      );
    }

    // Interactive Wax Seal & Envelope Opening scene
    if (!isEnvelopeOpened) {
      const getEnvelopeThemeClass = () => {
        switch (invitation.theme) {
          case 'islamic': return 'bg-emerald-900 border-amber-400 text-amber-100';
          case 'royal': return 'bg-slate-900 border-yellow-500 text-yellow-100';
          case 'floral': return 'bg-rose-50 border-rose-200 text-[#4A3B32]';
          case 'minimal': return 'bg-neutral-100 border-neutral-350 text-neutral-900';
          case 'boho':
          default: return 'bg-[#FAF3EC] border-[#E2B39E] text-[#704235]';
        }
      };

      return (
        <div className="min-h-screen bg-stone-100 dark:bg-neutral-950 flex flex-col items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className={`w-full max-w-md p-8 rounded-2xl shadow-2xl border-4 text-center space-y-6 ${getEnvelopeThemeClass()}`}
          >
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.25em] opacity-60">You are cordially invited</span>
              <h2 className="text-2xl sm:text-3xl font-serif font-extrabold capitalize leading-tight">
                The Wedding of <br />
                <span className="text-emerald-600 dark:text-emerald-400">{invitation.groomName}</span> <br />
                <span className="text-sm font-sans font-normal lowercase italic text-stone-400">and</span> <br />
                <span className="text-emerald-600 dark:text-emerald-400">{invitation.brideName}</span>
              </h2>
            </div>

            {/* Vintage Wax Seal Button */}
            <div className="relative flex justify-center py-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEnvelopeOpened(true)}
                className="relative z-10 w-24 h-24 rounded-full bg-rose-600 hover:bg-rose-700 shadow-xl border-4 border-amber-300 flex flex-col items-center justify-center text-white cursor-pointer group"
                id="btn-open-seal"
              >
                <Heart className="h-8 w-8 animate-pulse fill-white/10 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] uppercase font-bold tracking-widest mt-1">Open</span>
              </motion.button>
              {/* Decorative Envelope Back lines */}
              <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-amber-400/20 -translate-y-1/2 z-0" />
            </div>

            <p className="text-xs italic opacity-85 leading-relaxed">
              Click the wax heart seal to open the golden envelope and reveal the wedding invitation card.
            </p>
          </motion.div>
        </div>
      );
    }

    // Main Guest Invitation Page (Envelope opened!)
    return (
      <div className="min-h-screen bg-stone-50 text-stone-850 pb-20 relative overflow-hidden">
        {/* Confetti / Sparkle Decor background */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-40" />

        {/* Music Player */}
        <MusicPlayer url={invitation.musicUrl} autoPlay={true} />

        {/* Back button option to design one */}
        <div className="max-w-2xl mx-auto px-4 pt-6 flex justify-start">
          <a
            href={window.location.origin + window.location.pathname}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/80 hover:bg-white backdrop-blur-md text-xs font-semibold rounded-full shadow border border-neutral-200/50 text-neutral-600 transition-all hover:scale-105"
            id="link-go-to-designer"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
            Create Your Own Custom Cards
          </a>
        </div>

        {/* The beautiful invitation card */}
        <div className="max-w-xl mx-auto px-4 py-8">
          <InvitationCard
            data={invitation}
            isPreview={false}
            onRsvpClick={scrollToRsvpForm}
          />
        </div>

        {/* The RSVP submission form */}
        <div className="max-w-xl mx-auto px-4 mt-8">
          <GuestRSVPForm
            invitationId={guestInvitationId || ''}
            theme={invitation.theme}
            coupleNames={`${invitation.groomName} & ${invitation.brideName}`}
          />
        </div>

        {/* Gift registry placeholder or warm footer */}
        <footer className="text-center mt-16 max-w-sm mx-auto px-4 space-y-2 opacity-60">
          <p className="text-xs uppercase tracking-widest font-sans font-semibold">Wedding Celebrations</p>
          <p className="text-[10px] font-sans leading-relaxed">
            Your attendance is our ultimate treasure. Thank you for celebrating this timeless union with us.
          </p>
        </footer>
      </div>
    );
  }

  // --- CREATOR DESIGNER WORKSPACE ROUTE ---
  if (activeView === 'home') {
    return (
      <HomePage
        onStartCreating={() => setActiveView('editor')}
        activeId={activeId}
        onResumeDraft={() => setActiveView('editor')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 font-sans flex flex-col">
      {/* Dynamic Ambient Music for testing inside editor preview */}
      <MusicPlayer url={invitation.musicUrl} />

      {/* Editor Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="p-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 rounded-xl transition-all flex items-center justify-center cursor-pointer"
            title="Back to Homepage & Details"
            id="btn-back-to-home"
          >
            <Compass className="h-5 w-5 shrink-0" />
          </button>
          <span className="p-2.5 bg-emerald-600 text-white rounded-xl shadow-md">
            <Heart className="h-6 w-6 fill-white" />
          </span>
          <div>
            <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
              Wedding Invitation Builder
              <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Active
              </span>
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Create gorgeous digital cards, get RSVPs, & manage guests dynamically.
            </p>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Workspaces View Toggle */}
          <div className="flex bg-neutral-100 dark:bg-neutral-950 p-1 rounded-xl border border-neutral-250 dark:border-neutral-800">
            <button
              onClick={() => setActiveView('home')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'home'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
              id="view-toggle-home"
            >
              <Compass className="h-3.5 w-3.5" />
              Home Page
            </button>
            <button
              onClick={() => setActiveView('editor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'editor'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
              id="view-toggle-editor"
            >
              <Laptop className="h-3.5 w-3.5" />
              Card Designer
            </button>
            <button
              onClick={() => {
                setActiveView('dashboard');
                if (activeId) fetchRsvps(activeId);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer relative ${
                activeView === 'dashboard'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
              id="view-toggle-dashboard"
            >
              <Users className="h-3.5 w-3.5" />
              2. RSVPs Tracker
              {rsvps.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-mono text-[9px] font-black h-4 px-1 rounded-full flex items-center justify-center animate-bounce min-w-[16px]">
                  {rsvps.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeView === 'preview'
                  ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow'
                  : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
              }`}
              id="view-toggle-preview"
            >
              <Eye className="h-3.5 w-3.5" />
              3. Guest Preview
            </button>
          </div>

          {/* New Card Action */}
          <button
            onClick={createNewCard}
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-white hover:bg-neutral-50 dark:bg-neutral-900 dark:hover:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-700 dark:text-neutral-300 transition-all cursor-pointer"
            id="btn-create-new-card"
          >
            <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
            New Card
          </button>
        </div>
      </header>

      {/* Main Panel Content Area */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {activeView === 'editor' && (
            <motion.div
              key="view-editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              {/* Form Editor panel - Left (7 cols) */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-6">
                <EditorPanel
                  data={invitation}
                  onChange={setInvitation}
                  onSave={saveInvitation}
                  isSaving={isSaving}
                  shareUrl={shareUrl}
                />
              </div>

              {/* Real-time Simulator Preview panel - Right (5 cols) */}
              <div className="lg:col-span-6 xl:col-span-5 lg:sticky lg:top-28 space-y-4">
                <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Live Simulator Preview
                  </h3>
                  
                  {/* Device Toggler */}
                  <div className="flex bg-neutral-100 dark:bg-neutral-950 p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800">
                    <button
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded ${
                        previewDevice === 'desktop'
                          ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                      title="Desktop Layout"
                      id="preview-toggle-desktop"
                    >
                      <Laptop className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded ${
                        previewDevice === 'mobile'
                          ? 'bg-white dark:bg-neutral-900 text-emerald-600 shadow-sm'
                          : 'text-neutral-400 hover:text-neutral-600'
                      }`}
                      title="Mobile Layout"
                      id="preview-toggle-mobile"
                    >
                      <Smartphone className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Screen Stage */}
                <div className="flex justify-center">
                  <div
                    className={`transition-all duration-300 w-full overflow-hidden ${
                      previewDevice === 'mobile'
                        ? 'max-w-[360px] border-[10px] border-neutral-800 dark:border-neutral-900 rounded-[2rem] aspect-[9/16] shadow-2xl bg-neutral-50'
                        : 'max-w-xl rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xl bg-neutral-50'
                    }`}
                  >
                    <div className="h-full overflow-y-auto max-h-[600px] p-4 bg-neutral-50/50 dark:bg-neutral-950/20 [scrollbar-width:none]">
                      <InvitationCard
                        data={invitation}
                        isPreview={true}
                        onRsvpClick={() => alert("RSVP scrolling test! Guests will be directed smoothly to the attendance form below.")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'dashboard' && (
            <motion.div
              key="view-dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm"
            >
              {!activeId ? (
                <div className="p-12 text-center max-w-sm mx-auto space-y-4">
                  <Mail className="h-12 w-12 text-emerald-600 mx-auto opacity-30" />
                  <h3 className="text-lg font-bold">No Card Saved Yet</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    You must save your wedding invitation card at least once to begin collecting and tracking guest RSVPs.
                  </p>
                  <button
                    onClick={() => setActiveView('editor')}
                    className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-sm hover:bg-emerald-700 transition-all"
                    id="btn-goto-designer-from-dash"
                  >
                    Go to Card Designer
                  </button>
                </div>
              ) : (
                <DashboardRSVP
                  rsvps={rsvps}
                  isLoading={rsvpsLoading}
                  onRefresh={() => fetchRsvps(activeId)}
                  onDeleteRSVP={deleteRsvp}
                />
              )}
            </motion.div>
          )}

          {activeView === 'preview' && (
            <motion.div
              key="view-preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Full Screen Guest Preview Mode
                  </span>
                </div>
                <button
                  onClick={() => setActiveView('editor')}
                  className="text-xs px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg text-neutral-600 dark:text-neutral-300 font-semibold"
                  id="btn-close-preview"
                >
                  Exit Preview
                </button>
              </div>

              {/* Full guest replica */}
              <div className="bg-stone-50 rounded-2xl p-4 sm:p-10 border border-neutral-200 dark:border-neutral-800 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none opacity-45" />
                
                <div className="max-w-xl mx-auto space-y-12 relative z-10">
                  <InvitationCard
                    data={invitation}
                    isPreview={false}
                    onRsvpClick={() => alert("Simulated: Clicking this scrolls the guest to the RSVP form below.")}
                  />

                  {/* Dummy RSVP */}
                  <div className="opacity-80 pointer-events-none select-none relative">
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow">
                      TEST SIMULATION
                    </div>
                    <GuestRSVPForm
                      invitationId="test"
                      theme={invitation.theme}
                      coupleNames={`${invitation.groomName} & ${invitation.brideName}`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Main Footer */}
      <footer className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 py-6 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <p>© 2026 Wedding Invitation Card Creator. Design beautiful invitations with high-contrast themes and dynamic RSVP trackers.</p>
      </footer>
    </div>
  );
}
