/**
 * KindraWebBot — Public website AI support bot.
 * Floating emerald "K" button on every public page.
 * Features: quick chips, voice input, typing indicator, minimize, reset, markdown, support fallback.
 */
import { useState, useRef, useEffect } from 'react';
import { X, Send, Minus, RefreshCw, Mic, MicOff, Copy, Check, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { KindraAvatar } from '@/components/synergy/AskKindra';

// ─── Markdown renderer ─────────────────────────────────────────────────────────
function InlineText({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\))/g);
  const out = [];
  let i = 0;
  while (i < parts.length) {
    const p = parts[i];
    if (!p) { i++; continue; }
    if (p.startsWith('**') && p.endsWith('**')) {
      out.push(<strong key={i} className="text-white font-semibold">{p.slice(2, -2)}</strong>);
    } else if (p.startsWith('[')) {
      // markdown link [text](url)
      const m = p.match(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/);
      if (m) {
        out.push(
          <a key={i} href={m[2]} className="text-emerald-400 underline hover:text-emerald-300"
            onClick={e => e.stopPropagation()}>{m[1]}</a>
        );
      } else {
        out.push(<span key={i}>{p}</span>);
      }
    } else if (p.startsWith('mailto:') || (parts[i - 1] && parts[i - 1].includes('@'))) {
      out.push(<span key={i}>{p}</span>);
    } else {
      out.push(<span key={i}>{p}</span>);
    }
    i++;
  }
  return <span>{out}</span>;
}

function BotMarkdown({ text }) {
  // Handle mailto links like contact@kindness...
  const processedText = text.replace(
    /\[([^\]]+)\]\(mailto:([^)]+)\)/g,
    (_, label, email) => `[${label}](mailto:${email})`
  );

  const lines = processedText.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.match(/^[-•*]\s/)) {
      const items = [];
      while (i < lines.length && lines[i].match(/^[-•*]\s/)) {
        items.push(lines[i].replace(/^[-•*]\s/, ''));
        i++;
      }
      out.push(
        <ul key={`ul-${i}`} className="space-y-1 my-1.5 ml-0.5">
          {items.map((item, j) => (
            <li key={j} className="flex items-start gap-2">
              <span className="text-emerald-400 text-[10px] mt-[5px] flex-shrink-0">▸</span>
              <span className="flex-1 text-xs leading-relaxed"><InlineText text={item} /></span>
            </li>
          ))}
        </ul>
      );
    } else if (line.trim() === '') {
      out.push(<div key={`g-${i}`} className="h-1" />);
      i++;
    } else {
      out.push(
        <p key={`p-${i}`} className="text-xs leading-relaxed">
          <InlineText text={line} />
        </p>
      );
      i++;
    }
  }
  return <div className="space-y-0.5">{out}</div>;
}

