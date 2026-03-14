import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface border-t border-border mt-auto transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Logo & Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-accent text-white flex items-center justify-center shadow-sm group-hover:opacity-90 transition-opacity">
               {/* Smaller version of the Custom Dev+Coffee SVG */}
               <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3c0 2 2 2 2 4" />
                <path d="M16 3c0 2-2 2-2 4" />
                <path d="M4 8h14v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z" />
                <path d="M18 10h1a3 3 0 0 1 0 6h-1" />
                {/* Code brackets */}
                <path d="M10 12l-2 2 2 2" />
                <path d="M14 12l2 2-2 2" />
              </svg>
            </div>
            <span className="font-bold text-text text-base tracking-tight">
              find<span className="text-accent">coffee</span>mate
            </span>
          </Link>

          <span className="hidden sm:block w-px h-4 bg-border-strong"></span>

          <span className="text-sm text-muted">
            © {new Date().getFullYear()} All rights reserved.
          </span>
        </div>

        {/* Right Side: Links & Socials */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          
          <nav className="flex items-center gap-4 text-sm font-medium">
            <Link to="/privacy" className="text-muted hover:text-accent transition-colors">Privacy</Link>
            <Link to="/terms" className="text-muted hover:text-accent transition-colors">Terms</Link>
            <Link to="/contact" className="text-muted hover:text-accent transition-colors">Contact</Link>
          </nav>

          <span className="hidden sm:block w-px h-4 bg-border-strong"></span>

          <div className="flex items-center gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent transition-colors" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-text transition-colors" aria-label="GitHub">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;