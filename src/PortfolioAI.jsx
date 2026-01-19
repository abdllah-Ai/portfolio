// src/PortfolioAI.jsx
// Main portfolio layout orchestrating all sections
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useContent } from './context/ContentContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import IntroGate from './components/IntroGate.jsx';
import TopProgressBar from './components/TopProgressBar.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Skills from './components/Skills.jsx';
import Projects from './components/Projects.jsx';
import Labs from './components/Labs.jsx';
import Blog from './components/Blog.jsx';
import Certificates from './components/Certificates.jsx';
import Gallery from './components/Gallery.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

// Section IDs for intersection observer accent tracking
const ACCENT_SECTIONS = [
  { id: 'hero', accent: 'cyan' },
  { id: 'about', accent: 'cyan' },
  { id: 'skills', accent: 'cyan' },
  { id: 'projects', accent: 'cyan' },
  { id: 'labs', accent: 'cyan' },
  { id: 'blog', accent: 'cyan' },
  { id: 'certificates', accent: 'cyan' },
  { id: 'gallery', accent: 'cyan' },
  { id: 'contact', accent: 'cyan' },
];

export default function PortfolioAI() {
  const { content, loading } = useContent();

  // Set up intersection observer for section tracking
  useEffect(() => {
    const observers = [];

    ACCENT_SECTIONS.forEach(({ id, accent }) => {
      const element = document.getElementById(id);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              document.documentElement.setAttribute('data-section', id);
            }
          });
        },
        { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduceMotion.matches) return;

    const root = document.documentElement;
    const ease = 0.12;
    let raf = null;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.35;
    let currentX = targetX;
    let currentY = targetY;

    const applyPointer = () => {
      const xRatio = Math.min(Math.max(currentX / window.innerWidth, 0), 1);
      const yRatio = Math.min(Math.max(currentY / window.innerHeight, 0), 1);
      root.style.setProperty('--pointer-x', `${(xRatio * 100).toFixed(2)}%`);
      root.style.setProperty('--pointer-y', `${(yRatio * 100).toFixed(2)}%`);
    };

    const animate = () => {
      currentX += (targetX - currentX) * ease;
      currentY += (targetY - currentY) * ease;
      applyPointer();
      if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
    };

    const start = () => {
      if (raf === null) raf = requestAnimationFrame(animate);
    };

    const handlePointer = (event) => {
      if (event.pointerType && event.pointerType !== 'mouse') return;
      targetX = event.clientX;
      targetY = event.clientY;
      start();
    };

    const resetPointer = () => {
      targetX = window.innerWidth / 2;
      targetY = window.innerHeight * 0.35;
      start();
    };

    window.addEventListener('pointermove', handlePointer, { passive: true });
    window.addEventListener('pointerdown', handlePointer, { passive: true });
    window.addEventListener('mouseleave', resetPointer);
    window.addEventListener('blur', resetPointer);
    window.addEventListener('resize', resetPointer);

    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('pointerdown', handlePointer);
      window.removeEventListener('mouseleave', resetPointer);
      window.removeEventListener('blur', resetPointer);
      window.removeEventListener('resize', resetPointer);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, []);

  // Show loading state while content loads
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--theme-bg-dark-start)]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[var(--neon-accent)] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[var(--theme-text-muted-dark)]">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>{content.name} | {content.title}</title>
        <meta name="description" content={content.about?.intro || `${content.name} - ${content.title}`} />
        <meta property="og:title" content={`${content.name} | ${content.title}`} />
        <meta property="og:description" content={content.about?.intro || content.title} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.name} />
        <meta name="twitter:description" content={content.title} />
      </Helmet>

      {/* Intro animation */}
      <IntroGate />

      {/* Progress bar */}
      <TopProgressBar />

      {/* Navigation */}
      <Navbar />

      {/* Main content */}
      <ErrorBoundary>
        <main className="overflow-hidden">
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Labs />
          <Blog />
          <Certificates />
          <Gallery />
          <Contact />
        </main>
      </ErrorBoundary>

      {/* Footer */}
      <Footer />
    </>
  );
}
