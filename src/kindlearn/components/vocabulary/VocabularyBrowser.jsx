import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Volume2, Star } from 'lucide-react';

export default function VocabularyBrowser({ vocabulary, vocabularySRS, onMasterToggle, langId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMastered, setFilterMastered] = useState('all'); // all | mastered | learning

  const filtered = vocabulary.filter((word) => {
    const srsData = vocabularySRS[word.word];
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterMastered === 'mastered') return matchesSearch && srsData?.isMastered;
    if (filterMastered === 'learning') return matchesSearch && !srsData?.isMastered;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search & filters */}
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Search words or meanings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 rounded-xl border bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        />

        <div className="flex gap-2">
          {['all', 'mastered', 'learning'].map((filter) => (
            <Button
              key={filter}
              variant={filterMastered === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterMastered(filter)}
              className="capitalize"
            >
              {filter === 'all' ? 'All Words' : filter === 'mastered' ? '✓ Mastered' : '🔄 Learning'}
            </Button>
          ))}
        </div>
      </div>

      {/* Word grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((word, i) => {
          const srsData = vocabularySRS[word.word];
          const isMastered = srsData?.isMastered;

          return (
            <motion.div
              key={word.word}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 relative overflow-hidden group hover:shadow-md transition-all h-full flex flex-col justify-between">
                {/* Background accent */}
                <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl transition-all ${isMastered ? 'bg-emerald-500/20' : 'bg-primary/10 group-hover:bg-primary/20'}`} />

                <div className="relative">
                  {/* Header with mastery indicator */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-foreground">{word.word}</h3>
                      <p className="text-sm text-muted-foreground">{word.meaning}</p>
                    </div>
                    <button
                      onClick={() => onMasterToggle(word.word)}
                      className="p-1 hover:scale-110 transition-transform"
                      aria-label="Toggle mastery"
                    >
                      {isMastered ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-2 flex-wrap">
                    {srsData && (
                      <>
                        <Badge variant="secondary" className="text-xs">
                          Reviewed {srsData.reviewCount}x
                        </Badge>
                        {srsData.correctCount > 0 && (
                          <Badge className="bg-emerald-500/20 text-emerald-700 text-xs">
                            {srsData.correctCount} correct
                          </Badge>
                        )}
                        {isMastered && (
                          <Badge className="bg-emerald-500/20 text-emerald-700 text-xs gap-1">
                            <Star className="w-3 h-3" /> Mastered
                          </Badge>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No words found. Try adjusting your filters.</p>
        </div>
      )}
    </div>
  );
}