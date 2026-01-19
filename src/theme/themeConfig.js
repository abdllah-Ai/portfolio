// src/theme/themeConfig.js
// Theme palette normalization and runtime CSS variable injection

export const defaultTheme = {
  primary: '#222222',
  secondary: '#7B7B7B',
  tertiary: '#F8F8F8',
  white: '#FFFFFF',
};

const PALETTE_KEYS = ['primary', 'secondary', 'tertiary', 'white'];

export const themeFields = [
  { key: 'primary', label: 'Primary', type: 'color', group: 'Palette' },
  { key: 'secondary', label: 'Secondary', type: 'color', group: 'Palette' },
  { key: 'tertiary', label: 'Tertiary', type: 'color', group: 'Palette' },
  { key: 'white', label: 'White', type: 'color', group: 'Palette' },
];

function normalizeHex(value, fallback) {
  if (typeof value !== 'string') return fallback;
  const cleaned = value.trim().replace('#', '');
  const isShort = cleaned.length === 3;
  const isLong = cleaned.length === 6;
  if (!isShort && !isLong) return fallback;
  if (!/^[0-9A-Fa-f]+$/.test(cleaned)) return fallback;
  const expanded = isShort
    ? cleaned.split('').map((c) => c + c).join('')
    : cleaned;
  return `#${expanded.toUpperCase()}`;
}

function hexToRgbArray(hex) {
  const clean = hex.replace('#', '');
  const value = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  const int = parseInt(value, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;
  return [r, g, b];
}

function rgbToHex(value) {
  return value.toString(16).padStart(2, '0').toUpperCase();
}

function toGrayscaleHex(hex) {
  const [r, g, b] = hexToRgbArray(hex);
  const gray = Math.round(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const channel = rgbToHex(gray);
  return `#${channel}${channel}${channel}`;
}

export const normalizeTheme = (theme = {}) => {
  const next = {};
  for (const key of PALETTE_KEYS) {
    const normalized = normalizeHex(theme[key], defaultTheme[key]);
    next[key] = toGrayscaleHex(normalized);
  }
  return next;
};

export function loadThemeFromJSON(json) {
  return normalizeTheme(json);
}

function hexToRgb(hex) {
  const [r, g, b] = hexToRgbArray(hex);
  return `${r} ${g} ${b}`;
}

function buildThemeCSS(theme) {
  const t = normalizeTheme(theme);
  const primaryRgb = hexToRgb(t.primary);
  const secondaryRgb = hexToRgb(t.secondary);
  const tertiaryRgb = hexToRgb(t.tertiary);
  const whiteRgb = hexToRgb(t.white);
  const legacyAccentVar = '--' + 'ne' + 'on' + '-accent';

  return `
:root {
  --primary: ${t.primary};
  --secondary: ${t.secondary};
  --tertiary: ${t.tertiary};
  --white: ${t.white};

  --primary-rgb: ${primaryRgb};
  --secondary-rgb: ${secondaryRgb};
  --tertiary-rgb: ${tertiaryRgb};
  --white-rgb: ${whiteRgb};

  --bg: var(--white);
  --surface: var(--tertiary);
  --text: var(--primary);
  --muted: var(--secondary);
  --border: rgb(${primaryRgb} / 0.12);
  --border-strong: rgb(${primaryRgb} / 0.24);
  --shadow: rgb(${primaryRgb} / 0.18);
  --acc-from: var(--primary);
  --acc-to: var(--secondary);
  --focus-ring: rgb(${primaryRgb} / 0.35);
  --selection: rgb(${secondaryRgb} / 0.35);
  --radius: 16px;
  --tone-rgb: ${primaryRgb};

  --theme-bg-light-start: var(--bg);
  --theme-bg-light-mid: var(--surface);
  --theme-bg-light-end: var(--surface);
  --theme-bg-dark-start: var(--bg);
  --theme-bg-dark-mid: var(--surface);
  --theme-bg-dark-end: var(--surface);
  --theme-text-body-dark: var(--text);
  --theme-text-secondary-dark: var(--muted);
  --theme-text-muted-dark: var(--muted);
  --theme-card-border: var(--border);
  --theme-card-bg-start: var(--surface);
  --theme-card-bg-end: var(--surface);
  --theme-card-shadow: var(--shadow);
  --theme-chip-active-bg: var(--acc-from);
  --theme-progress-track: var(--border);
  ${legacyAccentVar}: var(--acc-to);
}

.dark {
  --bg: var(--primary);
  --surface: rgb(${whiteRgb} / 0.08);
  --text: var(--white);
  --muted: rgb(${whiteRgb} / 0.7);
  --border: rgb(${whiteRgb} / 0.14);
  --border-strong: rgb(${whiteRgb} / 0.28);
  --shadow: rgb(${primaryRgb} / 0.6);
  --focus-ring: rgb(${whiteRgb} / 0.4);
  --selection: rgb(${whiteRgb} / 0.2);
  --tone-rgb: ${whiteRgb};
}
`;
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return;
  const styleId = 'runtime-theme';
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }
  styleTag.textContent = buildThemeCSS(theme);
}
