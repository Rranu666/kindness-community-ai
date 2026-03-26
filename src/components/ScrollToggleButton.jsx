import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function ScrollToggleButton() {
  const [visible, setVisible] = useState(false);
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(scrollY > 200);
      setAtBottom(maxScroll > 0 && scrollY >= maxScroll - 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          key="scroll-toggle"
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 28 }}
          onClick={handleClick}
          title={atBottom ? "Scroll to top" : "Scroll to bottom"}
          className="fixed bottom-6 right-6 z-[9999] w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg"
          style={{ background: "linear-gradient(135deg, #f43f5e, #ec4899)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
        >
          {atBottom ? <ArrowUp className="w-5 h-5" /> : <ArrowDown className="w-5 h-5" />}
        </motion.button>
      )}
    </AnimatePresence>
  );
}