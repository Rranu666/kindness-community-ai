/**
 * Netlify Edge Function — Blog Post Open Graph Tags
 *
 * When a social crawler (WhatsApp, Telegram, Facebook, Twitter, etc.) requests
 * a blog post URL, this function fetches the post data from Supabase and returns
 * a minimal HTML page with the correct og:title, og:description, og:image, etc.
 *
 * Regular users are passed through to the React SPA unchanged.
 */

const BOT_PATTERN = /facebookexternalhit|twitterbot|whatsapp|telegrambot|linkedinbot|slackbot|discordbot|googlebot|bingbot|applebot|duckduckbot|yandexbot|baiduspider|ia_archiver|embedly|outbrain|quora|pinterest|vkshare|w3c_validator|curl|wget|python-requests/i;

const FALLBACK_IMAGE = "https://kindnesscommunityfoundation.com/og-image.png";
// ^^^ 1200×630 branded PNG in /public/og-image.png
const SITE_NAME     = "Kindness Community Foundation";
const BASE_URL      = "https://kindnesscommunityfoundation.com";

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function handler(request, context) {
  const ua = request.headers.get("user-agent") || "";

  // Let regular users through to the React SPA
  if (!BOT_PATTERN.test(ua)) {
    return context.next();
  }

  // Extract slug from URL path: /blog/:slug
  const url  = new URL(request.url);
  const slug = url.pathname.replace(/^\/blog\//, "").replace(/\/$/, "").trim();

  if (!slug) return context.next();

  // Pull Supabase credentials from Netlify env vars
  const supabaseUrl = Deno.env.get("VITE_SUPABASE_URL");
  const supabaseKey = Deno.env.get("VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseKey) return context.next();

  let post = null;
  try {
    const apiUrl = `${supabaseUrl}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=title,excerpt,meta_description,image_url,author_name,category,created_at&limit=1`;
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
    // On any error fall through to SPA
    return context.next();
  }

  if (!post) return context.next();

  const title       = escapeHtml(post.title) + ` | ${SITE_NAME} Blog`;
  const description = escapeHtml(post.meta_description || post.excerpt || "Read the latest from Kindness Community Foundation.");

  // Ensure image URL is absolute; Supabase storage URLs are already absolute.
  // If empty/relative, fall back to the branded og-image.png.
  let rawImage = post.image_url || "";
  if (rawImage && !rawImage.startsWith("http://") && !rawImage.startsWith("https://")) {
    rawImage = BASE_URL + (rawImage.startsWith("/") ? rawImage : "/" + rawImage);
  }
  const image = escapeHtml(rawImage || FALLBACK_IMAGE);
  const pageUrl     = escapeHtml(`${BASE_URL}/blog/${slug}`);
  const author      = escapeHtml(post.author_name || SITE_NAME);
  const pubDate     = post.created_at ? new Date(post.created_at).toISOString() : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta name="author" content="${author}" />
  ${pubDate ? `<meta name="article:published_time" content="${pubDate}" />` : ""}

  <!-- Open Graph -->
  <meta property="og:type"        content="article" />
  <meta property="og:site_name"   content="${SITE_NAME}" />
  <meta property="og:url"         content="${pageUrl}" />
  <meta property="og:title"       content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image"       content="${image}" />
  <meta property="og:image:width"  content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt"   content="${escapeHtml(post.title)}" />
  <meta property="og:locale"      content="en_US" />
  ${pubDate ? `<meta property="article:published_time" content="${pubDate}" />` : ""}
  ${post.author_name ? `<meta property="article:author" content="${author}" />` : ""}

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:site"        content="@KCFKindness" />
  <meta name="twitter:title"       content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image"       content="${image}" />
  <meta name="twitter:image:alt"   content="${escapeHtml(post.title)}" />

  <!-- Canonical + redirect real users to the SPA -->
  <link rel="canonical" href="${pageUrl}" />
  <meta http-equiv="refresh" content="0;url=${pageUrl}" />
</head>
<body>
  <p><a href="${pageUrl}">${escapeHtml(post.title)}</a></p>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}

export const config = { path: "/blog/*" };
