// src/components/IntroGate.jsx
// Fullscreen intro overlay with typewriter animation
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContent } from '../context/ContentContext.jsx';

export default function IntroGate({ onComplete }) {
  const { content } = useContent();
  const [visible, setVisible] = useState(true);
  const [text, setText] = useState('');
  const [phase, setPhase] = useState(0);

  const phrases = [
    content.name || 'NeonForge Studio',
    content.taglinePhrases?.[0] || 'Creative Excellence',
  ];

  useEffect(() => {
    // Check if already shown this session
    const hasShown = sessionStorage.getItem('intro.shown');
    if (hasShown) {
      setVisible(false);
      onComplete?.();
      return;
    }

    let currentPhrase = phrases[phase];
    let charIndex = 0;
    let typingTimeout;

    const typeNextChar = () => {
      if (charIndex <= currentPhrase.length) {
        setText(currentPhrase.slice(0, charIndex));
        charIndex++;
        typingTimeout = setTimeout(typeNextChar, 60);
      } else if (phase < phrases.length - 1) {
        // Pause then move to next phrase
        typingTimeout = setTimeout(() => {
          setPhase((p) => p + 1);
        }, 800);
      } else {
        // Done typing, fade out
        typingTimeout = setTimeout(() => {
          setVisible(false);
          sessionStorage.setItem('intro.shown', 'true');
          onComplete?.();
        }, 1200);
      }
    };

    typingTimeout = setTimeout(typeNextChar, 400);

    return () => clearTimeout(typingTimeout);
  }, [phase]);

  // Reset text when phase changes
  useEffect(() => {
    if (phase > 0) {
      setText('');
    }
  }, [phase]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[100] flex items-center justify-center intro-overlay"
        >
          {/* Ambient glow */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full accent-blob blur-[100px]" />
          </div>

          {/* Text content */}
          <div className="relative z-10 text-center px-6">
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`font-bold ${phase === 0 ? 'text-5xl md:text-7xl lg:text-8xl' : 'text-2xl md:text-4xl'}`}
            >
              <span className="text-accent neon-text">{text}</span>
              <span className="animate-pulse ml-1 text-accent">|</span>
            </motion.div>
          </div>

          {/* Skip button */}
          <button
            onClick={() => {
              setVisible(false);
              sessionStorage.setItem('intro.shown', 'true');
              onComplete?.();
            }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted hover:opacity-80 transition-opacity"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
