import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

type Step = 'email' | 'sent';

const inputClass = `
  auth-input
  w-full px-3.5 py-2.5 rounded-lg text-sm
  bg-raised border border-border
  text-text placeholder:text-muted
  transition-all duration-150
`;

const ForgotPassword = () => {
  const [step,    setStep]    = useState<Step>('email');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('sent');
    }, 800);
  };

  // ── Step 2: Email sent ──────────────────────────────────
  if (step === 'sent') {
    return (
      <div className="min-h-screen bg-bg dark:bg-bg flex items-center justify-center px-4 transition-colors duration-250">
        <div className="w-full max-w-md">
          <div className="bg-surface dark:bg-surface border border-border dark:border-border rounded-2xl p-8 shadow-card dark:shadow-card text-center">

            {/* Icon */}
            <div className="w-14 h-14 rounded-full bg-accent-tint dark:bg-accent-tint flex items-center justify-center mx-auto mb-5">
              <svg
                width="26" height="26" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                className="text-accent dark:text-accent"
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-text dark:text-text tracking-tight mb-2">
              Check your inbox
            </h2>
            <p className="text-sm text-secondary dark:text-secondary mb-1">
              We sent a password reset link to
            </p>
            <p className="text-sm font-semibold text-accent dark:text-accent mb-6">
              {email}
            </p>
            <p className="text-xs text-muted dark:text-muted mb-6">
              Didn't receive it? Check your spam or{' '}
              <button
                onClick={() => setStep('email')}
                className="text-accent dark:text-accent font-medium hover:underline
                  bg-transparent border-none cursor-pointer p-0 text-xs"
              >
                try again
              </button>
            </p>

            <Link
              to="/login"
              className="block w-full py-2.5 px-4 rounded-lg text-sm font-semibold text-center
                bg-raised dark:bg-raised
                border border-border dark:border-border
                text-text dark:text-text
                hover:bg-border dark:hover:bg-border
                transition-all duration-150"
            >
              ← Back to sign in
            </Link>

          </div>
        </div>
      </div>
    );
  }

  // ── Step 1: Enter email ─────────────────────────────────
  return (
    <div className="min-h-screen bg-bg dark:bg-bg flex items-center justify-center px-4 transition-colors duration-250">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text dark:text-text">
            Forgot password?
          </h1>
          <p className="mt-2 text-sm text-secondary dark:text-secondary">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface dark:bg-surface border border-border dark:border-border rounded-2xl p-8 shadow-card dark:shadow-card">
          <form onSubmit={handleSubmit}>

            <div className="mb-6">
              <label className="block text-sm font-medium text-text dark:text-text mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold
                bg-accent hover:bg-accent-hover
                dark:bg-accent dark:hover:bg-accent-hover
                text-white dark:text-bg
                shadow-accent dark:shadow-accent
                transition-all duration-150
                disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>

          </form>

          <p className="text-center text-sm text-secondary dark:text-secondary mt-6">
            Remember your password?{' '}
            <Link
              to="/login"
              className="font-semibold text-accent dark:text-accent hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;