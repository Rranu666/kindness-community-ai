/**
 * base44Client.js — Supabase compatibility shim
 *
 * Exposes the same `base44` object shape the rest of the codebase uses,
 * powered entirely by Supabase.  No imports in components/pages need to change.
 */

import { supabase } from './supabaseClient';

// ── Table name map ────────────────────────────────────────────────────────────
const TABLE_MAP = {
  Analytics:           'analytics',
  ChatGroup:           'chat_groups',
  CommunityStory:      'community_stories',
  Donation:            'donations',
  GivingGoal:          'giving_goals',
  MessageAttachment:   'message_attachments',
  Notification:        'notifications',
  SocialComment:       'social_comments',
  SocialPost:          'social_posts',
  Subscription:        'subscriptions',
  TaskAttachment:      'task_attachments',
  TeamAnnouncement:    'team_announcements',
  TeamDocument:        'team_documents',
  TeamMember:          'team_members',
  TeamMessage:         'team_messages',
  TeamTask:            'team_tasks',
  User:                'profiles',
  VolunteerBadge:      'volunteer_badges',
  VolunteerHours:      'volunteer_hours',
  VolunteerSignup:     'volunteer_signups',
  VolunteerSubmission: 'volunteer_submissions',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function applyFilter(query, filter) {
  if (!filter || typeof filter !== 'object') return query;
  for (const [key, val] of Object.entries(filter)) {
    if (val && typeof val === 'object' && val.$regex) {
      query = query.ilike(key, `%${val.$regex}%`);
    } else {
      query = query.eq(key, val);
    }
  }
  return query;
}

function applySort(query, sort) {
  if (!sort) return query.order('created_at', { ascending: false });
  const field = sort.startsWith('-') ? sort.slice(1) : sort;
  const ascending = !sort.startsWith('-');
  const colMap = { created_date: 'created_at', updated_date: 'updated_at' };
  const col = colMap[field] || field;
  return query.order(col, { ascending });
}

// ── Entity factory ────────────────────────────────────────────────────────────
function createEntity(tableName) {
  return {
    async list(sort, limit) {
      let q = supabase.from(tableName).select('*');
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async filter(filter, sort, limit) {
      let q = supabase.from(tableName).select('*');
      q = applyFilter(q, filter);
      q = applySort(q, sort);
      if (limit) q = q.limit(limit);
      const { data, error } = await q;
      if (error) throw error;
      return data || [];
    },

    async create(data) {
      const { data: row, error } = await supabase
        .from(tableName)
        .insert(data)
        .select()
        .single();
      if (error) throw error;
      return row;
    },

    async update(id, data) {
      const payload = { ...data };
      // Only add updated_at if the table likely has it (suppress for immutable tables)
      const noUpdatedAt = ['analytics', 'donations', 'community_stories', 'volunteer_hours',
        'volunteer_badges', 'volunteer_signups', 'volunteer_submissions', 'social_comments',
        'message_attachments', 'task_attachments'];
      if (!noUpdatedAt.includes(tableName)) {
        payload.updated_at = new Date().toISOString();
      }
      const { data: row, error } = await supabase
        .from(tableName)
        .update(payload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return row;
    },

    async delete(id) {
      const { error } = await supabase.from(tableName).delete().eq('id', id);
      if (error) throw error;
      return true;
    },

    subscribe(callback) {
      const channel = supabase
        .channel(`${tableName}_changes`)
        .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, callback)
        .subscribe();
      return () => supabase.removeChannel(channel);
    },
  };
}

const entities = Object.fromEntries(
  Object.entries(TABLE_MAP).map(([name, table]) => [name, createEntity(table)])
);

// ── Auth ──────────────────────────────────────────────────────────────────────
const auth = {
  async me() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) throw new Error('Not authenticated');
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    return {
      id: user.id,
      email: user.email,
      full_name: profile?.full_name || user.user_metadata?.full_name || user.email,
      role: profile?.role || 'member',
      avatar_url: profile?.avatar_url,
      ...profile,
    };
  },

  async isAuthenticated() {
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  redirectToLogin(redirectUrl) {
    if (redirectUrl) sessionStorage.setItem('auth_redirect', redirectUrl);
    window.location.href = '/login';
  },

  async logout(redirectUrl) {
    await supabase.auth.signOut();
    window.location.href = redirectUrl || '/';
  },
};

// ── Integrations ──────────────────────────────────────────────────────────────
const integrations = {
  Core: {
    async InvokeLLM({ prompt, response_json_schema } = {}) {
      // Use OpenAI if API key is configured in Netlify env vars
      const openaiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (openaiKey) {
        try {
          const resp = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${openaiKey}` },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: [{ role: 'user', content: prompt }],
              max_tokens: 500,
            }),
          });
          const data = await resp.json();
          const text = data.choices?.[0]?.message?.content;
          if (text) return response_json_schema ? {} : { result: text };
        } catch { /* fall through to context-based responses */ }
      }

      if (response_json_schema) return {};

      // ── KCF comprehensive context-based responses ────────────────────────────
      // Extract only the user's question — split on the marker and take the last part.
      // NOTE: The prompt must NOT have any text after USER QUESTION: that contains
      // keyword triggers (like "volunteer"), or they will false-match here.
      const raw = prompt || '';
      const afterMarker = raw.split(/USER QUESTION:/i);
      const userQ = afterMarker.length > 1
        ? afterMarker[afterMarker.length - 1].trim()
        : raw;
      const p = userQ.toLowerCase();

      // ── KindWave (check BEFORE generic "app" patterns) ──────────────────────
      if (p.includes('kindwave') || p.includes('kind wave') || p.includes('kindness map') || p.includes('community map')) {
        return { result: '**KindWave** is KCF\'s real-time community kindness app 📍\n\n- See live pins of kindness acts, help requests, and community events on a map\n- Post your own acts of kindness or request help nearby\n- Connect with neighbours in your area\n- Track your kindness impact over time\n\nVisit **/kindwave** on the website or download the app to get started!' };
      }
      // ── KindCalmUnity ───────────────────────────────────────────────────────
      if (p.includes('kindcalmunity') || p.includes('kind calm unity') || p.includes('calm unity') || p.includes('cooperative') || p.includes('calm living') || p.includes('community living')) {
        return { result: '**KindCalmUnity** is KCF\'s cooperative community living app 🌿\n\n- Helps communities establish shared agreements and peaceful coexistence\n- Tools for calm communication and conflict resolution\n- Shared resources and community coordination\n- Designed for neighbourhoods, housing groups, and community organisations\n\nExplore it at **/kindcalmunity** on the website.' };
      }
      // ── Volunteer / Badges / Hours ──────────────────────────────────────────
      if (p.includes('volunteer') || p.includes('badge') || p.includes('log hour') || p.includes('volunteer hour') || p.includes('serve') || p.includes('sign up to help')) {
        return { result: '**Volunteering with KCF** is easy and rewarding! 🙌\n\n- Go to **/volunteer** to sign up and browse opportunities\n- Log your volunteer hours directly from your dashboard\n- Earn recognition badges as you hit milestones:\n  - **First Steps** — 5 hrs\n  - **Champion** — 25 hrs\n  - **Leader** — 50 hrs\n  - **Ambassador** — 100 hrs\n  - **Lifetime** — 250 hrs+\n- Track total hours, active signups, and earned badges on your profile' };
      }
      // ── Cancel / Change / Pause giving plan (BEFORE generic giving catch-all) ──
      if (p.includes('cancel') || p.includes('pause') || p.includes('stop giving') || p.includes('change my donation') || p.includes('update my giving') || p.includes('modify') || p.includes('change amount') || p.includes('update payment') || p.includes('payment method')) {
        return { result: 'To manage your giving plan 💳\n\n- **View your giving** → go to **/mygiving** to see all active plans and history\n- **Change amount** → update your monthly giving plan from your dashboard\n- **Cancel a plan** → manage subscriptions inside **/mygiving** dashboard\n- **Update payment method** → edit payment details in your account settings\n- **Need help?** → email contact@kindnesscommunityfoundation.com\n\nYour generosity means so much — every contribution makes a real difference! 💚' };
      }
      // ── Tax deduction / Receipt / 501c3 (BEFORE generic giving catch-all) ────
      if (p.includes('tax') || p.includes('deduct') || p.includes('receipt') || p.includes('501') || p.includes('tax exempt') || p.includes('charitable') || p.includes('write off') || p.includes('tax benefit')) {
        return { result: 'KCF is a **registered California nonprofit** 📜\n\n- KCF is structured to operate as a tax-exempt charitable organisation\n- Donations may be **tax-deductible** depending on your location and tax situation\n- Donation **receipts** are provided via email after each contribution\n- For official tax documentation, visit **/mygiving** or email contact@kindnesscommunityfoundation.com\n\n⚠️ *We recommend consulting a tax professional for advice specific to your situation.*' };
      }
      // ── KindnessConnect / Donations / Giving ───────────────────────────────
      if (p.includes('donat') || p.includes('giving') || p.includes('kindnessconnect') || p.includes('cashback') || p.includes('roundup') || p.includes('how to give') || p.includes('contribute') || p.includes('fund') || p.includes('mygiving') || p.includes('my giving')) {
        return { result: '**KindnessConnect** is KCF\'s giving platform 💚 — visit **/servekindness** to get started.\n\nThree ways to give:\n- **Giving Plans** — recurring monthly donations from $5/mo\n- **Micro-Donation Roundups** — automatically rounds up your card purchases and donates the difference\n- **Conscious Shopping Cashback** — earn up to 15% cashback that goes straight to your chosen cause\n\nFees: 5% on plans & roundups, **0%** on cashback. Causes: Hunger, Climate, Clean Water, Education, Health, and Ocean Conservation.\n\nTrack your personal giving history at **/mygiving**.' };
      }
      // ── Platform fees / Cost ────────────────────────────────────────────────
      if (p.includes('fee') || p.includes('cost') || p.includes('charge') || (p.includes('free') && !p.includes('freedom') && !p.includes('freecosystem')) || p.includes('percent') || p.includes('%')) {
        return { result: 'KCF\'s platform fees are transparent and minimal:\n\n- **5%** on Giving Plans and Micro-Donation Roundups — keeps the platform running\n- **0%** on Conscious Shopping Cashback — every cent goes directly to your cause\n\nThere are no hidden charges. You always see exactly where your money goes.' };
      }
      // ── Partner charities ───────────────────────────────────────────────────
      if (p.includes('partner') || p.includes('charit') || p.includes('feeding america') || p.includes('water.org') || p.includes('unicef') || p.includes('one tree') || p.includes('save the children') || p.includes('ocean conservancy')) {
        return { result: 'KCF works with trusted global charity partners 🤝\n\n- **Feeding America** — fighting hunger and food insecurity\n- **Water.org** — providing access to safe clean water\n- **Save the Children** — education and child welfare\n- **One Tree Planted** — climate action and reforestation\n- **Ocean Conservancy** — protecting ocean health\n- **UNICEF** — supporting children worldwide\n\nYour donations go directly to these verified organisations based on your chosen cause.' };
      }
      // ── Blog ────────────────────────────────────────────────────────────────
      if (p.includes('blog') || p.includes('article') || p.includes('news') || p.includes('stor') || p.includes('community stor') || p.includes('read') || p.includes('latest')) {
        return { result: 'The **KCF Blog** at **/blog** is where we share:\n\n- Community impact stories from volunteers and members\n- Updates on KCF programmes and milestones\n- Insights on kindness, giving, and community building\n- Nonprofit news and partner spotlights\n\nVisit **/blog** to read the latest posts and stay connected with the KCF community.' };
      }
      // ── Team Portal / Synergy Hub ───────────────────────────────────────────
      if (p.includes('team portal') || p.includes('synergy') || p.includes('synergyhub') || p.includes('hub') || p.includes('workspace') || p.includes('internal') || p.includes('join team') || p.includes('jointeam')) {
        return { result: 'The **Team Portal** (Synergy Hub) is KCF\'s internal workspace for staff and active members 🛠️\n\n- **Messaging** — direct messages and group chats\n- **Tasks** — manage and assign team tasks\n- **Documents** — upload and share team files\n- **Announcements** — team-wide updates\n- **Ask Kindra** — built-in AI assistant (no ChatGPT needed!)\n- **Social Wall** — team community feed\n\nApply to join the team at **/jointeam**, then access the portal at **/synergyhub**.' };
      }
      // ── Analytics / Dashboard ───────────────────────────────────────────────
      if (p.includes('analytic') || p.includes('dashboard') || p.includes('stat') || p.includes('track') || p.includes('metric') || p.includes('report') || p.includes('impact')) {
        return { result: 'KCF\'s **Analytics Dashboard** gives full visibility into platform activity 📊\n\n- Volunteer signups and total logged hours\n- Donations received and giving goals progress\n- Community stories posted across all 6 pillars\n- Badge milestones earned by members\n- Real-time activity across the KCF ecosystem\n\nTeam members can access detailed reports inside the Synergy Hub.' };
      }
      // ── Governance / Board / Constitution ───────────────────────────────────
      if (p.includes('governance') || p.includes('board') || p.includes('constitution') || p.includes('tradition') || p.includes('transparent') || p.includes('policy') || p.includes('rule') || p.includes('legal') || p.includes('nonprofit')) {
        return { result: 'KCF operates under a transparent governance framework 📜\n\n- Guided by **12 traditions** — our Kindness Constitution\n- Ensures ethical participation and clear accountability\n- Community-centred decision making\n- Open board recruitment — passionate community leaders welcome\n- Registered California nonprofit\n\nLearn more about our leadership and vision in the **About** section on the home page.' };
      }
      // ── Contact / Email / Support ───────────────────────────────────────────
      if (p.includes('contact') || p.includes('reach') || p.includes('email') || p.includes('get in touch') || p.includes('message') || p.includes('help') || p.includes('support') || p.includes('question')) {
        return { result: 'We\'d love to hear from you! 💚\n\n- 📧 **Email:** contact@kindnesscommunityfoundation.com\n- 📝 **Contact form:** visit **/contact** on the website\n- 📍 **Location:** Newport Beach, California, USA\n\nOur team typically responds within 1–2 business days. You can also use this chat for instant answers!' };
      }
      // ── Location / Where ────────────────────────────────────────────────────
      if (p.includes('location') || p.includes('where') || p.includes('based') || p.includes('address') || p.includes('california') || p.includes('newport')) {
        return { result: 'KCF is headquartered in **Newport Beach, California, USA** 📍\n\nWhile our roots are in California, our volunteer network and giving programmes reach communities across the country and beyond. Everything is accessible online at kindnesscommunityfoundation.com.' };
      }
      // ── Pillars / Causes / Focus areas ─────────────────────────────────────
      if (p.includes('pillar') || p.includes('cause') || p.includes('focus area') || p.includes('area of work') || p.includes('what do you focus')) {
        return { result: 'KCF is built on **6 pillars of community impact** 🌱\n\n- 📚 **Education** — access to learning for all\n- 💼 **Economic Empowerment** — financial stability and opportunity\n- 🏥 **Health & Wellness** — physical and mental wellbeing\n- 🏘️ **Community Development** — building strong neighbourhoods\n- 🌍 **Environmental Sustainability** — protecting our planet\n- 🎭 **Cultural Preservation** — honouring heritage and diversity\n\nAll KCF programmes and giving causes are tied to one or more of these pillars.' };
      }
      // ── Initiatives / Programs ──────────────────────────────────────────────
      if (p.includes('initiative') || p.includes('program') || p.includes('feature') || p.includes('offer') || p.includes('what can i do')) {
        return { result: 'KCF has several key programmes for community members 🌟\n\n- **Volunteer Network** — sign up, log hours, earn badges at **/volunteer**\n- **KindnessConnect** — giving plans, roundups & cashback at **/servekindness**\n- **KindWave App** — real-time kindness map at **/kindwave**\n- **KindCalmUnity** — cooperative living app at **/kindcalmunity**\n- **Blog** — community stories and updates at **/blog**\n- **Team Portal** — internal workspace at **/synergyhub** (team members)\n\nAll programmes are designed around KCF\'s 6 pillars of community impact.' };
      }
      // ── General apps / Technology ───────────────────────────────────────────
      if (p.includes('serviceconnect') || p.includes('freeapp') || p.includes('freeappmaker') || p.includes('app') || p.includes('product') || p.includes('technology') || p.includes('tech') || p.includes('ecosystem')) {
        return { result: 'KCF\'s technology ecosystem includes 🚀\n\n- **KindWave** (/kindwave) — real-time community kindness map\n- **KindCalmUnity** (/kindcalmunity) — cooperative community living app\n- **ServiceConnectPro.ai** — AI-powered service coordination platform\n- **FreeAppMaker.ai** — no-code app builder (free)\n- **Synergy Hub** (/synergyhub) — internal team portal with AI assistant\n\nAll tools are part of KCF\'s mission to harness technology for community good.' };
      }
      // ── Kindness Score / Milestones / Rewards ───────────────────────────────
      if (p.includes('score') || p.includes('milestone') || p.includes('kindness score') || p.includes('point') || p.includes('reward') || p.includes('recognition')) {
        return { result: 'KCF rewards your kindness with a **Kindness Score** 🏅\n\n- Tracks your cumulative giving and volunteering activity\n- Earn badges as you hit volunteer hour milestones (5, 25, 50, 100, 250 hrs)\n- Reach giving milestones to unlock Community Giving Circle membership\n- Your score grows with every donation, volunteer hour, and act of kindness\n\nCheck your score and badges on your **/volunteer** or **/mygiving** dashboard.' };
      }
      // ── Founder / History / Who started ────────────────────────────────────
      if (p.includes('founder') || p.includes('founded') || p.includes('who started') || p.includes('who created') || p.includes('who built') || p.includes('established') || p.includes('history') || p.includes('origin')) {
        return { result: 'KCF was founded with a vision to **reinvent giving through kindness** 💡\n\nThe Kindness Community Foundation was built to:\n- Promote community stabilisation through ethical participation\n- Create technology-assisted volunteer coordination networks\n- Build transparent, sustainable infrastructure for nonprofits\n- Connect people to causes that matter — locally and globally\n\nBased in Newport Beach, California, KCF continues to grow its community impact every day.' };
      }
      // ── Membership / Join / How to join ────────────────────────────────────
      if (p.includes('join') || p.includes('member') || p.includes('register') || p.includes('become') || p.includes('get started') || p.includes('how do i start') || p.includes('sign up')) {
        return { result: 'Getting started with KCF is easy! 💚\n\n1. **Volunteer** → visit **/volunteer** to sign up and start logging hours\n2. **Give** → set up a giving plan at **/servekindness** (from $5/mo)\n3. **Explore the map** → download the KindWave app at **/kindwave**\n4. **Join the team** → apply for a staff/member role at **/jointeam**\n5. **Stay updated** → read community stories at **/blog**\n\nNo account required to explore — just show up and be kind!' };
      }
      // ── Mission / Vision / About / What is KCF ─────────────────────────────
      // NOTE: Keep this BROAD catch-all near the end. Do NOT add "kcf" alone —
      // almost every question contains "kcf" and would false-match here.
      if (p.includes('mission') || p.includes('vision') || p.match(/\babout kcf\b/) || p.includes('kindness community foundation') || p.match(/what is kcf/) || p.match(/who is kcf/) || p.match(/who are kcf/) || p.includes('tell me about kcf') || p.match(/^what (is|are) (the |a )?(kcf|kindness)/) || p.match(/^(what|who) (is|are) (kcf|kindness community)/) || p.includes('what does kcf') || p.includes('what does kcf stand') || p.includes('kindness community foundation')) {
        return { result: '**Kindness Community Foundation (KCF)** is a California-based nonprofit reinventing giving through kindness 🌿\n\n**Mission:** Community stabilisation through ethical participation, technology-assisted volunteer coordination, and transparent governance.\n\n**6 Pillars:** Education · Economic Empowerment · Health & Wellness · Community Development · Environmental Sustainability · Cultural Preservation\n\n**What we offer:**\n- Volunteer programmes with badge recognition (/volunteer)\n- Giving plans and cashback donations (/servekindness)\n- KindWave real-time kindness map app (/kindwave)\n- KindCalmUnity cooperative living app (/kindcalmunity)\n- Community stories and blog (/blog)\n\nVisit kindnesscommunityfoundation.com to explore everything!' };
      }

      // ── Greetings ───────────────────────────────────────────────────────────
      if (p.match(/^(hi|hello|hey|howdy|hiya|good morning|good afternoon|good evening|greetings|sup|what's up|yo)\b/) || p === 'hi!' || p === 'hello!') {
        return { result: 'Hello! 👋 Welcome to **Kindness Community Foundation**!\n\nI\'m Kindra, your 24/7 AI support assistant. I can help you:\n\n- 🙌 **Volunteer** — sign up & earn badges at /volunteer\n- 💚 **Give** — set up giving plans at /servekindness\n- 📍 **Explore KindWave** — community kindness map at /kindwave\n- 🌿 **KindCalmUnity** — cooperative living app at /kindcalmunity\n- 📖 **Read stories** — blog at /blog\n- 📧 **Contact us** — at /contact\n\nWhat would you like to know?' };
      }
      // ── Thank you / Appreciation ────────────────────────────────────────────
      if (p.includes('thank') || p.includes('thanks') || p.includes('appreciate') || p.includes('awesome') || p.includes('great answer') || p.includes('helpful') || p.includes('perfect')) {
        return { result: 'You\'re so welcome! 💚 It\'s what we\'re here for.\n\nIf you have more questions about KCF, volunteering, giving, or any of our apps — just ask! I\'m available 24/7.\n\nIs there anything else I can help you with today? 😊' };
      }
      // ── Goodbye / Farewell ──────────────────────────────────────────────────
      if (p.match(/^(bye|goodbye|see you|take care|ciao|later|talk later|that's all|that will be all|i'm done|done for now)\b/)) {
        return { result: 'Goodbye! 💚 Thank you for connecting with **Kindness Community Foundation**.\n\nRemember, you can always come back to chat with me anytime. Keep spreading kindness!\n\n🌿 Visit kindnesscommunityfoundation.com anytime.' };
      }
      // ── What can you do / Help me ───────────────────────────────────────────
      if (p.includes('what can you') || p.includes('what do you do') || p.includes('how can you help') || p.includes('what can kindra') || p.includes('your capabilities') || p.includes('can you help')) {
        return { result: 'I\'m **Kindra**, KCF\'s AI support assistant 🤖 — here 24/7 to help!\n\nI can answer questions about:\n\n- 🌿 **KCF & our mission** — who we are, pillars, governance\n- 🙌 **Volunteering** — sign up, log hours, earn badges\n- 💚 **Giving & donations** — KindnessConnect, plans, cashback\n- 📍 **KindWave app** — community kindness map\n- 🏡 **KindCalmUnity app** — cooperative living\n- 🤝 **Partner charities** — who we work with\n- 📖 **Blog & stories** — community updates\n- 👥 **Team Portal** — joining the team, Synergy Hub\n- 📧 **Contact & support** — reach the KCF team\n- 🔐 **Account** — login, password, profile\n- 💼 **Careers** — joining the KCF team\n\nJust ask away! 💚' };
      }
      // ── Account / Login / Password / Profile ────────────────────────────────
      if (p.includes('account') || p.includes('log in') || p.includes('login') || p.includes('sign in') || p.includes('password') || p.includes('forgot') || p.includes('reset') || p.includes('profile') || p.includes('my account') || p.includes('credentials')) {
        return { result: 'Here\'s how to manage your KCF account 🔐\n\n- **Log in / Sign in** → visit the website and click **Team Portal** or go to **/login**\n- **Forgot password** → on the login page, click "Forgot password" to receive a reset email\n- **Create account** → apply at **/jointeam** or sign up when registering to volunteer\n- **Update profile** → access your profile settings inside the Team Portal dashboard\n- **Account issues** → email us at contact@kindnesscommunityfoundation.com\n\nNeed more help? Our team responds within 1–2 business days 💚' };
      }
      // ── Website navigation / All pages ──────────────────────────────────────
      if (p.includes('navigate') || p.includes('website') || p.includes('pages') || p.includes('menu') || p.includes('navigation') || p.includes('site map') || p.includes('sitemap') || p.includes('all pages') || p.includes('what\'s on')) {
        return { result: 'Here\'s a full map of the **KCF website** 🗺️\n\n- 🏠 **Home** (/) — mission, pillars, initiatives overview\n- 🙌 **Volunteer** (/volunteer) — sign up, log hours, earn badges\n- 💚 **Serve Kindness** (/servekindness) — giving plans & KindnessConnect\n- 📊 **My Giving** (/mygiving) — your personal donation dashboard\n- 📍 **KindWave App** (/kindwave) — real-time kindness map\n- 🌿 **KindCalmUnity** (/kindcalmunity) — cooperative living app\n- 📖 **Blog** (/blog) — stories, news & updates\n- 📧 **Contact** (/contact) — get in touch\n- 👥 **Join Team** (/jointeam) — apply to join KCF\n- 🛠️ **Synergy Hub** (/synergyhub) — team portal (members only)\n\nClick any link in the nav bar to jump to a section!' };
      }
      // ── ServeKindness page ───────────────────────────────────────────────────
      if (p.includes('servekindness') || p.includes('serve kindness') || p.includes('giving platform') || p.includes('giving page') || p.includes('donation platform') || p.includes('how to donate') || p.includes('start giving') || p.includes('make a donation') || p.includes('give money') || p.includes('give back')) {
        return { result: '**Serve Kindness** is KCF\'s giving hub — visit **/servekindness** 💚\n\n**Three ways to make an impact:**\n- 💳 **Giving Plans** — set up a recurring monthly donation from just $5/mo\n- 🔄 **Micro-Donation Roundups** — rounds up your everyday card purchases and donates the change\n- 🛍️ **Conscious Shopping Cashback** — earn up to 15% cashback on partner purchases donated to your cause\n\n**Your giving supports:**\n- Hunger & Food Security (Feeding America)\n- Clean Water Access (Water.org)\n- Education & Children (Save the Children)\n- Climate & Reforestation (One Tree Planted)\n- Ocean Conservation (Ocean Conservancy)\n- Child Welfare (UNICEF)\n\nVisit **/servekindness** to get started!' };
      }
      // ── Privacy / Data / Security ────────────────────────────────────────────
      if (p.includes('privacy') || p.includes('data') || p.includes('secure') || p.includes('security') || p.includes('safe') || p.includes('personal information') || p.includes('gdpr') || p.includes('personal data') || p.includes('cookies')) {
        return { result: 'KCF takes your **privacy and security seriously** 🔒\n\n- Your personal data is securely stored and never sold to third parties\n- We use industry-standard encryption to protect your information\n- Payment data is handled via secure, certified payment processors\n- You can request your data or ask for account deletion at any time\n- For our full Privacy Policy, visit the footer of kindnesscommunityfoundation.com\n\nQuestions? Email contact@kindnesscommunityfoundation.com 💚' };
      }
      // ── Careers / Jobs / Work at KCF ────────────────────────────────────────
      if (p.includes('career') || p.includes('job') || p.includes('work at') || p.includes('work for') || p.includes('hiring') || p.includes('employment') || p.includes('apply') || p.includes('position') || p.includes('role') || p.includes('internship') || p.includes('staff')) {
        return { result: 'Interested in **working with KCF**? We\'d love to have you! 🌟\n\n- **Apply to join the team** → visit **/jointeam** to see open positions and apply\n- **Volunteer roles** → sign up at **/volunteer** to contribute your time and skills\n- **Board positions** → KCF has open board recruitment for passionate community leaders\n- **Internships** → reach out at contact@kindnesscommunityfoundation.com\n\nWe\'re a purpose-driven team building technology and community programmes for lasting impact. Come make a difference with us! 💚' };
      }
      // ── Leadership / Team / Who runs KCF ────────────────────────────────────
      if (p.includes('leadership') || p.includes('team') || p.includes('who runs') || p.includes('who leads') || p.includes('ceo') || p.includes('executive') || p.includes('director') || p.includes('management') || p.includes('staff member') || p.includes('people behind')) {
        return { result: 'KCF is led by a dedicated **leadership team and board** 👥\n\n- Founded and guided by our Founder with a mission to reinvent giving through kindness\n- Governed by a **transparent board** aligned with our 12-traditions Kindness Constitution\n- Open **board recruitment** — community leaders and impact-driven professionals welcome\n- Our growing team includes technologists, community builders, and nonprofit professionals\n\nLearn more about our team in the **About → Leadership** section on the home page, or reach us at contact@kindnesscommunityfoundation.com 💚' };
      }
      // ── Events / Calendar / Meetups ─────────────────────────────────────────
      if (p.includes('event') || p.includes('calendar') || p.includes('meetup') || p.includes('meet up') || p.includes('gathering') || p.includes('workshop') || p.includes('webinar') || p.includes('conference') || p.includes('upcoming')) {
        return { result: 'KCF hosts and participates in **community events** 🗓️\n\n- **Community kindness events** — volunteer days, neighbourhood initiatives\n- **Giving campaigns** — seasonal and cause-specific fundraising drives\n- **Partner events** — with Feeding America, Water.org, One Tree Planted and others\n- **Team events** — internal KCF team workshops and planning sessions\n\nStay updated on upcoming events by:\n- Reading the **Blog** at /blog\n- Following us on social media\n- Emailing contact@kindnesscommunityfoundation.com to be added to our mailing list' };
      }
      // ── Newsletter / Email updates / Subscribe ──────────────────────────────
      if (p.includes('newsletter') || p.includes('subscribe') || p.includes('unsubscribe') || p.includes('email update') || p.includes('mailing list') || p.includes('updates') || p.includes('notifications') || p.includes('stay informed') || p.includes('keep me posted')) {
        return { result: 'Stay connected with **KCF updates** 📬\n\n- **Newsletter / mailing list** → email us at contact@kindnesscommunityfoundation.com to be added\n- **Blog updates** → check **/blog** regularly for the latest stories and news\n- **Team announcements** → accessible inside the Team Portal for members\n- **Unsubscribe** → reply "unsubscribe" to any KCF email or contact us directly\n\nWe only send relevant, meaningful updates — no spam! 💚' };
      }
      // ── Social Media / Follow KCF ────────────────────────────────────────────
      if (p.includes('social media') || p.includes('instagram') || p.includes('facebook') || p.includes('twitter') || p.includes('linkedin') || p.includes('youtube') || p.includes('tiktok') || p.includes('follow') || p.includes('social') || p.includes('online presence')) {
        return { result: 'Connect with **KCF on social media** 📱\n\nFollow us to stay up to date with community stories, giving campaigns, and KCF news! Look for **Kindness Community Foundation** across major platforms.\n\nFor the official links, visit kindnesscommunityfoundation.com or contact us at contact@kindnesscommunityfoundation.com 💚\n\nYou can also share your own kindness stories and tag us!' };
      }
      // ── Partnerships / Sponsorship / Corporate ───────────────────────────────
      if (p.includes('partnership') || p.includes('sponsor') || p.includes('corporate') || p.includes('collaborate') || p.includes('collaborate') || p.includes('business') || p.includes('organisation want') || p.includes('company partner') || p.includes('brand')) {
        return { result: 'KCF welcomes **partnerships and collaborations** 🤝\n\n**Ways to partner with KCF:**\n- **Corporate sponsorship** — support KCF programmes and align your brand with kindness\n- **Charity partnerships** — verified charities can apply to join our giving platform\n- **Community organisations** — collaborate on local impact initiatives\n- **Technology partners** — integrate with KCF\'s ecosystem of apps and tools\n- **Media & content** — co-create stories and campaigns around community kindness\n\nTo explore a partnership, email contact@kindnesscommunityfoundation.com — we\'d love to connect! 💚' };
      }
      // ── Freecosystem / Intranet ──────────────────────────────────────────────
      if (p.includes('freecosystem') || p.includes('free ecosystem') || p.includes('intranet') || p.includes('free community') || p.includes('internal network') || p.includes('community network') || p.includes('ecosystem')) {
        return { result: 'The **KCF Freecosystem** is our broader community and technology ecosystem 🌐\n\nIt includes:\n- **KindWave** — real-time kindness map app\n- **KindCalmUnity** — cooperative community living app\n- **Synergy Hub** — internal team portal and AI-powered workspace\n- **ServiceConnectPro.ai** — AI service coordination\n- **FreeAppMaker.ai** — free no-code app builder\n- **KindnessConnect** — giving and cashback platform\n\nThe Freecosystem is designed to give every community member — from volunteers to team members — the tools to create lasting impact together. 💚' };
      }
      // ── Social Wall / Community Feed / Posts ────────────────────────────────
      if (p.includes('social wall') || p.includes('community feed') || p.includes('post update') || p.includes('share update') || p.includes('wall post') || p.includes('activity feed') || p.includes('announcements')) {
        return { result: 'The **Social Wall** is KCF\'s community feed inside the **Synergy Hub** 📣\n\n- Share team updates, achievements, and milestones\n- Celebrate volunteer and giving milestones\n- Engage with teammates through likes and comments\n- See announcements from KCF leadership\n\nAccess the Social Wall at **/synergyhub** → select "Social Wall" in the left navigation.\n\nTo join the team and access the portal, apply at **/jointeam** 💚' };
      }
      // ── ServiceConnectPro / FreeAppMaker ─────────────────────────────────────
      if (p.includes('serviceconnectpro') || p.includes('service connect') || p.includes('freeappmaker') || p.includes('free app maker') || p.includes('no-code') || p.includes('nocode') || p.includes('build an app') || p.includes('ai service')) {
        return { result: 'KCF\'s tech products go beyond the community platform 🚀\n\n- **ServiceConnectPro.ai** — an AI-powered service coordination platform that matches community needs with available resources and volunteers\n- **FreeAppMaker.ai** — a no-code app builder that lets anyone create their own apps for free, aligned with KCF\'s mission of technology for all\n\nBoth tools are part of KCF\'s broader **Freecosystem** — technology built to empower communities.\n\nContact us at contact@kindnesscommunityfoundation.com to learn more! 💚' };
      }
      // ── Community Giving Circles ─────────────────────────────────────────────
      if (p.includes('giving circle') || p.includes('giving group') || p.includes('community giving') || p.includes('giving community') || p.includes('collective giving') || p.includes('group donation')) {
        return { result: '**Community Giving Circles** are KCF\'s groups of like-minded donors 💫\n\n- Groups of community members coordinating their giving for maximum collective impact\n- Unlock access by reaching giving milestones on your **Kindness Score**\n- Coordinate with others around shared causes: hunger, climate, clean water, education\n- Share stories and celebrate collective impact inside the giving community\n\nStart your giving journey at **/servekindness** and track your progress at **/mygiving** 💚' };
      }
      // ── Education pillar ─────────────────────────────────────────────────────
      if (p.includes('education') || p.includes('school') || p.includes('learning') || p.includes('children learn') || p.includes('literacy') || p.includes('scholarship')) {
        return { result: '**Education** is one of KCF\'s 6 core pillars 📚\n\n- KCF believes access to quality education is a fundamental right\n- We partner with **Save the Children** to support education and child welfare globally\n- Education-focused volunteer opportunities are available at **/volunteer**\n- Members can share education impact stories on the community platform\n- Giving plans on **/servekindness** can be directed toward Education & Children causes\n\nLearn more about all 6 pillars on the KCF home page! 💚' };
      }
      // ── Health & Wellness pillar ─────────────────────────────────────────────
      if (p.includes('health') || p.includes('wellness') || p.includes('mental health') || p.includes('wellbeing') || p.includes('medical') || p.includes('healthcare')) {
        return { result: '**Health & Wellness** is one of KCF\'s 6 core pillars 🏥\n\n- KCF is committed to supporting physical and mental wellbeing in communities\n- Wellness-focused volunteer opportunities are available at **/volunteer**\n- Health & Medical Aid is one of the causes available through **KindnessConnect** at **/servekindness**\n- Our **KindCalmUnity** app promotes mental wellness through calm communication and peaceful community living\n\nExplore all giving causes at **/servekindness** 💚' };
      }
      // ── Economic Empowerment pillar ──────────────────────────────────────────
      if (p.includes('economic') || p.includes('empowerment') || p.includes('financial') || p.includes('poverty') || p.includes('income') || p.includes('employment support') || p.includes('economic opportunity')) {
        return { result: '**Economic Empowerment** is one of KCF\'s 6 core pillars 💼\n\n- KCF works to create financial stability and opportunity for underserved communities\n- We support programmes that break cycles of poverty through education and skills development\n- Economic empowerment stories are shared on the **Blog** at **/blog**\n- Volunteer with KCF\'s economic empowerment initiatives at **/volunteer**\n\nKCF believes everyone deserves a fair opportunity to thrive. Explore our full mission at kindnesscommunityfoundation.com 💚' };
      }
      // ── Environmental Sustainability pillar ──────────────────────────────────
      if (p.includes('environment') || p.includes('climate') || p.includes('sustainab') || p.includes('green') || p.includes('planet') || p.includes('reforestation') || p.includes('carbon') || p.includes('tree') || p.includes('nature') || p.includes('eco')) {
        return { result: '**Environmental Sustainability** is one of KCF\'s 6 core pillars 🌍\n\n- KCF is committed to protecting our planet for future generations\n- We partner with **One Tree Planted** for climate action and reforestation\n- **Ocean Conservancy** partnerships focus on protecting ocean health\n- Climate & Reforestation is one of the giving causes at **/servekindness**\n- Environmental volunteer opportunities are available at **/volunteer**\n\nEvery dollar given to climate causes plants trees and restores ecosystems. Start giving at **/servekindness** 💚' };
      }
      // ── Cultural Preservation pillar ─────────────────────────────────────────
      if (p.includes('cultural') || p.includes('culture') || p.includes('heritage') || p.includes('diversity') || p.includes('inclusion') || p.includes('preservation') || p.includes('tradition') || p.includes('indigenous') || p.includes('arts')) {
        return { result: '**Cultural Preservation** is one of KCF\'s 6 core pillars 🎭\n\n- KCF honours and supports the diverse cultural heritage of communities\n- We believe preserving culture strengthens community identity and belonging\n- Cultural preservation stories are featured on the **Blog** at **/blog**\n- Volunteer opportunities supporting cultural initiatives are available at **/volunteer**\n\nDiversity and inclusion are at the heart of everything KCF does. Learn more at kindnesscommunityfoundation.com 💚' };
      }
      // ── Community Development pillar ─────────────────────────────────────────
      if (p.includes('community development') || p.includes('neighbourhood') || p.includes('neighborhood') || p.includes('local community') || p.includes('community building') || p.includes('community project') || p.includes('grassroots')) {
        return { result: '**Community Development** is one of KCF\'s 6 core pillars 🏘️\n\n- KCF works to build strong, resilient neighbourhoods and communities\n- We support local initiatives that bring people together around shared goals\n- Community development volunteer opportunities are at **/volunteer**\n- **KindWave** (/kindwave) helps map and coordinate local community kindness acts\n- **KindCalmUnity** (/kindcalmunity) supports cooperative neighbourhood living\n\nCommunity is at the core of everything we do at KCF 💚' };
      }
      // ── Hunger / Food Security ───────────────────────────────────────────────
      if (p.includes('hunger') || p.includes('food') || p.includes('food security') || p.includes('feeding') || p.includes('nutrition') || p.includes('food bank') || p.includes('meal')) {
        return { result: 'KCF actively fights **hunger and food insecurity** 🍽️\n\n- We partner with **Feeding America** — the largest hunger-relief organisation in the US\n- "Hunger & Food Security" is one of the key causes on our giving platform\n- Set up a giving plan directed at hunger relief at **/servekindness**\n- Use the Micro-Donation Roundup feature so every purchase helps fight hunger\n\nYour contribution through KindnessConnect goes directly to Feeding America and supports food banks across the country. Start at **/servekindness** 💚' };
      }
      // ── Clean Water ──────────────────────────────────────────────────────────
      if (p.includes('water') || p.includes('clean water') || p.includes('water access') || p.includes('water crisis') || p.includes('drinking water') || p.includes('water.org') || p.includes('water supply')) {
        return { result: 'KCF supports **clean water access** globally 💧\n\n- We partner with **Water.org** — a world leader in providing safe water access\n- "Clean Water Access" is one of the giving causes on KindnessConnect\n- Your donations help fund water projects in communities across the developing world\n- Millions of people gain access to safe water through Water.org\'s programmes\n\nDonate to the clean water cause at **/servekindness** — even $5/mo makes a difference 💚' };
      }
      // ── Ocean / Marine environment ───────────────────────────────────────────
      if (p.includes('ocean') || p.includes('marine') || p.includes('sea') || p.includes('ocean conservancy') || p.includes('plastic') || p.includes('beach') || p.includes('coral') || p.includes('aquatic')) {
        return { result: 'KCF supports **ocean conservation** 🌊\n\n- We partner with **Ocean Conservancy** — dedicated to protecting ocean ecosystems\n- "Ocean Conservation" is one of the causes available on KindnessConnect\n- Ocean Conservancy fights ocean plastic, protects marine life, and supports healthy seas\n- Your giving through **/servekindness** contributes directly to ocean health\n\nThe ocean covers 70% of our planet — help protect it at **/servekindness** 💚' };
      }
      // ── Children / Child welfare ─────────────────────────────────────────────
      if (p.includes('child') || p.includes('children') || p.includes('kid') || p.includes('youth') || p.includes('unicef') || p.includes('save the children') || p.includes('child welfare') || p.includes('young people')) {
        return { result: 'KCF is committed to **supporting children and youth** 👶\n\n- We partner with **UNICEF** — providing humanitarian aid to children worldwide\n- We partner with **Save the Children** — focused on education and child welfare\n- Both "Education & Children" and child welfare are supported through KindnessConnect\n- Volunteer with child-focused initiatives at **/volunteer**\n\nYour support at **/servekindness** directly benefits the world\'s most vulnerable children 💚' };
      }
      // ── Kindra / AI assistant itself ─────────────────────────────────────────
      if (p.includes('kindra') || p.includes('who are you') || p.includes('what are you') || p.includes('ai assistant') || p.includes('chatbot') || p.includes('bot') || p.includes('artificial intelligence') || p.includes('are you a robot') || p.includes('are you human') || p.includes('are you real')) {
        return { result: 'I\'m **Kindra** 👋 — KCF\'s AI support assistant!\n\n- I\'m built directly into the KCF website to give you instant answers 24/7\n- I know everything about KCF\'s mission, programmes, apps, and how to get involved\n- I\'m powered by **KCF AI** — no need to use ChatGPT or search for answers elsewhere\n- I can answer text questions and even understand voice input 🎙️\n\n**I can help you with:**\n- Navigating the website\n- Volunteering and giving\n- Apps (KindWave, KindCalmUnity)\n- Contact and support\n- And much more!\n\nJust ask me anything — I\'m here to help! 💚' };
      }
      // ── Accessibility ─────────────────────────────────────────────────────────
      if (p.includes('accessibility') || p.includes('accessible') || p.includes('disability') || p.includes('screen reader') || p.includes('ada') || p.includes('wcag') || p.includes('impairment')) {
        return { result: 'KCF is committed to **accessibility and inclusion** ♿\n\n- The KCF website is designed to be accessible to all visitors\n- We continuously work to meet accessibility standards for users with disabilities\n- For specific accessibility needs or to report an issue, contact us at contact@kindnesscommunityfoundation.com\n- Our team will work with you to ensure you can access all KCF resources\n\nInclusion is one of our core values — everyone is welcome at KCF 💚' };
      }
      // ── Languages / Multilingual ──────────────────────────────────────────────
      if (p.includes('language') || p.includes('spanish') || p.includes('french') || p.includes('hindi') || p.includes('multilingual') || p.includes('translate') || p.includes('in my language') || p.includes('other language')) {
        return { result: 'KCF is working toward **multilingual support** 🌐\n\n- Currently the website is primarily in **English**\n- We are working on expanding language support to serve more communities\n- For assistance in another language, please reach out to our team at contact@kindnesscommunityfoundation.com\n- We\'re committed to making KCF accessible to communities regardless of language\n\nThank you for your patience as we grow! 💚' };
      }
      // ── Minimum donation / How much ──────────────────────────────────────────
      if (p.includes('minimum') || p.includes('how much') || p.includes('how little') || p.includes('smallest') || p.includes('starting from') || p.includes('price') || p.includes('amount')) {
        return { result: 'KCF giving starts from **as little as $5/month** 💚\n\n- **Giving Plans** — start from $5/month recurring\n- **Micro-Donation Roundups** — automatically rounds up everyday purchases (often just cents per transaction)\n- **Conscious Shopping Cashback** — no minimum, your cashback goes straight to your cause at 0% fee\n\nEvery amount makes a real difference! Start giving at **/servekindness**.\n\nPlatform fee: 5% on plans/roundups, 0% on cashback — always transparent.' };
      }
      // ── Volunteer opportunities / What can I do ──────────────────────────────
      if (p.includes('opportunity') || p.includes('how can i help') || p.includes('what can i do') || p.includes('ways to help') || p.includes('get involved') || p.includes('make a difference') || p.includes('contribute my time') || p.includes('help the community')) {
        return { result: 'There are so many ways to **get involved with KCF** 🌟\n\n- 🙌 **Volunteer** → sign up for community initiatives at **/volunteer**\n- 💚 **Give** → set up a monthly giving plan at **/servekindness**\n- 📍 **Use KindWave** → post acts of kindness on the map at **/kindwave**\n- 🌿 **KindCalmUnity** → join cooperative community living at **/kindcalmunity**\n- 📖 **Share a story** → submit community impact stories via the blog\n- 👥 **Join the team** → apply for a staff or board role at **/jointeam**\n- 🤝 **Partner with us** → bring your organisation on board\n\nEvery act of kindness counts — big or small! 💚' };
      }

      // Generic helpful fallback — never show API key instructions to users
      console.warn('[base44] InvokeLLM: no pattern matched. For AI-quality responses, set VITE_OPENAI_API_KEY.');
      return { result: 'Great question! 💚 I\'m Kindra — here\'s what I can help you with:\n\n- 🌿 **About KCF** — mission, pillars, governance\n- 🙌 **Volunteering** — sign up, badges, hours\n- 💚 **Giving** — KindnessConnect, plans, cashback\n- 📍 **KindWave** — real-time kindness map\n- 🏡 **KindCalmUnity** — cooperative living app\n- 🤝 **Partners** — Feeding America, Water.org, UNICEF & more\n- 👥 **Team Portal** — Synergy Hub, join team\n- 📧 **Contact** — email, contact form, location\n- 🔐 **Account** — login, password, profile\n- 💼 **Careers** — jobs and internships\n\nTry asking "How do I volunteer?" or "What is KindWave?" — I\'m here 24/7! 💚' };
    },

    async UploadFile({ file }) {
      const ext = file.name.split('.').pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from('uploads').upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from('uploads').getPublicUrl(path);
      return { url: data.publicUrl, file_url: data.publicUrl };
    },
  },
};

// ── Functions (Supabase Edge Functions) ───────────────────────────────────────
const functions = {
  async invoke(name, payload) {
    const { data, error } = await supabase.functions.invoke(name, { body: payload });
    if (error) throw error;
    return data;
  },
};

// ── App Logs (no-op) ──────────────────────────────────────────────────────────
const appLogs = { logUserInApp: () => Promise.resolve() };

// ── Export ────────────────────────────────────────────────────────────────────
export const base44 = { auth, entities, integrations, functions, appLogs };
