import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Gamepad2, BarChart3, MessageCircle, Zap, Users, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Lessons',
    desc: 'Smart lessons that adapt to your pace and learning style using advanced AI technology.',
    gradient: 'from-violet-500 to-purple-600',
    bgGlow: 'bg-violet-500/20',
  },
  {
    icon: MessageCircle,
    title: 'Real Conversations',
    desc: 'Practice real-world phrases and dialogues that you can use from day one.',
    gradient: 'from-blue-500 to-cyan-500',
    bgGlow: 'bg-blue-500/20',
  },
  {
    icon: Gamepad2,
    title: 'Gamified Learning',
    desc: 'Earn XP, unlock badges, and maintain streaks. Learning has never been this fun.',
    gradient: 'from-amber-400 to-orange-500',
    bgGlow: 'bg-amber-500/20',
  },
  {
    icon: Zap,
    title: '30-Day Structure',
    desc: 'A carefully crafted curriculum that takes you from zero to confident in just 30 days.',
    gradient: 'from-emerald-400 to-green-600',
    bgGlow: 'bg-emerald-500/20',
  },
  {
    icon: Users,
    title: 'Kids Zone',
    desc: 'A magical learning world designed for children — stories, games, and adventures.',
    gradient: 'from-pink-400 to-rose-500',
    bgGlow: 'bg-pink-500/20',
  },
  {
    icon: BarChart3,
    title: 'Track Progress',
    desc: 'Detailed analytics and progress tracking to keep you motivated throughout your journey.',
    gradient: 'from-indigo-400 to-violet-600',
    bgGlow: 'bg-indigo-500/20',
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-28 px-4 md:px-6 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-semibold mb-6"
          >
            <Sparkles className="w-4 h-4" />
            Proven Learning Methods
          </motion.div>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
            Why <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">KindLearn</span> Works
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            Combining the best of AI technology with proven learning methods to create an experience you'll actually love.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className="group relative"
            >
              {/* Card with glassmorphism effect */}
               <div className="relative bg-card/85 backdrop-blur-xl rounded-3xl border border-border/50 p-5 md:p-8 h-full hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:-translate-y-3 overflow-hidden">
                {/* Background glow on hover */}
                <div className={`absolute -top-20 -right-20 w-40 h-40 ${f.bgGlow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <f.icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                
                {/* Bottom accent line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${f.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}