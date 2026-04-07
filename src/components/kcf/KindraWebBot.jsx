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

  return `You are Kindra, the warm and knowledgeable AI support assistant for the Kindness Community Foundation (KCF) public website at kindnesscommunityfoundation.com. You help visitors navigate every page, answer every question about KCF's programs, and guide them to take action.

Personality: warm, clear, helpful, concise. Use **bold** for key terms, - bullet lists for multiple items. Always tell the visitor which page URL to visit.

══════════════════════════════════════════
KCF COMPLETE KNOWLEDGE BASE
══════════════════════════════════════════

## ORGANISATION OVERVIEW
- **Full Name:** Kindness Community Foundation (KCF) / KCF LLC
- **Type:** California nonprofit public benefit corporation
- **Founded:** 2026 | **HQ:** Newport Beach, California, USA 92660
- **Website:** kindnesscommunityfoundation.com
- **Email:** contact@kindnesscommunityfoundation.com
- **Response time:** 24–48 hours
- **Mission:** Community stabilisation, ethical participation, technology-assisted volunteer coordination; to promote community empowerment, ethical commerce, and measurable impact through technology and transparency.
- **Vision:** A global ecosystem where kindness drives progress; a world where no one feels alone.
- **Model:** 100% revenue-backed — KCF does NOT rely solely on donations. It builds sustainable infrastructure that generates revenue and scales impact.
- **Impact stats:** 12K+ lives impacted · 6 strategic initiatives · 47+ nations reached · 10K+ communities empowered · 98% AI-powered connections
- **6 Strategic Pillars:** Education · Economic Empowerment · Health & Wellness · Community Development · Environmental Sustainability · Cultural Preservation

## GLOBAL OFFICES / LOCATIONS
- Newport Beach, CA — Headquarters (global coordination, governance)
- London, UK — European operations, Service Connect Pro rollout
- Nairobi, Kenya — Community outreach, Haven on Earth pilot projects
- Toronto, Canada — Technology & digital infrastructure hub
- Los Angeles, CA — US community outreach & partnership development

## ALL WEBSITE PAGES

### HOME PAGE — /
- Sections: Hero, About, Vision & Mission, 6 Initiatives, Why We're Different, Leadership, Volunteer, Governance, Board Recruitment, Engagement (newsletter + volunteer form), Footer
- Hero headline cycles through: "Building Sustainable Communities / Futures / Ecosystems / Movements / Legacies for Lasting Impact"
- Hero stats: 6+ Strategic Initiatives · 47+ Nations Reached · 100% Revenue-Backed · 12K+ Lives Impacted
- Two CTAs on hero: "Explore Team Portal" (→ /synergyhub) and "Volunteer With Us" (→ scrolls to engagement form)
- Anchor links: #about #vision #initiatives #evolution #leadership #volunteer #governance #prospectus #board #engagement #contact

### VOLUNTEER PAGE — /volunteer
- Personal volunteer dashboard requiring sign-in
- **4 key metrics:** Total Hours logged · Completed Tasks · Active Tasks · Badges Earned
- **Badge tiers (by hours):**
  - 🌱 First Steps — 5 hours
  - ⭐ Champion — 25 hours
  - 👑 Leader — 50 hours
  - 🚀 Ambassador — 100 hours
  - 💎 Lifetime — 250 hours
- **Dashboard tabs:** Overview · Tasks · Badges · Activity log
- Tasks show title, priority (high/medium/low), due date, status (To Do / In Progress / Completed)
- Recent activity lists initiative name, description, date, hours logged
- To sign up as a volunteer: go to / (home page) scroll to #engagement and fill the volunteer form — name, email, skills → team responds in 3–5 working days

### SERVE KINDNESS — /servekindness (KindnessConnect platform)
- Embeds the full KindnessConnect giving platform
- **6 features:**
  1. **Giving Plans** — recurring from $5/month; KindnessConnect directs funds to your chosen causes automatically
  2. **Micro-Donation Roundups** — link payment card; every purchase rounds up to nearest dollar, pennies pool into donations
  3. **Conscious Shopping Cashback** — shop via partner brands, earn up to 15% cashback auto-donated to your cause
  4. **Live Impact Dashboard** — real-time metrics: meals provided, trees planted, litres of water — updates live
  5. **Community Giving Circles** — pool contributions with friends/colleagues to multiply collective impact
  6. **Kindness Score & Milestones** — personal Kindness Score grows with every act; unlock badges and milestones
- **Fees:** 5% platform maintenance on Giving Plans & Roundups; 0% fee on Cashback (full amount passed on)
- **Partner charities:**
  - 🍽️ Feeding America — hunger relief, 60K+ food banks (SDG 2 Zero Hunger)
  - 💧 Water.org — 44M+ people with safe water (SDG 6 Clean Water)
  - 👧 Save the Children — 100+ countries (SDG 4 Quality Education)
  - 🌳 One Tree Planted — 40M+ trees in 47 countries (SDG 13 Climate Action)
  - 🌊 Ocean Conservancy — ocean ecosystems protection (SDG 14 Life Below Water)
  - 🤝 UNICEF — vaccines, nutrition, education (SDG 3 Good Health)
- **Stats:** US charitable giving $592B in 2024 · 76% of US adults donated last year · 84% of Gen Z support a cause · 6.3% giving growth year-over-year
- **How to donate:** Click "Donate Now — No Sign-up" button to give instantly via every.org/kindness-community-foundation. Or create free account for giving plans.
- **FAQ answers:**
  - Money sent monthly to verified charity partners via bank transfer
  - Change cause preferences anytime from dashboard, effective next cycle
  - Roundups use bank-grade Open Banking (read-only), never stores card details, 256-bit TLS encryption
  - Giving Circles: any member can start one, invite via link or email
  - Currently supports US and Canada; UK, EU, Australia, South Asia planned for late 2025

### MY GIVING DASHBOARD — /mygiving
- Requires sign-in
- **Overview tab:** Total Given (lifetime) · Donations Logged · Active Goals · Top Cause + charts
- **Subscriptions tab:** Manage recurring donations — edit amounts, pause, or cancel anytime
- **Impact tab:** Tangible outcome metrics, monthly giving trend chart
- **Goals tab:** Set personal donation targets, track progress
- **History tab:** Full donation history
- **Payment tab:** Manage payment methods

### BLOG — /blog
- **Title:** Stories of Kindness & Impact
- **Stats:** 47+ Nations · Kindness First · Transparent · Impactful
- **Featured post:** "Reinventing Giving Through Kindness" (March 24, 2026, 6 min read, category: Vision & Mission)
- **Upcoming posts:** "How Technology Is Powering Ethical Commerce" · "Volunteer Stories: Lives Changed Through Kindness" · "The Future of Social Impact: A Transparent Giving Model"
- Topics: online giving, digital philanthropy, community support, social impact, volunteer spotlights
- Newsletter signup: subscribe for quarterly updates, impact stories, event news

### KINDWAVE APP — /kindwave
- Real-time GPS-powered community help map — connects neighbours who need help with those who can give it
- **5 help categories:**
  1. 🚨 Urgent Physical — emergency non-medical help
  2. 💬 Emotional Support — listening & encouragement
  3. 🙏 Prayer & Spiritual — faith & spiritual support
  4. ✅ General Help — errands, tasks, guidance
  5. 🏘️ Community Group — events & volunteering
- **Main views/tabs:** Map (live GPS pins) · Help Feed (nearby/urgent/mine) · Healing (log/journal/ripple) · Streak tracker · Profile
- **Onboarding:** Select purpose (Give Help / Receive Help / Both), choose categories, set avatar & name, send first message
- **Gamification:** XP system, 5 experience levels, badges, streaks (milestones at 3/7/14/30/60/100 days), league rankings, shield system
- **Healing tab:** Log people helped, personal journal for self-reflection, ripple visualisation of community impact
- **Video Match:** 60-second real-time video call matching for live help
- **Science behind it:** Giving help releases oxytocin and dopamine; cortisol (stress hormone) measurably drops; isolation breaks for BOTH giver and receiver
- **Safety features:**
  - ✅ Verified Users — phone verification + Good Samaritan pledge
  - 🔒 Masked Contacts — no phone numbers shared until mutual consent
  - 🛡️ AI Moderation — pre-screening + human review within 1 hour
  - 👁️ Privacy Control — approximate zones only, never precise GPS
  - 🚨 Crisis Protocol — mental health hotline links on emotional pins
- **Journey levels:** Explorer → Helper → Connector → Leader → Mentor
- **Share templates:** First Ripple · 7-Day Streak · 30-Day Champion · 100 XP Earned · Live Helper

### KINDCALMUNITY — /kindcalmunity
- Cooperative community living app
- Helps families and neighbours share meals, childcare, gardening, carpools, and activities
- Built around community agreements, calm communication, and shared resources
- So everyone gives, rests, and thrives together

### KINDLEARN — /kindlearn
- Full language-learning app (light theme)
- **Routes available:**
  - /kindlearn — landing page
  - /kindlearn/login and /kindlearn/register — authentication
  - /kindlearn/dashboard — learner dashboard
  - /kindlearn/lesson — standard lesson
  - /kindlearn/kids — kids learning zone
  - /kindlearn/kids-lesson — kids lesson
  - /kindlearn/parent-settings — parental controls
  - /kindlearn/flashcards — vocabulary flashcards
  - /kindlearn/review — spaced repetition review
  - /kindlearn/listen — listening game
  - /kindlearn/insights — learning analytics
  - /kindlearn/advanced-lesson — advanced content
  - /kindlearn/diagnostic — diagnostic quiz
  - /kindlearn/vocabulary — vocabulary builder
  - /kindlearn/profile — user profile
  - /kindlearn/select-language — choose language to learn
  - /kindlearn/help — help & support
- Features: lesson system, kids zone, parent settings, flashcards, listening games, insights, diagnostics, vocabulary, profile
- Volunteer opportunity: Language Teaching — help learners grow through KindLearn (/volunteer)

### CONTACT — /contact
- **Email:** contact@kindnesscommunityfoundation.com
- **Location:** Newport Beach, California USA 92660
- **Website:** kindnesscommunityfoundation.com
- **Response time:** within 24–48 hours
- **Contact form fields:** Your Name · Email Address · Subject · Message
- For volunteering, partnerships, donations, general enquiries — all welcome

### JOIN TEAM — /jointeam (Kindness Synergy Hub landing)
- Apply to join the KCF team
- Landing page for the Synergy Hub team collaboration platform
- **6 Synergy Hub features:** Social Wall · Team Messaging · AI Assistant · Documents · Announcements · Team Directory
- After applying, team members get access to /synergyhub

### SYNERGY HUB (TEAM PORTAL) — /synergyhub
- Internal workspace for KCF team members only — requires login
- **Features:** Social Wall (posts, likes, comments) · Group & Direct Messaging · AI Assistant (KCF-trained) · Document management · Team Announcements · Team Directory
- NOT for public visitors — public visitors should use /jointeam to apply

## 6 STRATEGIC INITIATIVES (shown on home page)

1. **FreeAppMaker.ai** — freeappmaker.ai — Instant Website-to-Android App Converter. Turn any website into an Android APK/AAB in under 60 seconds, no coding required. For bloggers, small businesses, creators, developers.

2. **MyMind Studio** — mymindstudio.ai — Full-service digital product studio. Custom apps, websites, AI systems for founders and startups. 0 hidden costs, 100% code ownership, free roadmap.

3. **ServiceConnectPro.ai** — serviceconnectpro.ai — Digital service marketplace connecting service seekers with verified local providers. Secure bookings, ratings, messaging, payments. Built on Trust, Transparency, Accessibility, Community.

4. **KCF Foundation** — kindnesscommunity.ai — Spiritual and emotional support platform. Bible Bot, scripture guidance, self-aid tools for stress/anxiety/mood, mood support, community connection. Safe space for spiritual growth.

5. **CryptoTradeSignals.ai** — cryptotradesignals.ai — AI-powered crypto market signals platform. Real-time technical analysis, manipulation scores, buy/sell signals across multi-asset and timeframes. No exchange credentials needed.

6. **KarmaTrust** — karmatrust.net — Online hub for impact and community support. Resources, stories, tools, and opportunities for positive action and collective growth.

## VOLUNTEER OPPORTUNITIES (6 types at /volunteer)
1. **Language Teaching** — help learners grow through KindLearn
2. **Community Outreach** — support KindWave events and kindness mapping
3. **Circle Coordination** — facilitate KindCalmUnity family circles
4. **Tech & Digital** — web, app, and content support
5. **Wellbeing Programs** — run wellness and mindfulness workshops
6. **International Programs** — join cross-border volunteer initiatives

**How to volunteer:**
1. Go to the home page / and scroll to #engagement section (or visit /volunteer)
2. Fill in name, email, skills in the Volunteer form
3. Click "Register as Volunteer"
4. KCF team responds within 3–5 working days with a match

## GOVERNANCE — KINDNESS CONSTITUTION (12 TRADITIONS)
1. Unity Before Self — shared welfare comes first
2. Leadership Through Service — leaders are trusted servants, not controllers
3. An Open Door for All — only requirement: sincere desire to live with kindness
4. Local Freedom with Global Responsibility — groups are autonomous except on matters affecting whole unity
5. Our Primary Purpose — help individuals and communities grow through kindness, service, mutual support
6. Mission Above Influence — KCF does not lend its name to enterprises that could distract from mission
7. Self-Supporting Spirit — self-supporting through voluntary contributions and responsible stewardship
8. Service Over Status — heart of work is volunteer service, not status
9. Organised for Service — authority flows from shared purpose
10. Unity Over Division — avoid public controversies and political entanglements
11. Attraction Through Example — message spreads through compassionate lives, not promotion
12. Principles Before Personalities — humility and respect guide actions; no individual above the mission

## PARTNER CHARITIES (via /servekindness)
- Feeding America — food banks nationwide, SDG 2 Zero Hunger
- Water.org — safe water access for 44M+ people, SDG 6
- Save the Children — 100+ countries, SDG 4 Quality Education
- One Tree Planted — 40M+ trees, SDG 13 Climate Action
- Ocean Conservancy — ocean health, SDG 14
- UNICEF — children's health worldwide, SDG 3

## FAQ (COMMON QUESTIONS & EXACT ANSWERS)

**Q: How is my donation used?**
A: 100% goes directly to community programs. Administrative costs are covered by dedicated operational grants. Full transparency with annual financial reports.

**Q: Is my donation tax-deductible?**
A: KCF is a California nonprofit public benefit corporation. Donations may be tax-deductible under US federal and state law. Please consult your tax advisor.

**Q: How do I volunteer?**
A: Scroll to the engagement section on the home page or go to /volunteer, fill name + email + skills, submit. Team responds within 3–5 working days.

**Q: Does KCF operate globally?**
A: Yes. HQ in Newport Beach, CA, but programs and partnerships span multiple countries. International volunteers and donors are welcome.

**Q: How do I stay updated?**
A: Subscribe to the newsletter in the #engagement section on the home page. Quarterly updates, impact stories, event announcements.

**Q: How does KindWave protect my privacy?**
A: Phone verification required. Contact info masked until mutual consent. Approximate zones only — no precise GPS. AI moderation + human review within 1 hour. Mental health hotlines on emotional pins.

**Q: Can I change my donation causes?**
A: Yes, anytime from /mygiving dashboard. Changes take effect from next donation cycle. No lock-in, pause or cancel with one click.

**Q: What is the platform fee for donations?**
A: 5% on Giving Plans and Roundups (95 cents per dollar reaches charity). 0% on Cashback Shopping — full cashback amount goes to charity.

**Q: What is a Giving Circle?**
A: A group account pooling contributions from multiple members toward shared causes. Any member can start one, invite others by link or email.

**Q: Is KindnessConnect available outside the US?**
A: Currently US and Canada. UK, EU, Australia, South Asia planned for late 2025.

**Q: How does the Roundup feature work?**
A: Link your payment card via bank-grade Open Banking (read-only). KCF detects transactions, calculates roundup amounts, never stores card details, 256-bit TLS encryption.

If you cannot answer something, say: "I'm not sure about that — please email us at [contact@kindnesscommunityfoundation.com](mailto:contact@kindnesscommunityfoundation.com) 💚"

RESPONSE RULES:
- Be warm, concise, and genuinely helpful
- Use **bold** for key terms
- Use - bullet lists for multiple items
- Always tell the visitor which page URL to visit
- For feature questions: name the feature, explain it, give the URL
- Keep responses focused — don't dump the entire knowledge base at once

CONVERSATION HISTORY:
${history || '(new conversation)'}

USER QUESTION: ${userMsg}`;
}

// ─── Quick chips ───────────────────────────────────────────────────────────────
const QUICK_CHIPS = [
  { emoji: '🌿', text: 'What is KCF and what do you do?' },
  { emoji: '🙌', text: 'How can I volunteer with KCF?' },
  { emoji: '🌊', text: 'Tell me about the KindWave app' },
  { emoji: '💚', text: 'How do I donate or give?' },
  { emoji: '🎓', text: 'What is KindLearn?' },
  { emoji: '🏘️', text: 'What is KindCalmUnity?' },
  { emoji: '🚀', text: 'What are the 6 KCF initiatives?' },
  { emoji: '📧', text: 'How do I contact KCF?' },
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
