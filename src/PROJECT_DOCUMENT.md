# KCF Platform — Full Project Documentation
**Kindness Community Foundation**
*Last Updated: March 2026*

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [Page Directory](#3-page-directory)
4. [Feature Breakdown by Section](#4-feature-breakdown-by-section)
5. [Data Entities](#5-data-entities)
6. [Component Library](#6-component-library)
7. [Backend Functions](#7-backend-functions)

---

## 1. Project Overview

The **KCF Platform** is the digital presence for **Kindness Community Foundation**, a California nonprofit dedicated to ethical, technology-assisted volunteer networks and sustainable community infrastructure. The platform is a multi-audience web application serving:

- **General public** — Organizational website, mission, and story
- **Community members** — Giving platform (KindnessConnect), volunteer program
- **Internal team** — Private team portal (Synergy Hub) for collaboration

The app is built on **React + Tailwind CSS + Vite** using the Base44 platform for backend services (database, authentication, integrations).

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite |
| Styling | Tailwind CSS, Framer Motion animations |
| UI Components | shadcn/ui component library |
| Data Fetching | TanStack React Query |
| Routing | React Router DOM v6 |
| Backend/DB | Base44 (entities, auth, integrations) |
| Icons | Lucide React |
| Charts | Recharts |
| Maps | React Leaflet |
| AI | Base44 InvokeLLM integration |

---

## 3. Page Directory

| Route | Page | Audience |
|---|---|---|
| `/` | **Home** (Main website) | Public |
| `/KindnessConnect` | **KindnessConnect** (Giving platform) | Public / Members |
| `/GivingDashboard` | **Giving Dashboard** (Personal giving stats) | Authenticated users |
| `/VolunteerDashboard` | **Volunteer Dashboard** (Personal volunteer hub) | Authenticated volunteers |
| `/TeamPortalLanding` | **Team Portal Landing** (Entry gateway) | Team members |
| `/TeamPortal` | **Team Portal / Synergy Hub** (Internal collaboration) | Authenticated team |
| `/Analytics` | **Analytics Dashboard** (Platform metrics) | Admin users |

---

## 4. Feature Breakdown by Section

---

### 4.1 Home Page (`/`)

The main public-facing website for Kindness Community Foundation. Built as a long-scroll single-page layout with the following sections, each lazy-loaded for performance:

#### Header (Navigation)
- Fixed top navigation bar with transparent → frosted-glass scroll transition
- Logo with KCF branding (Montserrat + Dancing Script fonts)
- Desktop nav: Home, Vision & Mission, Initiatives, Leadership, Partners, Connect Through Kindness, Contact
- Mobile hamburger menu with animated slide-down drawer
- Integrated **Site Search** modal (keyboard shortcut Cmd+K)
- **Team Portal** call-to-action button

#### Hero Section
- Full-screen dark themed hero with animated gradient blobs and grid overlay
- Bold mission statement with animated entrance (Framer Motion)
- Two CTAs: "Team Portal" and "Partner With Us"
- Statistics row: Active Members, Initiatives, Partnerships, Years Active

#### About Section
- Mission statement and organization background
- Founder attribution
- Animated cards for 6 organizational purpose pillars (scroll-triggered)

#### Vision & Mission Section
- Detailed articulation of KCF's vision and operating philosophy
- Ethical governance, technology-assisted community building

#### Impact Metrics Display
- Real-time charitable impact pulled from live **Donation** entity data
- Categories: Meals Funded, Trees Planted, Clean Water Access, Children in School, Health & Medical Aid, Ocean Conservation
- Animated stat cards with conversion rates (e.g., $1 = 10 meals)
- Live update via entity subscription

#### Initiatives Section
- Interactive carousel/slider of 6 strategic pillars:
  1. Service Marketplace
  2. AI-Driven Solutions
  3. Ethical Technology
  4. Community Infrastructure
  5. Economic Empowerment
  6. Environmental Sustainability
- Each initiative has title, description, feature list, and tags
- Auto-play with manual navigation controls

#### Why We're Different Section
- Comparison or differentiators vs. standard nonprofits

#### Evolution Section
- Three-stage visual timeline showing cultural transformation:
  - Stage 1: Current State (extraction-based digital economy)
  - Stage 2: Transition
  - Stage 3: Future State (contribution-based communities)
- Animated stepper timeline
- Anchoring principles summary

#### Impact Map
- Interactive Leaflet map with regional impact markers
- Region-by-region breakdown (North America, Europe, Asia, Africa, etc.)
- Stats per region: beneficiaries, projects, volunteers

#### Leadership Section
- Directory of KCF leadership profiles
- Icons, roles, descriptions for each leader

#### Partner Section
- Partner organization logos/cards

#### Governance Section
- Interactive accordion for governance areas:
  - Operational Terms
  - Ethics & Standards
  - Legal Compliance
  - Evaluation Metrics
- Animated expand/collapse with Framer Motion

#### Prospectus Section
- High-level organizational prospectus overview

#### Board Recruitment Section
- Ideal board member profiles
- Excluded candidate types
- Commitment requirements
- CTA for prospective board applications

#### Community Stories
- Filterable feed of approved member-submitted stories
- Filter by pillar: Education, Economic Empowerment, Health & Wellness, etc.
- "Load More" pagination
- **Story Submit Form** — members can submit their own story (AI-assisted)
  - Author name, email, title, story, pillar, tags, location
  - Stories go into "pending" status for moderation

#### Engagement Section
- Newsletter signup form
- Volunteer registration form (saves to VolunteerSubmission entity)
- FAQ accordion with 6+ community questions

#### Footer
- Site navigation links
- Legal links
- Contact information
- Smooth-scroll internal navigation
- Copyright + impact branding

---

### 4.2 KindnessConnect Page (`/KindnessConnect`)

A dedicated public-facing page for the KindnessConnect giving platform. Dark-themed, editorial design.

#### Hero
- Full-screen hero with ambient gradient blobs
- "Give a little. Change a lot." headline
- Animated impact stat cards: Meals Funded, Trees Planted, Clean Water Access, Children in School

#### Stats Strip
- $592B total US charitable giving in 2024
- 76% of US adults donated last year
- 84% of Gen Z support a cause
- 6.3% year-over-year growth

#### Six Ways to Give (Feature Grid)
1. **Giving Plans** — Recurring monthly contributions from $5/month
2. **Micro-Donation Roundups** — Automatic card roundups
3. **Conscious Shopping Cashback** — Up to 15% cashback to charity
4. **Live Impact Dashboard** — Real-time outcome tracking
5. **Community Giving Circles** — Group/team giving pools
6. **Kindness Score & Milestones** — Gamified giving with badges

Feature 6 is an **expandable card** that reveals a mock dashboard preview with score progress bar and CTA buttons.

#### How It Works (3 Steps)
1. Create profile & choose causes
2. Set up giving method
3. Watch real outcomes unfold

Presented as an animated vertical timeline.

#### Trusted Causes / Partner Charities
Bento-grid layout of 6 verified charity partners:
- Feeding America (Hunger & Food Security, SDG 2)
- Water.org (Clean Water, SDG 6)
- Save the Children (Education, SDG 4)
- One Tree Planted (Climate, SDG 13)
- Ocean Conservancy (Ocean, SDG 14)
- UNICEF (Health, SDG 3)

#### Impact Section
- Big number stats: 94,200 meals, 18,750 trees, 6,400 water access, 4,100 children, 12t ocean plastic
- Animated horizontal allocation bar chart showing how giving is distributed across causes

#### Global Impact Map
- Interactive Leaflet map with global impact visualization
- Regional breakdowns and aggregate stats
- Hover effects with per-region metrics

#### Testimonials
- 3 user testimonials with star ratings, quotes, names, and roles

#### FAQ
- 6 expandable FAQ items covering donation mechanics, privacy, fees, Giving Circles, availability

#### Call to Action (Dual-Path)
- **Path 1: Create Free Account** — Email capture form for early access
- **Path 2: Direct Donation** — Quick $5/$10/$25 buttons, links to every.org/kindness-community-foundation
- Link to personal Giving Dashboard

---

### 4.3 Giving Dashboard (`/GivingDashboard`)

A personal, authenticated dashboard for tracking all giving activity. Requires login — auto-redirects to login if unauthenticated.

#### Summary Cards (always visible)
- Total Given (lifetime)
- Donations Logged (+ active recurring count)
- Active Goals (+ completed count)
- Top Cause

#### Tab Navigation
Six tabs:

**Overview Tab**
- Giving Over Last 6 Months (line chart)
- Active Goals sidebar (top 2 goals with progress bars)
- Subscriptions summary (monthly total, active/paused count)
- Impact Score card
- Impact at a Glance metrics

**Subscriptions Tab**
- SubscriptionManager component
- View/edit/pause/cancel recurring donations
- Per-subscription: cause, charity, amount, billing day, next date, status

**Impact Tab**
- Full ImpactMetrics component
- Monthly Giving Trend chart

**Goals Tab**
- Full GivingGoals component
- Create new goals, track progress, mark complete

**History Tab**
- DonationHistory component
- Full list of all past donations with cause, amount, date, type

**Payment Tab**
- PaymentMethods component
- Manage linked payment methods

---

### 4.4 Volunteer Dashboard (`/VolunteerDashboard`)

A personal dashboard for authenticated volunteers to track their engagement and contributions.

#### Header
- Welcome message with user name
- Total hours badge

#### Summary Metric Cards
- Total Hours Volunteered
- Active Signups (initiatives)
- Badges Earned
- Tasks Assigned

#### Upcoming Tasks
- List of team tasks assigned to the user
- Shows title, due date, priority badge, status

#### Badge Progress Tracker
- Visual display of 5 milestone badges:
  - First Steps (5 hrs)
  - Champion (25 hrs)
  - Leader (50 hrs)
  - Ambassador (100 hrs)
  - Lifetime (250 hrs)
- Earned badges highlighted in gold; locked badges shown greyed out

#### Recent Activity / Hours Timeline
- Chronological list of logged volunteer sessions
- Each entry: initiative name, date, hours, description

#### Initiative Signups List
- All active, completed, and paused initiative signups

---

### 4.5 Team Portal Landing (`/TeamPortalLanding`)

A gateway landing page for the internal team portal. Auto-redirects authenticated users directly to the portal.

#### Content
- "Team Communication Made Simple" hero headline
- Description: secure, all-in-one collaboration platform for KCF
- **Features Grid** (6 cards):
  - Real-time Messaging
  - Document Management
  - Announcements
  - Team Directory
  - Secure & Private
  - Fast & Efficient
- Enter Portal CTA button
- Footer

---

### 4.6 Team Portal / Synergy Hub (`/TeamPortal`)

A full internal collaboration platform with a persistent sidebar navigation and multi-section content areas. Dark-themed app-style UI ("Synergy Hub").

#### Sidebar Navigation (sections)
- **Dashboard** — Overview with stats and welcome
- **Announcements** — Company-wide posts (with unread badge)
- **Notifications** — User notifications (with unread badge)
- **Communicate:**
  - Messages (Group chat)
  - Direct Messages
- **Work:**
  - Tasks
  - Documents
- **People:**
  - Team Directory
  - My Profile
  - AI Assistant
- Bottom toolbar: Search (Cmd+K), New Task

#### Dashboard Section
- Welcome greeting card
- 4 stat cards: Messages, Tasks Done, Open Tasks, Team Members

#### Messages Section
- Live group message feed from TeamMessage entity
- Each message: sender avatar, name, message content

#### Tasks Section
- List of all TeamTask records
- Shows title, description, status badge, priority badge

#### Documents Section
- List of all TeamDocument records
- Shows file title, uploader name, category badge, description

#### Announcements Section
- List of all TeamAnnouncement records
- Shows author avatar, title, pinned indicator, content

#### Team Directory Section
- Grid of all TeamMember records
- Shows avatar initials, full name, department, email

#### My Profile Section
- Gradient header banner
- Logged-in user's name, username handle, and role

#### AI Assistant Section
- Full chat interface — "Synergy Hub AI Assistant"
- Suggestion chips (draft announcement, productivity tips, help with directory, etc.)
- Chat bubbles (user right-aligned, AI left-aligned with bot avatar)
- Animated typing indicator
- Powered by Base44 `aiMessageAssistant` backend function

#### Notifications Section
- List of all notifications for the user
- Click to mark as read
- Notification types: message, mention, task_assigned, announcement

#### Search Overlay (Cmd+K)
- Blurred backdrop modal
- Full-text search across messages, tasks, documents

#### New Task Modal
- Quick create form: title + description
- Creates a TeamTask record linked to current user

---

### 4.7 Analytics Dashboard (`/Analytics`)

An admin-level dashboard for monitoring platform-wide metrics and usage patterns.

#### Header
- "Analytics Dashboard" title
- Subtitle: "Track platform growth and usage patterns"

#### Key Metrics Grid (MetricsGrid)
- Total Users
- Total Volunteer Hours
- Total Documents
- Growth Rate (week-over-week)

#### Activity Chart (last 30 days)
- Line/bar chart of daily signups and active users (Recharts)

#### Key Metrics List (TopMetrics)
- New User Signups (last 7 days)
- Total Volunteer Hours Logged
- Team Documents count
- Active Users count
- Growth Rate %

#### Activity Breakdown Chart (MetricBreakdown)
- Bar chart breaking down Analytics events by type:
  - user_signup, volunteer_signup, hours_logged, document_uploaded, message_sent, announcement_posted, story_submitted

---

## 5. Data Entities

| Entity | Purpose | Key Fields |
|---|---|---|
| **User** | Platform users (built-in) | email, full_name, role |
| **CommunityStory** | Member-submitted impact stories | author, title, story, pillar, status (pending/approved/rejected) |
| **VolunteerSubmission** | General volunteer interest sign-ups | name, email, skills, status |
| **VolunteerSignup** | Formal initiative enrollment | user_email, initiative_id, status |
| **VolunteerHours** | Logged volunteer session hours | user_email, hours, activity_date, initiative_name |
| **VolunteerBadge** | Earned milestone badges | user_email, badge_type, hours_earned_at |
| **TeamMember** | Internal team directory profiles | email, full_name, role, department, profile_image_url |
| **TeamMessage** | Group and direct messages | sender_email, message, message_type |
| **TeamDocument** | Uploaded team files | title, file_url, category, uploaded_by |
| **TeamAnnouncement** | Company-wide posts | title, content, author, priority, is_pinned |
| **TeamTask** | Personal and team tasks | title, status, priority, assigned_to, due_date |
| **ChatGroup** | Group messaging channels | name, members, created_by |
| **Notification** | In-app user notifications | recipient_email, type, title, is_read |
| **MessageAttachment** | File attachments for messages | message_id, file_url, file_name |
| **TaskAttachment** | File attachments for tasks | task_id, file_url, file_name |
| **Donation** | Individual donation records | user_email, amount, cause, donation_type, donation_date |
| **GivingGoal** | Personal fundraising targets | user_email, title, cause, target_amount, current_amount |
| **Subscription** | Recurring monthly donations | user_email, cause, amount, billing_day, status |
| **Analytics** | Platform activity event log | metric_type, metric_value, metric_date, user_email |

---

## 6. Component Library

### Public Site Components (`components/kcf/`)
| Component | Description |
|---|---|
| Header | Fixed nav bar with scroll behavior, mobile menu, site search |
| HeroSection | Full-screen landing hero |
| AboutSection | Mission + purpose cards |
| VisionMission | Vision and mission content |
| ImpactMetricsDisplay | Real-time donation impact visualization |
| InitiativesSection | Interactive initiatives carousel |
| WhyDifferent | Differentiators section |
| EvolutionSection | 3-stage evolution timeline |
| ImpactMap | Leaflet-based global impact map |
| LeadershipSection | Leadership profiles grid |
| PartnerSection | Partner logos and info |
| GovernanceSection | Governance accordion |
| ProspectusSection | Organizational prospectus |
| BoardRecruitmentSection | Board recruitment criteria |
| CommunityStories | Stories feed with filter + submit |
| StorySubmitForm | Story submission form (AI-assisted) |
| StoryCard | Individual story display card |
| EngagementSection | Newsletter + volunteer signup + FAQ |
| Footer | Global site footer |
| SiteSearch | Cmd+K search overlay |
| GlobalImpactMap | Full interactive map component |
| GlobalProgressBar | (Removed from KindnessConnect) Live progress bar |

### Giving Components (`components/giving/`)
| Component | Description |
|---|---|
| DonationChart | 6-month donation trend chart |
| DonationHistory | Full paginated donation log |
| GivingGoals | Goal cards with progress tracking |
| ImpactMetrics | Cause-to-outcome impact breakdown |
| ImpactScore | Personal kindness/impact score card |
| PaymentMethods | Payment method management |
| SubscriptionCalendar | Visual billing calendar |
| SubscriptionManager | Full subscription management CRUD |

### Volunteer Components (`components/volunteer/`)
| Component | Description |
|---|---|
| VolunteerPersonalDashboard | Full volunteer personal hub |
| BadgeDisplay | Badge grid with locked/earned states |
| HoursTimeline | Chronological activity log |
| InitiativeSignupModal | Modal to sign up for initiatives |
| LogHoursModal | Modal to log volunteer session hours |
| SignupsList | List of initiative enrollments |

### Team Portal Components (`components/team/`)
| Component | Description |
|---|---|
| Dashboard | Team overview stats dashboard |
| Messages | Group messaging interface |
| ChannelMessaging | Channel-based message view |
| AIMessageAssistant | AI chat interface |
| Announcements | Announcements feed |
| NotificationPanel | Notifications panel |
| Tasks | Task list view |
| TaskDashboard | Full task management view |
| Documents | Document library |
| DocumentAttachments | File attachment handling |
| TeamDirectory | Member directory grid |
| TeamDirectoryView | Detailed directory view |
| GlobalSearch | Global cross-entity search |
| VoiceDictation | Voice-to-text input |
| TeamPortalLayout | Portal layout wrapper |
| TeamPortalFooter | Portal footer |

### Analytics Components (`components/analytics/`)
| Component | Description |
|---|---|
| MetricsGrid | 4-card key metrics overview |
| ActivityChart | 30-day activity line chart |
| MetricBreakdown | Event type breakdown bar chart |
| TopMetrics | Ranked metrics list |

---

## 7. Backend Functions

| Function | Purpose |
|---|---|
| `aiMessageAssistant` | Handles AI chat requests in Team Portal. Accepts user messages, invokes LLM, returns contextual responses. |
| `awardVolunteerBadges` | Automated function to evaluate volunteer hours and award milestone badges (First Steps, Champion, Leader, Ambassador, Lifetime). |

> **Note:** Backend functions require a Builder+ subscription. These functions exist in the codebase but require plan upgrade to be active.

---

## Appendix: Route Summary

```
/                     → Home (main KCF website)
/KindnessConnect      → Giving platform landing page
/GivingDashboard      → Personal giving stats (auth required)
/VolunteerDashboard   → Personal volunteer hub (auth required)
/TeamPortalLanding    → Team portal gateway
/TeamPortal           → Synergy Hub internal app (auth required)
/Analytics            → Platform analytics (admin)
```

---

*Document generated: March 2026 | KCF Platform*