/**
 * @file Signup.tsx
 * @description 
 * Comprehensive User Registration Page with:
 * 1. "Touch & Leave" (onBlur) Validation.
 * 2. Synchronous Submit Guard (Prevents navigation on error).
 * 3. Dynamic UI Feedback (Red borders and messages).
 * 4. Regex-based Email & Password matching logic.
 */

import axios from 'axios';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API, API_VERSION, BASE_URL } from '../../shared/constant/const';
import Util from '../../shared/utils/utils';

const Signup = () => {
  const navigate = useNavigate();

  // ─────────────────────────────────────────────────────────────
  // 1. FORM FIELD STATES
  // ─────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [engineerType, setEngineerType] = useState('');

  // ─────────────────────────────────────────────────────────────
  // 2. INTERACTION & UI STATES
  // touched: Keeps track of which fields the user has focused and then left.
  // loading: Prevents multiple submissions while the "API" is working.
  // ─────────────────────────────────────────────────────────────
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

    /**
     * CORE VALIDATION ENGINE
     * This function contains the business rules for every field.
     * @param field - The name of the input field.
     * @param force - If true, ignores the "touched" check (used during form submission).
     */
  const getFieldError = (field: string, force = false): string => {
    // We only show errors if the field was "blurred" (touched) OR if we are forcing a check on submit.
    if (!touched[field] && !force) return '';

    // Validation for Full Name
    if (field === 'name' && !name.trim()) return 'This field is required';
    
    // Validation for Email
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) return 'This field is required';
      if (!emailRegex.test(email)) return 'Please enter a valid email address';
    }

    // Validation for Password
    if (field === 'password') {
      if (!password) return 'This field is required';
      if (password.length < 8) return 'Password must be at least 8 characters';
    }

    // Validation for Password Confirmation
    if (field === 'confirm') {
      if (!confirm) return 'This field is required';
      if (confirm !== password) return 'Passwords do not match';
    }

    // Validation for Dropdown
    if (field === 'engineerType' && !engineerType) return 'This field is required';

    return '';
  };

  /**
   * HANDLE BLUR
   * Marks a field as "touched" when the user clicks away from it.
   */
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

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

  /**
   * SUBMIT HANDLER
   * Performs a "Hard Validation" check. If even one field is invalid, 
   * it stops the navigation and shows all errors.
   */
  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Stop page reload

    // Step 1: Immediately show all errors visually by marking everything as touched
    setTouched({ name: true, email: true, password: true, confirm: true, engineerType: true });

    // Step 2: Perform a "Force" validation check on all fields
    const fields = ['name', 'email', 'password', 'confirm', 'engineerType'];
    
    // Check if any field has an error message
    const hasAnyError = fields.some(field => getFieldError(field, true) !== '');

    // Step 3: BLOCKER - If there are errors, stop right here!
    if (hasAnyError) {
      return; 
    }

    // Step 4: Proceed only if form is 100% valid
    setLoading(true);
    const PAYLOAD = {
      fullName: name,
      email: email,
      password: password,
      confirmPassword: confirm,
      role: engineerType
    };
    const response = await axios.post(BASE_URL + API + API_VERSION + `/auth/signup`,PAYLOAD);
    if(Util.isValidObject(response)) {
      setLoading(false);
      navigate('/login'); // Move to next page
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text">Create your account</h1>
          <p className="mt-2 text-sm text-secondary">Join thousands of builders today</p>
        </div>

        {/* Signup Card */}
        <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} noValidate>
            
            {/* FULL NAME */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-1.5">
                Full name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')} // Trigger validation on leave
                placeholder="Enter your full name"
                className={getInputClass('name')}
              />
              {getFieldError('name') && <p className="mt-1.5 text-xs text-danger">{getFieldError('name')}</p>}
            </div>

            {/* EMAIL */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-1.5">
                Email address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="Enter your email address"
                className={getInputClass('email')}
              />
              {getFieldError('email') && <p className="mt-1.5 text-xs text-danger">{getFieldError('email')}</p>}
            </div>

            {/* PASSWORD */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-text mb-1.5">
                Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur('password')}
                placeholder="Enter your password"
                className={getInputClass('password')}
              />
              {getFieldError('password') && <p className="mt-1.5 text-xs text-danger">{getFieldError('password')}</p>}
            </div>

            {/* CONFIRM PASSWORD */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-1.5">
                Confirm password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                onBlur={() => handleBlur('confirm')}
                placeholder="Please re-enter your password"
                className={getInputClass('confirm')}
              />
              {getFieldError('confirm') && <p className="mt-1.5 text-xs text-danger">{getFieldError('confirm')}</p>}
            </div>

            {/* ENGINEER TYPE */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-text mb-1.5">
                Engineer Type <span className="text-danger">*</span>
              </label>
              <select
                value={engineerType}
                onChange={(e) => setEngineerType(e.target.value)}
                onBlur={() => handleBlur('engineerType')}
                className={getInputClass('engineerType')}
              >
                <option value="" disabled>Select an option</option>
                <option value="1">Frontend Developer</option>
                <option value="2">Backend Developer</option>
                <option value="3">Full Stack Developer</option>
              </select>
              {getFieldError('engineerType') && <p className="mt-1.5 text-xs text-danger">{getFieldError('engineerType')}</p>}
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold 
                bg-accent hover:bg-accent-hover text-white shadow-accent 
                transition-all duration-150 disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>

          </form>

          {/* Footer Link */}
          <p className="text-center text-sm text-secondary mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;