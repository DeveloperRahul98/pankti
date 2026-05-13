"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 32,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left bg-primary z-50"
    />
  );
}

export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          aria-label="Scroll to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 280, damping: 22 }}
          className="fixed bottom-24 right-4 sm:bottom-28 sm:right-5 lg:bottom-32 lg:right-6 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-fg shadow-xl shadow-black/40 hover:bg-[var(--primary-hover)]"
        >
          <ArrowUp className="h-5 w-5" />
          <span className="absolute inset-0 rounded-full ring-2 ring-primary/40 animate-ping pointer-events-none opacity-0 hover:opacity-100" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
