import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LANGUAGES } from '@/kindlearn/lib/languages';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Zap } from 'lucide-react';
import Navbar from '../components/landing/Navbar';
import { useUILanguage } from '@/kindlearn/lib/UILanguageContext';

export default function SelectLanguage() {
  const navigate = useNavigate();
  const { t } = useUILanguage();

  const [selectedLang, setSelectedLang] = React.useState(null);

  const handleSelect = (langId) => {
    setSelectedLang(langId);
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 kl-page-body pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <Link to="/kindlearn">
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold">
              {t.select_title}
            </h1>
            <p className="text-lg text-muted-foreground mt-4">
              {t.select_sub}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {LANGUAGES.map((lang, i) => (
              <motion.button
                key={lang.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(lang.id)}
                className={`group relative bg-card rounded-2xl border p-6 transition-all duration-300 text-center ${
                  selectedLang === lang.id
                    ? 'border-primary shadow-lg shadow-primary/20 -translate-y-1'
                    : 'hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1'
                }`}
              >
                <span className="text-5xl block mb-3">{lang.flag}</span>
                <h3 className="font-bold text-lg">{lang.name}</h3>
                <p className="text-sm text-muted-foreground">{lang.native}</p>
                <p className="text-xs text-primary font-medium mt-2">{lang.learners} learners</p>
              </motion.button>
            ))}
          </div>

          {selectedLang && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-center mt-8"
            >
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(`/kindlearn/dashboard?lang=${selectedLang}`)}
                className="h-12 px-8 rounded-xl font-semibold"
              >
                Skip Assessment
              </Button>
              <Button
                size="lg"
                onClick={() => navigate(`/kindlearn/diagnostic?lang=${selectedLang}`)}
                className="h-12 px-8 rounded-xl font-semibold"
              >
                <Zap className="w-4 h-4 mr-2" />
                Take Level Quiz
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}