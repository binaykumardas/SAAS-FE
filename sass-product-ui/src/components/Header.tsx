/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect, useRef, type JSX } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

const Header = (): JSX.Element => {
  const [isDarkMode, setIsDarkMode]         = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled]         = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const location    = useLocation();
  const navigate    = useNavigate();

  // ── Dark mode ──────────────────────────────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // ── Close mobile menu on route change ─────────────────────────────────────
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // ── Scroll detection ──────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = (): void => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ── Close dropdown on outside click ───────────────────────────────────────
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleLogout = (): void => {
    setIsDropdownOpen(false);
    // Add your logout logic here (clear token, context, etc.)
    navigate('/');
  };

  const navLinks = [
    { name: 'Home',       path: '/' },
    { name: 'My Profile', path: '/profile' },
    { name: 'Find Mates', path: '/find-connection' },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled
        ? 'pt-4 px-4 sm:px-6'
        : 'bg-surface/90 backdrop-blur-md border-b border-border'
    }`}>

      <div className={`mx-auto flex items-center justify-between h-16 transition-all duration-300 ${
        isScrolled
          ? 'max-w-5xl bg-surface/90 backdrop-blur-md border border-border rounded-full shadow-lg px-6'
          : 'max-w-7xl px-6'
      }`}>

        {/* ── Left: Logo + Nav ── */}
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shadow-accent group-hover:scale-105 transition-transform">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3c0 2 2 2 2 4" />
                <path d="M16 3c0 2-2 2-2 4" />
                <path d="M4 8h14v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
                <path d="M18 10h1a3 3 0 0 1 0 6h-1" />
                <path d="M10 12l-2 2 2 2" />
                <path d="M14 12l2 2-2 2" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text tracking-tight hidden sm:block">
              find<span className="text-accent">coffee</span>mate
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 font-medium text-sm">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive
                      ? 'bg-accent-tint text-accent'
                      : 'text-secondary hover:text-text hover:bg-raised'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* ── Right: Search + Actions ── */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Search */}
          <div className="relative hidden lg:flex items-center">
            <svg className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search coffee mates..."
              className="bg-raised border border-border text-text placeholder-muted rounded-full pl-9 pr-12 py-1.5 text-sm focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/20 transition-all w-64"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="border border-border bg-surface text-muted text-[10px] font-mono px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>

          <div className="h-6 w-px bg-border hidden sm:block mx-1" />

          <div className="flex items-center gap-1 sm:gap-2">

            {/* Dark mode toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full text-secondary hover:text-accent hover:bg-raised transition-colors flex items-center justify-center cursor-pointer"
              aria-label="Toggle Dark Mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {/* ── Avatar + Dropdown ── */}
            <div className="relative mx-1" ref={dropdownRef}>

              {/* Avatar button */}
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={`w-8 h-8 rounded-full bg-accent-tint text-accent border font-bold text-sm flex items-center justify-center transition-all cursor-pointer ${
                  isDropdownOpen
                    ? 'border-accent ring-2 ring-accent/20 ring-offset-2 ring-offset-surface'
                    : 'border-accent/20 hover:ring-2 hover:ring-accent hover:ring-offset-2 hover:ring-offset-surface'
                }`}
                aria-label="Open user menu"
                aria-expanded={isDropdownOpen}
              >
                BD
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute right-0 top-[calc(100%+10px)] w-[220px] bg-surface border border-border rounded-xl shadow-card overflow-hidden z-50
                  animate-in fade-in-0 zoom-in-95 duration-150 origin-top-right">

                  {/* User info header */}
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
                    <div className="w-9 h-9 rounded-full bg-accent-tint border border-accent/20 flex items-center justify-center text-sm font-bold text-accent shrink-0">
                      BD
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-text truncate">Bhanu Dev</p>
                      <p className="text-xs text-secondary truncate">Full Stack Developer</p>
                    </div>
                  </div>

                  {/* Menu items */}
                  <div className="p-1.5">

                    <Link
                      to="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text hover:bg-raised transition-colors"
                    >
                      <svg className="w-4 h-4 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      My profile
                      <span className="ml-auto px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent-tint text-accent">
                        72%
                      </span>
                    </Link>

                    <Link
                      to="/find-connection"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text hover:bg-raised transition-colors"
                    >
                      <svg className="w-4 h-4 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Find mates
                    </Link>

                    <Link
                      to="/settings"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-text hover:bg-raised transition-colors"
                    >
                      <svg className="w-4 h-4 text-secondary shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </Link>

                    {/* Divider */}
                    <div className="h-px bg-border my-1 mx-1" />

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger-bg transition-colors cursor-pointer font-sans"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Log out
                    </button>

                  </div>
                </div>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-secondary hover:text-text hover:bg-raised transition-colors ml-1 cursor-pointer"
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ── Mobile Menu ── */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute w-full bg-surface shadow-lg py-4 px-6 flex flex-col gap-4 z-40 transition-all duration-300 ${
          isScrolled
            ? 'top-full mt-2 w-[calc(100%-2rem)] left-4 right-4 rounded-2xl border border-border'
            : 'top-full left-0 border-b border-border'
        }`}>
          <div className="relative">
            <svg className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search coffee mates..."
              className="w-full bg-raised border border-border text-text placeholder-muted rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-accent"
            />
          </div>
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActive ? 'bg-accent-tint text-accent' : 'text-secondary hover:bg-raised hover:text-text'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;