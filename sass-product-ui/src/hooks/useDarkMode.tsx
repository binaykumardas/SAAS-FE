// ============================================================
//  useDarkMode — TypeScript Hook
//  Place at: src/hooks/useDarkMode.ts
// ============================================================

import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface UseDarkModeReturn {
  isDark:     boolean;
  theme:      Theme;
  toggleTheme: () => void;
  setTheme:   (theme: Theme) => void;
}

export function useDarkMode(): UseDarkModeReturn {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // 1. Check saved user preference in localStorage
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved) return saved === 'dark';
    // 2. Fallback to OS/system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.setAttribute('data-theme', 'dark');  // for CSS var switching
      root.classList.add('dark');               // for Tailwind dark mode
    } else {
      root.removeAttribute('data-theme');
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  // Also respond to OS preference changes (e.g. user changes system theme)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't set a manual preference
      const saved = localStorage.getItem('theme');
      if (!saved) setIsDark(e.matches);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return {
    isDark,
    theme:        isDark ? 'dark' : 'light',
    toggleTheme:  () => setIsDark(prev => !prev),
    setTheme:     (t: Theme) => setIsDark(t === 'dark'),
  };
}