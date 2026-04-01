import React from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="border-t bg-secondary/20 py-10 md:py-14 px-4 md:px-6">
      <div className="container mx-auto max-w-5xl">
        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-2 mb-3">
              <img src="/kindlearn-logo.png" alt="KindLearn logo" className="w-9 h-9 rounded-xl shadow-md" width="36" height="36" loading="lazy" />
              <span className="font-extrabold text-xl tracking-tight">KindLearn</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed italic">
              "Where kind minds grow into bright futures."
            </p>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              An interactive, game-driven language learning platform that transforms screen time into meaningful skill-building through a structured 30-Day Challenge and a vibrant, play-based experience designed especially for kids.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-foreground">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/kindlearn/select-language" className="hover:text-foreground transition-colors">30-Day Challenge</Link></li>
              <li><Link to="/kindlearn/kids" className="hover:text-foreground transition-colors">Kids Zone</Link></li>
              <li><Link to="/kindlearn/help" className="hover:text-foreground transition-colors">Help</Link></li>
              <li><Link to="/kindlearn/select-language" className="hover:text-foreground transition-colors">Get Started</Link></li>
            </ul>
          </div>

          {/* About KCF */}
          <div className="max-w-xs">
            <h4 className="font-semibold text-sm mb-3 text-foreground">About</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Developed by <span className="font-medium text-foreground">KCF LLC</span> under the{' '}
              <span className="font-medium text-foreground">Kindness Community Foundation</span>,
              California, USA — serving learners worldwide.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-center md:justify-between gap-3 text-sm text-muted-foreground text-center md:text-left">
          <p>© 2026 KCF LLC · Kindness Community Foundation · All rights reserved.</p>
          <p className="flex items-center gap-1 justify-center">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for our community
          </p>
        </div>
      </div>
    </footer>
  );
}