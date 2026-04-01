import React, { useState, useRef, useEffect } from 'react';
import { useUILanguage } from '@/kindlearn/lib/UILanguageContext';
import { Globe, ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function LanguageSwitcher() {
  const { currentLang, setLanguage, languages } = useUILanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background/80 hover:bg-secondary text-sm font-medium transition-colors"
        aria-label="Switch interface language"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span>{currentLang.flag}</span>
        <span className="hidden sm:inline">{currentLang.nativeLabel}</span>
        <ChevronDown className={`w-3 h-3 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 end-0 w-52 bg-background border border-border rounded-2xl shadow-xl overflow-hidden z-[100]"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-secondary transition-colors text-start ${
                  lang.code === currentLang.code ? 'bg-primary/10 text-primary' : 'text-foreground'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.nativeLabel}</span>
                <span className="ms-auto text-xs text-muted-foreground">{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}