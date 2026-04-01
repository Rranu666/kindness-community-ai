import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Trophy, BookOpen, Zap } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function VocabularyStats({ stats, vocabularySRS }) {
  const statCards = [
    {
      icon: BookOpen,
      label: 'Total Words',
      value: stats?.totalWords || 0,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Zap,
      label: 'Being Reviewed',
      value: stats?.reviewedWords || 0,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: Trophy,
      label: 'Mastered',
      value: stats?.masteredWords || 0,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: BarChart3,
      label: 'Due Today',
      value: stats?.dueForReview || 0,
      color: 'from-rose-500 to-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Mastery overview */}
      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-6">Overall Mastery</h2>
        <div className="grid sm:grid-cols-2 gap-8">
          <div>
            <div className="flex items-end gap-2 mb-4">
              <div className="text-5xl font-extrabold text-primary">{stats?.masteryPercentage || 0}%</div>
              <p className="text-muted-foreground mb-1">Mastered</p>
            </div>
            <Progress value={stats?.masteryPercentage || 0} className="h-3" />
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Mastered: {stats?.masteredWords} words</p>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.masteryPercentage || 0}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                Reviewed: {stats?.reviewedWords} words
              </p>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${stats?.reviewedWords && stats?.totalWords ? (stats.reviewedWords / stats.totalWords) * 100 : 0}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className={`p-6 ${stat.bgColor} border-0`}>
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-4xl font-extrabold text-foreground">{stat.value}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recent reviews */}
      <Card className="p-8">
        <h3 className="text-xl font-bold mb-6">Recent Progress</h3>
        <div className="space-y-4">
          {Object.entries(vocabularySRS)
            .filter(([_, word]) => word.lastReviewDate)
            .sort((a, b) => new Date(b[1].lastReviewDate) - new Date(a[1].lastReviewDate))
            .slice(0, 5)
            .map(([key, word]) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div>
                  <p className="font-semibold text-foreground">{word.word}</p>
                  <p className="text-xs text-muted-foreground">{word.meaning}</p>
                </div>
                <div className="flex gap-2">
                  {word.isMastered && <Badge className="bg-emerald-500/20 text-emerald-700">✓ Mastered</Badge>}
                  <Badge variant="secondary">{word.reviewCount} reviews</Badge>
                </div>
              </motion.div>
            ))}
        </div>
      </Card>
    </div>
  );
}