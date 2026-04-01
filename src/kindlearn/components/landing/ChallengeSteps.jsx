import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, BookOpen, Trophy, ArrowRight, Sparkles, Zap, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    icon: Globe,
    accentIcon: Sparkles,
    step: '01',
    title: 'Pick Your Language',
    desc: 'Choose from 8 popular languages to start your journey.',
    detail: 'Spanish, French, German, Japanese, Korean, Italian, Portuguese & Mandarin — all waiting for you.',
    color: 'from-violet-500 to-purple-600',
    lightColor: 'from-violet-50 to-purple-50',
    borderColor: 'border-violet-200',
    textColor: 'text-violet-600',
    bgColor: 'bg-violet-500',
    emoji: '🌍',
  },
  {
    icon: BookOpen,
    accentIcon: Zap,
    step: '02',
    title: 'Learn Daily',
    desc: 'Just 10-15 minutes a day of AI-powered, interactive lessons.',
    detail: 'Vocabulary, quizzes, listening challenges & pronunciation practice — all in one session.',
    color: 'from-emerald-500 to-teal-600',
    lightColor: 'from-emerald-50 to-teal-50',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-600',
    bgColor: 'bg-emerald-500',
    emoji: '⚡',
  },
  {
    icon: Trophy,
    accentIcon: MessageCircle,
    step: '03',
    title: 'Speak Confidently',
    desc: 'Complete the 30-day challenge and start real conversations.',
    detail: 'Earn badges, build streaks and celebrate milestones as your fluency grows.',
    color: 'from-amber-500 to-orange-500',
    lightColor: 'from-amber-50 to-orange-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-600',
    bgColor: 'bg-amber-500',
    emoji: '🏆',
  },
];

export default function ChallengeSteps() {
  const [activeStep, setActiveStep] = useState(null);

  return (
    <section className="py-16 md:py-24 px-4 md:px-6 bg-secondary/30 overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            How it works
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            3 Steps to{' '}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Fluency</span>
          </h2>
          <p className="text-muted-foreground text-lg mt-4">It's simple. Pick, learn, speak.</p>
        </motion.div>

        {/* Connector line (desktop) */}
        <div className="hidden md:block relative mb-0">
          <div className="absolute top-1/2 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-violet-200 via-emerald-200 to-amber-200 z-0" />
        </div>

        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 relative z-10">
          {steps.map((s, i) => {
            const isActive = activeStep === i;
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                onHoverStart={() => setActiveStep(i)}
                onHoverEnd={() => setActiveStep(null)}
                className="cursor-default"
              >
                <motion.div
                   animate={isActive ? { y: -12, scale: 1.05 } : { y: 0, scale: 1 }}
                   transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                   className={`relative rounded-3xl border-2 p-5 md:p-8 bg-gradient-to-br ${s.lightColor} ${s.borderColor} backdrop-blur-sm transition-shadow duration-300 ${isActive ? 'shadow-2xl shadow-primary/15' : 'shadow-sm hover:shadow-md'}`}
                 >
                  {/* Step badge */}
                  <div className={`absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white text-xs font-black">{s.step}</span>
                  </div>

                  {/* Emoji top right */}
                  <motion.span
                    className="absolute top-4 right-5 text-2xl"
                    animate={isActive ? { rotate: [0, -15, 15, 0], scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {s.emoji}
                  </motion.span>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-5 shadow-lg mt-3`}>
                    <s.icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>

                  {/* Expanded detail on hover */}
                  <motion.div
                    initial={false}
                    animate={{ height: isActive ? 'auto' : 0, opacity: isActive ? 1 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className={`text-xs ${s.textColor} font-medium mt-3 leading-relaxed`}>{s.detail}</p>
                  </motion.div>

                  {/* Bottom CTA hint */}
                  <motion.div
                    animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center gap-1 mt-4"
                  >
                    <span className={`text-xs font-semibold ${s.textColor}`}>Start now</span>
                    <ArrowRight className={`w-3 h-3 ${s.textColor}`} />
                  </motion.div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            to="/kindlearn/select-language"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-accent text-white font-semibold px-8 py-3.5 rounded-2xl shadow-lg shadow-primary/25 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            Start Your Journey <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}