// ─── AI prompt builder ─────────────────────────────────────────────────────────
function buildPublicBotPrompt(messages, userMsg) {
  const history = messages
    .filter(m => m.id !== 'greeting')
    .slice(-8)
    .map(m => m.role === 'user' ? `Visitor: ${m.text}` : `Kindra: ${m.text}`)
    .join('\n');

  return `You are Kindra, the friendly AI support assistant on the Kindness Community Foundation (KCF) public website. You help visitors navigate the site, learn about KCF's features, and get support.

Personality: warm, clear, helpful, concise. Use **bold** for key terms and - bullet lists for steps or multiple items. Always mention the relevant page path so visitors know where to go.

KCF KNOWLEDGE BASE:

ORGANISATION:
- Mission: Community stabilization, ethical participation, technology-assisted volunteer coordination. California-based nonprofit.
- 6 Pillars: Education, Economic Empowerment, Health & Wellness, Community Development, Environmental Sustainability, Cultural Preservation
- Governance: 12-traditions Kindness Constitution, transparent board
- Contact: contact@kindnesscommunityfoundation.com | Newport Beach, California
- Partner charities: Feeding America, Water.org, Save the Children, One Tree Planted, Ocean Conservancy, UNICEF

PAGES:
- Home (/) — mission overview, pillars, stats, team portal CTA
- Volunteer (/volunteer) — sign up, log hours, earn badges: First Steps (5h) → Champion (25h) → Leader (50h) → Ambassador (100h) → Lifetime (250h+)
- Serve Kindness (/servekindness) — KindnessConnect giving plans ($5/mo), micro-donation roundups, 15% cashback on conscious shopping. Fee: 5% on plans/roundups, 0% on cashback
- My Giving (/mygiving) — personal donation dashboard, giving history, goals
- Blog (/blog) — community stories, news, impact updates
- Contact (/contact) — contact form, email, location
- Join Team (/jointeam) — apply to join KCF staff or team
- Synergy Hub (/synergyhub) — internal team portal (members only)

KINDLEARN (/kindlearn):
- Free gamified language-learning app built by KCF — 100% free, no subscription
- Languages: Spanish, French, German, Japanese, Korean, Italian, Portuguese, Mandarin
- How it works: Select a language → take a short diagnostic quiz (or skip) → get a personalised 30-day challenge dashboard
- Daily Path: each day shows a Lesson card, Flashcard review, Listening Game, and Vocabulary review
- Kids Zone: a separate child-friendly mode with pronunciation challenges, animations, and simpler vocabulary
- Lessons: AI-generated daily lessons with vocabulary, phrases, grammar tips and pronunciation
- Flashcards: spaced-repetition cards to memorise vocabulary
- Listening Game: listen to a word/phrase and identify the correct answer
- Streaks & XP: earn XP and maintain daily streaks to stay motivated
- Progress tracking: dashboard shows streak, daily goal, lessons completed, XP earned
- Notifications: in-app reminders to keep the streak going
- To start: visit /kindlearn → choose a language → begin learning for free

KINDWAVE (/kindwave):
- Mobile-first community kindness map app
- Features: see live pins of kindness acts near you, post help requests, offer help to neighbours, connect with people doing good in your community
- Goal: make everyday kindness visible and actionable on a map
- Real-time: acts of kindness appear as live pins on an interactive map
- How to use: visit /kindwave to learn more and download/access the app

KINDCALMUNITY (/kindcalmunity):
- Cooperative community living platform
- Features: shared meal planning, childcare coordination, community gardening, carpools with fair rotation, shared resources
- Philosophy: calm communication, community agreements, ethical resource sharing
- Goal: help neighbours live cooperatively and sustainably together
- How to use: visit /kindcalmunity to learn more and get started

If you cannot answer, say: "I'm not sure about that — please email us at contact@kindnesscommunityfoundation.com 💚"

RESPONSE RULES: Be warm, concise and useful. Use **bold** for key terms. Use - bullet lists for multiple items. Always tell the visitor which page to visit.

CONVERSATION HISTORY:
${history || '(new conversation)'}

USER QUESTION: ${userMsg}`;
}

// ─── Quick chips ───────────────────────────────────────────────────────────────
const QUICK_CHIPS = [
  { emoji: '🌿', text: 'What is KCF and what do you do?' },
  { emoji: '🌍', text: 'Tell me about KindLearn' },
  { emoji: '📱', text: 'Tell me about the KindWave app' },
  { emoji: '🏡', text: 'What is KindCalmUnity?' },
  { emoji: '🙌', text: 'How can I volunteer with KCF?' },
  { emoji: '💚', text: 'How do I make a donation?' },
];

// ─── Greeting ─────────────────────────────────────────────────────────────────
const GREETING = `Hi there! 👋 I'm **Kindra** — KCF's AI support assistant.

I'm here 24/7 to help you:
- **Navigate** the KCF website
- **Learn** about our mission and programs
- **Find** volunteer & giving opportunities
- **Get answers** about KindWave, KindCalmUnity & more

What can I help you with today? 💚`;

