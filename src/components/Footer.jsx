// src/components/Footer.jsx
// Simple footer with credits and agent status
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Zap } from 'lucide-react';
import { useContent } from '../context/ContentContext.jsx';

export default function Footer() {
  const { content, clientId } = useContent();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 divider">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-muted flex items-center gap-1">
            © {currentYear} {content.name || 'NeonForge Studio'}. Built with
            <Heart size={14} className="text-accent inline" />
            and
            <span className="text-accent neon-text">neon</span>
          </p>

          {/* Agent status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-xs text-muted"
          >
            <Zap size={12} className="text-accent" />
            <span>
              Agent Status: <span className="font-semibold">Online</span>
            </span>
            {clientId !== 'default' && (
              <span className="pill px-2 py-0.5 rounded-full text-[10px]">
                {clientId}
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
