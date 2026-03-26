import { useEffect } from "react";

export default function Layout({ children }) {
  useEffect(() => {
    // Load Montserrat + Dancing Script fonts (used by KCFLogo)
    if (!document.querySelector("link[href*='Montserrat']")) {
      const fontLink = document.createElement("link");
      fontLink.rel = "stylesheet";
      fontLink.href =
        "https://fonts.googleapis.com/css2?family=Montserrat:wght@900&family=Dancing+Script:wght@500;600&display=swap";
      document.head.appendChild(fontLink);
    }

    // Ensure html lang attribute
    document.documentElement.lang = "en";
  }, []);

  return (
    <div>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-rose-500 focus:text-white focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>
      {children}
    </div>
  );
}