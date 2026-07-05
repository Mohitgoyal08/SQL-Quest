import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  // Lightweight Frontend Validation
  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = "Blimey! We need your Captain's email to locate your ship.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Ahoy! That doesn't look like a valid seafaring email address.";
    }

    if (!password) {
      newErrors.password = "Ye must provide your secret code to unlock the bridge!";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Login Attempt Approved:', { email, rememberMe });
    }
  };

  const handleGoogleSignIn = () => {
    console.log('Google Sign-In Triggered');
  };

  return (
    <div className="flex flex-col w-full select-none">
      {/* 1. Mascot Placeholder & Welcoming Header */}
      <div className="text-center mb-6">
        {/* Decorative Pirate Mascot Placeholder */}
        <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-pirate-leather/15 border-2 border-dashed border-pirate-leather/40 flex items-center justify-center shadow-inner">
          <span className="text-[10px] font-bold uppercase tracking-widest text-pirate-leather/70">
            Mascot
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-pirate-charcoal tracking-wide">
          Welcome Back, Captain!
        </h2>
        <p className="text-xs sm:text-sm font-sans font-medium text-pirate-leather mt-1">
          The crew awaits, and the SQL Codex has begun glowing again.
        </p>
      </div>

      {/* 2. Authentication Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        
        {/* Email Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-pirate-leather">
            Captain's Email
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3.5 w-5 h-5 text-pirate-leather/60 pointer-events-none" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="captain@sqlquest.com"
              className={`w-full pl-11 pr-4 py-3 bg-white/80 rounded-2xl border-2 transition-all shadow-inner font-medium text-sm text-pirate-charcoal placeholder:text-pirate-leather/40 select-text focus:outline-none ${
                errors.email 
                  ? 'border-pirate-crimson bg-pirate-crimson/5 focus:border-pirate-crimson' 
                  : 'border-pirate-leather/25 focus:border-ocean focus:bg-white'
              }`}
            />
          </div>
          {errors.email && (
            <motion.p 
              initial={{ opacity: 0, y: -4 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex items-center gap-1.5 text-xs font-bold text-pirate-crimson px-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.email}</span>
            </motion.p>
          )}
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-pirate-leather">
            Secret Passcode
          </label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3.5 w-5 h-5 text-pirate-leather/60 pointer-events-none" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="••••••••••••"
              className={`w-full pl-11 pr-12 py-3 bg-white/80 rounded-2xl border-2 transition-all shadow-inner font-medium text-sm text-pirate-charcoal placeholder:text-pirate-leather/40 select-text focus:outline-none ${
                errors.password 
                  ? 'border-pirate-crimson bg-pirate-crimson/5 focus:border-pirate-crimson' 
                  : 'border-pirate-leather/25 focus:border-ocean focus:bg-white'
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 p-1 text-pirate-leather/60 hover:text-pirate-charcoal transition-colors focus:outline-none cursor-pointer"
              aria-label={showPassword ? 'Hide passcode' : 'Show passcode'}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {errors.password && (
            <motion.p 
              initial={{ opacity: 0, y: -4 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="flex items-center gap-1.5 text-xs font-bold text-pirate-crimson px-1"
            >
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errors.password}</span>
            </motion.p>
          )}
        </div>

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
          <label className="flex items-center gap-2 cursor-pointer text-pirate-charcoal font-bold">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded appearance-none border-2 border-pirate-leather/40 bg-white checked:bg-ocean checked:border-ocean cursor-pointer transition-colors relative after:content-['✓'] after:absolute after:inset-0 after:flex after:items-center after:justify-center after:text-white after:text-[10px] after:font-extrabold"
            />
            <span>Keep Ship Anchored</span>
          </label>
          <button
            type="button"
            onClick={() => console.log('Recover Passcode Triggered')}
            className="font-bold text-ocean hover:text-ocean-deep hover:underline transition-colors focus:outline-none cursor-pointer"
          >
            Lost Your Code?
          </button>
        </div>

        {/* 3. Chunky Nintendo/Duolingo Primary Submit Button */}
        <motion.button
          type="submit"
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97, y: 2 }}
          className="w-full mt-2 py-3.5 px-6 bg-gold hover:bg-gold-shimmer text-pirate-charcoal font-display font-extrabold text-lg tracking-wider rounded-2xl border-b-[5px] border-gold-dark shadow-md active:border-b-0 cursor-pointer transition-colors flex items-center justify-center gap-2 uppercase"
        >
          Resume Voyage
        </motion.button>
      </form>

      {/* 4. Decorative Divider */}
      <div className="relative flex items-center justify-center my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t-2 border-pirate-leather/15" />
        </div>
        <span className="relative px-4 bg-parchment-light text-xs font-extrabold uppercase tracking-widest text-pirate-leather/60">
          OR
        </span>
      </div>

      {/* 5. Google Sign-In Secondary Button */}
      <motion.button
        type="button"
        onClick={handleGoogleSignIn}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.97, y: 2 }}
        className="w-full py-3 px-6 bg-white hover:bg-parchment/40 text-pirate-charcoal font-bold text-sm rounded-2xl border-2 border-pirate-leather/20 border-b-4 shadow-sm active:border-b-2 cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5"
      >
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.3 8.9 5 12 5z"/>
            <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.7-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
            <path fill="#FBBC05" d="M5.3 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.6 7.4C.6 9.4 0 10.6 0 12s.6 2.6 1.6 4.6l3.7-2.8z"/>
            <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.3-6.7-5.2L1.6 16.6C3.5 20.4 7.4 23 12 23z"/>
          </svg>
          <span>Continue with Google</span>
        </div>
        <span className="text-[11px] font-medium text-pirate-leather/70">
          Instant board to your next mission
        </span>
      </motion.button>

      {/* 6. Footer Navigation Prompt */}
      <div className="mt-6 text-center text-xs sm:text-sm font-bold text-pirate-leather">
        First time sailing these waters?{' '}
        <button
          type="button"
          onClick={() => console.log('Navigate to Sign Up')}
          className="text-ocean hover:text-ocean-deep hover:underline transition-colors font-extrabold cursor-pointer"
        >
          Enlist in the Guild
        </button>
      </div>
    </div>
  );
}