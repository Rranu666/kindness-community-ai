import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LanguageSwitcher from '@/kindlearn/components/ui/LanguageSwitcher';
import NotificationCenter from '@/kindlearn/components/notifications/NotificationCenter';
import { useUILanguage } from '@/kindlearn/lib/UILanguageContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useUILanguage();

  // Hide navbar when running inside the Capacitor native app
  if (typeof window !== 'undefined' && window.Capacitor) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/kindlearn" className="flex items-center gap-2.5">
          <img src="/kindlearn-logo.png" alt="KindLearn logo" className="w-9 h-9 rounded-xl shadow-md" width="36" height="36" />
          <span className="font-extrabold text-xl tracking-tight">KindLearn</span>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          <Link to="/kindlearn/select-language" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t.nav_challenge}
          </Link>
          <Link to="/kindlearn/kids" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {t.nav_kids}
          </Link>
          <Link to="/kindlearn/help" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Help
          </Link>
          <LanguageSwitcher />
          <NotificationCenter />
          <Link to="/kindlearn/profile" className="p-2 hover:bg-secondary rounded-lg transition-colors">
            <User className="w-5 h-5" />
          </Link>
          <Link to="/kindlearn/select-language">
            <Button className="rounded-xl font-semibold shadow-sm">{t.nav_start}</Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t bg-background overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <Link to="/kindlearn/select-language" onClick={() => setOpen(false)} className="block text-foreground font-medium py-2">
                {t.nav_challenge}
              </Link>
              <Link to="/kindlearn/kids" onClick={() => setOpen(false)} className="block text-foreground font-medium py-2">
                {t.nav_kids}
              </Link>
              <Link to="/kindlearn/help" onClick={() => setOpen(false)} className="block text-foreground font-medium py-2">
                Help
              </Link>
              <div className="py-1"><LanguageSwitcher /></div>
              <Link to="/kindlearn/select-language" onClick={() => setOpen(false)}>
                <Button className="w-full rounded-xl font-semibold">{t.nav_start}</Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}