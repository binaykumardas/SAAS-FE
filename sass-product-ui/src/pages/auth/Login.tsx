import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API, API_VERSION, BASE_URL } from '../../shared/constant/const';

const Login = () => {
  const navigate = useNavigate();

  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
    // ─────────────────────────────────────────────────────────────
  // 2. INTERACTION & UI STATES
  // touched: Keeps track of which fields the user has focused and then left.
  // loading: Prevents multiple submissions while the "API" is working.
  // ─────────────────────────────────────────────────────────────
  const [touched, setToched] = useState<Record<string,boolean>>({});
  const [loading, setLoading] = useState(false);

    /**
   * CORE VALIDATION ENGINE
   * This function contains the business rules for every field.
   * @param field - The name of the input field.
   * @param force - If true, ignores the "touched" check (used during form submission).
   */
  const getFieldError = (field:string, force = false): string => {
    // We only show errors if the field was "blurred" (touched) OR if we are forcing a check on submit.
    if(!touched[field] && !force) return '';

    if(field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if(!email.trim()) return 'This field is required';
      if(!emailRegex.test(email)) return 'Please enter a valid email address';
    }

    if(field === 'password') {
      if(!password) return 'This field is required';
      if(password.length < 8) return 'Password must be at least 8 characters';
    }

    return '';

  }

  /**
   * HANDLE BLUR
   * Marks a field as "touched" when the user clicks away from it.
   */
  const handleBlur = (field:string) => {
    setToched((prev) => ({...prev, [field]: true}));
  }

  /**
   * DYNAMIC CLASS GENERATOR
   * Returns red border classes if the validator finds an error for the field.
   */
  const getInputClass = (fieldName: string) => {
    const error = getFieldError(fieldName);
    return `
      auth-input w-full px-3.5 py-2.5 rounded-lg text-sm
      bg-raised border transition-all duration-150 outline-none
      ${error 
        ? 'border-danger focus:border-danger ring-1 ring-danger' // Error State: Red
        : 'border-border focus:border-accent ring-0'}          // Normal State: Gray/Blue
    `;
  };

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Step 1: Immediately show all errors visually by marking everything as touched
    setToched({email: true, password: true});

    // Step 2: Perform a "Force" validation check on all fields
    const fields = ['email', 'password'];
    
    // Check if any field has an error message
    const hasAnyError = fields.some(field => getFieldError(field, true) !== '');

    // Step 3: BLOCKER - If there are errors, stop right here!
    if (hasAnyError) {
      return; 
    }
    setLoading(true);

    const PAYLOAD = {
      email: email,
      password: password
    }
    const response = await axios.post(BASE_URL + API + API_VERSION + `/auth/login`,PAYLOAD);
      try {
        if(response) {
          setLoading(false);
          navigate('/profile');
        }
      } catch(e) {
          console.error(e);
      }
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-bg flex items-center justify-center px-4 transition-colors duration-250">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-text dark:text-text">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-secondary dark:text-secondary">
            Sign in to your account to continue
          </p>
        </div>

        {/* Card */}
        <div className="bg-surface dark:bg-surface border border-border dark:border-border rounded-2xl p-8 shadow-card dark:shadow-card">
          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text dark:text-text mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email address"
                className={getInputClass('email')}
              />
              {getFieldError('email') && <p className="mt-1.5 text-xs text-danger">{getFieldError('email')}</p>}
            </div>

            {/* Password */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-text dark:text-text">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-accent dark:text-accent hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className={getInputClass('password')}
              />
              {getFieldError('password') && <p className="mt-1.5 text-xs text-danger">{getFieldError('password')}</p>}
            </div>

            {/* Submit */}
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
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border dark:bg-border" />
            <span className="text-xs text-muted dark:text-muted">or</span>
            <div className="flex-1 h-px bg-border dark:bg-border" />
          </div>

          {/* Sign up */}
          <p className="text-center text-sm text-secondary dark:text-secondary">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-semibold text-accent dark:text-accent hover:underline"
            >
              Sign up free
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;