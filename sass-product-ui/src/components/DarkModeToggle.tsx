// src/components/DarkModeToggle.tsx
// Drop this anywhere in your app — Navbar, Settings, etc.

import { useDarkMode } from '../hooks/useDarkMode';

const DarkModeToggle = () => {
  const { isDark, toggleTheme } = useDarkMode();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="flex items-center justify-center w-9 h-9 rounded-lg
        bg-raised dark:bg-raised
        border border-border dark:border-border
        text-text dark:text-text
        hover:bg-border dark:hover:bg-border
        transition-all duration-150"
    >
      {isDark ? (
        // Sun icon — shown in dark mode to switch to light
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z"
          />
        </svg>
      ) : (
        // Moon icon — shown in light mode to switch to dark
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24"
          stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
          />
        </svg>
      )}
    </button>
  );
};

export default DarkModeToggle;