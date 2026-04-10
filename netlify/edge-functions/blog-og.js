/**
 * Netlify Edge Function — Blog Post Open Graph injection
 *
 * For every /blog/:slug request (bots AND real users):
 *   1. Fetch the blog post from Supabase
 *   2. Fetch the real index.html (full React SPA)
 *   3. Replace the generic OG tags with post-specific ones
 *   4. Return the patched HTML
 *
 * Real users: React mounts normally, full SPA experience
 * Social bots: they read OG tags, don't execute JS — see correct preview
 *
 * No user-agent detection needed — eliminates the entire class of
 * "bot UA not matched → wrong HTML served" bugs.
 */

const SUPABASE_URL   = "https://dwewfplxnemuwwwutfhq.supabase.co";
const FALLBACK_IMAGE = "https://kindnesscommunityfoundation.com/og-image.jpg";
const SITE_NAME      = "Kindness Community Foundation";
const BASE_URL       = "https://kindnesscommunityfoundation.com";

function esc(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function handler(request, context) {
  const url  = new URL(request.url);
  const slug = url.pathname.replace(/^\/blog\//, "").replace(/\/$/, "").trim();
  if (!slug) return context.next();

  // ── 1. Fetch post from Supabase ──────────────────────────────────────────
  const supabaseKey = Deno.env.get("VITE_SUPABASE_ANON_KEY");
  if (!supabaseKey) return context.next();

  let post = null;
  try {
    const apiUrl = `${SUPABASE_URL}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=title,excerpt,meta_description,image_url,author_name,created_at&limit=1`;
    const res = await fetch(apiUrl, {
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: "application/json",
      },
    });
    if (res.ok) {
      const rows = await res.json();
      post = rows[0] ?? null;
    }
  } catch (_) {
    return context.next();
  }

  if (!post) return context.next();

  // ── 2. Resolve image URL ─────────────────────────────────────────────────
  let rawImage = post.image_url || "";
  if (rawImage && !rawImage.startsWith("http")) {
    rawImage = BASE_URL + (rawImage.startsWith("/") ? rawImage : "/" + rawImage);
  }
  const isSvgOrEmpty = !rawImage || /\.svg(\?|$)/i.test(rawImage);
  const imageUrl = isSvgOrEmpty ? FALLBACK_IMAGE : rawImage;

  const title       = esc(post.title) + ` | ${SITE_NAME} Blog`;
  const description = esc(post.meta_description || post.excerpt || `Read ${post.title} on the KCF Blog.`);
  const pageUrl     = `${BASE_URL}/blog/${slug}`;
  const pubDate     = post.created_at ? new Date(post.created_at).toISOString() : "";

  // ── 3. Fetch real index.html ─────────────────────────────────────────────
  let html;
  try {
    const indexRes = await fetch(new URL("/index.html", request.url));
    html = await indexRes.text();
  } catch (_) {
    return context.next();
  }

  // ── 4. Inject / replace OG tags ──────────────────────────────────────────
  const ogBlock = `
  <!-- Blog post OG — injected by edge function -->
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:type"         content="article" />
  <meta property="og:site_name"    content="${esc(SITE_NAME)}" />
  <meta property="og:url"          content="${esc(pageUrl)}" />
  <meta property="og:title"        content="${title}" />
  <meta property="og:description"  content="${description}" />
  <meta property="og:image"        content="${esc(imageUrl)}" />
  <meta property="og:image:type"   content="image/jpeg" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:locale"       content="en_US" />
  ${pubDate ? `<meta property="article:published_time" content="${pubDate}" />` : ""}
  ${post.author_name ? `<meta property="article:author" content="${esc(post.author_name)}" />` : ""}
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image"       content="${esc(imageUrl)}" />
  <link rel="canonical"            href="${esc(pageUrl)}" />`;

  // Remove existing og:/twitter:/title/description/canonical tags from index.html
  // then inject the post-specific ones at the top of <head>
  html = html
    .replace(/<title>[^<]*<\/title>/gi, "")
    .replace(/<meta\s+name="description"[^>]*>/gi, "")
    .replace(/<meta\s+property="og:[^"]*"[^>]*>/gi, "")
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>/gi, "")
    .replace(/<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/<head>/, `<head>${ogBlock}`);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Edge-OG": "injected",
    },
  });
}

export const config = { path: "/blog/*" };
