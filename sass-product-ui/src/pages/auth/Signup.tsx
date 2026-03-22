/**
 * @file Signup.tsx
 * @description 
 * Comprehensive User Registration Page with:
 * 1. "Touch & Leave" (onBlur) Validation for First and Last names.
 * 2. Split Name fields (First/Last) for better data granularity.
 * 3. Synchronous Submit Guard (Prevents navigation on error).
 * 4. Dynamic UI Feedback (Red borders and messages).
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
  // Split 'name' into 'firstName' and 'lastName'
  // ─────────────────────────────────────────────────────────────
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [engineerType, setEngineerType] = useState('');

  // ─────────────────────────────────────────────────────────────
  // 2. INTERACTION & UI STATES
  // ─────────────────────────────────────────────────────────────
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  /**
   * CORE VALIDATION ENGINE
   * Checks business rules for each field.
   * Updated to handle firstName and lastName separately.
   */
  const getFieldError = (field: string, force = false): string => {
    if (!touched[field] && !force) return '';

    // Validation for First Name
    if (field === 'firstName' && !firstName.trim()) return 'First name is required';
    
    // Validation for Last Name
    if (field === 'lastName' && !lastName.trim()) return 'Last name is required';
    
    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email.trim()) return 'Email is required';
      if (!emailRegex.test(email)) return 'Please enter a valid email address';
    }

    if (field === 'password') {
      if (!password) return 'Password is required';
      if (password.length < 8) return 'Must be at least 8 characters';
    }

    if (field === 'confirm') {
      if (!confirm) return 'Confirmation is required';
      if (confirm !== password) return 'Passwords do not match';
    }

    if (field === 'engineerType' && !engineerType) return 'Selection is required';

    return '';
  };

  /**
   * HANDLE BLUR
   * Marks a field as "touched" when the user clicks away.
   */
  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  /**
   * DYNAMIC CLASS GENERATOR
   * Returns red border/ring classes if an error is found.
   */
  const getInputClass = (fieldName: string) => {
    const error = getFieldError(fieldName);
    return `
      auth-input w-full px-3.5 py-2.5 rounded-lg text-sm
      bg-raised border transition-all duration-150 outline-none
      ${error 
        ? 'border-danger focus:border-danger ring-1 ring-danger' 
        : 'border-border focus:border-accent ring-0'}
    `;
  };

  /**
   * SUBMIT HANDLER
   * Checks all fields synchronously. Construct payload with split name data.
   */
  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Mark all fields as touched to show all existing errors
    setTouched({ 
      firstName: true, 
      lastName: true, 
      email: true, 
      password: true, 
      confirm: true, 
      engineerType: true 
    });

    // Synchronous error check
    const fields = ['firstName', 'lastName', 'email', 'password', 'confirm', 'engineerType'];
    const hasAnyError = fields.some(field => getFieldError(field, true) !== '');

    if (hasAnyError) return; 

    setLoading(true);

    // MODIFIED: Payload now includes separate name fields
    const PAYLOAD = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password,
      confirmPassword: confirm,
      role: engineerType
    };

    try {
      const response = await axios.post(BASE_URL + API + API_VERSION + `/auth/signup`, PAYLOAD);
      if(Util.isValidObject(response)) {
        setLoading(false);
        navigate('/login'); 
      }
    } catch (err) {
      setLoading(false);
      console.error("Signup failed", err);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text">Create your account</h1>
          <p className="mt-2 text-sm text-secondary">Join thousands of builders today</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit} noValidate>
            
            {/* NAME SECTION - Grid layout for First/Last Name */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  First name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={() => handleBlur('firstName')}
                  placeholder="First name"
                  className={getInputClass('firstName')}
                />
                {getFieldError('firstName') && <p className="mt-1.5 text-xs text-danger">{getFieldError('firstName')}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-1.5">
                  Last name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={() => handleBlur('lastName')}
                  placeholder="Last name"
                  className={getInputClass('lastName')}
                />
                {getFieldError('lastName') && <p className="mt-1.5 text-xs text-danger">{getFieldError('lastName')}</p>}
              </div>
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