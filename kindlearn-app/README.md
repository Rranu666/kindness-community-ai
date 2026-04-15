# KindLearn — Mobile App

Standalone Android & iOS app for **KindLearn**, the language-learning product of Kindness Community Foundation.

The app is a Capacitor wrapper that loads **https://kindnesscommunityfoundation.com/kindlearn** — so all content updates on the website are instantly reflected in the app without a new release.

---

## App Details

| Field | Value |
|-------|-------|
| **App ID** | `com.kindnesscommunityfoundation.kindlearn` |
| **App Name** | KindLearn |
| **Server URL** | https://kindnesscommunityfoundation.com/kindlearn |
| **Platforms** | Android, iOS |

---

## Prerequisites

- Node.js 18+
- For Android: Android Studio + Android SDK (API 22+)
- For iOS: Xcode 15+ (macOS only)
- Java 17+ (for Android builds)

---

## Setup

### 1. Install dependencies
```bash
cd kindlearn-app
npm install
```

### 2. Add native platforms (first time only)
```bash
npm run add:android
npm run add:ios        # macOS only
```

### 3. Sync web assets to native projects
```bash
npm run sync
```

---

## Development

### Open in Android Studio
```bash
npm run open:android
```
Then press **Run ▶** in Android Studio to launch on a device or emulator.

### Open in Xcode (macOS)
```bash
npm run open:ios
```
Then select your device/simulator and press **Run ▶** in Xcode.

---

## Building for Release

### Android (APK / AAB)
```bash
npm run build:android
```
Or open in Android Studio → Build → Generate Signed Bundle/APK.

### iOS (IPA)
```bash
npm run build:ios
```
Or open in Xcode → Product → Archive, then distribute via App Store Connect.

---

## App Store Metadata

### Short Description
Learn languages through kindness — 8 languages, speaking practice, kids mode, and daily streaks.

### Long Description
KindLearn makes language learning personal, joyful, and community-driven.

- 🌍 **8 Languages** — Spanish, French, German, Japanese, Korean, Italian, Portuguese, Mandarin
- 🎤 **Speaking Practice** — Real-time pronunciation feedback using your microphone
- 🧒 **Kids Mode** — Age-appropriate lessons with fun avatars for ages 7–15
- 🔥 **Daily Streaks** — Stay motivated with streak tracking and milestone badges
- 📊 **Insights** — Track your learning velocity, vocabulary mastery, and patterns
- 🃏 **Flashcards** — Spaced repetition system keeps words in long-term memory
- 👂 **Listening Games** — Train your ear with audio comprehension exercises
- 🏆 **Leaderboards** — Friendly competition with your community

---

## Project Structure

```
kindlearn-app/
├── capacitor.config.ts   # Capacitor config (App ID, server URL, plugins)
├── package.json          # Dependencies and scripts
├── www/                  # Fallback web shell (shown only if offline)
│   └── index.html
├── android/              # Android native project (generated — do not edit manually)
└── ios/                  # iOS native project (generated — do not edit manually)
```

---

## Updating the App

Since the app loads from the live website, **most updates require no app release**.

For native-level changes (new Capacitor plugins, splash screen, icons, permissions), update `capacitor.config.ts`, run `npm run sync`, and submit a new build.
