import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft, Shield } from 'lucide-react';

export default function KidsNav() {
  return (
    <nav className="bg-gradient-to-r from-violet-500 via-pink-500 to-amber-400 p-1">
      <div className="bg-white/90 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/kindlearn" className="flex items-center gap-2 text-violet-700">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-fredoka font-semibold text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="font-fredoka font-bold text-lg bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">
              KindLearn Kids
            </span>
            <Sparkles className="w-5 h-5 text-pink-500" />
          </div>
          <Link to="/kindlearn/parent-settings" className="flex items-center gap-1.5 text-violet-600 hover:text-violet-800 transition-colors">
            <Shield className="w-4 h-4" />
            <span className="font-fredoka font-semibold text-sm">Parents</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}