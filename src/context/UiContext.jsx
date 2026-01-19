// src/context/UiContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

// Simple UI context for theme (light/dark/system) and language (en/ar)
// - Persists to localStorage
// - Applies html `class="dark"` and `dir`/`lang` attributes
// - Exposes i18n labels used by Navbar and About

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem('theme') || 'system'
  );
  const [lang, setLang] = useState(() =>
    localStorage.getItem('lang') || 'en'
  );

  // Apply theme to <html>
  useEffect(() => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const effective = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    root.classList.toggle('dark', effective === 'dark');
    root.style.colorScheme = effective; // improves form controls/UA rendering
  }, [theme]);

  // Apply language + direction to <html>
  useEffect(() => {
    const root = document.documentElement;
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    root.setAttribute('dir', dir);
    root.setAttribute('lang', lang);
  }, [lang]);

  const i18n = useMemo(() => ({
    en: {
      nav: {
        home: 'Home',
        about: 'About',
        skills: 'Skills',
        projects: 'Projects',
        labs: 'Labs',
        certificates: 'Certificates',
        blog: 'Blog',
        gallery: 'Gallery',
        contact: 'Contact'
      },
      about: {
        kicker: 'A bit about me',
        title: 'About Me',
        blocks: {
          who: 'I’m a curious builder who loves turning complex ideas into simple, useful products.',
          what: 'I design and ship modern web/AI experiences with clean UI, fast performance, and solid engineering.',
          values: 'I value clarity, reliability, and continuous learning — always iterating to improve.',
          cta: 'Have a challenge or idea in mind? Let’s talk.'
        },
        ctaButton: 'Contact Me'
      },
    },
    ar: {
      nav: {
        home: 'الرئيسية',
        about: 'نبذة',
        skills: 'المهارات',
        projects: 'المشاريع',
        labs: 'مختبرات',
        certificates: 'الشهادات',
        blog: 'مدونة',
        gallery: 'المعرض',
        contact: 'تواصل'
      },
      about: {
        kicker: 'نبذة سريعة عني',
        title: 'نبذة عني',
        blocks: {
          who: 'مطوّر فضولي يحب تحويل الأفكار المعقّدة إلى منتجات بسيطة ومفيدة.',
          what: 'أصمّم وأطوّر تجارب ويب وذكاء اصطناعي حديثة بأداء سريع وتجربة مستخدم نظيفة.',
          values: 'أقدّر الوضوح والموثوقية والتعلّم المستمر — أكرّر التحسين دائمًا.',
          cta: 'هل لديك فكرة أو تحدّي؟ يسعدني التواصل.'
        },
        ctaButton: 'راسلني'
      },
    }
  }), []);

  const value = useMemo(() => ({
    theme,
    setTheme: (t) => {
      localStorage.setItem('theme', t);
      setTheme(t);
    },
    lang,
    setLang: (l) => {
      localStorage.setItem('lang', l);
      setLang(l);
    },
    t: i18n[lang]
  }), [theme, lang, i18n]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
