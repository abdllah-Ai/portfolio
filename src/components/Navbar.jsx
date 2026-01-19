// src/components/Navbar.jsx
// Sticky navigation with scroll-spy, theme toggle, and mobile menu
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Monitor, Globe } from 'lucide-react';
import { useUi } from '../context/UiContext.jsx';
import { useContent } from '../context/ContentContext.jsx';

const NAV_SECTIONS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'labs', label: 'Labs' },
  { id: 'blog', label: 'Blog' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'contact', label: 'Contact' },
];

const THEME_ICONS = {
  system: Monitor,
  light: Sun,
  dark: Moon,
};

export default function Navbar() {
  const { theme, setTheme, lang, setLang } = useUi();
  const { content } = useContent();
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);
  const [navHeight, setNavHeight] = useState(0);

  const getScrollBehavior = () => {
    if (typeof window === 'undefined') return 'auto';
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  };

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const update = () => {
      setNavHeight(navRef.current?.offsetHeight || 0);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (!mobileMenuOpen) {
      document.body.style.overflow = '';
      return;
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [mobileMenuOpen]);

  // Scroll spy using IntersectionObserver
  useEffect(() => {
    const observers = [];
    const offset = (navHeight || 72) + 12;

    NAV_SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        { rootMargin: `-${offset}px 0px -55% 0px`, threshold: 0.1 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [navHeight]);

  const scrollToSection = useCallback((id) => {
    if (typeof window === 'undefined') return;
    const element = document.getElementById(id);
    if (!element) return;
    const offset = (navHeight || 72) + 12;
    const top = element.getBoundingClientRect().top + window.scrollY - offset;
    setMobileMenuOpen(false);
    window.scrollTo({ top, behavior: getScrollBehavior() });
  }, [navHeight]);

  const cycleTheme = () => {
    const modes = ['system', 'light', 'dark'];
    const currentIndex = modes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % modes.length;
    setTheme(modes[nextIndex]);
  };

  const toggleLang = () => {
    setLang(lang === 'en' ? 'ar' : 'en');
  };

  const ThemeIcon = THEME_ICONS[theme] || Monitor;

  return (
    <>
      <motion.nav
        ref={navRef}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300
          ${scrolled ? 'nav-surface' : ''}
        `}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                scrollToSection('hero');
              }}
              className="font-bold text-xl lg:text-2xl text-accent neon-text cursor-pointer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {content.name?.split(' ')[0] || 'NeonForge'}
            </motion.a>

            {/* Desktop nav links */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_SECTIONS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(id)}
                  aria-current={activeSection === id ? 'true' : 'false'}
                  className="nav-link px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-2">
              {/* Theme toggle */}
              <motion.button
                onClick={cycleTheme}
                className="p-2.5 rounded-xl social-card"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Theme: ${theme}`}
              >
                <ThemeIcon size={18} />
              </motion.button>

              {/* Language toggle */}
              <motion.button
                onClick={toggleLang}
                className="p-2.5 rounded-xl social-card hidden sm:flex items-center gap-1"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label={`Language: ${lang}`}
              >
                <Globe size={18} />
                <span className="text-xs uppercase font-bold">{lang}</span>
              </motion.button>

              {/* Mobile menu button */}
              <motion.button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2.5 rounded-xl social-card lg:hidden"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Open menu"
                aria-controls="mobile-menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu size={20} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 modal-overlay lg:hidden"
            />

            {/* Menu panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-full nav-panel lg:hidden"
              id="mobile-menu"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 nav-divider">
                  <span className="font-bold text-xl text-accent neon-text">Menu</span>
                  <motion.button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xl social-card"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close menu"
                  >
                    <X size={20} />
                  </motion.button>
                </div>

                {/* Nav links */}
                <nav className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-2">
                    {NAV_SECTIONS.map(({ id, label }, index) => (
                      <motion.button
                        key={id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => scrollToSection(id)}
                        className={`nav-link-mobile w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${activeSection === id ? 'nav-link-mobile-active' : ''}`}
                      >
                        {label}
                      </motion.button>
                    ))}
                  </div>
                </nav>

                {/* Footer controls */}
                <div className="p-6 divider">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={cycleTheme}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl social-card"
                    >
                      <ThemeIcon size={18} />
                      <span className="capitalize text-sm">{theme}</span>
                    </button>
                    <button
                      onClick={toggleLang}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl social-card"
                    >
                      <Globe size={18} />
                      <span className="uppercase text-sm font-bold">{lang}</span>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
