/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const Header = () => {
  const[isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false); // 1. Added scroll state
  const location = useLocation();

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // 2. Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Trigger floating state after scrolling down 20px
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks =[
    { name: 'Home', path: '/' },
    { name: 'My Profile', path: '/profile' },
    { name: 'Find Mates', path: '/find-connection' },
  ];

  return (
    // 3. Toggle outer background, border, and padding
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'pt-4 px-4 sm:px-6' // Detach from top/sides on scroll
        : 'bg-surface/90 backdrop-blur-md border-b border-border' // Standard landing look
    }`}>
      
      {/* 4. Transform inner container into floating pill */}
      <div className={`mx-auto flex items-center justify-between h-16 transition-all duration-300 ${
        isScrolled 
          ? 'max-w-5xl bg-surface/90 backdrop-blur-md border border-border rounded-full shadow-lg px-6' 
          : 'max-w-7xl px-6'
      }`}>
        
        {/* Left Section: Logo & Desktop Nav Links */}
        <div className="flex items-center gap-8">
          
          {/* Custom Dev + Coffee Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-accent text-white flex items-center justify-center shadow-accent group-hover:scale-105 transition-transform">
              {/* No-Copyright Developer + Coffee SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Coffee Steam */}
                <path d="M8 3c0 2 2 2 2 4" />
                <path d="M16 3c0 2-2 2-2 4" />
                {/* Coffee Cup Body */}
                <path d="M4 8h14v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
                {/* Coffee Cup Handle */}
                <path d="M18 10h1a3 3 0 0 1 0 6h-1" />
                {/* Developer Code Brackets < > */}
                <path d="M10 12l-2 2 2 2" />
                <path d="M14 12l2 2-2 2" />
              </svg>
            </div>
            
            {/* Text sitting next to the pure logo (hidden on mobile) */}
            <span className="text-xl font-bold text-text tracking-tight hidden sm:block">
              find<span className="text-accent">coffee</span>mate
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-2 font-medium text-sm">
            {navLinks.map((link) => (
              <NavLink 
                key={link.name}
                to={link.path} 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md transition-all duration-200 ${
                    isActive 
                      ? "bg-accent-tint text-accent" 
                      : "text-secondary hover:text-text hover:bg-raised"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Section: Search, Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          
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

          <div className="h-6 w-px bg-border hidden sm:block mx-1"></div>

          <div className="flex items-center gap-1 sm:gap-2">
            
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

            <Link to="/profile" className="w-8 h-8 rounded-full bg-accent-tint text-accent border border-accent/20 flex items-center justify-center font-bold text-sm shadow-sm hover:ring-2 hover:ring-accent hover:ring-offset-2 hover:ring-offset-surface transition-all mx-1">
              BD
            </Link>

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

      {/* 5. Update mobile menu positioning to top-full to seamlessly adapt */}
      {isMobileMenuOpen && (
        <div className={`md:hidden absolute w-full bg-surface shadow-lg py-4 px-6 flex flex-col gap-4 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'top-full mt-2 w-[calc(100%-2rem)] left-4 right-4 rounded-2xl border border-border' 
            : 'top-full left-0 border-b border-border'
        }`}>
          <div className="relative">
            <svg className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
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
                  `px-4 py-3 rounded-lg font-medium transition-colors ${isActive ? "bg-accent-tint text-accent" : "text-secondary hover:bg-raised hover:text-text"}`
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