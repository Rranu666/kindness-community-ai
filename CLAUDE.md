# IMPORTANT — Deployment Reminders

## This folder deploys to kindnesscommunity.ai — NOT kindnesscommunityfoundation.com

This project folder:
**`Main website-kindness-community-foundation. 26th March 2026zip`**

Has TWO git remotes that go to DIFFERENT live sites:

| Remote | GitHub Repo | Live Site |
|--------|-------------|-----------|
| `origin` | `Rranu666/kindness-community-foundation` | https://kindnesscommunity.ai/ ← DIFFERENT SITE |
| `kindness-ai` | `Rranu666/kindness-community-ai` | https://kindnesscommunityfoundation.com/ ← CORRECT SITE |

## Rules

- **NEVER push to `origin`** from this folder — it deploys to `kindnesscommunity.ai` which is a completely separate site
- **ALWAYS push to `kindness-ai`** to deploy to `kindnesscommunityfoundation.com`

```bash
# CORRECT — deploys to kindnesscommunityfoundation.com
git push kindness-ai main

# WRONG — deploys to the wrong site kindnesscommunity.ai
git push origin main
```