// ─── Copy button ──────────────────────────────────────────────────────────────
function CopyBtn({ msgId, text, copied, onCopy }) {
  return (
    <button onClick={() => onCopy(msgId, text)}
      className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-all hover:bg-white/10"
      title="Copy">
      {copied === msgId
        ? <Check className="w-2.5 h-2.5 text-emerald-400" />
        : <Copy className="w-2.5 h-2.5 text-white/30 hover:text-white/60" />}
    </button>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────
export default function KindraWebBot() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: GREETING, id: 'greeting', ts: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [unread, setUnread] = useState(0);
  const [copied, setCopied] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const recRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open, minimized]);

  // Focus input when opening
  useEffect(() => {
    if (open && !minimized) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [open, minimized]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    setInput('');

    const userMsg = { role: 'user', text: msg, id: Date.now(), ts: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const res = await base44.integrations.Core.InvokeLLM({
        prompt: buildPublicBotPrompt([...messages, userMsg], msg)
      });
      let reply = (typeof res === 'string' ? res : res?.result || res?.response)
        || "I'm having trouble right now — please try again or email us at contact@kindnesscommunityfoundation.com 💚";

      // Support fallback: append email link if bot expresses uncertainty
      const uncertain = /not sure|don't know|can't find|unable to|I don't have|no information/i.test(reply);
      if (uncertain && !reply.includes('contact@')) {
        reply += '\n\n📧 **Need more help?** Email us: [contact@kindnesscommunityfoundation.com](mailto:contact@kindnesscommunityfoundation.com)';
      }

      setMessages(prev => [...prev, { role: 'bot', text: reply, id: Date.now() + 1, ts: Date.now() + 1 }]);
      if (!open || minimized) setUnread(n => n + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Something went wrong — please try again or email [contact@kindnesscommunityfoundation.com](mailto:contact@kindnesscommunityfoundation.com) 💚',
        id: Date.now() + 1,
        ts: Date.now() + 1
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  };

  const reset = () => {
    setMessages([{ role: 'bot', text: GREETING, id: 'greeting', ts: Date.now() }]);
    setInput('');
    setUnread(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const copyMsg = (id, text) => {
    navigator.clipboard.writeText(text.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1'));
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  // ── Voice input ──────────────────────────────────────────────────────────────
  const hasVoice = typeof window !== 'undefined' &&
    !!(window.SpeechRecognition || window.webkitSpeechRecognition);

  const toggleVoice = () => {
    if (listening) {
      recRef.current?.stop();
      setListening(false);
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.lang = 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(prev => (prev ? prev + ' ' : '') + transcript);
      setListening(false);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
    recRef.current = rec;
    setListening(true);
  };

  const hasChat = messages.length > 1;

  return (
    <>
      <style>{`
        @keyframes kw-ring {
          0%   { box-shadow: 0 8px 30px rgba(16,185,129,0.45), 0 0 0 0   rgba(16,185,129,0.55); }
          70%  { box-shadow: 0 8px 30px rgba(16,185,129,0.45), 0 0 0 18px rgba(16,185,129,0);   }
          100% { box-shadow: 0 8px 30px rgba(16,185,129,0.45), 0 0 0 0   rgba(16,185,129,0);    }
        }
        @keyframes kw-in {
          from { opacity:0; transform:translateY(18px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes kw-dot {
          0%,60%,100% { transform:translateY(0); }
          30%          { transform:translateY(-6px); }
        }
        @keyframes kw-pulse {
          0%,100% { opacity:1; box-shadow:0 0 0 0 rgba(16,185,129,0.5); }
          50%     { opacity:0.8; box-shadow:0 0 0 6px rgba(16,185,129,0); }
        }
        @keyframes kw-mic {
          0%,100% { box-shadow:0 0 0 0   rgba(16,185,129,0.6); }
          50%     { box-shadow:0 0 0 8px rgba(16,185,129,0);   }
        }
        .kw-panel { animation: kw-in 0.26s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .kw-trigger-ring { animation: kw-ring 3s ease-in-out infinite; }
      `}</style>

      {/* ── Chat Panel ── */}
      {open && (
        <div
          className="kw-panel fixed z-[9990] flex flex-col overflow-hidden"
          style={{
            bottom: 88,
            right: 24,
            width: 'min(390px, calc(100vw - 32px))',
            height: minimized ? 'auto' : 540,
            background: 'rgba(3,7,18,0.97)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 20,
            boxShadow: '0 28px 90px rgba(0,0,0,0.75), 0 0 0 1px rgba(16,185,129,0.07), 0 0 50px rgba(16,185,129,0.07)',
            backdropFilter: 'blur(28px)',
          }}
        >
          {/* Aurora glow (decorative) */}
          {!minimized && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[20px]">
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-[0.06]"
                style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }} />
              <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full opacity-[0.04]"
                style={{ background: 'radial-gradient(circle, #059669, transparent 70%)' }} />
            </div>
          )}

          {/* ── Panel Header ── */}
          <div
            className="relative z-10 flex items-center gap-3 px-4 py-3 flex-shrink-0 cursor-pointer select-none"
            style={{ borderBottom: minimized ? 'none' : '1px solid rgba(16,185,129,0.1)', background: 'rgba(0,0,0,0.3)' }}
            onClick={() => minimized && setMinimized(false)}
          >
            <KindraAvatar size={32} glow />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">Kindra</span>
                <span
                  className="flex items-center gap-1 text-[9px] font-bold text-emerald-400"
                  style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.22)', borderRadius: 99, padding: '1px 6px' }}
                >
                  <span className="w-1 h-1 rounded-full bg-emerald-400" style={{ animation: 'kw-pulse 2s infinite' }} />
                  LIVE
                </span>
              </div>
              <p className="text-[10px] text-white/30 truncate">KCF AI Support · Always here for you</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {hasChat && !minimized && (
                <button
                  onClick={(e) => { e.stopPropagation(); reset(); }}
                  title="New chat"
                  className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); setMinimized(m => !m); }}
                title={minimized ? 'Expand' : 'Minimize'}
                className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false); setMinimized(false); }}
                title="Close"
                className="p-1.5 rounded-lg text-white/30 hover:text-white/60 hover:bg-white/5 transition-all"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── Messages area (hidden when minimized) ── */}
          {!minimized && (
            <>
              <div className="relative z-10 flex-1 overflow-y-auto px-4 py-4 space-y-4"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(16,185,129,0.15) transparent' }}>
                {messages.map(msg => (
                  msg.role === 'user' ? (
                    /* User bubble */
                    <div key={msg.id} className="flex justify-end">
                      <div
                        className="max-w-[83%] px-3.5 py-2.5 rounded-2xl rounded-tr-sm text-xs text-white leading-relaxed"
                        style={{ background: 'linear-gradient(135deg, #059669, #10b981)', boxShadow: '0 3px 14px rgba(16,185,129,0.22)' }}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ) : (
                    /* Bot bubble */
                    <div key={msg.id} className="flex items-start gap-2.5 group">
                      <KindraAvatar size={26} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wide">Kindra</span>
                          <CopyBtn msgId={msg.id} text={msg.text} copied={copied} onCopy={copyMsg} />
                        </div>
                        <div
                          className="px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-white/75"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                        >
                          <BotMarkdown text={msg.text} />
                        </div>
                      </div>
                    </div>
                  )
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex items-start gap-2.5">
                    <KindraAvatar size={26} />
                    <div
                      className="flex items-center gap-1.5 px-4 py-3 rounded-2xl rounded-tl-sm"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      {[0, 1, 2].map(i => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-emerald-400/70"
                          style={{ animation: `kw-dot 1.2s ease-in-out ${i * 0.18}s infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* ── Quick chips (only before any user message) ── */}
              {!hasChat && (
                <div
                  className="relative z-10 flex-shrink-0 px-4 pb-2"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
                >
                  <p className="text-[9px] text-white/20 uppercase tracking-widest text-center py-2">
                    Quick questions
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                    {QUICK_CHIPS.map((chip, i) => (
                      <button
                        key={i}
                        onClick={() => send(chip.text)}
                        disabled={loading}
                        className="flex-shrink-0 flex items-center gap-1.5 text-[10px] text-white/50 hover:text-white/80 px-3 py-2 rounded-xl transition-all whitespace-nowrap disabled:opacity-30"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'}
                        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
                      >
                        <span>{chip.emoji}</span>
                        <span>{chip.text.split(' ').slice(0, 4).join(' ')}…</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Input bar ── */}
              <div
                className="relative z-10 flex-shrink-0 px-4 pb-4 pt-2"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div
                  className="flex items-center gap-2 rounded-2xl px-3 py-2 transition-all"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={() => {}}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
                    disabled={loading}
                    placeholder={listening ? '🎙️ Listening…' : 'Ask me anything…'}
                    className="flex-1 bg-transparent border-none outline-none text-xs text-white/80 placeholder-white/25 disabled:opacity-40 min-w-0"
                  />

                  {/* Mic button */}
                  {hasVoice && (
                    <button
                      onClick={toggleVoice}
                      disabled={loading}
                      title={listening ? 'Stop listening' : 'Voice input'}
                      className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-xl transition-all disabled:opacity-30"
                      style={{
                        background: listening ? 'rgba(16,185,129,0.25)' : 'rgba(255,255,255,0.05)',
                        border: listening ? '1px solid rgba(16,185,129,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        animation: listening ? 'kw-mic 1.2s ease-in-out infinite' : 'none',
                      }}
                    >
                      {listening
                        ? <MicOff className="w-3 h-3 text-emerald-400" />
                        : <Mic className="w-3 h-3 text-white/40" />
                      }
                    </button>
                  )}

                  {/* Send button */}
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-xl disabled:opacity-25 transition-all hover:scale-105 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}
                  >
                    <Send className="w-3 h-3 text-white" />
                  </button>
                </div>

                <p className="text-center text-[9px] text-white/12 mt-2 flex items-center justify-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-white/15" />
                  <span className="text-white/15">Powered by KCF AI · kindnesscommunityfoundation.com</span>
                </p>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Floating trigger button ── */}
      <button
        onClick={() => {
          if (open && !minimized) {
            setOpen(false);
            setMinimized(false);
          } else {
            setOpen(true);
            setMinimized(false);
            setUnread(0);
          }
        }}
        className="fixed z-[9989] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          bottom: 24,
          right: 24,
          width: 52,
          height: 52,
          borderRadius: 16,
          background: open && !minimized
            ? 'rgba(5,150,105,0.9)'
            : 'linear-gradient(135deg, #059669 0%, #10b981 60%, #34d399 100%)',
          boxShadow: open && !minimized
            ? '0 4px 20px rgba(16,185,129,0.3)'
            : undefined,
        }}
        title="Ask Kindra — KCF Support"
      >
        <span
          className={open && !minimized ? '' : 'kw-trigger-ring'}
          style={{
            position: 'absolute', inset: 0, borderRadius: 16,
            display: open && !minimized ? 'none' : 'block',
          }}
        />
        {open && !minimized
          ? <X className="w-5 h-5 text-white relative z-10" />
          : <span className="font-black text-white text-lg select-none relative z-10" style={{ fontFamily: "'Syne', sans-serif" }}>K</span>
        }

        {/* Unread badge */}
        {unread > 0 && !(open && !minimized) && (
          <span
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center"
            style={{ border: '2px solid #030712' }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
    </>
  );
}
