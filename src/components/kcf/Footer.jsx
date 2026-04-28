import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Heart, ArrowUpRight, Mail, MapPin } from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import KCFLogo from "@/components/kcf/KCFLogo";

const quickLinks = [
  { label: "Home", href: "/", external: true },
  { label: "Initiatives", href: "/initiatives", external: true },
  { label: "Vision & Mission", href: "/vision", external: true },
  { label: "Leadership", href: "/leadership", external: true },
  { label: "KindWave App", href: "/kindwave", external: true },
  { label: "KindCalmUnity", href: "/kindcalmunity", external: true },
  { label: "Blog", href: "/blog", external: true },
  { label: "Volunteer", href: "/volunteer", external: true },
  { label: "Governance", href: "/governance", external: true },
  { label: "Personal Growth", href: "/grow", external: true },
  { label: "Contact", href: "/contact", external: true },
];

const legalLinks = [
  { label: "Terms of Service", href: "/governance", external: true },
  { label: "Privacy Policy", href: "/governance", external: true },
  { label: "Governance & Ethics", href: "/governance", external: true },
];

export default function Footer({ hideCta = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const isHome = location.pathname === "/" || location.pathname === "/Home";

  const scrollTo = (href) => {
    if (!isHome) {
      navigate("/", { state: { scrollTarget: href } });
      return;
    }
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    const interval = setInterval(() => {
      const target = document.querySelector(href);
      if (target) {
        clearInterval(interval);
        target.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    setTimeout(() => clearInterval(interval), 5000);
  };

  return (
    <footer id="contact" ref={ref} className="relative overflow-hidden"
      style={{ background: "#e8e8e7", borderTop: "1px solid rgba(0,0,0,0.07)" }}>

      {/* CTA Section */}
      {!hideCta && (
        <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12 border-b border-gray-200">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-rose-200 text-rose-500 text-xs tracking-widest uppercase font-semibold mb-6"
                style={{ background: "rgba(244,63,94,0.06)" }}>
                Get in touch
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-gray-900 leading-tight mb-4">
                Let's build{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-400">
                  something meaningful
                </span>
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Ready to partner with us? Reach out — we'd love to hear from you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:justify-end">
              <motion.a
                href="mailto:contact@kindnesscommunityfoundation.com"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-white font-bold relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%)" }} />
                <Mail className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Get In Touch</span>
                <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </motion.a>
            </div>
          </motion.div>
        </div>
      )}

      {/* Links grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10 sm:py-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* Brand column */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="lg:col-span-1"
        >
          <div className="mb-5">
            <KCFLogo />
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed mb-4 mt-4">
            Building sustainable systems for community impact worldwide.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400 font-semibold">
            <MapPin className="w-4 h-4 text-rose-400 flex-shrink-0" />
            Newport Beach, CA · USA
          </div>
        </motion.div>

        {/* Quick Links & Legal */}
        {[
          { title: "Quick Links", links: quickLinks },
          { title: "Legal", links: legalLinks },
        ].map((col, ci) => (
          <motion.div
            key={col.title}
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 + ci * 0.1 }}
          >
            <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.18em] mb-5">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  {link.external ? (
                    <Link to={link.href} className="text-sm text-gray-500 hover:text-rose-500 transition-all duration-200">
                      {link.label}
                    </Link>
                  ) : (
                    <button
                      onClick={() => scrollTo(link.href)}
                      className="text-sm text-gray-500 hover:text-rose-500 transition-all duration-200 text-left"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="text-xs font-black text-gray-900 uppercase tracking-[0.18em] mb-5">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li>
              <a href="mailto:contact@kindnesscommunityfoundation.com"
                className="text-gray-600 hover:text-rose-500 transition-colors duration-200 font-semibold whitespace-nowrap block text-xs">
                contact@kindnesscommunityfoundation.com
              </a>
            </li>
            <li className="text-gray-500 font-medium leading-relaxed text-sm">
              Newport Beach, California<br />
              USA 92660
            </li>
          </ul>
        </motion.div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-center">
          <p className="text-xs text-gray-400 font-medium text-center flex items-center gap-1.5 flex-wrap justify-center">
            © {new Date().getFullYear()} Kindness Community Foundation. Developed by KCF LLC, A California, USA company serving the world. All rights reserved. Made with{" "}
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline flex-shrink-0" />{" "}
            for our community.
          </p>
        </div>
      </div>
    </footer>
  );
}
