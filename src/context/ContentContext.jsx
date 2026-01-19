// src/context/ContentContext.jsx
// Content state management with JSON-based loading and localStorage persistence
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getBaseContent, loadContent } from '../utils/contentLoader.js';
import { applyTheme, normalizeTheme } from '../theme/themeConfig.js';

const STORAGE_KEY = 'site.content';
const SKILLS_KEY = 'site.skills';
const AUTH_KEY = 'site.admin.auth';
const PASS_KEY = 'site.admin.pass';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const baseContent = getBaseContent();

  const [content, setContent] = useState(() => {
    // Initial state from base content, potentially merged with localStorage
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...baseContent.site,
          ...parsed,
          theme: normalizeTheme({ ...baseContent.theme, ...parsed.theme }),
        };
      }
    } catch { }
    return { ...baseContent.site, theme: normalizeTheme(baseContent.theme) };
  });

  const [skills, setSkills] = useState(() => {
    try {
      const raw = localStorage.getItem(SKILLS_KEY);
      if (raw) return JSON.parse(raw);
    } catch { }
    return baseContent.skills;
  });
  const [clientId, setClientId] = useState('default');
  const [loading, setLoading] = useState(true);

  // Load client-specific content on mount
  useEffect(() => {
    let mounted = true;

    loadContent().then(({ site, skills: loadedSkills, theme, clientId: loadedClientId }) => {
      if (!mounted) return;

      // Merge with any localStorage overrides
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          setContent({
            ...site,
            ...parsed,
            theme: normalizeTheme({ ...theme, ...parsed.theme }),
          });
        } else {
          setContent({ ...site, theme: normalizeTheme(theme) });
        }
      } catch {
        setContent({ ...site, theme: normalizeTheme(theme) });
      }

      try {
        const rawSkills = localStorage.getItem(SKILLS_KEY);
        if (rawSkills) {
          setSkills(JSON.parse(rawSkills));
        } else {
          setSkills(loadedSkills);
        }
      } catch {
        setSkills(loadedSkills);
      }
      setClientId(loadedClientId);
      setLoading(false);
    });

    return () => { mounted = false; };
  }, []);

  // Persist content overrides to localStorage
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    } catch { }
  }, [content, loading]);

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(content.theme);
  }, [content.theme]);

  const saveContent = (next) => {
    setContent((prev) => {
      const mergedTheme = normalizeTheme({
        ...prev.theme,
        ...(next?.theme || {}),
      });
      const merged = {
        ...prev,
        ...next,
        theme: mergedTheme,
      };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch { }
      return merged;
    });
  };

  const replaceContent = (next) => {
    const base = getBaseContent();
    setContent({
      ...base.site,
      ...next,
      theme: normalizeTheme(next?.theme || base.theme),
    });
  };

  const resetContent = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(SKILLS_KEY);
    const base = getBaseContent();
    setContent({ ...base.site, theme: normalizeTheme(base.theme) });
    setSkills(base.skills);
  };

  const updateSkills = (newSkills) => {
    setSkills(newSkills);
    try {
      localStorage.setItem(SKILLS_KEY, JSON.stringify(newSkills));
    } catch { }
  };

  // Simple client-only auth (for convenience, not secure for production)
  const [authed, setAuthed] = useState(() => {
    try { return !!JSON.parse(localStorage.getItem(AUTH_KEY)); } catch { return false; }
  });

  const login = (password) => {
    // First time: set password. Subsequent: check it.
    const storedPass = localStorage.getItem(PASS_KEY);
    if (!storedPass) {
      localStorage.setItem(PASS_KEY, password);
      setAuthed(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    if (storedPass === password) {
      setAuthed(true);
      localStorage.setItem(AUTH_KEY, 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthed(false);
    localStorage.removeItem(AUTH_KEY);
  };

  const value = useMemo(() => ({
    content,
    skills,
    clientId,
    loading,
    saveContent,
    replaceContent,
    resetContent,
    updateSkills,
    authed,
    login,
    logout,
  }), [content, skills, clientId, loading, authed]);

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
