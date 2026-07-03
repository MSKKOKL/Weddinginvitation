import { GuestRSVP } from '../types';
import { motion } from 'motion/react';
import { Users, CheckCircle2, XCircle, HelpCircle, RefreshCw, MessageSquare, Heart, Sparkles, Trash2 } from 'lucide-react';
import { db, doc, updateDoc } from '../firebase'; // or delete if needed

interface DashboardRSVPProps {
  rsvps: GuestRSVP[];
  isLoading: boolean;
  onRefresh: () => void;
  onDeleteRSVP?: (id: string) => void;
}

export default function DashboardRSVP({ rsvps, isLoading, onRefresh, onDeleteRSVP }: DashboardRSVPProps) {
  // Compute Stats
  const attendingRsvps = rsvps.filter(r => r.status === 'attending');
  const maybeRsvps = rsvps.filter(r => r.status === 'maybe');
  const declinedRsvps = rsvps.filter(r => r.status === 'declined');

  const totalAttendingGuests = attendingRsvps.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);
  const totalMaybeGuests = maybeRsvps.reduce((acc, curr) => acc + (curr.guestCount || 1), 0);

  const totalResponses = rsvps.length;

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            Guest RSVP Tracker & Dashboard
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Real-time attendance numbers, party sizes, and customized messages from your guests.
          </p>
        </div>
        
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-all cursor-pointer disabled:opacity-50"
          id="btn-refresh-rsvps"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Responses
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Attending */}
        <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl p-4 flex items-center gap-4">
          <span className="p-3 bg-emerald-500 text-white rounded-lg shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-xs font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
              Attending
            </span>
            <span className="text-2xl font-black text-emerald-950 dark:text-emerald-100 font-mono">
              {totalAttendingGuests} <span className="text-xs font-normal text-emerald-700 dark:text-emerald-400">guests</span>
            </span>
            <span className="block text-[10px] text-emerald-600 dark:text-emerald-400/80 mt-0.5">
              from {attendingRsvps.length} groups
            </span>
          </div>
        </div>

        {/* Total Maybe */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 flex items-center gap-4">
          <span className="p-3 bg-amber-500 text-white rounded-lg shrink-0">
            <HelpCircle className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">
              Maybe
            </span>
            <span className="text-2xl font-black text-amber-950 dark:text-amber-100 font-mono">
              {totalMaybeGuests} <span className="text-xs font-normal text-amber-700 dark:text-amber-400">guests</span>
            </span>
            <span className="block text-[10px] text-amber-600 dark:text-amber-400/80 mt-0.5">
              from {maybeRsvps.length} groups
            </span>
          </div>
        </div>

        {/* Total Declined */}
        <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl p-4 flex items-center gap-4">
          <span className="p-3 bg-rose-500 text-white rounded-lg shrink-0">
            <XCircle className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-xs font-semibold text-rose-800 dark:text-rose-300 uppercase tracking-wider">
              Declined
            </span>
            <span className="text-2xl font-black text-rose-950 dark:text-rose-100 font-mono">
              {declinedRsvps.length}
            </span>
            <span className="block text-[10px] text-rose-600 dark:text-rose-400/80 mt-0.5">
              invitation declines
            </span>
          </div>
        </div>

        {/* Total Responses */}
        <div className="bg-neutral-100 dark:bg-neutral-850 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 flex items-center gap-4">
          <span className="p-3 bg-neutral-500 text-white rounded-lg shrink-0">
            <Users className="h-5 w-5" />
          </span>
          <div>
            <span className="block text-xs font-semibold text-neutral-800 dark:text-neutral-300 uppercase tracking-wider">
              Total RSVPs
            </span>
            <span className="text-2xl font-black text-neutral-900 dark:text-neutral-100 font-mono">
              {totalResponses}
            </span>
            <span className="block text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              guest responses
            </span>
          </div>
        </div>
      </div>

      {/* Guest Details Table */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 flex justify-between items-center">
          <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
            Guest List Ledger ({rsvps.length} entries)
          </h3>
        </div>

        {rsvps.length === 0 ? (
          <div className="p-8 text-center text-neutral-500 dark:text-neutral-400 space-y-2">
            <Users className="h-8 w-8 mx-auto opacity-30 text-emerald-600" />
            <p className="text-sm font-medium">No RSVPs received yet.</p>
            <p className="text-xs">Send your generated link to guests to start collecting RSVPs.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-sans">
              <thead className="bg-neutral-50 dark:bg-neutral-850 text-neutral-500 dark:text-neutral-400 uppercase text-[10px] tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="px-6 py-3 font-semibold">Guest Name</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-center">Party Size</th>
                  <th className="px-6 py-3 font-semibold">Message Blessing</th>
                  {onDeleteRSVP && <th className="px-6 py-3 font-semibold text-center">Action</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-850/30">
                    <td className="px-6 py-4 font-semibold text-neutral-900 dark:text-neutral-100">
                      {rsvp.guestName}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        rsvp.status === 'attending'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                          : rsvp.status === 'maybe'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400'
                      }`}>
                        {rsvp.status === 'attending' && <CheckCircle2 className="h-3 w-3 shrink-0" />}
                        {rsvp.status === 'maybe' && <HelpCircle className="h-3 w-3 shrink-0" />}
                        {rsvp.status === 'declined' && <XCircle className="h-3 w-3 shrink-0" />}
                        {rsvp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-bold font-mono">
                      {rsvp.status === 'declined' ? '0' : rsvp.guestCount || 1}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate italic text-neutral-600 dark:text-neutral-400" title={rsvp.message}>
                      {rsvp.message || <span className="text-neutral-300 dark:text-neutral-700 font-sans not-italic">—</span>}
                    </td>
                    {onDeleteRSVP && (
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => rsvp.id && onDeleteRSVP(rsvp.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 rounded-lg transition-all"
                          title="Delete RSVP Record"
                          id={`btn-del-rsvp-${rsvp.id}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Message Bulletin Board of Blessings */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
          <MessageSquare className="h-4 w-4 text-emerald-600" />
          Guest Blessing Bulletin Board ({rsvps.filter(r => r.message).length} wishes)
        </h3>
        
        {rsvps.filter(r => r.message).length === 0 ? (
          <div className="p-6 bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 border-dashed rounded-xl text-center text-xs text-neutral-500 dark:text-neutral-400">
            No guest blessings posted yet. They will appear here when guests submit comments.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {rsvps.filter(r => r.message).map((rsvp, idx) => (
              <motion.div
                key={rsvp.id || idx}
                whileHover={{ scale: 1.02 }}
                className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-200/50 dark:border-amber-900/20 rounded-xl p-5 shadow-sm relative overflow-hidden"
              >
                {/* Vintage paper pin effect */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-4 h-1.5 bg-emerald-500/10 dark:bg-emerald-400/20 rounded border border-emerald-500/20" />
                
                <div className="absolute -right-2 -bottom-2 opacity-10">
                  <Sparkles className="h-16 w-16 text-amber-500" />
                </div>

                <p className="text-xs italic font-serif leading-relaxed text-amber-950 dark:text-amber-100 pr-2 pt-1">
                  "{rsvp.message}"
                </p>
                <div className="mt-4 pt-3 border-t border-amber-200/40 dark:border-amber-900/10 flex items-center justify-between text-[10px] tracking-wider uppercase">
                  <span className="font-bold text-amber-900 dark:text-amber-300">
                    — {rsvp.guestName}
                  </span>
                  <span className="font-mono text-neutral-400">
                    {rsvp.status === 'attending' ? 'Attending' : rsvp.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
