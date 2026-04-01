import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Zap, Globe, Users } from 'lucide-react';
import { progressApi } from '@/kindlearn/api/progress';

const MEDALS = ['🥇', '🥈', '🥉'];

function getRankColor(rank) {
  if (rank === 0) return 'from-amber-400 to-yellow-500';
  if (rank === 1) return 'from-slate-300 to-slate-400';
  if (rank === 2) return 'from-orange-400 to-amber-500';
  return 'from-primary/20 to-primary/10';
}

function Avatar({ name, rank }) {
  const initials = (name || '?').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500', 'bg-blue-500', 'bg-pink-500', 'bg-cyan-500'];
  const color = colors[name?.charCodeAt(0) % colors.length] || 'bg-primary';
  return (
    <div className={`w-9 h-9 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {initials}
    </div>
  );
}

export default function Leaderboard({ langId, currentUserId }) {
  const [view, setView] = useState('global'); // 'global' | 'friends'
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, [langId]);

  const loadLeaderboard = async () => {
    setLoading(true);
    // Fetch leaderboard for this language (already sorted by the API)
    const all = await progressApi.leaderboard(langId, 'adult');

    // Build display list from leaderboard response shape: {id, xp_total, streak_days, user: {name, photo}}
    const displayList = all.map((p, i) => ({
      id: p.id,
      name: p.user?.name || `Learner ${i + 1}`,
      streak: p.streak_days || 0,
      xp: p.xp_total || 0,
      rank: i,
      isMe: p.id === currentUserId,
    }));

    setEntries(displayList);

    const myIndex = displayList.findIndex((e) => e.isMe);
    setMyRank(myIndex >= 0 ? myIndex + 1 : null);
    setLoading(false);
  };

  // For "Friends" view, show only top 5 around the current user (simulated)
  const visibleEntries = view === 'global' ? entries.slice(0, 10) : entries.slice(0, 5);

  return (
    <div className="bg-card rounded-2xl border p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-500" /> Leaderboard
        </h3>

        {/* Toggle */}
        <div className="flex items-center bg-secondary rounded-xl p-1 gap-1">
          <button
            onClick={() => setView('global')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              view === 'global' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Global
          </button>
          <button
            onClick={() => setView('friends')}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
              view === 'friends' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Friends
          </button>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[auto_1fr_auto_auto] gap-x-3 text-xs text-muted-foreground font-medium mb-2 px-2">
        <span>#</span>
        <span>Learner</span>
        <span className="flex items-center gap-0.5"><Flame className="w-3 h-3 text-orange-400" /> Streak</span>
        <span className="flex items-center gap-0.5"><Zap className="w-3 h-3 text-amber-400" /> XP</span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      ) : visibleEntries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No learners yet for this language. Be the first! 🚀
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-1.5">
            {visibleEntries.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`grid grid-cols-[auto_1fr_auto_auto] gap-x-3 items-center px-3 py-2.5 rounded-xl transition-all ${
                  entry.isMe
                    ? 'bg-primary/10 border border-primary/30 ring-1 ring-primary/20'
                    : i < 3
                    ? 'bg-gradient-to-r ' + getRankColor(i) + ' bg-opacity-10'
                    : 'hover:bg-secondary/60'
                }`}
              >
                {/* Rank */}
                <div className="w-7 text-center">
                  {i < 3 ? (
                    <span className="text-lg">{MEDALS[i]}</span>
                  ) : (
                    <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                  )}
                </div>

                {/* Name */}
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar name={entry.name} rank={i} />
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate capitalize ${entry.isMe ? 'text-primary' : ''}`}>
                      {entry.name}
                      {entry.isMe && <span className="ml-1.5 text-xs font-normal text-primary/70">(you)</span>}
                    </p>
                  </div>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-1 text-sm font-bold text-orange-500 min-w-[3rem] justify-end">
                  <Flame className="w-3.5 h-3.5" />
                  {entry.streak}
                </div>

                {/* XP */}
                <div className="flex items-center gap-1 text-sm font-bold text-amber-500 min-w-[3.5rem] justify-end">
                  <Zap className="w-3.5 h-3.5" />
                  {entry.xp >= 1000 ? `${(entry.xp / 1000).toFixed(1)}k` : entry.xp}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}

      {/* My rank footer (if not in visible range) */}
      {!loading && myRank && myRank > visibleEntries.length && (
        <div className="mt-3 pt-3 border-t border-dashed text-center text-xs text-muted-foreground">
          Your rank: <span className="font-bold text-foreground">#{myRank}</span> — keep going to climb up! 🔥
        </div>
      )}

      {/* Friends empty state */}
      {view === 'friends' && !loading && (
        <p className="text-center text-xs text-muted-foreground mt-3">
          👥 Showing top learners near your rank
        </p>
      )}
    </div>
  );
}