# Portfolio – React + Vite + Tailwind

Key runtime settings and patterns used in this project.

## JSX Runtime
- Automatic JSX runtime is enabled via Vite’s React plugin and `jsconfig.json`:
  - `vite.config.js` includes `@vitejs/plugin-react`.
  - `jsconfig.json` sets `{ "compilerOptions": { "jsx": "react-jsx" } }`.
- If a file uses `React.useState` or `class extends React.Component`, it must explicitly `import React from 'react'`.

## Effects: Avoid re-render loops
- When an effect calls `setState`, either:
  - Use `useEffect(() => { /* set */ }, [])` (run once), or
  - Depend only on stable values that won’t change as a result of that `setState`.
- Don’t depend on an array literal or inline object — memoize with `useMemo` first.
- Intervals/timeouts follow this pattern:
  ```js
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % WORDS.length), 3000);
    return () => clearInterval(id);
  }, []);
  ```

## Lottie & Motion
- Heavy animations are gated to mount with `useEffect(() => setMounted(true), [])`.
- Animations respect reduced motion; keep durations subtle.

## Linting
- ESLint is configured with `eslint-plugin-react-hooks` and Vite’s react-refresh rules (see `eslint.config.js`). Fix warnings proactively.
