import React, { useState } from 'react';
import { GuestRSVP } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { db, collection, addDoc, handleFirestoreError, OperationType } from '../firebase';
import { Heart, User, Users, MessageSquare, Check, X, HelpCircle, Send } from 'lucide-react';

interface GuestRSVPProps {
  invitationId: string;
  theme: string;
  coupleNames: string;
}

export default function GuestRSVPForm({ invitationId, theme, coupleNames }: GuestRSVPProps) {
  const [formData, setFormData] = useState({
    guestName: '',
    status: 'attending' as 'attending' | 'declined' | 'maybe',
    guestCount: 1,
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = (status: 'attending' | 'declined' | 'maybe') => {
    setFormData(prev => ({
      ...prev,
      status,
      // If declining, guest count should default to 0
      guestCount: status === 'declined' ? 0 : prev.guestCount === 0 ? 1 : prev.guestCount
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guestCount' ? Math.max(0, parseInt(value) || 0) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.guestName.trim()) {
      setError("Please fill in your name to RSVP.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const rsvpData: Omit<GuestRSVP, 'id'> = {
        invitationId,
        guestName: formData.guestName.trim(),
        status: formData.status,
        guestCount: formData.status === 'declined' ? 0 : formData.guestCount,
        message: formData.message.trim(),
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'rsvps'), rsvpData);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error writing RSVP to Firestore", err);
      setError("We encountered an error saving your RSVP. Please try again.");
      handleFirestoreError(err, OperationType.CREATE, 'rsvps');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Determine button styles based on invitation theme
  const getButtonStyles = () => {
    switch (theme) {
      case 'islamic':
        return 'bg-amber-400 hover:bg-amber-300 text-emerald-950 focus:ring-amber-300';
      case 'royal':
        return 'bg-yellow-500 hover:bg-yellow-400 text-neutral-950 focus:ring-yellow-400';
      case 'floral':
        return 'bg-rose-300 hover:bg-rose-400 text-white focus:ring-rose-200';
      case 'minimal':
        return 'bg-neutral-900 hover:bg-neutral-800 text-white focus:ring-neutral-200';
      case 'boho':
      default:
        return 'bg-[#BE7A5F] hover:bg-[#A35D43] text-white focus:ring-[#E2B39E]';
    }
  };

  const getCardBg = () => {
    switch (theme) {
      case 'islamic':
        return 'bg-emerald-900/40 text-amber-100 border-amber-400/20';
      case 'royal':
        return 'bg-slate-900/60 text-yellow-100 border-yellow-500/20';
      case 'floral':
        return 'bg-white text-[#4A3B32] border-rose-100';
      case 'minimal':
        return 'bg-neutral-50 text-neutral-900 border-neutral-200';
      case 'boho':
      default:
        return 'bg-[#FAF3EC] text-[#704235] border-[#E2B39E]/40';
    }
  };

  return (
    <div className={`max-w-xl mx-auto rounded-2xl border-2 p-6 sm:p-8 shadow-xl transition-all ${getCardBg()}`} id="rsvp-guest-card">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.form
            key="rsvp-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <Heart className="h-8 w-8 text-rose-400 animate-pulse fill-rose-400/10" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight">
                RSVP Attendance
              </h3>
              <p className="text-sm opacity-80 max-w-sm mx-auto">
                Will you honor the wedding celebrations of <span className="font-semibold">{coupleNames}</span> with your presence?
              </p>
            </div>

            {error && (
              <div className="p-3.5 text-xs bg-red-500/15 border border-red-500/30 text-red-600 rounded-xl">
                {error}
              </div>
            )}

            {/* Name Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider opacity-90">
                Your Full Name(s) *
              </label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 h-4 w-4 opacity-50" />
                <input
                  type="text"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  placeholder="e.g. Sarah & Michael"
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm rounded-xl border border-neutral-300/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-900 font-sans"
                  required
                  id="rsvp-guest-name"
                />
              </div>
            </div>

            {/* Attendance Status Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider opacity-90">
                Are you attending? *
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleStatusChange('attending')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                    formData.status === 'attending'
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-md scale-102 font-sans'
                      : 'bg-white/40 dark:bg-black/10 hover:bg-white/60 text-inherit border-neutral-300/30 font-sans'
                  }`}
                  id="rsvp-btn-attending"
                >
                  <Check className="h-5 w-5 mb-1" />
                  <span className="text-xs font-semibold">Attending</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('declined')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                    formData.status === 'declined'
                      ? 'bg-rose-500 text-white border-rose-500 shadow-md scale-102 font-sans'
                      : 'bg-white/40 dark:bg-black/10 hover:bg-white/60 text-inherit border-neutral-300/30 font-sans'
                  }`}
                  id="rsvp-btn-declined"
                >
                  <X className="h-5 w-5 mb-1" />
                  <span className="text-xs font-semibold">Declining</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStatusChange('maybe')}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                    formData.status === 'maybe'
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md scale-102 font-sans'
                      : 'bg-white/40 dark:bg-black/10 hover:bg-white/60 text-inherit border-neutral-300/30 font-sans'
                  }`}
                  id="rsvp-btn-maybe"
                >
                  <HelpCircle className="h-5 w-5 mb-1" />
                  <span className="text-xs font-semibold">Maybe</span>
                </button>
              </div>
            </div>

            {/* Number of Guests (Only if attending/maybe) */}
            {formData.status !== 'declined' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider opacity-90">
                  Number of Guests (including you)
                </label>
                <div className="relative flex items-center">
                  <Users className="absolute left-3.5 h-4 w-4 opacity-50" />
                  <input
                    type="number"
                    name="guestCount"
                    min={1}
                    max={10}
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm rounded-xl border border-neutral-300/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-900 font-sans"
                    id="rsvp-guest-count"
                  />
                </div>
              </div>
            )}

            {/* Custom Message / Wishes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider opacity-90">
                Send Blessings & Wishes to the Couple
              </label>
              <div className="relative flex items-start">
                <MessageSquare className="absolute left-3.5 top-3.5 h-4 w-4 opacity-50" />
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Write a custom blessing, piece of advice, or a beautiful message to the newlywed couple..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white/50 backdrop-blur-sm rounded-xl border border-neutral-300/30 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-neutral-900 font-sans"
                  id="rsvp-guest-msg"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formData.guestName}
              className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-xl shadow-md transition-all font-sans cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${getButtonStyles()} disabled:opacity-50 disabled:cursor-not-allowed`}
              id="rsvp-btn-submit"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting RSVP...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit RSVP
                </>
              )}
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="rsvp-thankyou"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <div className="inline-flex p-3 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
              <Heart className="h-10 w-10 fill-emerald-500" />
            </div>
            <h3 className="text-2xl font-bold">
              Thank You!
            </h3>
            <p className="text-sm opacity-95 max-w-sm mx-auto leading-relaxed">
              Your response has been registered successfully. We have notified {coupleNames} of your status!
            </p>
            <div className="pt-4 text-xs italic opacity-85">
              {formData.status === 'attending' 
                ? "Looking forward to celebrating this glorious day with you!"
                : formData.status === 'maybe'
                ? "We hope you will be able to make it!"
                : "Thank you for sending your warm thoughts and wishes!"
              }
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
